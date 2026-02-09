import { Document } from 'mongoose';
export declare class Cart extends Document {
    userId: string;
    status: string;
    items: Array<{
        productId: string;
        qty: number;
        unitPriceSnapshotCents: number;
        currency?: string;
    }>;
}
export declare const CartSchema: import("mongoose").Schema<Cart, import("mongoose").Model<Cart, any, any, any, Document<unknown, any, Cart, any, {}> & Cart & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Cart, Document<unknown, {}, import("mongoose").FlatRecord<Cart>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<Cart> & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
}>;
