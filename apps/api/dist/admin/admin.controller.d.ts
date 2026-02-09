import { ProductsService } from '../products/products.service';
import { UsersService } from '../users/users.service';
import { Model } from 'mongoose';
import { Order } from '../orders/schemas/order.schema';
export declare class AdminController {
    private productsService;
    private usersService;
    private orderModel;
    constructor(productsService: ProductsService, usersService: UsersService, orderModel: Model<Order>);
    getProducts(): Promise<any>;
    createProduct(body: any): Promise<import("mongoose").Document<unknown, {}, import("../products/schemas/product.schema").Product, {}, {}> & import("../products/schemas/product.schema").Product & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
    updateProduct(id: string, body: any): Promise<import("mongoose").Document<unknown, {}, import("../products/schemas/product.schema").Product, {}, {}> & import("../products/schemas/product.schema").Product & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
    deleteProduct(id: string): Promise<import("mongoose").Document<unknown, {}, import("../products/schemas/product.schema").Product, {}, {}> & import("../products/schemas/product.schema").Product & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
    getOrders(): Promise<(import("mongoose").Document<unknown, {}, Order, {}, {}> & Order & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    })[]>;
}
