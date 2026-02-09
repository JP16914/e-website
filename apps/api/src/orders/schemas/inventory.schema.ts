import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class InventoryAdjustment extends Document {
  @Prop({ index: true })
  productId: string;

  @Prop()
  type: string; // ORDER_DEDUCT, RESTOCK

  @Prop()
  deltaQty: number;

  @Prop()
  reason: string;
}

export const InventoryAdjustmentSchema = SchemaFactory.createForClass(InventoryAdjustment);
