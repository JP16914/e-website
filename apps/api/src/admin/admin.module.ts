import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AdminController } from './admin.controller';
import { ProductsModule } from '../products/products.module';
import { UsersModule } from '../users/users.module';
import { Order, OrderSchema } from '../orders/schemas/order.schema';

@Module({
  imports: [
    ProductsModule,
    UsersModule,
    MongooseModule.forFeature([{ name: Order.name, schema: OrderSchema }])
  ],
  controllers: [AdminController],
})
export class AdminModule { }
