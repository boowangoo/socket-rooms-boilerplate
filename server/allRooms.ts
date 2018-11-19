import socketIO from 'socket.io'
import RoomInfo from './roomInfo';
import { truncateSync } from 'fs';

export default class AllRooms {
    private allRoomsNsp: socketIO.Namespace;
    private roomMap: Map<string, RoomInfo>;

    constructor(nsp: socketIO.Namespace) {
        this.allRoomsNsp = nsp;
        this.roomMap = new Map<string, RoomInfo>();

        this.allRoomsNsp.on('connection', (socket: socketIO.Socket) => {
            console.log('a user connected');

            socket.on('createRoom', (roomId: string, callback: Function) => {
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

            socket.on('joinRoom', (roomId: string, callback: Function) => {
                console.log(`id:\t${ roomId }`);
                callback({ allowJoin: true });
            });

            socket.on('disconnect', () => {
                console.log('user disconnected');
            });
        });

        

        // this.allRoomsNsp.on('get-info', (roomId: string, callback: Function) => {
        //     callback(this.roomMap.get(roomId).toMsg());
        // });

    }

    private createRoom(roomId: string): RoomInfo {
        if (!this.roomMap.has(roomId)) {
            const room: RoomInfo = new RoomInfo(roomId); 
            this.roomMap.set(roomId, room);

            return room;
        }
        return null;
    }

    private deleteInfo(roomId: string): void {
        this.allRoomsNsp.emit('delete-rooms', roomId);
    }

    private updateInfo(data: any): void {
        this.allRoomsNsp.emit('updateInfo', data);
    }

    private updateAllInfo(): void {
        const keys: Array<string> = Array.from(this.roomMap.keys());
        const rooms: Array<any> = keys.map(
            (roomId) => this.roomMap.get(roomId).toMsg()
        );
        
        this.allRoomsNsp.emit('update-rooms', rooms);
    }

    
}