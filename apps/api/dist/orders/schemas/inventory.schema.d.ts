import { Document } from 'mongoose';
export declare class InventoryAdjustment extends Document {
    productId: string;
    type: string;
    deltaQty: number;
    reason: string;
}
export declare const InventoryAdjustmentSchema: import("mongoose").Schema<InventoryAdjustment, import("mongoose").Model<InventoryAdjustment, any, any, any, Document<unknown, any, InventoryAdjustment, any, {}> & InventoryAdjustment & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, InventoryAdjustment, Document<unknown, {}, import("mongoose").FlatRecord<InventoryAdjustment>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<InventoryAdjustment> & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
}>;
