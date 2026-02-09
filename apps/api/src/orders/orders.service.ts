import { Injectable, BadRequestException, OnModuleInit, Inject, NotAcceptableException } from '@nestjs/common';
import { InjectModel, InjectConnection } from '@nestjs/mongoose';
import { Model, Connection } from 'mongoose';
import { Order } from './schemas/order.schema';
import { OrderItem } from './schemas/order-item.schema';
import { InventoryAdjustment } from './schemas/inventory.schema';
import { CartService } from '../cart/cart.service';
import { Product } from '../products/schemas/product.schema';
import { UsersService } from '../users/users.service';

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<Order>,
    @InjectModel(OrderItem.name) private orderItemModel: Model<OrderItem>,
    @InjectModel(Product.name) private productModel: Model<Product>,
    @InjectModel(InventoryAdjustment.name) private inventoryLogModel: Model<InventoryAdjustment>,
    @InjectConnection() private connection: Connection,
    private cartService: CartService,
    private usersService: UsersService,
  ) { }

  async create(userId: string, addressId: string) {
    const session = await this.connection.startSession();
    session.startTransaction();
    try {
      // 1. Get Cart
      const cart = await this.cartService.getCart(userId);
      if (!cart.items.length) throw new BadRequestException('Cart empty');

      // 2. Validate Address
      const address = await this.usersService.getAddresses(userId).then(list => list.find(a => a.id === addressId));
      if (!address) throw new BadRequestException('Invalid address');

      let orderTotal = 0;
      const orderItemsData = [];

      // 3. Deduct Inventory & Prepare Items using explicit atomic updates
      for (const item of cart.items) {
        // We refetch product to ensure price/stock is authoritative
        // findOneAndUpdate is atomic. 
        // We check stock >= qty AND status ACTIVE
        const product = await this.productModel.findOneAndUpdate(
          { _id: item.productId, stock: { $gte: item.qty }, status: 'ACTIVE' },
          { $inc: { stock: -item.qty } },
          { session, new: true }
        );

        if (!product) {
          throw new NotAcceptableException(`Product ${item.product?.name || item.productId} is out of stock or unavailable.`);
        }

        const price = product.discountPriceCents > 0 ? product.discountPriceCents : product.actualPriceCents;
        orderTotal += price * item.qty;

        orderItemsData.push({
          productId: item.productId,
          qty: item.qty,
          unitPriceCents: price,
          nameSnapshot: product.name,
          imageSnapshot: product.images?.[0] || '',
        });

        // Log inventory
        await this.inventoryLogModel.create([{
          productId: item.productId,
          type: 'ORDER_DEDUCT',
          deltaQty: -item.qty,
          reason: 'Order placement'
        }], { session });
      }

      // 4. Create Order
      const [order] = await this.orderModel.create([{
        userId,
        status: 'PLACED',
        totalCents: orderTotal,
        shippingAddressSnapshot: address.toObject()
      }], { session });

      // 5. Create Order Items
      await this.orderItemModel.insertMany(
        orderItemsData.map(i => ({ ...i, orderId: order._id })),
        { session }
      );

      // 6. Clear Cart
      await this.cartService.clearCart(userId); // Not transactional usually unless cart is in same DB. Assuming same DB here.
      // Wait, cart clear is just update one doc.

      await session.commitTransaction();
      return order;
    } catch (e) {
      await session.abortTransaction();
      throw e;
    } finally {
      session.endSession();
    }
  }

  async findByUser(userId: string) {
    return this.orderModel.find({ userId }).sort({ createdAt: -1 }).exec();
  }

  async findOne(id: string, userId: string) {
    const order = await this.orderModel.findOne({ _id: id, userId }).exec();
    if (!order) return null;
    const items = await this.orderItemModel.find({ orderId: id }).exec();
    return { ...order.toObject(), items };
  }
}
