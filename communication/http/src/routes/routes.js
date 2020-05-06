import users from "./users.js";
import stores from "./stores.js";
import system from "./system";

const routes = server => {
    server.use("/users", users);
    server.use("/stores", stores);
    server.use("/system", system);

    server.get("/", (req, res) => {
        res.json({
            status: "OK"
        });
    });
};

export default routes;
