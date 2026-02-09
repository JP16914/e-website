import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Cart } from './schemas/cart.schema';
import { Product } from '../products/schemas/product.schema';

@Injectable()
export class CartService {
  constructor(
    @InjectModel(Cart.name) private cartModel: Model<Cart>,
    @InjectModel(Product.name) private productModel: Model<Product>,
  ) { }

  async getCart(userId: string) {
    let cart = await this.cartModel.findOne({ userId, status: 'ACTIVE' });
    if (!cart) {
      cart = await this.cartModel.create({ userId, items: [] });
    }

    // Compute totals
    // We also populate product info for UI display
    // For speed, client side can use cached product data, but server does reliable calc
    let subtotal = 0;
    const itemsWithDetails = [];

    for (const item of cart.items) {
      const product = await this.productModel.findById(item.productId).select('name images actualPriceCents discountPriceCents status stock').exec();
      if (product && product.status === 'ACTIVE') {
        // Update snapshot if price changed? Usually we respect snapshot unless explicitly refreshed
        // But for cart view in e-commerce, user expects *current* price usually.
        // Prompt says: "store snapshot" at add time.
        // Let's stick to snapshot for "order" but refresh for "cart view" if strategy dictates.
        // Prompt rule: "Store unitPriceSnapshotCents computed as above" during ADD.
        // I will return current prices in `product` field for compare.

        const currentPrice = product.discountPriceCents > 0 ? product.discountPriceCents : product.actualPriceCents;
        subtotal += currentPrice * item.qty;
        // manually spread to avoid TS issues if item is typed as POJO but runtime is Subdoc, or vice versa
        itemsWithDetails.push({
          productId: item.productId,
          qty: item.qty,
          unitPriceSnapshotCents: item.unitPriceSnapshotCents,
          currency: item.currency,
          product
        });
      } else {
        // Product archived? remove?
      }
    }
    return { _id: cart._id, items: itemsWithDetails, subtotal };
  }

  async setItem(userId: string, productId: string, qty: number) {
    if (qty <= 0) return this.removeItem(userId, productId);

    let cart = await this.cartModel.findOne({ userId, status: 'ACTIVE' });
    if (!cart) cart = await this.cartModel.create({ userId, items: [] });

    const product = await this.productModel.findById(productId);
    if (!product || product.status !== 'ACTIVE') throw new NotFoundException('Product not found');

    const price = product.discountPriceCents > 0 ? product.discountPriceCents : product.actualPriceCents;

    const existingIdx = cart.items.findIndex(i => i.productId === productId);
    if (existingIdx !== -1) {
      cart.items[existingIdx].qty = qty; // Set absolute
      cart.items[existingIdx].unitPriceSnapshotCents = price;
    } else {
      cart.items.push({ productId, qty, unitPriceSnapshotCents: price, currency: 'USD' });
    }

    cart.markModified('items');
    await cart.save();
    return this.getCart(userId);
  }

  async addItem(userId: string, productId: string, qty: number) {
    let cart = await this.cartModel.findOne({ userId, status: 'ACTIVE' });
    if (!cart) cart = await this.cartModel.create({ userId, items: [] });

    const product = await this.productModel.findById(productId);
    if (!product || product.status !== 'ACTIVE') throw new NotFoundException('Product not found');

    const price = product.discountPriceCents > 0 ? product.discountPriceCents : product.actualPriceCents;

    const existingIdx = cart.items.findIndex(i => i.productId === productId);
    if (existingIdx !== -1) {
      // Create a copy to ensure reference change if needed, but Mongoose usually handles subdoc updates
      // However, assigning directly to property is sometimes safer if typed correctly
      cart.items[existingIdx].qty += qty;
      cart.items[existingIdx].unitPriceSnapshotCents = price;
    } else {
      cart.items.push({ productId, qty, unitPriceSnapshotCents: price, currency: 'USD' });
    }

    // Explicitly mark as modified to be safe
    cart.markModified('items');
    await cart.save();
    return this.getCart(userId);
  }

  async removeItem(userId: string, productId: string) {
    await this.cartModel.updateOne(
      { userId, status: 'ACTIVE' },
      { $pull: { items: { productId } } }
    );
    return this.getCart(userId);
  }

  async clearCart(userId: string) {
    await this.cartModel.updateOne({ userId, status: 'ACTIVE' }, { items: [] });
    return { items: [], subtotal: 0 };
  }
}
