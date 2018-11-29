import socketIO from 'socket.io'
import RoomInfo from './roomInfo';
<<<<<<< HEAD
import { ID, RoomData } from '../types';
// import { truncateSync } from 'fs';
=======
import { truncateSync } from 'fs';
>>>>>>> parent of 5083ab7... select.ts now initiates socket in its constructor rather than in index.ts

export default class AllRooms {
    private allRoomsNsp: socketIO.Namespace;
    private roomMap: Map<ID, RoomInfo>;

    constructor(nsp: socketIO.Namespace) {
        this.allRoomsNsp = nsp;
        this.roomMap = new Map<ID, RoomInfo>();

        this.allRoomsNsp.on('connection', (socket: socketIO.Socket) => {
            console.log('a user connected');

            socket.on('createRoom', (roomId: ID, callback: Function) => {
                let room: RoomInfo;

                if (this.roomMap.has(roomId)) {
                    room = this.roomMap.get(roomId);
                    console.log(`room ${ roomId } created`);
                } else {
                    room = this.createRoom(roomId);
                    this.roomMap.set(roomId, room);
                }
    
                if (room) {
                    const data = {
                        created: true,
                        roomId: room.roomId,
                        players: room.players,
                        capacity: room.capacity,
                    };

                    this.updateInfo(data);
                    callback(data);
                }
                callback({ created: false });
            });

<<<<<<< HEAD
            socket.on('joinRoom', (roomId: ID, callback: Function) => {
                if (this.roomMap.has(roomId)) {
                    callback({
                        allowJoin: true,
                        data: this.roomMap.get(roomId),
                    });
                }
                callback({ allowJoin: false, data: null });
=======
            socket.on('joinRoom', (roomId: string, callback: Function) => {
                console.log(`id:\t${ roomId }`);
                callback({ allowJoin: true });
>>>>>>> parent of 5083ab7... select.ts now initiates socket in its constructor rather than in index.ts
            });

            socket.on('updateAllInfo', (callback: Function) => {
                const keys: Array<ID> = Array.from(this.roomMap.keys());
                const rooms: Array<RoomData> = keys.map(
                    (roomId) => this.roomMap.get(roomId).toMsg()
                );

                callback(rooms);
            });

            socket.on('disconnect', () => {
                console.log('user disconnected');
            });
        });

        // this.allRoomsNsp.on('get-info',
        //         (roomId: ID, callback: Function) => {
        //     callback(this.roomMap.get(roomId).toMsg());
        // });
    }

    private createRoom(roomId: ID): RoomInfo {
        if (!this.roomMap.has(roomId)) {
            const room: RoomInfo = new RoomInfo(roomId); 
            this.roomMap.set(roomId, room);

            return room;
        }
        return null;
    }

    private deleteInfo(roomId: ID): void {
        this.allRoomsNsp.emit('delete-rooms', roomId);
    }

    private updateInfo(data: RoomData): void {
        this.allRoomsNsp.emit('updateInfo', data);
    }
}
