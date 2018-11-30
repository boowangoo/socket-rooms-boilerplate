import socketIO from 'socket.io'
import RoomInfo from './roomInfo';
import SelectSockets from './selectSockets';
import RoomSockets from './roomSockets';
import RoomDB from './roomDB';

export class SocketConnection {
    constructor(io: socketIO.Server) {
        const db = new RoomDB();
        const selectSockets = new SelectSockets(io.of('/select'), db);
        const roomSockets = new RoomSockets(io.of('/room'), db);

        io.on('connect', (socket: SocketIO.Socket) => {
            console.log(socket.id + ' connected');

            socket.on('disconnect', () => {
                console.log(socket.id + ' disconnected');
            });
        });
        
    }
}
