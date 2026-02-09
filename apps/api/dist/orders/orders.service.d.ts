import { Model, Connection } from 'mongoose';
import { Order } from './schemas/order.schema';
import { OrderItem } from './schemas/order-item.schema';
import { InventoryAdjustment } from './schemas/inventory.schema';
import { CartService } from '../cart/cart.service';
import { Product } from '../products/schemas/product.schema';
import { UsersService } from '../users/users.service';
export declare class OrdersService {
    private orderModel;
    private orderItemModel;
    private productModel;
    private inventoryLogModel;
    private connection;
    private cartService;
    private usersService;
    constructor(orderModel: Model<Order>, orderItemModel: Model<OrderItem>, productModel: Model<Product>, inventoryLogModel: Model<InventoryAdjustment>, connection: Connection, cartService: CartService, usersService: UsersService);
    create(userId: string, addressId: string): Promise<import("mongoose").Document<unknown, {}, Order, {}, {}> & Order & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
    findByUser(userId: string): Promise<(import("mongoose").Document<unknown, {}, Order, {}, {}> & Order & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    })[]>;
    findOne(id: string, userId: string): Promise<{
        items: (import("mongoose").Document<unknown, {}, OrderItem, {}, {}> & OrderItem & Required<{
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
        db: Connection;
        errors?: import("mongoose").Error.ValidationError;
        id?: any;
        isNew: boolean;
        schema: import("mongoose").Schema;
        __v: number;
    }>;
}
