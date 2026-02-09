import { OrdersService } from './orders.service';
export declare class OrdersController {
    private readonly ordersService;
    constructor(ordersService: OrdersService);
    checkout(req: any, body: any): Promise<import("mongoose").Document<unknown, {}, import("./schemas/order.schema").Order, {}, {}> & import("./schemas/order.schema").Order & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
    list(req: any): Promise<(import("mongoose").Document<unknown, {}, import("./schemas/order.schema").Order, {}, {}> & import("./schemas/order.schema").Order & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    })[]>;
    one(req: any, id: string): Promise<{
        items: (import("mongoose").Document<unknown, {}, import("./schemas/order-item.schema").OrderItem, {}, {}> & import("./schemas/order-item.schema").OrderItem & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        })[];
        userId: string;
        status: string;
        totalCents: number;
        shippingAddressSnapshot: any;
        _id: import("mongoose").Types.ObjectId;
        $locals: Record<string, unknown>;
        $op: "save" | "validate" | "remove" | null;
        $where: Record<string, unknown>;
        baseModelName?: string;
        collection: import("mongoose").Collection;
        db: import("mongoose").Connection;
        errors?: import("mongoose").Error.ValidationError;
        id?: any;
        isNew: boolean;
        schema: import("mongoose").Schema;
        __v: number;
    }>;
}
