import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schemas/user.schema';
import { Address } from './schemas/address.schema';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Address.name) private addressModel: Model<Address>,
  ) { }

  async create(userData: Partial<User>): Promise<User> {
    const user = new this.userModel(userData);
    return user.save();
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({ email }).select('+passwordHash').exec(); // Explicitly include pwd
  }

  async findById(id: string): Promise<User | null> {
    return this.userModel.findById(id).exec();
  }

  async getAddresses(userId: string) {
    return this.addressModel.find({ userId }).exec();
  }

  async addAddress(userId: string, data: any) {
    // If setting default, unset others first
    if (data.isDefault) {
      await this.addressModel.updateMany({ userId }, { isDefault: false });
    } else {
      // If first address, make it default
      const count = await this.addressModel.countDocuments({ userId });
      if (count === 0) data.isDefault = true;
    }
    return this.addressModel.create({ ...data, userId });
  }
}
