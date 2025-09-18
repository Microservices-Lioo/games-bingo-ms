import { Controller } from '@nestjs/common';
import { RoomService } from './room.service';
import { CreateDto } from './dtos';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller()
export class RoomController {
  constructor(
    private readonly roomService: RoomService,
  ) {}

  //* Crear una sala
  @MessagePattern('createRoom')
  async create(@Payload() createDto: CreateDto) {
    return this.roomService.create(createDto);
  }
}
