import { Body, Controller, Delete, Get, Inject, Param, ParseIntPipe, Patch, Post, Query } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { catchError } from 'rxjs';
import { PaginationDto } from 'src/common';
import { NATS_SERVICE, PRODUCT_SERVICE } from 'src/config';
import { CreateProductDto, UpdateProductDto } from './dto';

@Controller('products')
export class ProductsController {
  constructor(
    // @Inject(PRODUCT_SERVICE) private readonly productService: ClientProxy,
    @Inject(NATS_SERVICE) private readonly client: ClientProxy,
  ) {}

  @Post()
  createProduct(@Body() createProductDto: CreateProductDto) {
    return this.client.send(
      { cmd: 'create_product' }, 
      createProductDto
    )
  }

  @Get()
  findAllProducts(@Query() paginationDto: PaginationDto) {
    return this.client.send(
      { cmd: 'find_all_products' }, 
      { limit: paginationDto.limit, page: paginationDto.page }
    );
  }

  @Get(':id')
  async findOneProduct(@Param('id') id: string) {
    return this.client.send(
      { cmd: 'find_one_product' },
      { id },
    ).pipe( catchError(error => { throw new RpcException(error) }) );
  }

  @Patch(':id')
  updateProduct(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProductDto: UpdateProductDto,) {
    return this.client.send(
      { cmd: 'update_product' },
      { id, ...updateProductDto },
    ).pipe( catchError(error => { throw new RpcException(error) }) );
  }

  @Delete(':id')
  deleteProduct(@Param('id') id: string) {
    return this.client.send(
      { cmd: 'delete_product' },
      { id },
    ).pipe( catchError(error => { throw new RpcException(error) }) );
  }
}
