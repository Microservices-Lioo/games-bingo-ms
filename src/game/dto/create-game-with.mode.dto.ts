import { IsNotEmpty, IsNumber, IsPositive, IsString } from "class-validator";

export class CreateGameWithModeDto {
    @IsNumber()
    @IsPositive()
    eventId: number;

    @IsNumber()
    @IsPositive()
    gameModeId: number;

    @IsString()
    @IsNotEmpty()
    assignedBy: string;
}