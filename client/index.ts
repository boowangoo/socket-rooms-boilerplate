import $ from 'jquery';
import io from 'socket.io-client';

import roomHtml from './html/room.html';
import selectHtml from './html/select.html';

const socket: SocketIOClient.Socket = io();

console.log(socket);

$('#container').html(selectHtml);