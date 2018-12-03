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
                    if (room) {
                        console.log(`room ${ roomId } created`);
                        data = room.toMsg();
                        this.updateInfo(data);
                    }
                }
                callback(data);
            });
            
            socket.on('joinRoom', (roomId: ID, callback: Function) => {
                let data: RoomData = null;
                if (db.roomMap.has(roomId)) {
                    const roomInfo = db.roomMap.get(roomId).incrPlayers();
                    if (roomInfo) {
                        data = roomInfo.toMsg();
                        this.updateInfo(data);
                    }
                }
                callback(data);
            });

            socket.on('deleteRoom', (roomId: ID) => {
                if (db.roomMap.has(roomId)) {
                    const data = db.roomMap.get(roomId).toMsg();
                    db.roomMap.delete(data.roomId);
                    this.deleteInfo(data);
                }
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

    public updateInfo(data: RoomData) {
        this.selectNsp.emit('updateInfo', data);
    }

    public deleteInfo(data: RoomData) {
        this.selectNsp.emit('deleteInfo', data);
    }

    private createRoom(roomId: ID, db: RoomDB): RoomInfo {
        let room: RoomInfo = null;
        if (!db.roomMap.has(roomId)) {
            room = new RoomInfo(roomId); 
            db.roomMap.set(roomId, room);
        }
        console.log(`createRoom -- db.roomMap`, db.roomMap);
        return room;
    }
}
