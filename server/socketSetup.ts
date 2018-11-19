import socketIO from 'socket.io'
import RoomInfo from './roomInfo';
import AllRooms from './allRooms';

export class SocketConnection {
    constructor(io: socketIO.Server) {
        const rooms = new AllRooms(io.of('/room-list'));

        io.on('connection', (socket: socketIO.Socket) => {
            
            
            
        });

        
    }
}
