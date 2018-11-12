import $ from 'jquery';

import Room from './room'

import selectHtml from './html/select.html';
import { stringify } from 'querystring';

export default class Select {
    private socket: SocketIOClient.Socket;

    private html: string;
    private roomMap: Map<string, Room>;

    constructor(socket: SocketIOClient.Socket) {
        this.socket = socket;

        this.createRoomCtrl();

        this.html = selectHtml;
        this.roomMap = new Map<string, Room>();

        socket.on('createRoom', (roomId: string) => {
            this.createRoom(roomId);
        });
    }

    private createRoomCtrl(): void {
        $(document).ready(() => {
            $('#createRoom').click(() => {
                const roomId = $('#roomId').val();

                this.socket.emit('createRoom', roomId, (roomList: Array<string>) => {
                    const rowList = roomList.map((roomId: string) => {
                            const tmpRoom: Room = this.roomMap.get(roomId);
                            return `<tr>
                                <td>${tmpRoom.roomId}</td>
                                <td>${tmpRoom.players}/${tmpRoom.capacity}</td>
                            </tr>`
                        }).join('');

                    $('#roomList').html(rowList);
                });
            });

            $('#roomId').val('');
        });
    }

    private createRoom(roomID: string): Room {
        const newRoom: Room = new Room(roomID, this.socket);

        if (newRoom) {
            console.log('roomMap', this.roomMap);
            this.roomMap.set(roomID, newRoom);
        }

        return newRoom;
    }

    public getHTML(): string { return this.html; }
}