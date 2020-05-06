import server from "./config/server";
import routes from "./routes/routes";
import Socket from "./config/websocket"
import {ServiceFacade} from "service_layer";

const PORT = process.env.PORT || 4000;
const WS_PORT = process.env.WS_PORT || 3000;

// set up socket & publisher
const socket = new Socket(WS_PORT);

ServiceFacade.setSendMessageFunction(socket.sendMessageTo);



// set up http server
routes(server);
server.listen(PORT, () => {
    console.log(`app running on port ${PORT}`);
});

