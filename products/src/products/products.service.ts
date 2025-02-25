import { HttpStatus, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaClient } from '@prisma/client';
import { PaginationDto } from 'src/common';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class ProductsService extends PrismaClient implements OnModuleInit {
  private readonly logger = new Logger('ProductsService');

  onModuleInit() {
    this.$connect();
    this.logger.log('Connected to the database');
  }

  create(createProductDto: CreateProductDto) {
    return this.product.create({
      data: createProductDto,
    });
  }

  async findAll(paginationDto: PaginationDto) {
    const { page, limit } = paginationDto;

    const totalProducts = await this.product.count({where: { available: true }});
    const lastPage = Math.ceil(totalProducts / limit);

    return {
      data: await this.product.findMany({
        where: { available: true },
        skip: (page - 1) * limit,
        take: limit,
      }),
      meta: {
        page,
        totalProducts,
        lastPage
      }
    }
  }

  async findOne(id: number) {
    const product = await this.product.findUnique({
      where: { id, available: true },
    });

    if (!product) {
      throw new RpcException({
        message: `Product #${id} not found`,
        status: HttpStatus.NOT_FOUND,
      });
    }

    return product;
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    const {id: _, ...data} = updateProductDto;
    
    await this.findOne(id);

    return this.product.update({
      where: { id },
      data,
    });
  }

  async remove(id: number) {
    await this.findOne(id);

    return  this.product.update({
      where: { id },
      data: { available: false },
    });
  }

  async validateProducts(ids: number[]) {
    const uniqueIds = Array.from(new Set(ids));

    const products = await this.product.findMany({
      where: {
        id: {
          in: uniqueIds,
        },
        available: true,
      },
    });

    if (products.length !== uniqueIds.length) {
      throw new RpcException({
        message: 'Some products are not available',
        status: HttpStatus.NOT_FOUND,
      });
    }

    return products;
  }
}
