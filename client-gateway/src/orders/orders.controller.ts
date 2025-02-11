import { Controller, Get, Post, Body, Param, Inject } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { ORDER_SERVICE } from 'src/config';
import { catchError } from 'rxjs';

@Controller('orders')
export class OrdersController {
  constructor(
    @Inject(ORDER_SERVICE) private readonly ordersService: ClientProxy
  ) {}
  
  @Post()
  create(@Body() createOrderDto: CreateOrderDto) {
    return this.ordersService.send('createOrder', createOrderDto);
  }

  @Get()
  findAll() {
    return this.ordersService.send('findAllOrders', {});
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ordersService.send('findOneOrder', id)
      .pipe(
        catchError(error => { throw new RpcException(error) })
      )
  }
}
