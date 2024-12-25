import { PartialType } from '@nestjs/mapped-types';
import { CreateGameDto } from './create-game.dto';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class UpdateGameDto extends PartialType(CreateGameDto) {
  @IsNumber()
  @IsNotEmpty()
  id: number;
}
