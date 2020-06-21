import express from "express";
import * as SystemControllers from "../controllers/system_controllers"

const router = express.Router();

router.post("/init", SystemControllers.systemInit);
router.post("/setPaymentSystem/", SystemControllers.setPaymentSystem);
router.post("/setDeliverySystem/", SystemControllers.setDeliverySystem);

router.get("/initFile", SystemControllers.initFromFile);
router.get("/status", SystemControllers.isLoggedIn);
router.get("/healthcheck", SystemControllers.getIsSystemUp);
router.get("/newtoken", SystemControllers.startNewSession);    // usage: stores/newtoken
router.get("/getStatistics/", SystemControllers.getVisitorsStatistics);      // usage: stores/getStatistics/?from=DATE&to=DATE
router.get("/stopStatistics/", SystemControllers.stopVisitorsStatistics);      // usage: stores/getStatistics/?from=DATE&to=DATE

export default router;
