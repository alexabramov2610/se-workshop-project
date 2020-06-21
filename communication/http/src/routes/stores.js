import express from "express";
import * as StoreController from "../controllers/store_controllers";

const router = express.Router();

router.post("/search", StoreController.search);
router.post("/purchase", StoreController.purchase);
router.post("/createStore", StoreController.createStore);
router.post("/changeProductName", StoreController.changeProductName);
router.post("/changeProductPrice", StoreController.changeProductPrice);
router.post("/addItems", StoreController.addItems);
router.post("/removeItems", StoreController.removeItems);
router.post("/removeProductsWithQuantity", StoreController.removeProductsWithQuantity);
router.post("/addNewProducts", StoreController.addNewProducts);
router.post("/removeProducts", StoreController.removeProducts);
router.post("/setDiscountsPolicy", StoreController.setDiscountsPolicy);
router.post("/addDiscount", StoreController.addDiscount);
router.post("/removeProductDiscount", StoreController.removeProductDiscount);
router.post("/assignStoreOwner", StoreController.assignStoreOwner);
router.post("/approveStoreOwner", StoreController.approveStoreOwner);

router.post("/removeStoreOwner", StoreController.removeStoreOwner);
router.post("/assignStoreManager", StoreController.assignStoreManager);
router.post("/addManagerPermissions", StoreController.addManagerPermissions);
router.post("/updateManagersPermissions", StoreController.addMultipleManagersPermissions);
router.post("/removeManagerPermissions", StoreController.removeManagerPermissions);
router.post("/viewManagerPermissions", StoreController.viewManagerPermissions);
router.post("/removeStoreManager", StoreController.removeStoreManager);
router.post("/viewUsersContactUsMessages", StoreController.viewUsersContactUsMessages);
router.post("/setPurchasePolicy", StoreController.setPurchasePolicy);

router.get("/viewStorePurchasesHistory", StoreController.viewStorePurchasesHistory); // usage: stores/viewStorePurchasesHistory/?storeName=shufersal
router.get("/viewProductInfo", StoreController.viewProductInfo);// usage: stores/viewProductInfo/?storeName=store&catalogNumber=123
router.get("/", (req, res) => res.send('Hello World! -> /'));
router.get("/getStores/", StoreController.getStoresWithLimit);      // usage: stores/getStores/?offset=2&limit=3
router.get("/getProducts/", StoreController.getAllProductsInStore);      // usage: stores/getProducts/?storeName=shufersal
router.get("/getCategories/", StoreController.getAllCategoriesInStore);      // usage: stores/getCategories/?storeName=shufersal
router.get("/getAllCategories/", StoreController.getAllCategories);      // usage: stores/getAllCategories
router.get("/getManagerPermissions/", StoreController.getManagerPermissions);       //usage: stores/getManagerPermissions/?storeName=shufersal
router.get("/getDiscountsPolicy", StoreController.getDiscountsPolicy);              //usage: stores/getDiscountsPolicy/?storeName=shufersal
router.get("/getStoreInfo", StoreController.viewStoreInfo);                        //usage: stores/getStoreInfo/?storeName=shufersal
router.get("/getManagersPermissions", StoreController.getManagersPermissions);                        //usage: stores/getStoreInfo/?storeName=shufersal
router.get("/getOwnersAssignedBy", StoreController.getOwnersAssignedBy);                        //usage: stores/getOwnersAssignedBy/?storeName=shufersal
router.get("/getPurchasePolicy", StoreController.getPurchasePolicy);              //usage: stores/getPurchasePolicy/?storeName=shufersal
router.get("/getItemIds/", StoreController.getItemIds);      // usage: stores/getItemIds/?storeName=alibaba&product=3
router.get("/getStoresNames/", StoreController.getStoresNames);      // usage: stores/getStoresNames/?storeName=alibaba&limit=3
router.get("/getProductsNames/", StoreController.getProductsNames);      // usage: stores/getProductsNames/?storeName=alibaba&limit=3
export default router;
