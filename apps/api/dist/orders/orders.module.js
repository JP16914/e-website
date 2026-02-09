"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrdersModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const order_schema_1 = require("./schemas/order.schema");
const order_item_schema_1 = require("./schemas/order-item.schema");
const inventory_schema_1 = require("./schemas/inventory.schema");
const order_controller_1 = require("./order.controller");
const orders_service_1 = require("./orders.service");
const cart_module_1 = require("../cart/cart.module");
const products_module_1 = require("../products/products.module");
const users_module_1 = require("../users/users.module");
let OrdersModule = class OrdersModule {
};
exports.OrdersModule = OrdersModule;
exports.OrdersModule = OrdersModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: order_schema_1.Order.name, schema: order_schema_1.OrderSchema },
                { name: order_item_schema_1.OrderItem.name, schema: order_item_schema_1.OrderItemSchema },
                { name: inventory_schema_1.InventoryAdjustment.name, schema: inventory_schema_1.InventoryAdjustmentSchema }
            ]),
            cart_module_1.CartModule,
            products_module_1.ProductsModule,
            users_module_1.UsersModule
        ],
        controllers: [order_controller_1.OrdersController],
        providers: [orders_service_1.OrdersService],
    })
], OrdersModule);
//# sourceMappingURL=orders.module.js.map