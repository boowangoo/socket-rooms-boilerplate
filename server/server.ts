import * as express from 'express';

const app = express();

const PORT = process.env.PORT || 3000;

app.get('/', (req: any, res: any) => {
    res.send('hello world');
});

app.listen(PORT, () => {
    console.log('listening on *:' + PORT);
});