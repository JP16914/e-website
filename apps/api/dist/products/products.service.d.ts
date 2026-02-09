import { Model } from 'mongoose';
import { Product } from './schemas/product.schema';
import Redis from 'ioredis';
export declare class ProductsService {
    private productModel;
    private readonly redis;
    constructor(productModel: Model<Product>, redis: Redis);
    findAll(query: any): Promise<any>;
    findOne(id: string): Promise<any>;
    findRelated(id: string): Promise<(import("mongoose").Document<unknown, {}, Product, {}, {}> & Product & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    })[]>;
    create(data: any): Promise<import("mongoose").Document<unknown, {}, Product, {}, {}> & Product & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
    update(id: string, data: any): Promise<import("mongoose").Document<unknown, {}, Product, {}, {}> & Product & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
    delete(id: string): Promise<import("mongoose").Document<unknown, {}, Product, {}, {}> & Product & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
}
