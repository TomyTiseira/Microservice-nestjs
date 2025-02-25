import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { MongooseConfigModule } from 'src/mongoose/mongoose.module';
import { envs } from 'src/config';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/mongoose/schemas/user.schema';

@Module({
  controllers: [AuthController],
  providers: [AuthService],
  imports: [ 
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema }
    ]), 
    JwtModule.register({
      global: true,
      secret: envs.jwtSecret,
      signOptions: { expiresIn: '1h' },
    })
  ]
})
export class AuthModule {}
