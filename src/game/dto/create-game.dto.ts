import { IsDate, IsEmpty, IsNumber, IsString } from "class-validator"

export class CreateGameDto {

    @IsString()
    eventId: string;

    @IsDate()
    start_time: Date;

    @IsDate()
    @IsEmpty()
    end_time: Date;

    @IsNumber()
    game_mode: number;
}
