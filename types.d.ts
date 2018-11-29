export type Html = string;
export type ID = string;

export interface RoomData {
    roomId: string;
    players: number;
    capacity: number;
}

export interface CreateRoomData {
    created: boolean;
    data: RoomData;
}

export interface JoinRoomData {
    allowJoin: boolean;
    data: RoomData;
}

export interface LeaveRoomData {
    allowLeave: boolean;
    data: RoomData;
}
