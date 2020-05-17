import * as UserController from "../controllers/user_controllers"
import express from "express";

const router = express.Router();

router.post("/register", UserController.register);
router.post("/login", UserController.login);
router.post("/logout", UserController.logout);
router.post("/saveProduct", UserController.saveProductToCart);
router.post("/removeProduct", UserController.removeProductFromCart);
router.post("/viewRegisteredUserPurchasesHistory", UserController.viewRegisteredUserPurchasesHistory);


router.get("/viewCart", UserController.viewCart);


export default router;
