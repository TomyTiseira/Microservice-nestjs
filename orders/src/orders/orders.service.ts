import { HttpStatus, Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { changeOrderStatusDto, OrderPaginationDto, CreateOrderDto } from './dto';
import { NATS_SERVICE } from 'src/config';
import { firstValueFrom } from 'rxjs';
import { mergeItems, OrderStates } from 'src/common';
import { StatusService } from 'src/status/status.service';
import { OrderState, PendingState, CancelledState, ConfirmedState, PaidState } from 'src/status/states';
import { OrderWithProducts } from 'src/interfaces/order-with-products.interface';

@Injectable()
export class OrdersService extends PrismaClient implements OnModuleInit {
  constructor(
    @Inject(NATS_SERVICE) private readonly client: ClientProxy,
    private readonly statusService: StatusService,
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
        this.client.send({ cmd: 'validate_products' }, productIds)
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

      // Buscar el estado de la orden
      const orderState = await this.statusService.getStatusByName(OrderStates.PENDING);

      // Crear el pedido
      const order = await this.order.create({
        data: {
          totalAmount,
          totalItems,
          statusId: orderState.id,
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
              price: true,
            }
          }, 
          status: {
            select: {
              id: true,
              name: true,
            }
          }
        }
      }
    )

    const { statusId, ...orderWithoutStatusId } = order; // 👈 Quita `statusId`

    return {
      ...orderWithoutStatusId,
      orderItems: order.orderItems.map((orderItem) => ({
        ...orderItem,
        productName: products.find(product => product.id === orderItem.productId).name,
      })),
    } as OrderWithProducts;

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
    // Recuperar el estado del orderPaginationDto
    const status = await this.statusService.getStatusByName(orderPaginationDto.status);

    const totalOrders = await this.order.count({
      where: {
        statusId: status.id,
      },
    });

    const currentPage = orderPaginationDto.page;
    const perPage = orderPaginationDto.limit;
    const lastPage = Math.ceil(totalOrders / perPage);

    const data = await this.order.findMany({
      where: {
        statusId: status.id,
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
          },
          status: true,
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
        this.client.send({ cmd: 'validate_products' }, productIds)
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
    const { id, action } = changeOrderStatusDto;

    const order = await this.findOne(id);

    const state = this.getStatusInstance(order.status.name);

    let newStatus: OrderState | undefined;
    try {
      newStatus = state[action]();
    } catch (error) {
      throw new RpcException({ message: error.message, status: HttpStatus.BAD_REQUEST });
    }


    const newStatusRecord = await this.statusService.getStatusByName(newStatus.getName());

    return this.order.update({
      where: {id: order.id},
      data: { statusId: newStatusRecord.id }
    });
  }

  async createPaymentSession(order: OrderWithProducts) {
    const paymentSession = await firstValueFrom(
      this.client.send('create_payment_session', {
        orderId: order.id,
        currency: 'usd',
        items: order.orderItems.map(item => ({
          name: item.productName,
          quantity: item.quantity,
          price: item.price,
        })),
      })
    );

    return paymentSession;
  }

  private getStatusInstance(state: string): OrderState {
    switch (state) {
      case OrderStates.PENDING: return new PendingState();
      case OrderStates.CANCELLED: return new CancelledState();
      case OrderStates.CONFIRMED: return new ConfirmedState();
      case OrderStates.PAID: return new PaidState();
      default:
        throw new RpcException({ message: 'Invalid State', status: HttpStatus.BAD_REQUEST });
    }
  }
}
