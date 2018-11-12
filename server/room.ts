import { stringify } from "querystring";


export default class Room {
    private _roomId: string;
    private _players: number;
    private _capacity: number;

    public static rooms: Map<string, Room> = new Map<string, Room>();

    constructor(roomId: string, capacity?: number) {
        Room.rooms.set(roomId, this);
        this._roomId = roomId;
        this._capacity = capacity && capacity > 0 ? capacity : 10;
        this._players = 0;
    }

    public static getRoom(roomId: string): Room {
        return Room.rooms.get(roomId) || null;
    }

    public get capcity(): number { return this._capacity; }
    public get players(): number { return this._players; }
}