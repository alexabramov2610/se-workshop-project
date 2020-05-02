import server from "./config/server";
import routes from "./routes/routes";
import io from "./config/websocket";
const httpServer = require('http').createServer(server);
const PORT = process.env.PORT || 4000;

routes(server);
io(httpServer);

httpServer.listen(3000, () => {
    console.log(`web socket running on port 3000`);
});

server.listen(PORT, () => {
    console.log(`app running on port ${PORT}`);
});



// const server = require('http').createServer();
// const io = require('socket.io')(server);
// io.on('connection', client => {
//     console.log("newconnect")
//     client.on('tal', data => {     console.log("newevent")
//     });
// });

