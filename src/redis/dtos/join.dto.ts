import { IsUUID, IsString, IsNotEmpty } from "class-validator";


export class JoinDto {
    @IsUUID()
    roomId: string;

    @IsString()
    @IsNotEmpty()
    socketId: string;

    @IsUUID()
    userId: string;
}