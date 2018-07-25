import * as express from 'express';
import * as cors from 'cors';
import * as helmet from 'helmet';
import * as http from 'http';

import { AddressInfo } from 'net';
import { CorsOptions } from 'cors';

import ExampleController from './controllers/example/contact';

import ErrorService from './services/error.service';

/*
 * Load up the App
 */
const app: express.Application = express();

/*
 * Configure security elements
 */
const corsOpts: CorsOptions = {
    origin: process.env['ADMIN_URL'],
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'HEAD'],
    allowedHeaders: ['Content-Type'],
    credentials: true,
    optionsSuccessStatus: 200
};

app.enable('trust proxy');
app.use(helmet());
app.options('*', cors(corsOpts));
app.use(cors(corsOpts));

/*
 * Register routing endpoints
 */
app.use('/example/contact', ExampleController);

app.use(ErrorService);

/*
 * Create the server
 */
const server = http.createServer(app);
const port = process.env['PORT'];

server.listen(port);
server.on('listening', listening);

function listening() {
    const addr = <AddressInfo>server.address();
    console.log(`Listening on ${addr.address}:${addr.port}`);
}

module.exports = app;
