import { IsEnum, IsNotEmpty, IsString, IsUUID } from "class-validator";
import { ERole } from "../enums";

export class CreateDto {
    @IsUUID()
    @IsString()
    @IsNotEmpty()
    userId: string;

    @IsUUID()
    @IsString()
    @IsNotEmpty()
    roomId: string;

    @IsEnum(ERole, { message: 'El rol no existe dentro de la sala'})
    role: ERole
}