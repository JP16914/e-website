import { UsersService } from './users.service';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    getProfile(req: any): Promise<import("./schemas/user.schema").User>;
    getAddresses(req: any): Promise<(import("mongoose").Document<unknown, {}, import("./schemas/address.schema").Address, {}, {}> & import("./schemas/address.schema").Address & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    })[]>;
    addAddress(req: any, body: any): Promise<import("mongoose").Document<unknown, {}, import("./schemas/address.schema").Address, {}, {}> & import("./schemas/address.schema").Address & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
}
