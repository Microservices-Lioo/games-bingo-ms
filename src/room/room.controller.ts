import { Controller, ParseUUIDPipe } from '@nestjs/common';
import { RoomService } from './room.service';
import { CreateDto, UpdateDto } from './dtos';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { EStatusHost } from './enums';

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

  //* Obtener una sala por un eventId
  @MessagePattern('findOneEventByIdRoom')
  findOneEventById(@Payload('eventId', ParseUUIDPipe) eventId: string) {
    return this.roomService.findOneEventByIdRoom(eventId);
  }

  //* Obtener el rol del usuario en la sala
  @MessagePattern('findRoleMemberRoom')
  findRoleMemberRoom(
    @Payload('roomId', ParseUUIDPipe) roomId: string,
    @Payload('userId', ParseUUIDPipe) userId: string,
  ) {
    return this.roomService.findRoleMemberRoom(roomId, userId);
  }

  //* Actualizar el estado del host en la sala
  @MessagePattern('updateStatusHostRoom')
  updateStatusHost(
    @Payload('roomId', ParseUUIDPipe) roomId: string,
    @Payload('status') status: EStatusHost,
  ) {
    return this.roomService.updateStatusHost(roomId, status);
  }

  @MessagePattern('updateRoom')
  update(@Payload() updateDto: UpdateDto) {
    return this.roomService.update(updateDto);
  }
}
