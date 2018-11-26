import $ from 'jquery';
import Handlebars from 'handlebars';

import roomHtml from './html/room.html';
import selectHtml from './html/select.html';
import Router from './router';
import { RoomData }  from '../types';

export default class Room {
    private router: Router;

    private _roomId: string;
    private _players: number;
    private _capacity: number;

    private roomTemplate: string;

    constructor(roomId: string, players: number, capacity: number,
            router: Router, socket: SocketIOClient.Socket) {
        this._roomId = roomId;
        this._players = players;
        this._capacity = capacity;

        const template = Handlebars.compile(roomHtml);
        console.log($.parseHTML(roomHtml));
        this.roomTemplate = template({
            roomId: roomId,
            players: players,
            capacity: capacity,
        });

        $(document).ready(() => {
            $('#leaveRoom').click(() => {
                this.leaveRoom();
            });
        });
    }
    
    private leaveRoom(): void {
        this.router.changeTemplHtml(selectHtml);
    }

    private update(socket: any): void {
        socket.emit('getRoomInfo', this.roomId, (data: RoomData) => {
            console.log(data);
            this._players = data.players;
            this._capacity = data.capacity;
        });
    }

    public get roomId() { return this._roomId; }
    public get players() { return this._players; }
    public get capacity() { return this._capacity; }

    public get HTML(): string {
        console.log(this.roomTemplate);
        return this.roomTemplate;
    }
}
