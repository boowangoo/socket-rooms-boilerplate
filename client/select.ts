import $ from 'jquery';
import io from 'socket.io-client';
import Handlebars from 'handlebars';
import { stringify } from 'querystring';

import Room from './room'

import selectHtml from './html/select.html';
import Router from './router';
import { RoomData, JoinRoomData, ID, CreateRoomData } from '../types';

export default class Select {
    private socket: SocketIOClient.Socket;
    private router: Router;
    private roomMap: Map<ID, Room>;

    constructor(router: Router, socket: SocketIOClient.Socket) {
        this.socket = socket;
        this.router = router;
        this.roomMap = new Map<ID, Room>();

        this.socket.emit('updateAllInfo', (data: Array<RoomData>) => {
            data.map((d: RoomData) => { this.updateInfo(d); });
        });

        this.socket.on('updateInfo', (data: RoomData) => {
            this.updateInfo(data);
        });

        $(document).ready(() => {
            $('#createRoom').click(() => {
                const roomId = $('#roomIdInput').val();

                this.socket.emit('createRoom', roomId, (data: CreateRoomData) => {
                    if (data.created) {
                        this.updateInfo(data.data);
                        this.joinRoom(data.data.roomId);
                    } else if (!data.created) {
                        // room not created
                    }
                });
            });

            $('#roomIdInput').val('');
        });
    }

    private joinRoom(roomId: ID): void {
        this.socket.emit('joinRoom', roomId, (data: JoinRoomData) => {
            if (data.allowJoin) {
                const room: Room = this.roomMap.get(roomId);
                this.router.changeTemplHtml(room.HTML);
                room.initDOM();
            }
        });
    }

    private updateInfo(data: RoomData): void {
        if (this.roomMap.has(data.roomId)) { return; }

        this.roomMap.set(
            data.roomId,
            new Room(
                data.roomId,
                data.players,
                data.capacity,
                this.router,
                io('/room'),
            ),
        );
        const rowId: ID = 'rowId_' + data.roomId;

        const template = Handlebars.compile($('#selectRoomRow').html());
        $('#roomListTable').append(template({
            rowId: rowId,
            roomId: data.roomId,
            players: data.players,
            capacity: data.capacity,
        }));

        $(`#${rowId}>td:last-child>button`).click(() => {
            console.log('poop2', data);
            this.joinRoom(data.roomId);
        });
    }

    public get HTML(): ID { return selectHtml; }
}
