import { Controller, Get, Post, Body, Request, Param, Delete, HttpCode, HttpStatus, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginInput } from './dto/auth.dto';
import { AuthGuard } from './guards/auth.guard';
import { SignupInput } from './dto/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @HttpCode(HttpStatus.OK)
  @Post('login')
  async signIn(@Body() loginInput: LoginInput) {
    return await this.authService.signIn(loginInput);
  }

  @HttpCode(HttpStatus.OK)
  @Post('signup')
  async signUp(@Body() signupInput: SignupInput) {
    return await this.authService.signUp(signupInput);
  }

  @UseGuards(AuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }
}
