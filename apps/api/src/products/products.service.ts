import { Injectable, Inject } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product } from './schemas/product.schema';
import Redis from 'ioredis';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<Product>,
    @Inject('REDIS_CLIENT') private readonly redis: Redis,
  ) { }

  async findAll(query: any) {
    const { main, sub, q, page = 1, limit = 20, sort, minPrice, maxPrice, minRating } = query;

    // Cache Key
    const cacheKey = `products:list:${JSON.stringify(query)}`;
    const cached = await this.redis.get(cacheKey);
    if (cached) return JSON.parse(cached);

    const filter: any = { status: 'ACTIVE' };
    if (main) filter.mainCategory = main;
    if (sub) filter.subCategory = sub;
    if (q) filter.$text = { $search: q };
    if (minPrice) filter.actualPriceCents = { $gte: Number(minPrice) };
    if (maxPrice) filter.actualPriceCents = { ...filter.actualPriceCents, $lte: Number(maxPrice) };
    if (minRating) filter.rating = { $gte: Number(minRating) };

    const sortOption: any = {};
    if (sort === 'price_asc') sortOption.actualPriceCents = 1;
    else if (sort === 'price_desc') sortOption.actualPriceCents = -1;
    else if (sort === 'rating') sortOption.rating = -1;
    else sortOption.createdAt = -1; // Newest default

    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      this.productModel.find(filter).sort(sortOption).skip(skip).limit(Number(limit)).exec(),
      this.productModel.countDocuments(filter).exec()
    ]);

    const result = { items, total, page: Number(page), pages: Math.ceil(total / limit) };
    await this.redis.set(cacheKey, JSON.stringify(result), 'EX', 60); // 1 min cache
    return result;
  }

  async findOne(id: string) {
    const cached = await this.redis.get(`product:${id}`);
    if (cached) return JSON.parse(cached);

    const product = await this.productModel.findById(id).exec();
    if (product) await this.redis.set(`product:${id}`, JSON.stringify(product), 'EX', 300); // 5 min
    return product;
  }

  async findRelated(id: string) {
    const product = await this.findOne(id);
    if (!product) return [];

    // Try subCategory first
    let related = await this.productModel.find({
      subCategory: product.subCategory,
      _id: { $ne: id },
      status: 'ACTIVE'
    }).limit(4).exec();

    if (related.length < 4) {
      const more = await this.productModel.find({
        mainCategory: product.mainCategory,
        _id: { $ne: id, $nin: related.map(r => r._id) },
        status: 'ACTIVE'
      }).limit(4 - related.length).exec();
      related = [...related, ...more];
    }
    return related;
  }

  // Admin ops
  async create(data: any) {
    const p = new this.productModel(data);
    return p.save();
  }

  async update(id: string, data: any) {
    const p = await this.productModel.findByIdAndUpdate(id, data, { new: true }).exec();
    await this.redis.del(`product:${id}`);
    // Simple invalidation of lists
    // In prod, use version based or specific tags
    // For now, let lists expire naturally or clear all keys matching pattern (expensive)
    return p;
  }

  async delete(id: string) {
    return this.productModel.findByIdAndUpdate(id, { status: 'ARCHIVED' }).exec();
  }
}
