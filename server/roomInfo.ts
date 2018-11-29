import { RoomData, ID } from "../types";

export default class RoomInfo {
    private _roomId: ID;
    private _players: number;
    private _capacity: number;

    constructor(roomId: ID, capacity?: number) {
        this._roomId = roomId;
        this._capacity = capacity && capacity > 0 ? capacity : 10;
        this._players = 0;
    }

    public incrPlayers(): RoomInfo {
        if (this._players + 1 > this._capacity) {
            return null;
        }
        this._players++;
        return this;
    }
    public decrPlayers(): RoomInfo {
        if (this._players - 1 < 0) {
            return null;
        }
        this._players--;
        return this;
    }

    public get roomId(): ID { return this._roomId; }
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