import { Document } from 'mongoose';
export declare class Product extends Document {
    name: string;
    description: string;
    mainCategory: string;
    subCategory: string;
    actualPriceCents: number;
    discountPriceCents: number;
    stock: number;
    status: string;
    images: string[];
    rating: number;
    reviewCount: number;
}
export declare const ProductSchema: import("mongoose").Schema<Product, import("mongoose").Model<Product, any, any, any, Document<unknown, any, Product, any, {}> & Product & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Product, Document<unknown, {}, import("mongoose").FlatRecord<Product>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<Product> & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
}>;
