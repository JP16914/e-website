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
exports.CartController = void 0;
const common_1 = require("@nestjs/common");
const cart_service_1 = require("./cart.service");
const guest_cart_service_1 = require("./guest-cart.service");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const swagger_1 = require("@nestjs/swagger");
const uuid_1 = require("uuid");
let CartController = class CartController {
    constructor(cartService, guestService) {
        this.cartService = cartService;
        this.guestService = guestService;
    }
    async getUserCartItems(req) {
        return this.cartService.getCart(req.user.userId);
    }
    async addItem(req, body) {
        return this.cartService.addItem(req.user.userId, body.productId, body.qty);
    }
    async updateItem(req, productId, body) {
        return this.cartService.setItem(req.user.userId, productId, body.qty);
    }
    async deleteItem(req, productId) {
        return this.cartService.removeItem(req.user.userId, productId);
    }
    async clearUserCart(req) {
        return this.cartService.clearCart(req.user.userId);
    }
    async mergeGuest(req, expressReq) {
        const guestId = expressReq.cookies['guest_cart_id'];
        if (guestId) {
            await this.guestService.mergeToUser(guestId, req.user.userId);
        }
        return this.cartService.getCart(req.user.userId);
    }
    async initGuestCart(res) {
        const id = (0, uuid_1.v4)();
        res.cookie('guest_cart_id', id, { httpOnly: true, maxAge: 30 * 24 * 3600 * 1000 });
        return { cartId: id };
    }
    async getGuestCart(req) {
        const id = req.cookies['guest_cart_id'];
        if (!id)
            return { items: [], subtotal: 0 };
        return this.guestService.getCart(id);
    }
    async addGuestItem(req, body, res) {
        let id = req.cookies['guest_cart_id'];
        if (!id) {
            id = (0, uuid_1.v4)();
            res.cookie('guest_cart_id', id, { httpOnly: true });
        }
        return this.guestService.addItem(id, body.productId, body.qty);
    }
    async updateGuestItem(req, productId, body) {
        const id = req.cookies['guest_cart_id'];
        if (!id)
            return;
        return this.guestService.setItem(id, productId, body.qty);
    }
    async removeGuestItem(req, productId) {
        const id = req.cookies['guest_cart_id'];
        if (!id)
            return;
        return this.guestService.removeItem(id, productId);
    }
};
exports.CartController = CartController;
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('cart/items'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CartController.prototype, "getUserCartItems", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)('cart/items'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], CartController.prototype, "addItem", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Put)('cart/items/:id'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", Promise)
], CartController.prototype, "updateItem", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Delete)('cart/items/:id'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], CartController.prototype, "deleteItem", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Delete)('cart'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CartController.prototype, "clearUserCart", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)('cart/merge-guest'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], CartController.prototype, "mergeGuest", null);
__decorate([
    (0, common_1.Post)('guest-cart'),
    __param(0, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CartController.prototype, "initGuestCart", null);
__decorate([
    (0, common_1.Get)('guest-cart/items'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CartController.prototype, "getGuestCart", null);
__decorate([
    (0, common_1.Post)('guest-cart/items'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], CartController.prototype, "addGuestItem", null);
__decorate([
    (0, common_1.Put)('guest-cart/items/:id'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", Promise)
], CartController.prototype, "updateGuestItem", null);
__decorate([
    (0, common_1.Delete)('guest-cart/items/:id'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], CartController.prototype, "removeGuestItem", null);
exports.CartController = CartController = __decorate([
    (0, swagger_1.ApiTags)('Cart'),
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [cart_service_1.CartService,
        guest_cart_service_1.GuestCartService])
], CartController);
//# sourceMappingURL=cart.controller.js.map