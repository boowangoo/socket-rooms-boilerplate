import express from 'express';
// import webpackDevMiddleware from 'webpack-dev-middleware';
// import webpackHotMiddleware from 'webpack-hot-middleware';

// import webpack from 'webpack'
// import config from '../webpack.server.config.js';

export class ExpressSetup {
    public static setup(app: express.Application): void {
        // const compiler = webpack(<webpack.Configuration> config);

        // app.use(webpackDevMiddleware(compiler, {
        //     publicPath: config.output.publicPath
        // }));
        // app.use(webpackHotMiddleware(compiler));

        app.use(express.static('dist/client'));
        app.use(express.json());
        app.use(express.urlencoded({ extended: true }));

        app.post('/createRoom', (req, res) => {
            console.log('qwerty');
            res.sendStatus(200);
        });
    }
}
