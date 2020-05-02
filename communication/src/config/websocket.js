const WebSocket = require('ws'); // new

export default (port) => {
    console.log(`WebSocket running on port ${port}`);
    const socketServer = new WebSocket.Server({port: port});

    socketServer.on('connection', (socketClient) => {
        // socketClient.send('hola');

        socketClient.on(('message'), (data) => {
            // socketClient.send('1111111111hola');
        });

        socketClient.on('close', (data) => {
        });
    });
}
