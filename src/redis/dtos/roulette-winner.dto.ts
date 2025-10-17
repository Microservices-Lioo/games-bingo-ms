import { IsNumber, IsPositive } from "class-validator";

export class RouletteWinnerDto {
    @IsNumber()
    targetRotation: number;

    @IsNumber()
    winnerIndex: number;
}