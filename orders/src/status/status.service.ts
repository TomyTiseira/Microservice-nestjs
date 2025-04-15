import { HttpStatus, Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class StatusService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();
  }

  findAll() {
    return this.status.findMany();
  }

  async getStatusByName(name: string) {
    const status = await this.status.findFirst({ where: { name } });

    if (!status)
      throw new RpcException({
        message: 'State not found',
        status: HttpStatus.NOT_FOUND,
      });

    return status;
  }
}
