import express from "express";
import * as PurchaseController from "../controllers/purchase_controllers";

const router = express.Router();


router.post("/viewStoreInfo", PurchaseController.pay);
router.post("/viewStoreInfo", PurchaseController.deliver);


router.get("/", (req, res) => res.send('Hello World!'));
router.get("/:storeName", (req, res) => res.send('Hello World!'));

export default router;
