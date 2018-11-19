import socketIO from 'socket.io';

import Room from './room';

export class RoomList {
    private io: socketIO.Server;
    private roomListCtrlNsp: socketIO.Namespace;

    constructor(io: socketIO.Server, nameSpaceName?: string) {
        const nspName: string = nameSpaceName || 'room-list-ctrl'
        this.roomListCtrlNsp = io.of('/' + nspName)
        this.io = io;
    }

    private sendRoomInfo(roomList: Array<Room>): void {

    }

    private createRoom(): void {

    }
}