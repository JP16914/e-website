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
exports.GuestCartService = void 0;
const common_1 = require("@nestjs/common");
const ioredis_1 = require("ioredis");
const mongoose_1 = require("@nestjs/mongoose");
const product_schema_1 = require("../products/schemas/product.schema");
const mongoose_2 = require("mongoose");
const cart_service_1 = require("./cart.service");
let GuestCartService = class GuestCartService {
    constructor(redis, productModel, cartService) {
        this.redis = redis;
        this.productModel = productModel;
        this.cartService = cartService;
    }
    getKey(id) { return `cart:guest:${id}`; }
    async getCart(cartId) {
        const raw = await this.redis.get(this.getKey(cartId));
        if (!raw)
            return { items: [], subtotal: 0 };
        let data = JSON.parse(raw);
        let subtotal = 0;
        const itemsWithDetails = [];
        for (const item of data.items) {
            const product = await this.productModel.findById(item.productId).select('name images actualPriceCents discountPriceCents').exec();
            if (product) {
                const currentPrice = product.discountPriceCents > 0 ? product.discountPriceCents : product.actualPriceCents;
                subtotal += currentPrice * item.qty;
                itemsWithDetails.push(Object.assign(Object.assign({}, item), { product }));
            }
        }
        return { items: itemsWithDetails, subtotal };
    }
    async addItem(cartId, productId, qty) {
        let data = await this.getRaw(cartId);
        const product = await this.productModel.findById(productId);
        if (!product || product.status !== 'ACTIVE')
            throw new common_1.NotFoundException('Product unavailable');
        const price = product.discountPriceCents > 0 ? product.discountPriceCents : product.actualPriceCents;
        const existing = data.items.find((i) => i.productId === productId);
        if (existing) {
            existing.qty += qty;
            existing.unitPriceSnapshotCents = price;
        }
        else {
            data.items.push({ productId, qty, unitPriceSnapshotCents: price, addedAt: new Date() });
        }
        await this.saveRaw(cartId, data);
        return this.getCart(cartId);
    }
    async setItem(cartId, productId, qty) {
        if (qty <= 0)
            return this.removeItem(cartId, productId);
        let data = await this.getRaw(cartId);
        const product = await this.productModel.findById(productId);
        const price = product.discountPriceCents > 0 ? product.discountPriceCents : product.actualPriceCents;
        const existing = data.items.find((i) => i.productId === productId);
        if (existing) {
            existing.qty = qty;
            existing.unitPriceSnapshotCents = price;
        }
        else {
            data.items.push({ productId, qty, unitPriceSnapshotCents: price, addedAt: new Date() });
        }
        await this.saveRaw(cartId, data);
        return this.getCart(cartId);
    }
    async removeItem(cartId, productId) {
        let data = await this.getRaw(cartId);
        data.items = data.items.filter((i) => i.productId !== productId);
        await this.saveRaw(cartId, data);
        return this.getCart(cartId);
    }
    async mergeToUser(guestCartId, userId) {
        const raw = await this.redis.get(this.getKey(guestCartId));
        if (!raw)
            return;
        const data = JSON.parse(raw);
        for (const item of data.items) {
            await this.cartService.addItem(userId, item.productId, item.qty);
        }
        await this.redis.del(this.getKey(guestCartId));
    }
    async getRaw(cartId) {
        const raw = await this.redis.get(this.getKey(cartId));
        return raw ? JSON.parse(raw) : { items: [] };
    }
    async saveRaw(cartId, data) {
        await this.redis.set(this.getKey(cartId), JSON.stringify(data), 'EX', 30 * 24 * 60 * 60);
    }
};
exports.GuestCartService = GuestCartService;
exports.GuestCartService = GuestCartService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)('REDIS_CLIENT')),
    __param(1, (0, mongoose_1.InjectModel)(product_schema_1.Product.name)),
    __metadata("design:paramtypes", [ioredis_1.default,
        mongoose_2.Model,
        cart_service_1.CartService])
], GuestCartService);
//# sourceMappingURL=guest-cart.service.js.map