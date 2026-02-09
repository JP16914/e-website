import { Controller, Get, UseGuards, Put, Param, Body, Delete, Post } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ProductsService } from '../products/products.service';
import { UsersService } from '../users/users.service';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order } from '../orders/schemas/order.schema';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Admin')
@Controller('admin')
@UseGuards(JwtAuthGuard) // Add role guard here in real app
export class AdminController {
  constructor(
    private productsService: ProductsService,
    private usersService: UsersService,
    @InjectModel(Order.name) private orderModel: Model<Order>
  ) { }

  // Products
  @Get('products')
  async getProducts() { return this.productsService.findAll({ limit: 1000 }); }

  @Post('products')
  async createProduct(@Body() body) { return this.productsService.create(body); }

  @Put('products/:id')
  async updateProduct(@Param('id') id: string, @Body() body) { return this.productsService.update(id, body); }

  @Delete('products/:id')
  async deleteProduct(@Param('id') id: string) { return this.productsService.delete(id); }

  // Users
  // ... implement list users

  // Orders
  @Get('orders')
  async getOrders() { return this.orderModel.find().sort({ createdAt: -1 }).limit(50).exec(); }
}
