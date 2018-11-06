import $ from 'jquery';
import io from 'socket.io-client';

import { Select } from './select'


class Index {
    private select: Select;
    private socket: SocketIOClient.Socket;

    constructor() {
        this.socket = io();
        this.select = new Select(this.socket);

        this.loadContainer();
    }

    private loadContainer(): void {
        $('#container').html(this.select.getHTML());
    }

    public changeTemplate(html: string): void {
        $('#container').html(html);
    }
}

const index = new Index();
