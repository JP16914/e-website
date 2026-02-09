import { Injectable, UnauthorizedException, BadRequestException, OnModuleInit } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    public usersService: UsersService,
    private jwtService: JwtService,
  ) { }

  async getUser(id: string) {
    return this.usersService.findById(id);
  }

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);
    if (user && await bcrypt.compare(pass, user.passwordHash)) {
      const { passwordHash, ...result } = user.toObject();
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = { email: user.email, sub: user._id, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
      user,
    };
  }

  async register(data: any) {
    const existing = await this.usersService.findByEmail(data.email);
    if (existing) throw new BadRequestException('Email exists');

    const hash = await bcrypt.hash(data.password, 10);
    const user = await this.usersService.create({
      ...data,
      passwordHash: hash
    });

    const { passwordHash, ...result } = user.toObject();
    return result;
  }

  async changePassword(userId: string, currentPass: string, newPass: string) {
    const user = await this.usersService.findById(userId);
    if (!user) throw new UnauthorizedException();

    const isMatch = await bcrypt.compare(currentPass, user.passwordHash);
    if (!isMatch) throw new BadRequestException('Current password incorrect');

    const newHash = await bcrypt.hash(newPass, 10);
    user.passwordHash = newHash;
    await user.save();

    return { message: 'Password updated successfully' };
  }
}
