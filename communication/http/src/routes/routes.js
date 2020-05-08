import users from "./users.js";
import stores from "./stores.js";
import system from "./system";
import purchase from "./purchase";
import test from "./test";

const routes = server => {
    server.use("/users", users);
    server.use("/stores", stores);
    server.use("/system", system);
    server.use("/purchase", purchase);
    server.use("/test", test);

    server.get("/", (req, res) => {
        res.json({
            status: "OK"
        });
    });
};

export default routes;
