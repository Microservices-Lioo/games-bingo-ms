import { IsNotEmpty, IsNumber, IsPositive, IsString } from "class-validator";

export class CreateBallCalledDto {
    @IsNumber()
    @IsPositive()
    @IsNotEmpty()
    gameId: number;

    @IsNumber()
    @IsPositive()
    @IsNotEmpty()
    num: number;

    @IsString()
    @IsNotEmpty()
    colName: string;
}
