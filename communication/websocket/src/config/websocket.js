const WebSocket = require('ws'); // new
const url = require('url');

export default class Socket {

    #LOGGED_IN_CLIENTS = new Map();

    constructor (port, onCloseEvent) {
        this.#LOGGED_IN_CLIENTS = new Map();

        // console.log(`WebSocket running on port ${port}`);
        this.socketServer = new WebSocket.Server({port: port});

        this.socketServer.on('connection', (socketClient, req) => {  // usage: /?name=yossi
            const username = url.parse(req.url, true).query.name;
            if (username) {
                // console.log(`${username} connected`);
                this.#LOGGED_IN_CLIENTS.set(username, socketClient)
                socketClient.send(`hola ${username}`);
            }
            socketClient.on(('message'), (data) => {
                socketClient.send(`message back to ${username? username: ""}`);
                this.sendToAllLoggedInUsers(`broadcast from ${username?username: ""} motherfuckers, message: ${data}`)
            });

            socketClient.on('close', (asd ,data) => {
                if (username) {
                    onCloseEvent(username);
                    // console.log(username + ' byebyebeye ')
                    this.#LOGGED_IN_CLIENTS.delete(username);
                }
            });
        });
    }

    sendToAllLoggedInUsers(message) {
        for (let client of this.#LOGGED_IN_CLIENTS.values())
            client.send(message);
    }

    sendToGroup(usersGroup, message) {
        for (let client of usersGroup)
            client.send(message)
    }

    isConnected(username) {
        return this.#LOGGED_IN_CLIENTS.keys().include(username);
    }

    getSocketByUsername(username) {
        return this.#LOGGED_IN_CLIENTS.get(username);
    }

    sendMessageTo(username, message) {
        // console.log(`got ${username}`)
        const client = this.#LOGGED_IN_CLIENTS.get(username);
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

    async terminate() {
        // console.log('closing websocket connection')
        // this.socketServer.close();
        await this.socketServer.close();
    }
}