import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AuthService } from './auth.service';
import { LoginDto, RegisterDto } from './dto';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @MessagePattern('register')
  async register(@Payload() registerUserDto: RegisterDto) {
    return this.authService.registerUser(registerUserDto);
  }

  @MessagePattern('login')
  async login(@Payload() loginUserDto: LoginDto) {
    return this.authService.loginUser(loginUserDto);
  }

  @MessagePattern('refresh')
  async refresh(@Payload() refreshToken: string) {
    return this.authService.refresh(refreshToken);
  }
}
