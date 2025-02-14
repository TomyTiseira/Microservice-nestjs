import { HttpStatus, Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { PrismaClient } from '@prisma/client';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { OrderPaginationDto } from './dto/order-pagination.dto';
import { changeOrderStatusDto } from './dto';
import { PRODUCTS_SERVICE } from 'src/config';
import { firstValueFrom } from 'rxjs';
import { mergeItems } from 'src/common/order.utils';

@Injectable()
export class OrdersService extends PrismaClient implements OnModuleInit {
  constructor(
    @Inject(PRODUCTS_SERVICE) private readonly productsService: ClientProxy,
  ) {
    super();
  }

  private readonly logger = new Logger('OrdersService');

  async onModuleInit() {
    await this.$connect();
    this.logger.log('Connected to the database');
  }

  async create(createOrderDto: CreateOrderDto) {
    try {
      // Confirmar los ids de los productos
      const productIds = createOrderDto.items.map(item => item.productId);
      const products = await firstValueFrom(
        this.productsService.send({ cmd: 'validate_products' }, productIds)
      );

      // Ordenes fusionadas por id de productos
      const mergedItems = mergeItems(createOrderDto.items);

      // Calcular valores
      const totalAmount = mergedItems.reduce((acc, orderItem) => {
        const price = products.find(product => product.id === orderItem.productId).price;
        return acc + price * orderItem.quantity;
      }, 0);

      const totalItems = mergedItems.reduce((acc, orderItem) => {
        return acc + orderItem.quantity;
      }, 0);

      // Crear el pedido
      const order = await this.order.create({
        data: {
          totalAmount,
          totalItems,
          orderItems: {
            createMany: {
              data: mergedItems.map(item => (
                {
                  price: products.find(product => product.id === item.productId).price,
                  quantity: item.quantity,
                  productId: item.productId,
                }
              ))
            }
          }
        },
        include: {
          orderItems: {
            select: {
              productId: true,
              quantity: true,
            }
          }
        }
      })

      return {
        ...order,
        orderItems: order.orderItems.map((orderItem) => ({
          ...orderItem,
          name: products.find(product => product.id === orderItem.productId).name,
        }))
      }
    } catch (error) {
      this.logger.error(error)

      const message = error.message || 'Error al crear una orden.';

      throw new RpcException({
        status: HttpStatus.BAD_REQUEST,
        message,
      });
    }
  }

  async findAll(orderPaginationDto: OrderPaginationDto) {
    const totalOrders = await this.order.count({
      where: {
        status: orderPaginationDto.status,
      },
    });

    const currentPage = orderPaginationDto.page;
    const perPage = orderPaginationDto.limit;
    const lastPage = Math.ceil(totalOrders / perPage);

    const data = await this.order.findMany({
      where: {
        status: orderPaginationDto.status,
      },
      skip: perPage * (currentPage - 1),
      take: perPage,
    });

    return {
      data, 
      meta: {
        totalOrders,
        currentPage,
        lastPage,
      }
    }
  }

  async findOne(id: string) {
    try {
      const order = await this.order.findFirst({
        where: { id },
        include: {
          orderItems: {
            select: {
              productId: true,
              quantity: true,
            }
          }
        }
      });
  
      if (!order) {
        throw new RpcException({
          message: `Order #${id} not found`,
          status: HttpStatus.NOT_FOUND,
        });
      }

      const productIds = order.orderItems.map(item => item.productId);
      const products = await firstValueFrom(
        this.productsService.send({ cmd: 'validate_products' }, productIds)
      );

      // Crear un mapa de productos por ID
      const productMap = new Map(products.map(p => [p.id, p.name]));

      return {
        ...order,
        orderItems: order.orderItems.map(item => ({
          ...item,
          name: productMap.get(item.productId),
        })),
      };
    } catch (error) {
      this.logger.error(error)

      const message = error.message || 'Error al obtener una orden.';

      throw new RpcException({
        status: HttpStatus.BAD_REQUEST,
        message,
      })
    }
  }

  async changeOrderStatus(changeOrderStatusDto: changeOrderStatusDto) {
    const { id, status } = changeOrderStatusDto;

    const order = await this.findOne(id);

    if(order.status === status) return order;

    return this.order.update({
      where: { id },
      data: { status },
    })
  }
}
