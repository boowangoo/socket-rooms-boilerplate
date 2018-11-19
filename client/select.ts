import $ from 'jquery';
import io from 'socket.io-client';
import Handlebars from 'handlebars';
import { stringify } from 'querystring';

import Room from './room'

import selectHtml from './html/select.html';
import Router from './router';

export default class Select {
    private router: Router;
    private roomMap: Map<string, Room>;

    constructor(router: Router, socket: SocketIOClient.Socket) {
        this.router = router;
        this.roomMap = new Map<string, Room>();

        this.listeners(socket);
        this.createRoomCtrl(socket);
    }

    private createRoomCtrl(socket: SocketIOClient.Socket): void {
        socket.emit('updateAllInfo', (data: any) => {

        });

        $(document).ready(() => {
            $('#createRoom').click(() => {
                const roomId = $('#roomId').val();

                socket.emit('createRoom', roomId, (data: any) => {
                    if (!this.roomMap.has(data.roomId)) {
                        console.log('poop1', data);
                        this.joinRoom(socket, data.roomId);
                    }
                });
            });

            $('#roomId').val('');
        });
    }

    private joinRoom(socket: SocketIOClient.Socket, roomId: string): void {
        socket.emit('joinRoom', roomId, (data: any) => {
            if (data.allowJoin && this.roomMap.has(roomId)) {
                this.router.changeTemplHtml(this.roomMap.get(roomId).HTML);
            }
        });
    }

    private listeners(socket: SocketIOClient.Socket): void {
        socket.on('updateInfo', (data: any) => {
            if (!this.roomMap.has(data.roomId)) {
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

                $(`#${ rowId }>td:last-child>button`).click(() => {
                    console.log('poop2', data);
                    this.joinRoom(socket, data.roomId);
                });
            }
        });
    }

    public get HTML(): string { return selectHtml; }
}