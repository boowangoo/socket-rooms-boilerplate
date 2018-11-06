import socketIO from 'socket.io'

export class SocketSetup {
    private room: socketIO.Room;
    public static setup(io: socketIO.Server): void {
        io.on('connection', (socket: socketIO.Socket) => {
            console.log('a user connected');

            socket.on('joinRoom', room => {
                console.log('join room: ' + room);
                socket.join(room);
                console.log(io.sockets.adapter.rooms);
            });
            
            socket.on('disconnect', () => {
                console.log('user disconnected');
            });
        });
    }
}
