const WebSocket = require('ws'); // new
const url = require('url');

export default class Socket {

    constructor (port) {
        this.LOGGED_IN_CLIENTS = new Map();
        this.GUESTS = new Map();
        this.GUEST_NAME = 'GUEST';
        this.i = 0;

        console.log(`WebSocket running on port ${port}`);
        const socketServer = new WebSocket.Server({port: port});

        socketServer.on('connection', (socketClient, req) => {  // usage: /?name=ahmed
            const username = url.parse(req.url, true).query.name;
            const guest = !username ? `${this.GUEST_NAME}_${i++}` : undefined;
            if (username) {
                console.log(`${username} connected`);
                this.LOGGED_IN_CLIENTS.set(username, socketClient)
                socketClient.send(`hola ${username}`);
            }
            else {
                console.log(`guest connected: ${guest}`);
                this.GUESTS.set(guest, socketClient)
                socketClient.send(`hola ${guest}`);
            }

            socketClient.on(('message'), (data) => {
                socketClient.send(`message back to ${username? username: guest}`);
                this.sendAll(`broadcast from ${username?username: guest} motherfuckers, message: ${data}`)
            });

            socketClient.on('close', (asd ,data) => {
                if (username) {
                    console.log(username + ' byebyebeye ' + i)
                    this.LOGGED_IN_CLIENTS.delete(username);
                }
                else {
                    console.log(guest + ' byebyebeye ' + i)
                    this.GUESTS.delete(guest);
                }
            });
        });
    }

    sendAll(message) {
        this.sendToAllLoggedInUsers(message);
        this.sendToAllGuests(message);
    }

    sendToAllGuests(message) {
        for (let client of this.GUESTS.values())
            client.send(message)
    }

    sendToAllLoggedInUsers(message) {
        for (let client of this.LOGGED_IN_CLIENTS.values())
            client.send(message);
    }

    sendToGroup(usersGroup, message) {
        for (let client of usersGroup)
            client.send(message)
    }

    isConnected(username) {
        return this.LOGGED_IN_CLIENTS.keys().include(username);
    }

    getSocketByUsername(username) {
        return this.LOGGED_IN_CLIENTS.get(username);
    }

    sendMessageTo(username, message) {
        console.log(`got ${username}`)
        const client = this.LOGGED_IN_CLIENTS.get(username);
        console.log(`${client ? "ok": "not ok"}`)
        if (client) {
            try {
                console.log(`sending`)
                client.send(message);
                console.log(`send message to ${username}`)
                return true;
            } catch (e) {
                console.log('websocket: failed sending message, error: ' + e)
            }
        }
        console.log(`didn't send`)
        return false;
    }

}

// const getInstance = () => {
//     if (socket)
//         return socket;
//     socket = new Socket(WS_PORT);
//     return socket;
// }
//
// export { getInstance };