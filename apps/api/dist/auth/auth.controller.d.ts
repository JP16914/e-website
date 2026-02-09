import { AuthService } from './auth.service';
import { Response } from 'express';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    login(req: any, res: Response): Promise<any>;
    getMe(req: any): Promise<import("../users/schemas/user.schema").User>;
    signup(body: any): Promise<any>;
    logout(res: Response): Promise<{
        message: string;
    }>;
    changePassword(req: any, body: any): Promise<{
        message: string;
    }>;
}
