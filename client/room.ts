import $ from 'jquery';
import Handlebars from 'handlebars';

import roomHtml from './html/room.html';
import selectHtml from './html/select.html';
import Router from './router';
import { Html, RoomData, ID }  from '../types';

export default class Room {
    private router: Router;
    private socket: SocketIOClient.Socket;

    private _roomId: ID;
    private _players: number;
    private _capacity: number;

    private roomTemplate: Html;

    constructor(roomId: ID, players: number, capacity: number,
            router: Router, socket: SocketIOClient.Socket) {
        this._roomId = roomId;
        this._players = players;
        this._capacity = capacity;
        this.router = router;
        this.socket = socket;
    }

    public initDOM(): Room {
        this.update(this.socket);

        $(document).ready(() => {
            $('#leaveRoom').click(() => {
                this.leaveRoom();
            });

            $('#wave').click(() => {
                this.wave();
            });
        });
        return this;
    }
    
    private leaveRoom(): void {
        this.router.changeTemplHtml(selectHtml);
    }
    
    private wave(): void {
        console.log('wave');
    }

    private update(socket: SocketIOClient.Socket): void {
        socket.emit('updateInfo', this.roomId, (data: RoomData) => {
            if (data) {
                this._players = data.players;
                this._capacity = data.capacity;
                $('#roomId').html(this.roomId);
                $('#roomCapacity').html(this.players + '/' + this.capacity);
            } else {
                // update failed
            }
        });
    }

    public get roomId(): ID { return this._roomId; }
    public get players(): number { return this._players; }
    public get capacity(): number { return this._capacity; }

    public get HTML(): Html { return roomHtml; }
}