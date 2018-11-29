import socketIO from 'socket.io'
import RoomInfo from './roomInfo';
import { ID, RoomData, JoinRoomData, LeaveRoomData } from '../types';
// import { truncateSync } from 'fs';

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
                let roomData: RoomData = null;

                if (!this.roomMap.has(roomId)) {
                    room = this.createRoom(roomId);
                    console.log(`room ${ roomId } created`);
                    roomData = room.toMsg();
                }
                callback({ created: !!roomData, data: roomData });
            });

            socket.on('joinRoom', (roomId: ID, callback: Function) => {
                let updatedRoom: RoomInfo = null;
                if (this.roomMap.has(roomId)) {
                    updatedRoom = this.roomMap.get(roomId).incrPlayers();
                }
                callback({
                    allowJoin: !!updatedRoom,
                    data: updatedRoom ? updatedRoom.toMsg() : null,
                });
            });

            socket.on('leaveRoom', (roomId: ID, callback: Function) => {
                let updatedRoom: RoomInfo = null;
                if (this.roomMap.has(roomId)) {
                    updatedRoom = this.roomMap.get(roomId).decrPlayers();
                }
                callback({
                    allowJoin: !!updatedRoom,
                    data: updatedRoom ? updatedRoom.toMsg() : null,
                });
            });

            socket.on('updateInfo', (roomId: ID, callback: Function) => {
                let room: RoomInfo = null;
                if (this.roomMap.has(roomId)) {
                    room = this.roomMap.get(roomId);
                }
                callback(room);
            });

            socket.on('updateAllInfo', (callback: Function) => {
                const keys: Array<ID> = Array.from(this.roomMap.keys());
                const roomsData: Array<RoomData> = keys.map(
                    (roomId) => this.roomMap.get(roomId).toMsg()
                );
                callback(roomsData);
            });

            socket.on('disconnect', () => {
                console.log('user disconnected');
            });
        });
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
