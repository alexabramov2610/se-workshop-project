import express from "express";
import * as TestControllers from "../controllers/test_controllers"

const router = express.Router();

router.post("/test1", TestControllers.test1);
router.post("/test2", TestControllers.test2);


export default router;
