import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
export declare class AuthService {
    usersService: UsersService;
    private jwtService;
    constructor(usersService: UsersService, jwtService: JwtService);
    getUser(id: string): Promise<import("../users/schemas/user.schema").User>;
    validateUser(email: string, pass: string): Promise<any>;
    login(user: any): Promise<{
        access_token: string;
        user: any;
    }>;
    register(data: any): Promise<any>;
    changePassword(userId: string, currentPass: string, newPass: string): Promise<{
        message: string;
    }>;
}
