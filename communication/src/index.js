import server from "./config/server";
import routes from "./routes/routes";

const PORT = process.env.PORT || 4000;

routes(server);

server.listen(PORT, () => {
    console.log(`app running on port ${PORT}`);
});
