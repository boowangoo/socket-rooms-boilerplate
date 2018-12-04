import socketIO from 'socket.io'
import { ID, RoomData } from '../types';
import RoomDB from './roomDB';
import SelectSockets from './selectSockets';
import RoomInfo from './roomInfo';
import { SocketConnection } from './socketSetup';

export default class RoomSockets {
    private roomNsp: socketIO.Namespace;

    constructor(nsp: socketIO.Namespace, conn: SocketConnection) {
        this.roomNsp = nsp;

        this.roomNsp.on('connection', (socket: socketIO.Socket) => {
            socket.on('joinRoom', (roomId: ID) => {
                console.log(socket.id + ' has joined room ' + roomId);
                socket.join(roomId);
            });

            socket.on('leaveRoom', (roomId: ID) => {
                socket.leave(roomId, (err: any) => {
                    if (!err) {
                        this.leaveRoom(roomId, conn);
                    }
                });
            });

            socket.on('updateInfo', (roomId: ID) => {
                this.updateInfo(roomId, conn);
            });

            socket.on('wave', (roomId: ID) => {
                this.roomNsp.in(roomId).emit('updateWave', socket.id);
            });

            socket.on('disconnect', () => {
                console.log(socket.rooms)
            });
        });
    }

    public kickFromRoom(roomId: ID) {
        this.roomNsp.in(roomId).emit('kicked');
    }

    private leaveRoom(roomId: ID, conn: SocketConnection): RoomData {
        let roomInfo: RoomInfo = null;
        if (conn.db.roomMap.has(roomId)) {
            roomInfo = conn.db.roomMap.get(roomId).decrPlayers();
        }
        if (roomInfo) {
            this.updateInfo(roomId, conn);
            conn.selectSockets.updateInfo(roomInfo.toMsg());
        }
        console.log('roomInfo', roomInfo);
        console.log('roomInfo.toMsg', roomInfo.toMsg());
        return roomInfo ? roomInfo.toMsg() : null;
    }

    private updateInfo(roomId: ID, conn: SocketConnection) {
        let data: RoomData = null;
        if (conn.db.roomMap.has(roomId)) {
            data = conn.db.roomMap.get(roomId).toMsg();
        }
        this.roomNsp.in(roomId).emit('updateInfo', data);
    }
}
