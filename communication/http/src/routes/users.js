import * as UserController from "../controllers/user_controllers"
import express from "express";

const router = express.Router();

router.post("/register", UserController.register);
router.post("/login", UserController.login);
router.post("/logout", UserController.logout);
router.post("/saveProduct", UserController.saveProductToCart);
router.post("/removeProduct", UserController.removeProductFromCart);
router.post("/viewCart", UserController.viewCart);
router.post("/viewRegisteredUserPurchasesHistory", UserController.viewRegisteredUserPurchasesHistory);


router.get("/", (req, res) => res.send('users!'));
router.get("/:userName", (req, res) => res.send('specific user!!'));


export default router;
