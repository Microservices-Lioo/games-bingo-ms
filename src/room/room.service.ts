import { HttpStatus, Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { CreateDto } from './dtos';
import { PrismaClient, Status, StatusHost } from '@prisma/client';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { NATS_SERVICE } from 'src/config';
import { ERole } from 'src/shared/enum';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class RoomService extends PrismaClient implements OnModuleInit {
    private logger = new Logger("ROOM SERVICE")

    async onModuleInit() {
        await this.$connect();
        this.logger.log("Database connected");
    }
    constructor(@Inject(NATS_SERVICE) private readonly client: ClientProxy){ super();}

    async create(createDto: CreateDto) {
        const compensations = [];

        const {userId, ...data} = createDto;
        try {
            const room = await this.room.create({
                data: {
                    ...data,
                    status: Status.NOT_STARTED,
                    status_host: StatusHost.OFFLINE
                }
            });
            compensations.push(() => this.room.delete({ where: {id: room.id}}))

            // Asigno el rol al usuario como Host
            const member = await firstValueFrom(
                this.client.send('createMember', {
                    userId: createDto.userId,
                    roomId: room.id,
                    role: ERole.HOST
                })
            );

            return {
                room: 'Se creó la sala de juego',
                member: member
            };
        } catch (error) {
            for (const compensation of compensations) {
                try {
                    await compensation();
                } catch (compError) {
                    this.logger.error('Error en compensación: ' + compError)                    
                }
            }

            this.logger.error(error);
            throw new RpcException({
                status: HttpStatus.INTERNAL_SERVER_ERROR,
                message: 'Erro al crear la sala.'
            });
        }
    }
}
