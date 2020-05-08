import express from "express";
import * as PurchaseController from "../controllers/purchase_controllers";

const router = express.Router();


router.post("/pay", PurchaseController.pay);
router.post("/deliver", PurchaseController.deliver);

export default router;
