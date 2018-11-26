import { RoomData } from "../types";

export default class RoomInfo {
    private _roomId: string;
    private _players: number;
    private _capacity: number;

    constructor(roomId: string, capacity?: number) {
        this._roomId = roomId;
        this._capacity = capacity && capacity > 0 ? capacity : 10;
        this._players = 0;
    }

    public get roomId(): string { return this._roomId; }
    public get capacity(): number { return this._capacity; }
    public get players(): number { return this._players; }

    public toMsg(): RoomData {
        return {
            roomId: this.roomId,
            players: this.players,
            capacity: this.capacity,
        };
    }
}