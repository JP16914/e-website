import { Model } from 'mongoose';
import { Cart } from './schemas/cart.schema';
import { Product } from '../products/schemas/product.schema';
export declare class CartService {
    private cartModel;
    private productModel;
    constructor(cartModel: Model<Cart>, productModel: Model<Product>);
    getCart(userId: string): Promise<{
        _id: import("mongoose").Types.ObjectId;
        items: any[];
        subtotal: number;
    }>;
    setItem(userId: string, productId: string, qty: number): Promise<{
        _id: import("mongoose").Types.ObjectId;
        items: any[];
        subtotal: number;
    }>;
    addItem(userId: string, productId: string, qty: number): Promise<{
        _id: import("mongoose").Types.ObjectId;
        items: any[];
        subtotal: number;
    }>;
    removeItem(userId: string, productId: string): Promise<{
        _id: import("mongoose").Types.ObjectId;
        items: any[];
        subtotal: number;
    }>;
    clearCart(userId: string): Promise<{
        items: any[];
        subtotal: number;
    }>;
}
