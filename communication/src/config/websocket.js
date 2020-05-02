const WebSocket = require('ws'); // new
const url = require('url');

const CLIENTS = new Map;
let i = 1;

export default (port) => {

    console.log(`WebSocket running on port ${port}`);
    const socketServer = new WebSocket.Server({port: port});

    socketServer.on('connection', (socketClient, req) => {
        console.log('connected');
        // console.log(req.url);
        console.log(url.parse(req.url, true).query.name); // usage: ws://localhost:3000/?name=ryan
        CLIENTS.set('test' + i, socketClient);
        i++;
        socketClient.send('hola');

        socketClient.on(('message'), (data) => {
            console.log('closed');
            console.log('Number of clients: ', socketServer.clients.size);
            socketClient.send('1111111111hola');
            sendAll('hey mathererer')
        });

        socketClient.on('close', (data) => {
            console.log('closed');
            console.log('Number of clients: ', socketServer.clients.size);
        });
    });
}

export function sendAll(message) {
    for (let i=0; i<CLIENTS.length; i++) {
        CLIENTS.values()[i].send("Broadcast: " + message);
    }
}

export function sendToGroup(usersGroup, message) {
    for (let i=0; i<usersGroup.length; i++) {
        usersGroup[i].send("Broadcast: " + message);
    }
}

export function isConnected(username) {
    return CLIENTS.keys().include(username);
}

export function getSocketByUsername(username) {
    return CLIENTS.get(username);
}