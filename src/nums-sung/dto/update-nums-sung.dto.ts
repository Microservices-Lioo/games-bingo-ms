import { PartialType } from '@nestjs/mapped-types';
import { CreateNumsSungDto } from './create-nums-sung.dto';

export class UpdateNumsSungDto extends PartialType(CreateNumsSungDto) {
  id: number;
}
