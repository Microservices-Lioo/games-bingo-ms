import { Type } from "class-transformer";
import { IsDate, IsNotEmpty, IsString, IsUUID } from "class-validator";

export class CreateDto {
    @IsUUID()
    @IsString()
    @IsNotEmpty()
    eventId: string;

    @IsUUID()
    @IsString()
    @IsNotEmpty()
    userId: string;

    @Type(() => Date)
    @IsDate()
    start_time: Date;
}