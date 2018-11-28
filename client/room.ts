import $ from 'jquery';
import Handlebars from 'handlebars';

import roomHtml from './html/room.html';
import selectHtml from './html/select.html';
import Router from './router';
import { Html, RoomData, ID }  from '../types';

export default class Room {
    private router: Router;

    private _roomId: ID;
    private _players: number;
    private _capacity: number;

    private roomTemplate: Html;

    constructor(roomId: ID, players: number, capacity: number,
            router: Router, socket: SocketIOClient.Socket) {
        this._roomId = roomId;
        this._players = players;
        this._capacity = capacity;

        const template = Handlebars.compile(roomHtml);

        this.roomTemplate = template({
            roomId: roomId,
            players: players,
            capacity: capacity,
        });

        $(document).ready(() => {
            $('#leaveRoom').click(() => {
                console.log('leaving room');
                this.leaveRoom();
            });
        });
    }

    private initDOM(): Room {
        return this;
    }
    
    private leaveRoom(): void {
        this.router.changeTemplHtml(selectHtml);
    }

    private update(socket: SocketIOClient.Socket): void {
        socket.emit('getRoomInfo', this.roomId, (data: RoomData) => {
            console.log(data);
            this._players = data.players;
            this._capacity = data.capacity;
        });
    }

    public get roomId(): ID { return this._roomId; }
    public get players(): number { return this._players; }
    public get capacity(): number { return this._capacity; }

    public get HTML(): Html {
        console.log(this.roomTemplate);
        return this.roomTemplate;
    }
}
