import socketIO from 'socket.io'
import RoomInfo from './roomInfo';
import { ID, RoomData } from '../types';
import RoomDB from './roomDB';

export default class RoomSockets {
    private roomNsp: socketIO.Namespace;

    constructor(nsp: socketIO.Namespace, db: RoomDB) {
        this.roomNsp = nsp;

        this.roomNsp.on('connection', (socket: socketIO.Socket) => {
            socket.on('joinRoom', (roomId: ID) => {
                console.log(socket.id + ' has joined room ' + roomId);
                socket.join(roomId)
            });

            socket.on('updateInfo', (roomId: ID) => {
                this.updateInfo(roomId, db);
            });

            socket.on('wave', (roomId: ID) => {
                this.roomNsp.in(roomId).emit('updateWave', socket.id);
            });
        });
    }

    private updateInfo(roomId: ID, db: RoomDB) {
        let data: RoomData = null;
        if (db.roomMap.has(roomId)) {
            data = db.roomMap.get(roomId).toMsg();
        }
        console.log(this.roomNsp);
        this.roomNsp.in(roomId).emit('updateInfo', data);
    }
}
