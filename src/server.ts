import  express from 'express';
const logger = require('morgan');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const compression = require('compression');
import { ObjectType } from '@app-types/index';
import PATHS from './paths'

export default class Server {

    public PATHS: ObjectType | undefined;
    public ENV: string;
    public CONFIGS: ObjectType;
    public APP: express.Application;
    public SingletonInstances: ObjectType;

    protected _serverInstance: any;

    constructor(env: string) {
        this.ENV = env;
    }


    initialize() {
        this.SingletonInstances = {};
        this.PATHS = PATHS;
        this.APP = express();
        this._registerMiddlwares();
        this._initRouting();
    }

    isDev() {
        return this.ENV === 'development';
    }

    isProduction() {
        return this.ENV === 'production';
    }

    public setSingletonInstance(className: string, instance: any) {
        return this.SingletonInstances[className] = instance;
    }

    public getSingletonInstance(className: string) {
        return this.SingletonInstances[className]
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

    _displayServerInfo() {
        const { networkInterfaces } = require('os');
        const nets = networkInterfaces();
        const results = Object.create(null); // Or just '{}', an empty object

        for (const name of Object.keys(nets)) {
            for (const net of nets[name]) {
                // Skip over non-IPv4 and internal (i.e. 127.0.0.1) addresses
                if (net.family === 'IPv4' && !net.internal) {
                    if (!results[name]) {
                        results[name] = [];
                    }
                    results[name].push(net.address);
                }
            }
        }
        console.log(results);
    }

    startServer() {
        process.env.PORT = '4500';
        this._serverInstance = this.APP.listen(process.env.PORT, () => console.log(`Server (${this.ENV}) started at port ${process.env.PORT}. Process id ${process.pid} and Parent process id ${process.ppid}`));
       // this._displayServerInfo();
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


