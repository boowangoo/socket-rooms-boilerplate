export type Html = string;
export type ID = string;

export interface RoomData {
    roomId: string;
    players: number;
    capacity: number;
}

export interface JoinRoomData {
    allowJoin: boolean;
    data: RoomData;
}