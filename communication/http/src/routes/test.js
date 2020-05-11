import express from "express";
import * as TestControllers from "../controllers/test_controllers"

const router = express.Router();

router.post("/test1", TestControllers.test1);       // test notifications
router.post("/test2", TestControllers.test2);
router.post("/test3", TestControllers.test3);       // add 10 stores


export default router;
