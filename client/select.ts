import $ from 'jquery';

import selectHtml from './html/select.html';

export class Select {
    private html: string;

    constructor(socket: SocketIOClient.Socket) {
        this.html = selectHtml;
        this.createRoomCtrl(socket);
    }

    private loadElements(): void {
    }

    private createRoomCtrl(socket: SocketIOClient.Socket): void {
        $(document).ready(() => {
            $('#createRoom').click(() => {
                const roomName = $('#roomName').val();
                socket.emit('joinRoom', roomName);
                $('#roomName').val('');
            });
        });
    }

    private createRoom(): void {
        $('#roomList tr:last').after(`<tr>
            <td>RoomName</td>
            <button id="joinRoom" type="button">Join</button>
        </tr>`);
    }

    public getHTML(): string { return this.html; }
}