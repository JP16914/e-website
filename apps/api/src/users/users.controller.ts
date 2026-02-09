import { Controller, Get, Post, Body, UseGuards, Request, Patch } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getProfile(@Request() req) {
    return this.usersService.findById(req.user.userId);
  }

  // Addresses
  @UseGuards(JwtAuthGuard)
  @Get('me/addresses')
  async getAddresses(@Request() req) {
    return this.usersService.getAddresses(req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('me/addresses')
  async addAddress(@Request() req, @Body() body) {
    return this.usersService.addAddress(req.user.userId, body);
  }
}
