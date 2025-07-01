import { CacheRedisEnum } from "../enums";

export const RedisKeys = {

    //*Game
    GAME_ID: (id: number) => `${CacheRedisEnum.GAME}:${id}`,
    GAME_EVENT: (eventId: number) => `${CacheRedisEnum.GAME}:event:${eventId}`,

    //*GameMode
    GAME_MODE_ID: (id: number) => `${CacheRedisEnum.GAME_MODE}:${id}`,
    GAME_MODE_ALL: `${CacheRedisEnum.GAME_MODE}:all`,

    //*GameOnMode
    GAME_ON_MODE_ID: (gameId: number, gameModeId: number) => 
        `${CacheRedisEnum.GAME_ON_MODE}:${gameId}:${gameModeId}`,
}