import { IsDate, IsEmpty, IsNotEmpty, IsNumber, IsPositive, IsString } from "class-validator"

export class CreateGameDto {

    @IsNumber()
    @IsPositive()
    @IsNotEmpty()
    eventId: number;
}
