import { EStatusTableBingo } from "../enums";

export interface ITableBingo {
    socketId: string;
    userId: string;
    cardId: string;
    fullnames: string;
    status: EStatusTableBingo;
}