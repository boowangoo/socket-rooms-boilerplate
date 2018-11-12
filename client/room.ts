import roomHtml from './html/room.html';

export default class Room {
    private _roomId: string;
    private _players: number;
    private _capacity: number;

    constructor(roomId: string, socket: any) {
        this._roomId = roomId;
        this.update(socket)   
    }

    private update(socket: any): void {
        socket.emit('getRoomInfo', this.roomId, (data: any) => {
            console.log(data);
            this._players = data.players;
            this._capacity = data.capacity;
        });
    }

    public get roomId() { return this._roomId; }
    public get players() { return this._players; }
    public get capacity() { return this._capacity; }

}