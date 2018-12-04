import socketIO from 'socket.io'
import { ID, RoomData } from '../types';
import RoomDB from './roomDB';
import SelectSockets from './selectSockets';
import RoomInfo from './roomInfo';

export default class RoomSockets {
    private roomNsp: socketIO.Namespace;

    constructor(nsp: socketIO.Namespace, db: RoomDB, selectSockets: SelectSockets) {
        this.roomNsp = nsp;

        this.roomNsp.on('connection', (socket: socketIO.Socket) => {
            socket.on('joinRoom', (roomId: ID) => {
                console.log(socket.id + ' has joined room ' + roomId);
                socket.join(roomId);
            });

            socket.on('leaveRoom', (roomId: ID, callback: Function) => {
                let data: RoomData = null;
                socket.leave(roomId, (err: any) => {
                    if (!err) {
                        data = this.leaveRoom(roomId, db, selectSockets);
                        callback(data);
                    }
                });
            });

            socket.on('updateInfo', (roomId: ID) => {
                this.updateInfo(roomId, db);
            });

            socket.on('wave', (roomId: ID) => {
                this.roomNsp.in(roomId).emit('updateWave', socket.id);
            });
        });
    }

    private leaveRoom(roomId: ID, db: RoomDB, selectSockets: SelectSockets): RoomData {
        let roomInfo: RoomInfo = null;
        if (db.roomMap.has(roomId)) {
            roomInfo = db.roomMap.get(roomId).decrPlayers();
        }
        if (roomInfo) {
            this.updateInfo(roomId, db);
            selectSockets.updateInfo(roomInfo.toMsg());
        }
        console.log('roomInfo', roomInfo);
        console.log('roomInfo.toMsg', roomInfo.toMsg());
        return roomInfo ? roomInfo.toMsg() : null;
    }

    private updateInfo(roomId: ID, db: RoomDB) {
        let data: RoomData = null;
        if (db.roomMap.has(roomId)) {
            data = db.roomMap.get(roomId).toMsg();
        }
        this.roomNsp.in(roomId).emit('updateInfo', data);
    }
}
