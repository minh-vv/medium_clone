import { Body, Controller, Post } from '@nestjs/common';
import { LoginDto, RegisterDto, UserResponseDto, LoginResponseDto } from './dto/auth.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly  authService: AuthService) {}

  @Post('register')
  register(@Body() body: RegisterDto): Promise<UserResponseDto> {
    return this.authService.register(body);
  }

  @Post('login')
  login(@Body() body: LoginDto): Promise<LoginResponseDto> {
    return this.authService.login(body);
  }
}
