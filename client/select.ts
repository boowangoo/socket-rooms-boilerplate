import $ from 'jquery';
import io from 'socket.io-client';
import Handlebars from 'handlebars';

import Router from './router';
import Room from './room'
import { RoomData, ID, Html } from '../types';

import selectHtml from './html/select.html';
import Page from './page';

export default class Select implements Page {
    private socket: SocketIOClient.Socket;
    private router: Router;
    private roomMap: Map<ID, Room>;

    constructor(router: Router) {
        this.socket = io('/select');
        this.router = router;
        this.roomMap = new Map<ID, Room>();
    }

    public init(): void {
        this.socket.on('updateInfo', (data: RoomData) => {
            this.updateInfo(data);
        });
        
        this.socket.on('deleteInfo', (data: RoomData) => {
            this.deleteInfo(data);
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
            
            this.socket.emit('updateAllInfo', (data: Array<RoomData>) => {
                data.map((d: RoomData) => { this.updateInfo(d); });
            });
        });
    }

    private appendRow(rowId: ID, data: RoomData): void {
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

    private joinRoom(roomId: ID): void {
        this.socket.emit('joinRoom', roomId, (data: RoomData) => {
            if (data) {
                const room: Room = this.roomMap.get(roomId);
                this.router.changePage(room);
            }
        });
    }

    private deleteRoom(roomId: ID): void {
        this.socket.emit('deleteRoom', roomId);
    }

    private deleteInfo(data: RoomData): void {
        const rowId: ID = data.roomId;
        if ($(`#${rowId}`).length) { // if the row exists in the DOM
            $(`#${rowId}`).remove();
        }
        this.roomMap.delete(data.roomId);
    }

    private updateInfo(data: RoomData): void {
        const rowId: ID = data.roomId;

        if (!$(`#${rowId}`).length) { // if the row exists in the DOM
            this.appendRow(rowId, data);
        }

        if (this.roomMap.has(data.roomId)) {
            const room = this.roomMap.get(data.roomId);
            $(`#${rowId}_roomID`).html(data.roomId);
            $(`#${rowId}_roomCapacity`).html(`${data.players}/${data.capacity}`);
        } else {
            this.roomMap.set(
                data.roomId,
                new Room(data.roomId, data.players, data.capacity, this, this.router),
            );
        }
    }

    public HTML(): Html { return selectHtml; }
}
