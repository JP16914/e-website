import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Cart, CartSchema } from './schemas/cart.schema';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { GuestCartService } from './guest-cart.service';

import { ProductsModule } from '../products/products.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Cart.name, schema: CartSchema }]),
    ProductsModule
  ],
  controllers: [CartController],
  providers: [CartService, GuestCartService],
  exports: [CartService, GuestCartService],
})
export class CartModule { }
