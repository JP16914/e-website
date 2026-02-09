import { Document, Schema as MongooseSchema } from 'mongoose';
export declare class Order extends Document {
    userId: string;
    status: string;
    totalCents: number;
    shippingAddressSnapshot: any;
}
export declare const OrderSchema: MongooseSchema<Order, import("mongoose").Model<Order, any, any, any, Document<unknown, any, Order, any, {}> & Order & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Order, Document<unknown, {}, import("mongoose").FlatRecord<Order>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<Order> & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
}>;
