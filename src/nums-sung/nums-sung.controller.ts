import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { NumsSungService } from './nums-sung.service';
import { CreateNumsSungDto } from './dto/create-nums-sung.dto';
import { UpdateNumsSungDto } from './dto/update-nums-sung.dto';

@Controller()
export class NumsSungController {
  constructor(private readonly numsSungService: NumsSungService) {}

  @MessagePattern('createNumsSung')
  create(@Payload() createNumsSungDto: CreateNumsSungDto) {
    return this.numsSungService.create(createNumsSungDto);
  }

  @MessagePattern('findAllNumsSung')
  findAll() {
    return this.numsSungService.findAll();
  }

  @MessagePattern('findOneNumsSung')
  findOne(@Payload() id: number) {
    return this.numsSungService.findOne(id);
  }

  @MessagePattern('updateNumsSung')
  update(@Payload() updateNumsSungDto: UpdateNumsSungDto) {
    return this.numsSungService.update(updateNumsSungDto.id, updateNumsSungDto);
  }

  @MessagePattern('removeNumsSung')
  remove(@Payload() id: number) {
    return this.numsSungService.remove(id);
  }
}
