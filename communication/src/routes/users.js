import * as UserController from "../controllers/user_controllers"
import express from "express";

const router = express.Router();

router.post("/register", UserController.register);
router.post("/login", UserController.login);
router.post("/logout", UserController.logout);
router.get("/", (req, res) => res.send('users!'));
router.get("/:userName", (req, res) => res.send('specific user!!'));


export default router;
