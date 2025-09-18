import { Controller } from '@nestjs/common';
import { MembersService } from './members.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CreateDto } from './dtos';

@Controller()
export class MembersController {
  constructor(private readonly membersService: MembersService) {}

  //* Crear una integrante
  @MessagePattern('createMember')
  create(@Payload() createDto: CreateDto) {
    return this.membersService.create(createDto);
  }
}
