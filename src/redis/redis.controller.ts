import { Controller, ParseIntPipe, ParseUUIDPipe } from '@nestjs/common';
import { RedisService } from './redis.service';
import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices';
import { JoinDto, RouletteWinnerDto } from './dtos';
import { EStatusTableBingo, HostActivity } from './enums';

@Controller('redis')
export class RedisController {

    constructor(private redisServ: RedisService) {}

    //* Unirse a una sala
    @MessagePattern('joinRoom')
    joinRoom(@Payload() payload: JoinDto) {
        return this.redisServ.joinRoom(payload);
    }

    //* Obtener la cantidad de usuarios en una sala
    @MessagePattern('countUsersToRoom')
    countUsersToRoom(@Payload('roomId', ParseUUIDPipe) roomId: string) {
        return this.redisServ.countUsersToRoom(roomId);
    }

    //* Salir de una sala
    @MessagePattern('exitRoom')
    exitRoom(@Payload() payload: JoinDto) {
        return this.redisServ.exitRoom(payload);
    }

    //* Activar contador por sala
    @MessagePattern('countRoom')
    count(
        @Payload('roomId', ParseUUIDPipe) roomId: string,
        @Payload('duration', ParseIntPipe) duration: number
    ) {
        return this.redisServ.startCount(roomId, duration);
    }

    //* Obtener el estado del contador por sala
    @MessagePattern('statusCountRoom')
    getCount(
        @Payload('roomId', ParseUUIDPipe) roomId: string,
    ) {
        return this.redisServ.getStartCount(roomId);
    }

    //* Guardar datos en la tabla de cantos de bingo
    @MessagePattern('saveTableBingoRoom')
    saveSingBingo(
        @Payload('socketId') socketId: string,
        @Payload('roomId', ParseUUIDPipe) roomId: string,
        @Payload('userId', ParseUUIDPipe) userId: string,
        @Payload('cardId', ParseUUIDPipe) cardId: string,
        @Payload('fullnames') fullnames: string,
    ) {
        return this.redisServ.saveSingBingo(socketId, roomId, userId, cardId, fullnames);
    }

    //* Obtención de data inicial
    @MessagePattern('initialDataRoom')
    async initialData(
        @Payload('roomId', ParseUUIDPipe) roomId: string,
    ) {
        // Estado del Contador
        const statusCount = await this.redisServ.getStartCount(roomId);

        // Numero de usuarios conectados en una sala
        const countUser = await this.redisServ.countUsersToRoom(roomId);

        // Tabla de ganadores
        const tableWinners = await this.redisServ.getSingBingo(roomId);

        // Actividad del host
        const hostActivity = await this.getHostActivity(roomId);

        // Obtener el estado de la premiación
        const awardStatus = await this.redisServ.get(`rooms:${roomId}:awardStatus`);

        // Obtener el estado de la ruleta
        const rouletteStatus = await this.redisServ.get(`rooms:${roomId}:rouletteStatus`);

        // Obtener al ganador de la ruleta
        const rouletteWinner = await this.redisServ.get(`rooms:${roomId}:rouletteWinner`);
 
        return {
            statusCount,
            countUser,
            tableWinners,
            hostActivity,
            awardStatus,
            rouletteStatus,
            rouletteWinner,
        }
    }

    //* Actualizar la tabla de bingos
    @MessagePattern('updateTableBingoRoom')
    updateTableBingo(
        @Payload('roomId', ParseUUIDPipe) roomId: string,
        @Payload('status') status: string,
        @Payload('cardId', ParseUUIDPipe) cardId: string,
    ) {
        return this.redisServ.updateSingBingo(roomId, cardId, status as EStatusTableBingo);
    }

    //* Limpiar tabla de cantos
    @EventPattern('cleanTableBingoRoom')
    cleanTableBingo(@Payload('roomId', ParseUUIDPipe) roomId: string,) {
        return this.redisServ.cleanTableBingo(roomId);
    }

    //* Obtención de la actividad del host
    @MessagePattern('getHostActivityRoom')
    getHostActivity(
        @Payload('roomId', ParseUUIDPipe) roomId: string,
    ) {
        return this.redisServ.getHostActivity(roomId);
    }
    
    //* Actualización de la actividad del host
    @EventPattern('updateHostActivityRoom')
    updateHostActivity(
        @Payload('roomId', ParseUUIDPipe) roomId: string,
        @Payload('status') status: string,
    ) {
        return this.redisServ.updateHostActivity(roomId, status as HostActivity);
    }

    //* Actualizar el estado de la ruleta de premiación
    @EventPattern('updateAwardStatusRoom')
    updateAwardStatus(
        @Payload('roomId', ParseUUIDPipe) roomId: string,
        @Payload('status') status: string,
    ) {
        const key = `rooms:${roomId}:awardStatus`;
        return this.redisServ.set(key, status);
    }

    //* Actualizar la posicion del ganador en la ruleta
    @EventPattern('updateRouletteStatusRoom')
    updateRouletteStatus(
        @Payload('roomId', ParseUUIDPipe) roomId: string,
        @Payload('status') status: string,
    ) {
        const key = `rooms:${roomId}:rouletteStatus`;
        return this.redisServ.set(key, status);
    }

    //* Actualizar la posición del ganador en la ruleta a
    @EventPattern('updateRouletteWinnerRoom')
    updateRouletteWinner(
        @Payload('roomId', ParseUUIDPipe) roomId: string,
        @Payload('data') data: RouletteWinnerDto,
    ) {
        const key = `rooms:${roomId}:rouletteWinner`;
        return this.redisServ.set(key, data);
    }
}
