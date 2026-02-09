import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

@Schema({ timestamps: true })
export class Order extends Document {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', index: true })
  userId: string;

  @Prop({ default: 'PLACED' })
  status: string;

  @Prop()
  totalCents: number;

  @Prop({ type: Object })
  shippingAddressSnapshot: any;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
