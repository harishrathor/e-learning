

import  express from 'express';
const logger = require('morgan');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const compression = require('compression');
import { ObjectType } from '@app-types/index';
import PATHS from './paths'

class Server {

    public PATHS: ObjectType | undefined;
    public ENV: any;
    public CONFIGS: ObjectType;
    public APP: express.Application;

    protected _serverInstance: any;

    constructor() {
    }

    initialize() {
        this.PATHS = PATHS;
        this.APP = express();
        this.ENV = process.env.NODE_ENV;
        this._registerMiddlwares();
        this._initRouting();
    }

    isDev() {
        return this.ENV === 'development';
    }

    isProduction() {
        return this.ENV === 'production';
    }

    _initRouting() {
        require('@routes');
    }

    _registerMiddlwares() {
        this.APP.use(express.static(this.PATHS.SERVER_ASSETS));
        this.APP.use(cookieParser());
        this.APP.use(compression());
        this.APP.use(helmet());
        this.APP.use(bodyParser.json());
        this.APP.use(bodyParser.urlencoded({extended: true}));
        if (this.isDev()) {
            this.APP.use(logger('dev'));
        }
    }

    startServer() {
        this._serverInstance = this.APP.listen(process.env.PORT, () => console.log(`Server (${this.ENV}) started at port ${process.env.PORT}. Process id ${process.pid} and Parent process id ${process.ppid}`));
    }

    stopServer() {
        if (this._serverInstance) {
            this._serverInstance.close();
        }
    }

    all(req: express.Request, res: express.Response, next: any) { //Called for all request. 
        next(req, res);
    }

}

function startServer() {
    var server = new Server();
    globalThis.SERVER = server;
    server.initialize();
    server.startServer();
}

startServer();
   



