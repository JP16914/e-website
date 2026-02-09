import { CartService } from './cart.service';
import { GuestCartService } from './guest-cart.service';
import { Response, Request as ExpressRequest } from 'express';
export declare class CartController {
    private cartService;
    private guestService;
    constructor(cartService: CartService, guestService: GuestCartService);
    getUserCartItems(req: any): Promise<{
        _id: import("mongoose").Types.ObjectId;
        items: any[];
        subtotal: number;
    }>;
    addItem(req: any, body: any): Promise<{
        _id: import("mongoose").Types.ObjectId;
        items: any[];
        subtotal: number;
    }>;
    updateItem(req: any, productId: string, body: any): Promise<{
        _id: import("mongoose").Types.ObjectId;
        items: any[];
        subtotal: number;
    }>;
    deleteItem(req: any, productId: string): Promise<{
        _id: import("mongoose").Types.ObjectId;
        items: any[];
        subtotal: number;
    }>;
    clearUserCart(req: any): Promise<{
        items: any[];
        subtotal: number;
    }>;
    mergeGuest(req: any, expressReq: ExpressRequest): Promise<{
        _id: import("mongoose").Types.ObjectId;
        items: any[];
        subtotal: number;
    }>;
    initGuestCart(res: Response): Promise<{
        cartId: string;
    }>;
    getGuestCart(req: ExpressRequest): Promise<{
        items: any[];
        subtotal: number;
    }>;
    addGuestItem(req: ExpressRequest, body: any, res: Response): Promise<{
        items: any[];
        subtotal: number;
    }>;
    updateGuestItem(req: ExpressRequest, productId: string, body: any): Promise<{
        items: any[];
        subtotal: number;
    }>;
    removeGuestItem(req: ExpressRequest, productId: string): Promise<{
        items: any[];
        subtotal: number;
    }>;
}
