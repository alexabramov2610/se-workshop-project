import express from "express";
import * as TestControllers from "../controllers/test_controllers"

const router = express.Router();

router.post("/test1", TestControllers.test1);       // test notifications
router.post("/test2", TestControllers.test2);
router.post("/test3", TestControllers.test3);       // add 10 stores
router.post("/test4", TestControllers.test4);       // add 10 stores
router.post("/test5", TestControllers.test5);       // 3 buyers - for notifications - need to run test1 before


export default router;
