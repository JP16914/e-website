"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const product_schema_1 = require("./schemas/product.schema");
const ioredis_1 = require("ioredis");
let ProductsService = class ProductsService {
    constructor(productModel, redis) {
        this.productModel = productModel;
        this.redis = redis;
    }
    async findAll(query) {
        const { main, sub, q, page = 1, limit = 20, sort, minPrice, maxPrice, minRating } = query;
        const cacheKey = `products:list:${JSON.stringify(query)}`;
        const cached = await this.redis.get(cacheKey);
        if (cached)
            return JSON.parse(cached);
        const filter = { status: 'ACTIVE' };
        if (main)
            filter.mainCategory = main;
        if (sub)
            filter.subCategory = sub;
        if (q)
            filter.$text = { $search: q };
        if (minPrice)
            filter.actualPriceCents = { $gte: Number(minPrice) };
        if (maxPrice)
            filter.actualPriceCents = Object.assign(Object.assign({}, filter.actualPriceCents), { $lte: Number(maxPrice) });
        if (minRating)
            filter.rating = { $gte: Number(minRating) };
        const sortOption = {};
        if (sort === 'price_asc')
            sortOption.actualPriceCents = 1;
        else if (sort === 'price_desc')
            sortOption.actualPriceCents = -1;
        else if (sort === 'rating')
            sortOption.rating = -1;
        else
            sortOption.createdAt = -1;
        const skip = (page - 1) * limit;
        const [items, total] = await Promise.all([
            this.productModel.find(filter).sort(sortOption).skip(skip).limit(Number(limit)).exec(),
            this.productModel.countDocuments(filter).exec()
        ]);
        const result = { items, total, page: Number(page), pages: Math.ceil(total / limit) };
        await this.redis.set(cacheKey, JSON.stringify(result), 'EX', 60);
        return result;
    }
    async findOne(id) {
        const cached = await this.redis.get(`product:${id}`);
        if (cached)
            return JSON.parse(cached);
        const product = await this.productModel.findById(id).exec();
        if (product)
            await this.redis.set(`product:${id}`, JSON.stringify(product), 'EX', 300);
        return product;
    }
    async findRelated(id) {
        const product = await this.findOne(id);
        if (!product)
            return [];
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
    async create(data) {
        const p = new this.productModel(data);
        return p.save();
    }
    async update(id, data) {
        const p = await this.productModel.findByIdAndUpdate(id, data, { new: true }).exec();
        await this.redis.del(`product:${id}`);
        return p;
    }
    async delete(id) {
        return this.productModel.findByIdAndUpdate(id, { status: 'ARCHIVED' }).exec();
    }
};
exports.ProductsService = ProductsService;
exports.ProductsService = ProductsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(product_schema_1.Product.name)),
    __param(1, (0, common_1.Inject)('REDIS_CLIENT')),
    __metadata("design:paramtypes", [mongoose_2.Model,
        ioredis_1.default])
], ProductsService);
//# sourceMappingURL=products.service.js.map