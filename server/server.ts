import * as fs from 'fs';
import * as path from 'path';

import * as express from 'express';
import { Server } from 'https';

const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.static('dist/client'));

// app.get('/d', (req, res) => {
//     fs.readdir(__dirname, (err, items) => { console.log(items); });
//     res.sendFile(__dirname + '/god.html')
// });

app.listen(PORT, () => {
    console.log('listening on *:' + PORT);
});