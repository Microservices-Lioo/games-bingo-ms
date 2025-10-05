import { IsEmail, IsNotEmpty, IsString, IsUUID } from "class-validator";

export class UserDto {
    @IsUUID()
    id: string;
    
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    lastname: string;

    @IsString()
    @IsNotEmpty()
    @IsEmail()
    email: string;
}