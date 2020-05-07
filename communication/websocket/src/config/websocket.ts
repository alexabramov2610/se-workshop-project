// const WebSocketServer = require('ws').Server;
// const url = require('url');
//
// export class Socket {
//
//     private LOGGED_IN_CLIENTS = new Map();
//     private socketServer: any;
//     private port: number;
//
//     constructor (port) {
//
//     }
//
//     sendToAllLoggedInUsers(message) {
//         for (let client of this.LOGGED_IN_CLIENTS.values())
//             client.send(message);
//     }
//
//     sendToGroup(usersGroup, message) {
//         for (let client of usersGroup)
//             client.send(message)
//     }
//
//     // isConnected(username) {
//     //     return this.LOGGED_IN_CLIENTS.keys().include(username);
//     // }
//
//     getSocketByUsername(username) {
//         return this.LOGGED_IN_CLIENTS.get(username);
//     }
//
// }