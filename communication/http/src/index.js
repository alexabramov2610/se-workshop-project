import server from "./config/server";
import routes from "./routes/routes";
import fs from "fs"
import https from "https"

const PORT = process.env.PORT || 4000;
// const httpPort = 5000
// set up http server
routes(server);

https.createServer({
    key: fs.readFileSync('./server.key'),
    cert: fs.readFileSync('./server.cert')
}, server)

    .listen(PORT, function () {
        console.log(`https app running on port ${PORT}`)
    });
// server.listen(httpPort, () => {
//     console.log(`http app running on port ${httpPort}`);
// });
