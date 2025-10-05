import { PartialType } from '@nestjs/mapped-types';
import { CreateGameDto } from './create-game.dto';
import { IsDate, IsOptional, IsUUID } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateGameDto extends PartialType(CreateGameDto) {
  @IsUUID()
  id: string;

  @Type(() => Date)
  @IsDate()
  @IsOptional()
  start_time?: Date;

  @Type(() => Date)
  @IsDate()
  @IsOptional()
  end_time?: Date;

  @IsUUID()
  @IsOptional()
  numberHistoryId?: string;
}
