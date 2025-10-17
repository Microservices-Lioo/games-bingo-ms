import { PartialType } from "@nestjs/mapped-types";
import { IsDate, IsEnum, IsOptional, IsUUID } from "class-validator";
import { CreateDto } from "./create.dto";
import { EStatus, EStatusHost } from "../enums";
import { Type } from "class-transformer";

export class UpdateDto extends PartialType(CreateDto) {
    @IsUUID()
    id: string;

    @IsOptional()
    @Type(() => Date)
    @IsDate()
    end_time?: Date;

    @IsOptional()
    @IsEnum(EStatusHost, {
        message: 'El status debe ser uno de los siguientes: ONLINE, OFFLINE'
    })
    status_host?: EStatusHost;

    @IsOptional()
    @IsEnum(EStatus, {
        message: `El status debe ser uno de los siguientes: STARTED, NOT_STARTED, FINISHED, CANCELED`
    })
    status?: EStatus;
}