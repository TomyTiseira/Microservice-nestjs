import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { NatsModule } from 'src/transports/nats.module';
import { StatusModule } from 'src/status/status.module';

@Module({
  controllers: [OrdersController],
  providers: [OrdersService],
  imports: [NatsModule, StatusModule]
})
export class OrdersModule {}
