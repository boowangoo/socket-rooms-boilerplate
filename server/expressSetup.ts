import express from 'express';

export class ExpressSetup {
    public static setup(app: express.Application): void {
        app.use(express.static('dist/client'));
        app.use(express.json());
        app.use(express.urlencoded());

        app.post('/createRoom', (req, res) => {
            console.log(req.body.roomName);
        });
    }
}
