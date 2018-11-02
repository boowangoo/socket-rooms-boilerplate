import fs from 'fs';
import path from 'path';

import express from 'express';
import { Server } from 'https';

const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.static('dist/client'));

// app.get('/', (req, res) => {
//     fs.readdir(__dirname, (err, items) => { console.log(items); });
//     res.sendFile(__dirname + '/god.html')
// });

app.get('/createRoom', (req, res) => {
    res.send('hi')
});

app.listen(PORT, () => {
    console.log('listening on *:' + PORT);
    console.log('__dirname: ' + __dirname);
});