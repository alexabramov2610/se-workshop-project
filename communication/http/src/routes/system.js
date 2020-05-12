import express from "express";
import * as SystemControllers from "../controllers/system_controllers"

const router = express.Router();

router.post("/init", SystemControllers.systemInit);
router.post("/isLoggedIn", SystemControllers.isLoggedIn);


router.get("/status/", SystemControllers.getIsSystemUp);        // usage: stores/status
router.get("/newtoken", SystemControllers.startNewSession);    // usage: stores/newtoken


export default router;
