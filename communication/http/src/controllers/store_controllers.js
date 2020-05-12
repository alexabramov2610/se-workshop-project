import {ServiceFacade} from "service_layer"
import {invalidRes, wrapHttp} from "./http_request_wrapper";

/*
curl --header "Content-Type: application/json" --request POST --data '{"body": {"username": "tnewusername", "password": "newuser"}, "token": "a8658714-a66b-45c7-9c40-cc9bb6f188dd"}'   http://localhost:4000/users/register
 */
export async function viewStoreInfo(req,res) {
    const result = wrapHttp(req, ServiceFacade.viewStoreInfo);
    return res.send(result)
}

export async function viewProductInfo(req,res) {
    const result = wrapHttp(req, ServiceFacade.viewProductInfo);
    return res.send(result)
}

export async function search(req,res) {
    const result = wrapHttp(req, ServiceFacade.search);
    return res.send(result)
}

export async function purchase(req,res) {
    const result = wrapHttp(req, ServiceFacade.purchase);
    return res.send(result)
}

export async function createStore(req,res) {
    const result = wrapHttp(req, ServiceFacade.createStore);
    return res.send(result)
}

export async function changeProductName(req,res) {
    const result = wrapHttp(req, ServiceFacade.changeProductName);
    return res.send(result)
}

export async function changeProductPrice(req,res) {
    const result = wrapHttp(req, ServiceFacade.changeProductPrice);
    return res.send(result)
}

export async function addItems(req,res) {
    const result = wrapHttp(req, ServiceFacade.addItems);
    return res.send(result)
}

export async function removeItems(req,res) {
    const result = wrapHttp(req, ServiceFacade.removeItems);
    return res.send(result)
}

export async function removeProductsWithQuantity(req,res) {
    const result = wrapHttp(req, ServiceFacade.removeProductsWithQuantity);
    return res.send(result)
}

export async function addNewProducts(req,res) {
    const result = wrapHttp(req, ServiceFacade.addNewProducts);
    return res.send(result)
}

export async function removeProducts(req,res) {
    const result = wrapHttp(req, ServiceFacade.removeProducts);
    return res.send(result)
}

export async function setDiscountsPolicy(req,res) {
    const result = wrapHttp(req, ServiceFacade.setDiscountsPolicy);
    return res.send(result)
}

export async function addDiscount(req,res) {
    const result = wrapHttp(req, ServiceFacade.addDiscount);
    return res.send(result)
}

export async function removeProductDiscount(req,res) {
    const result = wrapHttp(req, ServiceFacade.removeProductDiscount);
    return res.send(result)
}

export async function assignStoreOwner(req,res) {
    const result = wrapHttp(req, ServiceFacade.assignStoreOwner);
    return res.send(result)
}

export async function removeStoreOwner(req,res) {
    const result = wrapHttp(req, ServiceFacade.removeStoreOwner);
    return res.send(result)
}

export async function assignStoreManager(req,res) {
    const result = wrapHttp(req, ServiceFacade.assignStoreManager);
    return res.send(result)
}

export async function addManagerPermissions(req,res) {
    const result = wrapHttp(req, ServiceFacade.addManagerPermissions);
    return res.send(result)
}

export async function removeManagerPermissions(req,res) {
    const result = wrapHttp(req, ServiceFacade.removeManagerPermissions);
    return res.send(result)
}

export async function viewManagerPermissions(req,res) {
    const result = wrapHttp(req, ServiceFacade.viewManagerPermissions);
    return res.send(result)
}

export async function removeStoreManager(req,res) {
    const result = wrapHttp(req, ServiceFacade.removeStoreManager);
    return res.send(result)
}

export async function viewUsersContactUsMessages(req,res) {
    const result = wrapHttp(req, ServiceFacade.viewUsersContactUsMessages);
    return res.send(result)
}

export async function viewStorePurchasesHistory(req,res) {
    const result = wrapHttp(req, ServiceFacade.viewStorePurchasesHistory);
    return res.send(result)
}

export async function setPurchasePolicy(req,res) {
    const result = wrapHttp(req, ServiceFacade.setPurchasePolicy);
    return res.send(result)
}

export async function getStoresWithLimit(req, res) {
    try {
        const getStoresWithLimitReq = { body: { offset: req.query.offset, limit: req.query.limit }, token: req.cookies['token']};
        req.body = getStoresWithLimitReq;
        const result = wrapHttp(req, ServiceFacade.getStoresWithOffset);
        // console.log('ressss : ' +JSON.stringify(result));
        return res.send(result);
    } catch (err) {
        return res.send(invalidRes);
    }
}

export async function getAllProductsInStore(req, res) {
    try {
        const getAllProductsReq = { body: { storeName: req.query.storeName } };
        req.body = getAllProductsReq;
        const result = wrapHttp(req, ServiceFacade.getAllProductsInStore);
        return res.send(result);
    } catch (err) {
        return res.send(invalidRes);
    }
}

export async function getAllCategoriesInStore(req, res) {
    try {
        const getAllCategoriesReq = { body: { storeName: req.query.storeName } };
        req.body = getAllCategoriesReq;
        const result = wrapHttp(req, ServiceFacade.getAllCategoriesInStore);
        return res.send(result);
    } catch (err) {
        return res.send(invalidRes);
    }
}