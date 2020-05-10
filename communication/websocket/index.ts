// const WebSocketServer = require('ws').Server;
const url = require('url');
var fs = require('fs');

const port = 3000;
const LOGGED_IN_CLIENTS = new Map();
let onCloseEvent;

// read ssl certificate
var privateKey = fs.readFileSync('server.key', 'utf8');
var certificate = fs.readFileSync('server.cert', 'utf8');

var credentials = { key: privateKey, cert: certificate };
var https = require('https');

var httpsServer = https.createServer(credentials);
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
        socketClient.send(`hola ${username}`);
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

async function terminate() {
    try {
        await socketServer.close();
    } catch (err) {
        console.log(err)
    }
}

function setOnCloseEvent(func) {
    onCloseEvent = func;
}

function removeClient(username) {
    if (LOGGED_IN_CLIENTS.has(username)) {
        const client = LOGGED_IN_CLIENTS.get(username);
        LOGGED_IN_CLIENTS.delete(username);
        client.terminate();
    }
}

export { sendMessageTo, terminate, setOnCloseEvent, removeClient };