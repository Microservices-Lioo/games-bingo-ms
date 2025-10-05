import { Controller, ParseUUIDPipe } from '@nestjs/common';
import { ModeService } from './mode.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CreateModeDto } from './dtos';

@Controller()
export class ModeController {
  constructor(private readonly modeService: ModeService) {}

  //* Crea un modo de juego
  @MessagePattern('createMode')
  create(@Payload() mode: CreateModeDto) {
    return this.modeService.create(mode);
  }

  //* Obtener todos los modos de juego
  @MessagePattern('findAllMode')
  findAll() {
    return this.modeService.findAll();
  }
  
  //* Obtener un modo de juego por ID
  @MessagePattern('findOneMode')
  findOne(@Payload('modeId', ParseUUIDPipe) modeId: string) {
    return this.modeService.findOne(modeId);
  }
}
