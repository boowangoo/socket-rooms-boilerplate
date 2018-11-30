import io from 'socket.io-client';

import Select from './select';
import Router from './router'; 

class Index {
    private socket: SocketIOClient.Socket;
    private select: Select;
    private router: Router;


    constructor() {
        this.socket = io();
        this.router = new Router();
        this.select = new Select(this.router, io('/select'));
        this.router.changeTemplHtml(this.select.HTML);
    }
}

const index = new Index();
