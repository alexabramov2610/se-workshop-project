import * as UserController from "../controllers/user_controllers"
import express from "express";

const router = express.Router();

router.get("/", (req, res) => res.send('users!'));
router.post("/register", UserController.register);
router.get("/:userName", (req, res) => res.send('specific user!!'));


export default router;
