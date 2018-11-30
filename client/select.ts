import $ from 'jquery';
import io from 'socket.io-client';
import Handlebars from 'handlebars';

import Router from './router';
import Room from './room'
import { RoomData, ID } from '../types';

import selectHtml from './html/select.html';

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
                $('#createRoomStatus').html('');
                const roomId = (<string>$('#roomIdInput').val())
                        .replace(/\s/g, '_');

                this.socket.emit('createRoom', roomId, (data: RoomData) => {
                    if (data) {
                        this.joinRoom(data.roomId);
                    } else {
                        $('#createRoomStatus').html('room not created');
                    }
                });
            });

            $('#roomIdInput').val('');
        });
    }

    private joinRoom(roomId: ID): void {
        this.socket.emit('joinRoom', roomId, (data: RoomData) => {
            if (data) {
                const room: Room = this.roomMap.get(roomId);
                this.router.changeTemplHtml(room.HTML);
                room.initDOM();
            }
        });
    }

    private deleteRoom(roomId: ID): void {
        this.socket.emit('joinRoom', roomId, (data: RoomData) => {
            if (data) {
                const room: Room = this.roomMap.get(roomId);
                this.router.changeTemplHtml(room.HTML);
                room.initDOM();
            }
        });
    }

    private updateInfo(data: RoomData): void {
        const rowId: ID = data.roomId;

        if (this.roomMap.has(data.roomId)) {
            const room = this.roomMap.get(data.roomId);
            $(`#${rowId}_roomID`).html(data.roomId);
            $(`#${rowId}_roomCapacity`).html(`${data.players}/${data.capacity}`);
            return;
        }

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

        const template = Handlebars.compile($('#selectRoomRow').html());
        $('#roomListTable').append(template({
            rowId: rowId,
            roomId: data.roomId,
            players: data.players,
            capacity: data.capacity,
        }));

        $(`#${rowId}_joinBtn`).click(() => {
            this.joinRoom(data.roomId);
        });
        
        $(`#${rowId}_deleteBtn`).click(() => {
            this.deleteRoom(data.roomId);
        });
    }

    public get HTML(): ID { return selectHtml; }
}
