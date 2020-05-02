import socket from 'socket.io'

const io = server => {
    const socketIO = socket(server);
    socketIO.on('connection', client => {
        console.log("newconnect")
        client.on('tal', data => {
            client.emit('hey')
        });
    });

}

export default io