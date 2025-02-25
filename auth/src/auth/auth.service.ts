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

  private async signJWT (payload: JwtPayload) {
    return this.jwtService.sign(payload);
  }

  private async singJWTRefresh (payload: JwtPayload) {
    return this.jwtService.sign(payload, { 
      secret: envs.jwtRefreshSecret,
      expiresIn: '7d'
     });
  }

  async verifyJWT (token: string) {
    try {
      const { sub, iat, exp, ...user } = this.jwtService.verify(token, {
        secret: envs.jwtSecret,
      });

      return {
        user,
        token: await this.signJWT(user)
      }
    } catch (error) {
      throw new RpcException({
        message: 'Invalid token',
        status: HttpStatus.UNAUTHORIZED
      });
    }
  }

  private async verifyRefreshToken(token: string) {
    try {
      const { sub, iat, exp, ...user } = this.jwtService.verify(token, {
        secret: envs.jwtRefreshSecret,
      });

      return user      
    } catch (error) {
      throw new RpcException({
        message: 'Invalid refresh token',
        status: HttpStatus.UNAUTHORIZED
      });
    }
  }

  async registerUser (registerUserDto: RegisterDto) {
    const { email, name, password } = registerUserDto;

    if (!email || !name || !password) {
      throw new RpcException({
        message: 'All fields are required',
        status: HttpStatus.BAD_REQUEST
      });
    }

    try {
      const user = await this.userModel.findOne({ email }).exec();

      if (user) {
        throw new RpcException({
          message: 'User already exists',
          status: HttpStatus.BAD_REQUEST
        });
      }

      const newUser = new this.userModel({
        email,
        name,
        password: bcrypt.hashSync(password, 10)
      });
      
      await newUser.save();

      const newUserDocument = newUser.toObject();
      const { password: _, ...result } = newUserDocument;

      return {
        user: result,
        token: await this.signJWT(result)
      }
    } catch (error) {
      throw new RpcException({
        message: error.message,
        status: HttpStatus.BAD_REQUEST
      })
    }
  }

  async loginUser(loginUserDto: LoginDto) {
    const { email, password } = loginUserDto;
    
    try {
      const user = await this.userModel.findOne({ email }).exec();

      if (!user) {
        throw new RpcException({
          message: 'User not found',
          status: HttpStatus.NOT_FOUND
        });
      }

      const isPasswordValid = bcrypt.compareSync(password, user.password);

      if (!isPasswordValid) {
        throw new RpcException({
          message: 'Invalid password',
          status: HttpStatus.UNAUTHORIZED
        });
      }

      const userDocument = user.toObject();
      const { password: _, ...result } = userDocument;

      return {
        user: result,
        accessToken: await this.signJWT(result),
        refreshToken: await this.singJWTRefresh(result)
      }

    } catch (error) {
      throw new RpcException({
        message: error.message,
        status: HttpStatus.BAD_REQUEST
      })
    }
  }

  async refresh(refreshToken: string) {
    const payload = await this.verifyRefreshToken(refreshToken);

    const newAccessToken = await this.signJWT(payload)

    return {
      accessToken: newAccessToken
    }
  }
}
