import socketIO from 'socket.io'
import Room from './room';

export class SocketSetup {

    public static setup(io: socketIO.Server): void {
        io.on('connection', (socket: socketIO.Socket) => {
            console.log('a user connected');

            socket.on('createRoom', (roomId: string, callback) => {
                if (!Room.getRoom(roomId)) {
                    const newRoom = new Room(roomId);

                    if (newRoom) {
                        socket.emit('createRoom', roomId);
                    }
                }

                callback(Array.from(Room.rooms.keys()));
            });

            socket.on('joinRoom', (roomId: string) => {
                socket.join(roomId);
            });

            socket.on('getRoomInfo', (roomId: string, callback) => {
                const room: Room = Room.getRoom(roomId);
                callback({
                    roomId: roomId,
                    players: room.players,
                    capacity: room.capcity
                });
            });
            
            socket.on('disconnect', () => {
                console.log('user disconnected');
            });
        });
    }
}
