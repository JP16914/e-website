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
exports.CartService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const cart_schema_1 = require("./schemas/cart.schema");
const product_schema_1 = require("../products/schemas/product.schema");
let CartService = class CartService {
    constructor(cartModel, productModel) {
        this.cartModel = cartModel;
        this.productModel = productModel;
    }
    async getCart(userId) {
        let cart = await this.cartModel.findOne({ userId, status: 'ACTIVE' });
        if (!cart) {
            cart = await this.cartModel.create({ userId, items: [] });
        }
        let subtotal = 0;
        const itemsWithDetails = [];
        for (const item of cart.items) {
            const product = await this.productModel.findById(item.productId).select('name images actualPriceCents discountPriceCents status stock').exec();
            if (product && product.status === 'ACTIVE') {
                const currentPrice = product.discountPriceCents > 0 ? product.discountPriceCents : product.actualPriceCents;
                subtotal += currentPrice * item.qty;
                itemsWithDetails.push({
                    productId: item.productId,
                    qty: item.qty,
                    unitPriceSnapshotCents: item.unitPriceSnapshotCents,
                    currency: item.currency,
                    product
                });
            }
            else {
            }
        }
        return { _id: cart._id, items: itemsWithDetails, subtotal };
    }
    async setItem(userId, productId, qty) {
        if (qty <= 0)
            return this.removeItem(userId, productId);
        let cart = await this.cartModel.findOne({ userId, status: 'ACTIVE' });
        if (!cart)
            cart = await this.cartModel.create({ userId, items: [] });
        const product = await this.productModel.findById(productId);
        if (!product || product.status !== 'ACTIVE')
            throw new common_1.NotFoundException('Product not found');
        const price = product.discountPriceCents > 0 ? product.discountPriceCents : product.actualPriceCents;
        const existingIdx = cart.items.findIndex(i => i.productId === productId);
        if (existingIdx !== -1) {
            cart.items[existingIdx].qty = qty;
            cart.items[existingIdx].unitPriceSnapshotCents = price;
        }
        else {
            cart.items.push({ productId, qty, unitPriceSnapshotCents: price, currency: 'USD' });
        }
        cart.markModified('items');
        await cart.save();
        return this.getCart(userId);
    }
    async addItem(userId, productId, qty) {
        let cart = await this.cartModel.findOne({ userId, status: 'ACTIVE' });
        if (!cart)
            cart = await this.cartModel.create({ userId, items: [] });
        const product = await this.productModel.findById(productId);
        if (!product || product.status !== 'ACTIVE')
            throw new common_1.NotFoundException('Product not found');
        const price = product.discountPriceCents > 0 ? product.discountPriceCents : product.actualPriceCents;
        const existingIdx = cart.items.findIndex(i => i.productId === productId);
        if (existingIdx !== -1) {
            cart.items[existingIdx].qty += qty;
            cart.items[existingIdx].unitPriceSnapshotCents = price;
        }
        else {
            cart.items.push({ productId, qty, unitPriceSnapshotCents: price, currency: 'USD' });
        }
        cart.markModified('items');
        await cart.save();
        return this.getCart(userId);
    }
    async removeItem(userId, productId) {
        await this.cartModel.updateOne({ userId, status: 'ACTIVE' }, { $pull: { items: { productId } } });
        return this.getCart(userId);
    }
    async clearCart(userId) {
        await this.cartModel.updateOne({ userId, status: 'ACTIVE' }, { items: [] });
        return { items: [], subtotal: 0 };
    }
};
exports.CartService = CartService;
exports.CartService = CartService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(cart_schema_1.Cart.name)),
    __param(1, (0, mongoose_1.InjectModel)(product_schema_1.Product.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model])
], CartService);
//# sourceMappingURL=cart.service.js.map