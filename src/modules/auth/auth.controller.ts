import { Body, Controller, Post } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import LoginDto from './dtos/login.dto';
import { AuthService } from './auth.service';
import RegisterDto from './dtos/register.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/login')
  async login(@Body() loginDto: LoginDto) {
    const token = await this.authService.login(loginDto);
    return token;
  }

  @Post('/register')
  async register(@Body() registerDto: RegisterDto) {
    const newUser = await this.authService.register(registerDto);
    return {
      message: 'Register successfully',
      newUser,
    };
  }
}
