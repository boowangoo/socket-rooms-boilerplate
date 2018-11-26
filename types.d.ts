export interface RoomData {
    roomId: string;
    players: number;
    capacity: number;
}

export interface JoinRoomData {
    allowJoin: boolean;
    data: RoomData;
}