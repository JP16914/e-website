import { Document, Schema as MongooseSchema } from 'mongoose';
export declare class OrderItem extends Document {
    orderId: string;
    productId: string;
    qty: number;
    unitPriceCents: number;
    nameSnapshot: string;
    imageSnapshot: string;
}
export declare const OrderItemSchema: MongooseSchema<OrderItem, import("mongoose").Model<OrderItem, any, any, any, Document<unknown, any, OrderItem, any, {}> & OrderItem & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, OrderItem, Document<unknown, {}, import("mongoose").FlatRecord<OrderItem>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<OrderItem> & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
}>;
