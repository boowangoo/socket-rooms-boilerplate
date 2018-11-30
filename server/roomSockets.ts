import socketIO from 'socket.io'
import RoomInfo from './roomInfo';
import { ID, RoomData } from '../types';
import RoomDB from './roomDB';

export default class RoomSockets {
    private roomNsp: socketIO.Namespace;

    constructor(nsp: socketIO.Namespace, db: RoomDB) {
        this.roomNsp = nsp;

        this.roomNsp.on('connection', (socket: socketIO.Socket) => {
            socket.on('updateInfo', (roomId: ID) => {
                this.updateInfo(roomId, db);
            });
        });
    }

    private updateInfo(roomID: ID, db: RoomDB) {
        let data: RoomData = null;
        if (db.roomMap.has(roomID)) {
            data = db.roomMap.get(roomID).toMsg();
        }
        this.roomNsp.in(roomID).emit('updateInfo', data);
    }
}
