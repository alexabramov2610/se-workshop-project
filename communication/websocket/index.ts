const WebSocketServer = require('ws').Server;
const url = require('url');

const port = 3000;
const LOGGED_IN_CLIENTS = new Map();

let socketServer = new WebSocketServer({port: port});
console.log(`WebSocket running on port ${port}`);

socketServer.on('connection', (socketClient, req) => {  // usage: /?name=yossi
    const username = url.parse(req.url, true).query.name;
    if (username) {
        // console.log(`${username} connected`);
        LOGGED_IN_CLIENTS.set(username, socketClient)
        socketClient.send(`hola ${username}`);
    }
    socketClient.on(('message'), (data) => {
        socketClient.send(`message back to ${username? username: ""}`);
        // sendToAllLoggedInUsers(`broadcast from ${username?username: ""} motherfuckers, message: ${data}`);
        socketServer = new WebSocketServer({port: port});
    });

    socketClient.on('close', (asd ,data) => {
        if (username) {
            // onCloseEvent(username);
            // console.log(username + ' byebyebeye ')
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
    // console.log(`${client ? "ok": "not ok"}`)
    if (client) {
        try {
            // console.log(`sending`)
            client.send(message);
            // console.log(`send message to ${username}`)
            return true;
        } catch (e) {
            // console.log('websocket: failed sending message, error: ' + e)
        }
    }
    // console.log(`didn't send`)
    return false;
}

async function terminate() {
    try {
        await socketServer.close();
    } catch(err) {
        console.log(err)
    }
}



export { sendMessageTo, terminate };