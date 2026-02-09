"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrdersService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const order_schema_1 = require("./schemas/order.schema");
const order_item_schema_1 = require("./schemas/order-item.schema");
const inventory_schema_1 = require("./schemas/inventory.schema");
const cart_service_1 = require("../cart/cart.service");
const product_schema_1 = require("../products/schemas/product.schema");
const users_service_1 = require("../users/users.service");
let OrdersService = class OrdersService {
    constructor(orderModel, orderItemModel, productModel, inventoryLogModel, connection, cartService, usersService) {
        this.orderModel = orderModel;
        this.orderItemModel = orderItemModel;
        this.productModel = productModel;
        this.inventoryLogModel = inventoryLogModel;
        this.connection = connection;
        this.cartService = cartService;
        this.usersService = usersService;
    }
    async create(userId, addressId) {
        var _a, _b;
        const session = await this.connection.startSession();
        session.startTransaction();
        try {
            const cart = await this.cartService.getCart(userId);
            if (!cart.items.length)
                throw new common_1.BadRequestException('Cart empty');
            const address = await this.usersService.getAddresses(userId).then(list => list.find(a => a.id === addressId));
            if (!address)
                throw new common_1.BadRequestException('Invalid address');
            let orderTotal = 0;
            const orderItemsData = [];
            for (const item of cart.items) {
                const product = await this.productModel.findOneAndUpdate({ _id: item.productId, stock: { $gte: item.qty }, status: 'ACTIVE' }, { $inc: { stock: -item.qty } }, { session, new: true });
                if (!product) {
                    throw new common_1.NotAcceptableException(`Product ${((_a = item.product) === null || _a === void 0 ? void 0 : _a.name) || item.productId} is out of stock or unavailable.`);
                }
                const price = product.discountPriceCents > 0 ? product.discountPriceCents : product.actualPriceCents;
                orderTotal += price * item.qty;
                orderItemsData.push({
                    productId: item.productId,
                    qty: item.qty,
                    unitPriceCents: price,
                    nameSnapshot: product.name,
                    imageSnapshot: ((_b = product.images) === null || _b === void 0 ? void 0 : _b[0]) || '',
                });
                await this.inventoryLogModel.create([{
                        productId: item.productId,
                        type: 'ORDER_DEDUCT',
                        deltaQty: -item.qty,
                        reason: 'Order placement'
                    }], { session });
            }
            const [order] = await this.orderModel.create([{
                    userId,
                    status: 'PLACED',
                    totalCents: orderTotal,
                    shippingAddressSnapshot: address.toObject()
                }], { session });
            await this.orderItemModel.insertMany(orderItemsData.map(i => (Object.assign(Object.assign({}, i), { orderId: order._id }))), { session });
            await this.cartService.clearCart(userId);
            await session.commitTransaction();
            return order;
        }
        catch (e) {
            await session.abortTransaction();
            throw e;
        }
        finally {
            session.endSession();
        }
    }
    async findByUser(userId) {
        return this.orderModel.find({ userId }).sort({ createdAt: -1 }).exec();
    }
    async findOne(id, userId) {
        const order = await this.orderModel.findOne({ _id: id, userId }).exec();
        if (!order)
            return null;
        const items = await this.orderItemModel.find({ orderId: id }).exec();
        return Object.assign(Object.assign({}, order.toObject()), { items });
    }
};
exports.OrdersService = OrdersService;
exports.OrdersService = OrdersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(order_schema_1.Order.name)),
    __param(1, (0, mongoose_1.InjectModel)(order_item_schema_1.OrderItem.name)),
    __param(2, (0, mongoose_1.InjectModel)(product_schema_1.Product.name)),
    __param(3, (0, mongoose_1.InjectModel)(inventory_schema_1.InventoryAdjustment.name)),
    __param(4, (0, mongoose_1.InjectConnection)()),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Connection,
        cart_service_1.CartService,
        users_service_1.UsersService])
], OrdersService);
//# sourceMappingURL=orders.service.js.map