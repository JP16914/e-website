import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Product extends Document {
  @Prop({ required: true, index: 'text' })
  name: string;

  @Prop()
  description: string;

  @Prop({ required: true, index: true })
  mainCategory: string;

  @Prop({ index: true })
  subCategory: string;

  @Prop({ default: 0 })
  actualPriceCents: number;

  @Prop({ default: 0 })
  discountPriceCents: number;

  @Prop({ default: 0 })
  stock: number; // Simple embedded inventory

  @Prop({ default: 'ACTIVE' })
  status: string;

  @Prop([String])
  images: string[];

  @Prop({ default: 0 })
  rating: number;

  @Prop({ default: 0 })
  reviewCount: number;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
ProductSchema.index({ mainCategory: 1, subCategory: 1 });
