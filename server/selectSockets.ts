import socketIO from 'socket.io'
import RoomInfo from './roomInfo';
import { ID, RoomData } from '../types';
import RoomDB from './roomDB';
import Room from '../client/room';

export default class SelectSockets {
    private selectNsp: socketIO.Namespace;

    constructor(nsp: socketIO.Namespace, db: RoomDB) {
        this.selectNsp = nsp;

        this.selectNsp.on('connection', (socket: socketIO.Socket) => {
            socket.on('createRoom', (roomId: ID, callback: Function) => {
                let data: RoomData = null;
                if (!db.roomMap.has(roomId)) {
                    const room = this.createRoom(roomId, db);
                    console.log(`room ${ roomId } created`);
                    data = room.toMsg();
                    this.updateInfo(data);
                }
                callback(data);
            });
            
            socket.on('joinRoom', (roomId: ID, callback: Function) => {
                let data: RoomData = null;
                if (db.roomMap.has(roomId)) {
                    data = db.roomMap.get(roomId).incrPlayers().toMsg();
                    this.updateInfo(data);
                }
                callback(data);
            });

            socket.on('updateAllInfo', (callback: Function) => {
                const keys: Array<ID> = Array.from(db.roomMap.keys());
                const data: Array<RoomData> = keys.map(
                    (roomId) => db.roomMap.get(roomId).toMsg()
                );
                callback(data);
            });
        });
    }

    private updateInfo(data: RoomData) {
        this.selectNsp.emit('updateInfo', data);
    }

    private createRoom(roomId: ID, db: RoomDB): RoomInfo {
        let room: RoomInfo = null;
        if (!db.roomMap.has(roomId)) {
            room = new RoomInfo(roomId); 
            db.roomMap.set(roomId, room);
        }
        return room;
    }
}
