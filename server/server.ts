import express from 'express';
import socketIO from 'socket.io';
import { createServer, Server } from 'http';

import { ExpressSetup } from './expressSetup';
import { SocketSetup } from './socketSetup';

export default class MyServer {
    public static readonly PORT: number = 3000;
    private app: express.Application;
    private server: Server;
    private io: socketIO.Server;
    private port: string | number;

    constructor() {
        this.createApp();
        this.config();
        this.createServer();
        this.sockets();
        this.listen();
    }

    private config(): void {
        this.port = process.env.PORT || MyServer.PORT;
    }

    private createApp(): void {
        this.app = express();
        ExpressSetup.setup(this.app);
    }

    private createServer(): void {
        this.server = createServer(this.app);
    }
   
    private sockets(): void {
        this.io = socketIO(this.server);
        SocketSetup.setup(this.io);
    }

    private listen(): void {
        this.server = this.app.listen(this.port, () => {
            console.log('listening on *:' + this.port);
        });   
    }

    public getApp(): express.Application { return this.app; }
    public getServer(): Server { return this.server; }
}

const myServer = new MyServer();
