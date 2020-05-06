import server from "./config/server";
import routes from "./routes/routes";
import fs from "fs"
import https from "https"

const PORT = process.env.PORT || 4000;

// set up http server
routes(server);

// https.createServer({
//     key: fs.readFileSync('./server.key'),
//     cert: fs.readFileSync('./server.cert')
// }, server)
//     .listen(PORT, function () {
//         console.log(`app running on port ${PORT}`)
//     })/*
server.listen(PORT, () => {
    console.log(`app running on port ${PORT}`);
});
