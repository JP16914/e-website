import { Controller, Get, Post, Put, Delete, Body, UseGuards, Request, Res, Req, Param } from '@nestjs/common';
import { CartService } from './cart.service';
import { GuestCartService } from './guest-cart.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiTags } from '@nestjs/swagger';
import { Response, Request as ExpressRequest } from 'express';
import { v4 as uuidv4 } from 'uuid';

@ApiTags('Cart')
@Controller() // Using root controller for mixed routes
export class CartController {
  constructor(
    private cartService: CartService,
    private guestService: GuestCartService
  ) { }

  // USER CART
  @UseGuards(JwtAuthGuard)
  @Get('cart/items')
  async getUserCartItems(@Request() req) {
    return this.cartService.getCart(req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('cart/items')
  async addItem(@Request() req, @Body() body) {
    return this.cartService.addItem(req.user.userId, body.productId, body.qty);
  }

  @UseGuards(JwtAuthGuard)
  @Put('cart/items/:id')
  async updateItem(@Request() req, @Param('id') productId: string, @Body() body) {
    return this.cartService.setItem(req.user.userId, productId, body.qty);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('cart/items/:id')
  async deleteItem(@Request() req, @Param('id') productId: string) {
    return this.cartService.removeItem(req.user.userId, productId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('cart')
  async clearUserCart(@Request() req) {
    return this.cartService.clearCart(req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('cart/merge-guest')
  async mergeGuest(@Request() req, @Req() expressReq: ExpressRequest) {
    const guestId = expressReq.cookies['guest_cart_id'];
    if (guestId) {
      await this.guestService.mergeToUser(guestId, req.user.userId);
    }
    return this.cartService.getCart(req.user.userId);
  }


  // GUEST CART
  @Post('guest-cart')
  async initGuestCart(@Res({ passthrough: true }) res: Response) {
    const id = uuidv4();
    res.cookie('guest_cart_id', id, { httpOnly: true, maxAge: 30 * 24 * 3600 * 1000 });
    return { cartId: id };
  }

  @Get('guest-cart/items')
  async getGuestCart(@Req() req: ExpressRequest) {
    const id = req.cookies['guest_cart_id'];
    if (!id) return { items: [], subtotal: 0 };
    return this.guestService.getCart(id);
  }

  @Post('guest-cart/items')
  async addGuestItem(@Req() req: ExpressRequest, @Body() body, @Res({ passthrough: true }) res: Response) {
    let id = req.cookies['guest_cart_id'];
    if (!id) {
      id = uuidv4();
      res.cookie('guest_cart_id', id, { httpOnly: true });
    }
    return this.guestService.addItem(id, body.productId, body.qty);
  }

  @Put('guest-cart/items/:id')
  async updateGuestItem(@Req() req: ExpressRequest, @Param('id') productId: string, @Body() body) {
    const id = req.cookies['guest_cart_id'];
    if (!id) return;
    return this.guestService.setItem(id, productId, body.qty);
  }

  @Delete('guest-cart/items/:id')
  async removeGuestItem(@Req() req: ExpressRequest, @Param('id') productId: string) {
    const id = req.cookies['guest_cart_id'];
    if (!id) return;
    return this.guestService.removeItem(id, productId);
  }
}
