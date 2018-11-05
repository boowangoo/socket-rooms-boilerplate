import socketIO from 'socket.io'

export class SocketSetup {
    public static setup(io: socketIO.Server): void {
        io.on('connection', (socket: socketIO.Socket) => {
            console.log('a user connected');
            
            socket.on('disconnect', () => {
                console.log('user disconnected');
            });
        });
    }
}
