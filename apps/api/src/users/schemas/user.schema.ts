import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export enum UserRole {
  USER = 'USER',
  ADMIN = 'ADMIN',
}

@Schema({ timestamps: true })
export class User extends Document {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true, select: false }) // Hide password by default
  passwordHash: string;

  @Prop()
  firstName: string;

  @Prop()
  lastName: string;

  @Prop()
  phone?: string;

  @Prop({ default: UserRole.USER })
  role: UserRole;

  @Prop({ default: 'ACTIVE' })
  status: string;

  @Prop()
  currentCartId?: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
