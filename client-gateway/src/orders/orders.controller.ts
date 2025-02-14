import { Controller, Get, Post, Body, Param, Inject, ParseUUIDPipe, Query, Patch } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { ORDER_SERVICE } from 'src/config';
import { catchError } from 'rxjs';
import { CreateOrderDto, OrderStatusDto } from './dto';
import { PaginationDto } from 'src/common';

@Controller('orders')
export class OrdersController {
  constructor(
    @Inject(ORDER_SERVICE) private readonly ordersService: ClientProxy
  ) {}
  
  @Post()
  create(@Body() createOrderDto: CreateOrderDto) {
    return this.ordersService.send('createOrder', createOrderDto)
      .pipe(
        catchError(error => { throw new RpcException(error) })
      );
  }

  @Get()
  findAll(@Query() paginationDto: PaginationDto) {
    return this.ordersService.send('findAllOrders', paginationDto);
  }

  @Get(':status')
  findAllByStatus(
    @Param() statusDto: OrderStatusDto,
    @Query() paginationDto: PaginationDto) {
    return this.ordersService.send('findAllOrders', { 
      ...paginationDto,
      status: statusDto.status
    }).pipe(
      catchError(error => { throw new RpcException(error) })
    )
  }

  @Get('id/:id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.ordersService.send('findOneOrder', id
    ).pipe(
      catchError(error => { throw new RpcException(error) })
    )
  }

  @Patch(':id')
  changeStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() statusDto: OrderStatusDto
  ) {
    return this.ordersService.send('changeOrderStatus', { id, status: statusDto.status });
  }
}
