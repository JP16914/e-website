import { Document, Schema as MongooseSchema } from 'mongoose';
export declare class Address extends Document {
    userId: string;
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
    isDefault: boolean;
}
export declare const AddressSchema: MongooseSchema<Address, import("mongoose").Model<Address, any, any, any, Document<unknown, any, Address, any, {}> & Address & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Address, Document<unknown, {}, import("mongoose").FlatRecord<Address>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<Address> & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
}>;
