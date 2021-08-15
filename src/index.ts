
import Server from './server';

function startServer() {
    var server = new Server();
    globalThis.SERVER = server;
    server.initialize();
    server.startServer();
}

startServer();
   

