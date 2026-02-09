import { Model } from 'mongoose';
import { User } from './schemas/user.schema';
import { Address } from './schemas/address.schema';
export declare class UsersService {
    private userModel;
    private addressModel;
    constructor(userModel: Model<User>, addressModel: Model<Address>);
    create(userData: Partial<User>): Promise<User>;
    findByEmail(email: string): Promise<User | null>;
    findById(id: string): Promise<User | null>;
    getAddresses(userId: string): Promise<(import("mongoose").Document<unknown, {}, Address, {}, {}> & Address & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    })[]>;
    addAddress(userId: string, data: any): Promise<import("mongoose").Document<unknown, {}, Address, {}, {}> & Address & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
}
