import { HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginDto, RegisterDto } from './dto';
import { User, UserDocument } from 'src/mongoose/schemas/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RpcException } from '@nestjs/microservices';
import { JwtPayload } from './interfaces/jwt-payload';
import * as bcrypt from 'bcrypt';
import { envs } from 'src/config';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    private readonly jwtService: JwtService,
  ) {}

  private signJWT(payload: JwtPayload) {
    return this.jwtService.sign(payload);
  }

  private singJWTRefresh(payload: JwtPayload) {
    return this.jwtService.sign(payload, {
      secret: envs.jwtRefreshSecret,
      expiresIn: '7d',
    });
  }

  verifyJWT(token: string) {
    try {
      const user = this.jwtService.verify<JwtPayload>(token, {
        secret: envs.jwtSecret,
      });

      return {
        user,
        token: this.signJWT(user),
      };
    } catch {
      throw new RpcException({
        message: 'Invalid token',
        status: HttpStatus.UNAUTHORIZED,
      });
    }
  }

  private verifyRefreshToken(token: string) {
    try {
      const { ...user } = this.jwtService.verify<JwtPayload>(token, {
        secret: envs.jwtRefreshSecret,
      });

      return user;
    } catch {
      throw new RpcException({
        message: 'Invalid refresh token',
        status: HttpStatus.UNAUTHORIZED,
      });
    }
  }

  async registerUser(registerUserDto: RegisterDto) {
    const { email, name, password: plainPassword } = registerUserDto;

    if (!email || !name || !plainPassword) {
      throw new RpcException({
        message: 'All fields are required',
        status: HttpStatus.BAD_REQUEST,
      });
    }

    try {
      const user = await this.userModel.findOne({ email }).exec();

      if (user) {
        throw new RpcException({
          message: 'User already exists',
          status: HttpStatus.BAD_REQUEST,
        });
      }

      const hashedPassword = bcrypt.hashSync(String(plainPassword), 10);

      const newUser = new this.userModel({
        email,
        name,
        password: hashedPassword,
      });

      await newUser.save();

      const newUserDocument = newUser.toObject();
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password: _, ...result } = newUserDocument;

      return {
        user: result,
        token: this.signJWT(result),
      };
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'An unknown error occurred';
      throw new RpcException({
        message: errorMessage,
        status: HttpStatus.BAD_REQUEST,
      });
    }
  }

  async loginUser(loginUserDto: LoginDto) {
    const { email, password } = loginUserDto;

    try {
      const user = await this.userModel.findOne({ email }).exec();

      if (!user) {
        throw new RpcException({
          message: 'User not found',
          status: HttpStatus.NOT_FOUND,
        });
      }

      const isPasswordValid = bcrypt.compareSync(password, user.password);

      if (!isPasswordValid) {
        throw new RpcException({
          message: 'Invalid password',
          status: HttpStatus.UNAUTHORIZED,
        });
      }

      const userDocument = user.toObject();
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password: _, ...result } = userDocument;

      return {
        user: result,
        accessToken: this.signJWT(result),
        refreshToken: this.singJWTRefresh(result),
      };
    } catch (error) {
      throw new RpcException({
        message:
          error instanceof Error ? error.message : 'An unknown error occurred',
        status: HttpStatus.BAD_REQUEST,
      });
    }
  }

  refresh(refreshToken: string) {
    const payload = this.verifyRefreshToken(refreshToken);

    const newAccessToken = this.signJWT(payload);

    return {
      accessToken: newAccessToken,
    };
  }
}
