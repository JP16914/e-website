import { Controller, Post, Body, UseGuards, Request, Get, Param } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Orders')
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) { }

  @UseGuards(JwtAuthGuard)
  @Post()
  async checkout(@Request() req, @Body() body) {
    return this.ordersService.create(req.user.userId, body.addressId);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async list(@Request() req) {
    return this.ordersService.findByUser(req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async one(@Request() req, @Param('id') id: string) {
    return this.ordersService.findOne(id, req.user.userId);
  }
}
