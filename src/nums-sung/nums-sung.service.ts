import { Injectable } from '@nestjs/common';
import { CreateNumsSungDto } from './dto/create-nums-sung.dto';
import { UpdateNumsSungDto } from './dto/update-nums-sung.dto';

@Injectable()
export class NumsSungService {
  create(createNumsSungDto: CreateNumsSungDto) {
    return 'This action adds a new numsSung';
  }

  findAll() {
    return `This action returns all numsSung`;
  }

  findOne(id: number) {
    return `This action returns a #${id} numsSung`;
  }

  update(id: number, updateNumsSungDto: UpdateNumsSungDto) {
    return `This action updates a #${id} numsSung`;
  }

  remove(id: number) {
    return `This action removes a #${id} numsSung`;
  }
}
