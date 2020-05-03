const WebSocket = require('ws'); // new
const url = require('url');

const LOGGED_IN_CLIENTS = new Map;
const GUESTS = new Map;
const GUEST_NAME = 'GUEST';
let i = 0;

export default (port) => {

    console.log(`WebSocket running on port ${port}`);
    const socketServer = new WebSocket.Server({port: port});

    socketServer.on('connection', (socketClient, req) => {
        const username = url.parse(req.url, true).query.name;
        const guest = !username ? `${GUEST_NAME}_${i++}` : undefined;
        if (username) {
            console.log(`${username} connected`);
            LOGGED_IN_CLIENTS.set(username, socketClient)
            socketClient.send(`hola ${username}`);
        }
        else {
            console.log(`guest connected: ${guest}`);
            GUESTS.set(guest, socketClient)
            socketClient.send(`hola ${guest}`);
        }

        socketClient.on(('message'), (data) => {
            socketClient.send(`message back to ${username? username: guest}`);
            sendAll(`broadcast from ${username?username: guest} motherfuckers, message: ${data}`)
        });

        socketClient.on('close', (asd ,data) => {
            if (username) {
                console.log(username + ' byebyebeye ' + i)
                LOGGED_IN_CLIENTS.delete(username);
            }
            else {
                console.log(guest + ' byebyebeye ' + i)
                GUESTS.delete(guest);
            }
        });
    });
}

export function sendAll(message) {
    sendToAllLoggedInUsers(message);
    sendToAllGuests(message);
}

export function sendToAllGuests(message) {
    for (let client of GUESTS.values())
        client.send(message)
}

export function sendToAllLoggedInUsers(message) {
    for (let client of LOGGED_IN_CLIENTS.values())
        client.send(message);
}

export function sendToGroup(usersGroup, message) {
    for (let client of usersGroup)
        client.send(message)
}

export function isConnected(username) {
    return LOGGED_IN_CLIENTS.keys().include(username);
}

export function getSocketByUsername(username) {
    return LOGGED_IN_CLIENTS.get(username);
}