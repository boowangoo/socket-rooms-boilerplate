import $ from 'jquery';

import roomHtml from './html/room.html';
import selectHtml from './html/select.html';
import Router from './router';
import { Html, RoomData, ID }  from '../types';
import Page from './page';
import Select from './select';

export default class Room implements Page {
    private router: Router;
    private socket: SocketIOClient.Socket;

    private _roomId: ID;
    private _players: number;
    private _capacity: number;

    private selectPage: Select;

    constructor(roomId: ID, players: number, capacity: number,
            router: Router, socket: SocketIOClient.Socket, selectPage: Select) {
        this._roomId = roomId;
        this._players = players;
        this._capacity = capacity;
        this.router = router;
        this.socket = socket;
        this.selectPage = selectPage;
    }

    public init(): void {
        this.socket.emit('joinRoom', this.roomId);

        $(document).ready(() => {
            $('#leaveRoom').click(() => {
                this.leaveRoom();
            });
            
            $('#wave').click(() => {
                this.wave();
            });
        });

        this.socket.on('updateInfo', (data: RoomData) => {
            if (data) {
                this._players = data.players;
                this._capacity = data.capacity;
                $('#roomId').html(this.roomId);
                $('#roomCapacity').html(this.players + '/' + this.capacity);
            } else {
                // update failed
            }
        });
        
        this.socket.on('updateWave', (playerID: ID) => {
            $('#waveMsgBox').html(playerID + ' waved!');
        });


        this.update();
    }
    
    private leaveRoom(): void {
        this.router.changePage(this.selectPage);
    }
    
    private wave(): void {
        this.socket.emit('wave', this.roomId);
    }

    private update(): void {
        this.socket.emit('updateInfo', this.roomId);
    }

    public get roomId(): ID { return this._roomId; }
    public get players(): number { return this._players; }
    public get capacity(): number { return this._capacity; }

    public HTML(): Html { return roomHtml; }
}
