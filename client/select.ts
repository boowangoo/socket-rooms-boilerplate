import $ from 'jquery';
import io from 'socket.io-client';
import Handlebars from 'handlebars';
import { stringify } from 'querystring';

import Room from './room'

import selectHtml from './html/select.html';
import Router from './router';
import { RoomData, JoinRoomData } from '../types';

export default class Select {
    private socket: SocketIOClient.Socket;
    private router: Router;
    private roomMap: Map<string, Room>;

    constructor(router: Router) {
        this.socket = io('/room-list');
        this.router = router;
        this.roomMap = new Map<string, Room>();

        this.socket.emit('updateAllInfo', (data: Array<RoomData>) => {
            data.map((d: any) => { this.updateInfo(d); });
        });

        this.socket.on('updateInfo', (data: RoomData) => {
            this.updateInfo(data);
        });

        $(document).ready(() => {
            $('#createRoom').click(() => {
                const roomId = $('#roomIdInput').val();

                this.socket.emit('createRoom', roomId, (data: RoomData) => {
                    if (this.roomMap.has(data.roomId)) {
                        this.joinRoom(data.roomId);
                    }
                });
            });

            $('#roomIdInput').val('');
        });
    }

    private joinRoom(roomId: string): void {
        this.socket.emit('joinRoom', roomId, (data: JoinRoomData) => {
            if (data.allowJoin) {
                this.router.changeTemplHtml(this.roomMap.get(roomId).HTML);
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
        const rowId: string = 'rowId_' + data.roomId;

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

    public get HTML(): string { return selectHtml; }
}
