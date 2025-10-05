import { IsArray, IsNotEmpty, IsString } from "class-validator";


export class CreateModeDto {
    @IsString()
    @IsNotEmpty()
    name: string;
    
    @IsString()
    @IsNotEmpty()
    description: string;

    @IsArray()
    @IsString({ each: true })
    rule: string[];
}