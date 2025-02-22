import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { MongooseConfigModule } from './mongoose/mongoose.module';

@Module({
  imports: [
    AuthModule, 
    MongooseConfigModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
