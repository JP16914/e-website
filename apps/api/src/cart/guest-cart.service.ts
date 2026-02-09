import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import Redis from 'ioredis';
import { InjectModel } from '@nestjs/mongoose';
import { Product } from '../products/schemas/product.schema';
import { Model } from 'mongoose';
import { CartService } from './cart.service';

@Injectable()
export class GuestCartService {
  constructor(
    @Inject('REDIS_CLIENT') private readonly redis: Redis,
    @InjectModel(Product.name) private productModel: Model<Product>,
    private cartService: CartService,
  ) { }

  private getKey(id: string) { return `cart:guest:${id}`; }

  async getCart(cartId: string) {
    const raw = await this.redis.get(this.getKey(cartId));
    if (!raw) return { items: [], subtotal: 0 };

    let data = JSON.parse(raw);
    // inflate product details
    let subtotal = 0;
    const itemsWithDetails = [];
    for (const item of data.items) {
      // Optimization: could cache product details in redis too, but correctness first
      const product = await this.productModel.findById(item.productId).select('name images actualPriceCents discountPriceCents').exec();
      if (product) {
        const currentPrice = product.discountPriceCents > 0 ? product.discountPriceCents : product.actualPriceCents;
        subtotal += currentPrice * item.qty;
        itemsWithDetails.push({ ...item, product });
      }
    }
    return { items: itemsWithDetails, subtotal };
  }

  async addItem(cartId: string, productId: string, qty: number) {
    let data = await this.getRaw(cartId);
    const product = await this.productModel.findById(productId);
    if (!product || product.status !== 'ACTIVE') throw new NotFoundException('Product unavailable');

    const price = product.discountPriceCents > 0 ? product.discountPriceCents : product.actualPriceCents;

    const existing = data.items.find((i: any) => i.productId === productId);
    if (existing) {
      existing.qty += qty;
      existing.unitPriceSnapshotCents = price;
    } else {
      data.items.push({ productId, qty, unitPriceSnapshotCents: price, addedAt: new Date() });
    }

    await this.saveRaw(cartId, data);
    return this.getCart(cartId);
  }

  async setItem(cartId: string, productId: string, qty: number) {
    if (qty <= 0) return this.removeItem(cartId, productId);

    let data = await this.getRaw(cartId);
    const product = await this.productModel.findById(productId);
    const price = product.discountPriceCents > 0 ? product.discountPriceCents : product.actualPriceCents;

    const existing = data.items.find((i: any) => i.productId === productId);
    if (existing) {
      existing.qty = qty;
      existing.unitPriceSnapshotCents = price;
    } else {
      data.items.push({ productId, qty, unitPriceSnapshotCents: price, addedAt: new Date() });
    }
    await this.saveRaw(cartId, data);
    return this.getCart(cartId);
  }

  async removeItem(cartId: string, productId: string) {
    let data = await this.getRaw(cartId);
    data.items = data.items.filter((i: any) => i.productId !== productId);
    await this.saveRaw(cartId, data);
    return this.getCart(cartId);
  }

  async mergeToUser(guestCartId: string, userId: string) {
    const raw = await this.redis.get(this.getKey(guestCartId));
    if (!raw) return;
    const data = JSON.parse(raw);

    for (const item of data.items) {
      await this.cartService.addItem(userId, item.productId, item.qty);
    }
    await this.redis.del(this.getKey(guestCartId));
  }

  private async getRaw(cartId: string) {
    const raw = await this.redis.get(this.getKey(cartId));
    return raw ? JSON.parse(raw) : { items: [] };
  }

  private async saveRaw(cartId: string, data: any) {
    await this.redis.set(this.getKey(cartId), JSON.stringify(data), 'EX', 30 * 24 * 60 * 60); // 30 days
  }
}
