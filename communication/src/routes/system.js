import express from "express";
import * as SystemControllers from "../controllers/system_controllers"

const router = express.Router();

router.post("/newtoken", SystemControllers.startNewSession);
router.post("/init", SystemControllers.systemInit);


export default router;
