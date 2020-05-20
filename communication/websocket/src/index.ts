// const WebSocketServer = require('ws').Server;
const url = require('url');
import fs from "fs";
var path = require('path');

const port = 8000;
const LOGGED_IN_CLIENTS = new Map();
let onCloseEvent;

// read ssl certificate
// var privateKey = fs.readFileSync('./server.key', 'utf8');
// var certificate = fs.readFileSync('./server.cert', 'utf8');

// var credentials = { key: privateKey, cert: certificate };
var https = require('https');

var httpsServer = https.createServer({
    key: fs.readFileSync('./server.key'),
    cert: fs.readFileSync('./server.cert')
});
httpsServer.listen(port);

var WebSocketServer = require('ws').Server;
var socketServer = new WebSocketServer({
    server: httpsServer
});


// let socketServer = new WebSocketServer({port: port});
if (process.env.NODE_ENV == "development")
    console.log(`WebSocket running on port ${port}`);
console.log(`WebSocket running on port ${port}`);

socketServer.on('connection', (socketClient, req) => {  // usage: /?name=yossi
    const username = url.parse(req.url, true).query.name;
    if (username) {
        // console.log(`${username} connected`);
        LOGGED_IN_CLIENTS.set(username, socketClient)
        // socketClient.send(JSON.stringify({id: 1, message: `WELCOME ${username.toUpperCase()}!`, type: 4}));
    }
    socketClient.on(('message'), (data) => {
        socketClient.send(`message back to ${username ? username : ""}`);
    });

    socketClient.on('close', () => {
        if (username) {
            onCloseEvent(username);
            LOGGED_IN_CLIENTS.delete(username);
        }
    });
});

// socketServer.on('close', () => {
//     console.log('disconnected');
// });

function sendMessageTo(username, message) {
    // console.log(`got ${username}`)
    const client = LOGGED_IN_CLIENTS.get(username);
    // console.log(`${username} :::: ${client ? "ok- client found": "not ok - client NOT FOUND!!!!!!!!!!!!!!!!!"}`)
    if (client) {
        try {
            // console.log(`trying to send ${JSON.stringify(message)} to ${username}`)
            client.send(JSON.stringify(message));
            // console.log(`send message to ${username}`)
            return true;
        } catch (e) {
            console.log('websocket: failed sending message, error: ' + e)
        }
    }
    // console.log(`didn't send`)
    return false;
}

function terminate() {
    try {
        socketServer.close();
        httpsServer.close();
    } catch (err) {
        console.log(err)
    }
}

function setOnCloseEvent(func) {
    onCloseEvent = func;
}

function removeClient(username) {
    // let x = 0;
    if (LOGGED_IN_CLIENTS.has(username)) {
        const client = LOGGED_IN_CLIENTS.get(username);
        LOGGED_IN_CLIENTS.delete(username);
        client.terminate();
        console.log("removed client!")
        // x = 1;
    }
    // if (x === 0)
    // console.log("didn't remove client!")
}

export { sendMessageTo, terminate, setOnCloseEvent, removeClient };