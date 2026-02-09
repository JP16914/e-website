import Redis from 'ioredis';
import { Product } from '../products/schemas/product.schema';
import { Model } from 'mongoose';
import { CartService } from './cart.service';
export declare class GuestCartService {
    private readonly redis;
    private productModel;
    private cartService;
    constructor(redis: Redis, productModel: Model<Product>, cartService: CartService);
    private getKey;
    getCart(cartId: string): Promise<{
        items: any[];
        subtotal: number;
    }>;
    addItem(cartId: string, productId: string, qty: number): Promise<{
        items: any[];
        subtotal: number;
    }>;
    setItem(cartId: string, productId: string, qty: number): Promise<{
        items: any[];
        subtotal: number;
    }>;
    removeItem(cartId: string, productId: string): Promise<{
        items: any[];
        subtotal: number;
    }>;
    mergeToUser(guestCartId: string, userId: string): Promise<void>;
    private getRaw;
    private saveRaw;
}
