import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { StatusService } from './status.service';

@Controller()
export class StatusController {
  constructor(private readonly statusService: StatusService) {}

  @MessagePattern('findAllStatus')
  findAll() {
    return this.statusService.findAll();
  }
}
