import { Body, Controller, Inject, Post, Res, UseGuards } from '@nestjs/common';
import { envs, NATS_SERVICE } from 'src/config';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { RegisterUserDto } from './dto';
import { catchError, firstValueFrom } from 'rxjs';
import { LoginUserDto } from './dto/login-user.dto';
import { RefreshToken, Token, User } from './decorators';
import { CurrentUser } from './interfaces/current-user.interface';
import { Response } from 'express';
import { JwtAuthGuard } from './guards/auth.guard';

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
  async login(@Body() loginDto: LoginUserDto, @Res() res: Response) {

    const response = await firstValueFrom(
      this.client.send('login', loginDto)
    );

    res.cookie('authToken', response.accessToken, {
      httpOnly: true,
      secure: envs.nodeEnv === 'production',
      sameSite: 'strict',
      maxAge: 1000 * 60 * 60, // 1 hour in milliseconds
    });

    res.cookie('refreshToken', response.refreshToken, {
      httpOnly: true,
      secure: envs.nodeEnv === 'production',
      sameSite: 'strict',
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days in milliseconds
    });

    return res.json({
      user: response.user,
      accessToken: response.accessToken,
    });
  }

  @UseGuards(JwtAuthGuard)
  @Post('verify')
  verify(@User() user: CurrentUser, @Token() token: string) {
    return { user, token };
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  logout(@Res() res: Response) {
    res.clearCookie('authToken');
    res.clearCookie('refreshToken');
    return res.json({ message: 'Logged out successfully' });
  }

  @Post('refresh')
  async refresh(@RefreshToken() refreshToken: string, @Res() res: Response) {
    const response = await firstValueFrom(
      this.client.send('refresh', refreshToken)
    );

    res.cookie('authToken', response.accessToken, {
      httpOnly: true,
      secure: envs.nodeEnv === 'production',
      sameSite: 'strict',
      maxAge: 1000 * 60 * 60, // 1 hour in milliseconds
    });

    return res.json({
      accessToken: response.accessToken,
    });
  }
}
