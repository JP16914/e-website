import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Cart extends Document {
  @Prop({ unique: true, index: true })
  userId: string;

  @Prop({ default: 'ACTIVE' })
  status: string;

  @Prop({
    type: [{
      productId: String,
      qty: Number,
      unitPriceSnapshotCents: Number,
      currency: { type: String, default: 'USD' }
    }],
    default: []
  })
  items: Array<{
    productId: string;
    qty: number;
    unitPriceSnapshotCents: number;
    currency?: string;
  }>;
}

export const CartSchema = SchemaFactory.createForClass(Cart);
