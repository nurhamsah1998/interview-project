import {
  Controller,
  Request,
  Post,
  UseGuards,
  Get,
  Body,
  InternalServerErrorException,
  ValidationPipe,
  HttpStatus,
} from '@nestjs/common';
import { AuthService } from './auth/auth.service';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { LoginDto, RegisterDto } from './auth/auth.dto';

@Controller()
export class AppController {
  constructor(private authService: AuthService) {}

  @Post('auth/login')
  async login(@Body(new ValidationPipe()) user: LoginDto) {
    return this.authService.login(user);
  }

  @Post('auth/register')
  async register(@Body(new ValidationPipe()) user: RegisterDto) {
    return await this.authService.register(user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }
}
