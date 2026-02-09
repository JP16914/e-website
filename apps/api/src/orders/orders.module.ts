import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Order, OrderSchema } from './schemas/order.schema';
import { OrderItem, OrderItemSchema } from './schemas/order-item.schema';
import { InventoryAdjustment, InventoryAdjustmentSchema } from './schemas/inventory.schema';
import { OrdersController } from './order.controller';
import { OrdersService } from './orders.service';
import { CartModule } from '../cart/cart.module';
import { ProductsModule } from '../products/products.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Order.name, schema: OrderSchema },
      { name: OrderItem.name, schema: OrderItemSchema },
      { name: InventoryAdjustment.name, schema: InventoryAdjustmentSchema }
    ]),
    CartModule,
    ProductsModule,
    UsersModule
  ],
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class OrdersModule { }
