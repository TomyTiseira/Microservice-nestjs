import { Module } from '@nestjs/common';
import { OrdersModule } from './orders/orders.module';
import { NatsModule } from './transports/nats.module';
import { StatusModule } from './status/status.module';

@Module({
  imports: [OrdersModule, NatsModule, StatusModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
