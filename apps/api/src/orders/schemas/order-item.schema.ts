import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

@Schema()
export class OrderItem extends Document {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Order', index: true })
  orderId: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Product', index: true })
  productId: string;

  @Prop()
  qty: number;

  @Prop()
  unitPriceCents: number;

  @Prop()
  nameSnapshot: string;

  @Prop()
  imageSnapshot: string;
}

export const OrderItemSchema = SchemaFactory.createForClass(OrderItem);
