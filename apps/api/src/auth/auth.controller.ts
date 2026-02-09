import { Controller, Get, Post, Body, UseGuards, Request, Res, HttpStatus } from '@nestjs/common';
import { JwtAuthGuard } from './jwt-auth.guard';
import { AuthService } from './auth.service';
import { Response } from 'express';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) { }

  @Post('login')
  async login(@Body() req, @Res({ passthrough: true }) res: Response) {
    const user = await this.authService.validateUser(req.email, req.password);
    if (!user) {
      res.status(HttpStatus.UNAUTHORIZED).json({ message: 'Invalid credentials' });
      return;
    }
    const { access_token } = await this.authService.login(user);

    // Set HttpOnly Cookie
    res.cookie('access_token', access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 15 * 60 * 1000, // 15m
    });

    return user;
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getMe(@Request() req) {
    return this.authService.getUser(req.user.userId);
  }

  @Post('signup')
  async signup(@Body() body) {
    return this.authService.register(body);
  }

  @Post('logout')
  async logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('access_token');
    return { message: 'Logged out' };
  }

  @UseGuards(JwtAuthGuard)
  @Post('change-password')
  async changePassword(@Request() req, @Body() body) {
    return this.authService.changePassword(req.user.userId, body.currentPassword, body.newPassword);
  }
}
