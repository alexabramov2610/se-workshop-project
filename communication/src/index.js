import server from "./config/server";
import routes from "./routes/routes";
import webSocketInit from "./config/websocket";
const PORT = process.env.PORT || 4000;
const WS_PORT = process.env.WS_PORT || 3000;

routes(server);
webSocketInit(WS_PORT);

server.listen(PORT, () => {
    console.log(`app running on port ${PORT}`);
});

export * from "./config/websocket"
