import { IsNotEmpty, IsNumber } from "class-validator";
import { CreateGameModeDto } from "./create-game-mode.dto copy";
import { PartialType } from "@nestjs/mapped-types";


export class UpdateGameModeDto extends PartialType(CreateGameModeDto) {
  @IsNumber()
  @IsNotEmpty()
  id: number;
}