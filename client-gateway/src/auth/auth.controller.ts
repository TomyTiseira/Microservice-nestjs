import { Body, Controller, HttpStatus, Inject, Post } from '@nestjs/common';
import { NATS_SERVICE } from 'src/config';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { RegisterUserDto } from './dto';
import { catchError } from 'rxjs';
import { LoginUserDto } from './dto/login-user.dto';

@Controller('auth')
export class AuthController {
  constructor(
    @Inject(NATS_SERVICE) private readonly client: ClientProxy,
  ) {}
  
  @Post('register')
  register(@Body() registerUserDto: RegisterUserDto) {
    return this.client.send('register', registerUserDto)
      .pipe(
        catchError(error => { throw new RpcException(error) })
      );
  }

  @Post('login')
  login(@Body() loginDto: LoginUserDto) {
    return this.client.send('login', loginDto)
      .pipe(
        catchError(error => { throw new RpcException(error) })
      );
  }
}
