
import Server from './server';


function startServer(env: string) {
    var server = new Server(env);
    globalThis.SERVER = server;
    server.initialize();
    server.startServer();
}

const args = process.argv
let env = args[2];
console.log('ARGS', args);
if (!env || env != 'production' && env != 'development') {
    env = 'development';
}
startServer(env);
   

