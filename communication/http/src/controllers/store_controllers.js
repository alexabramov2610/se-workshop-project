import {ServiceFacade} from "service_layer"
import {invalidRes, wrapHttp} from "./http_request_wrapper";

/*
curl --header "Content-Type: application/json" --request POST --data '{"body": {"username": "tnewusername", "password": "newuser"}, "token": "a8658714-a66b-45c7-9c40-cc9bb6f188dd"}'   http://localhost:4000/users/register
 */
export async function viewStoreInfo(req,res) {
    const result = ServiceFacade.viewStoreInfo(req.body);
    return res.send(result)
}

export async function viewProductInfo(req,res) {
    const result = ServiceFacade.viewProductInfo(req.body);
    return res.send(result)
}

export async function search(req,res) {
    const result = ServiceFacade.search(req.body);
    return res.send(result)
}

export async function purchase(req,res) {
    const result = ServiceFacade.purchase(req.body);
    return res.send(result)
}

export async function createStore(req,res) {
    const result = ServiceFacade.createStore(req.body);
    return res.send(result)
}

export async function changeProductName(req,res) {
    const result = ServiceFacade.changeProductName(req.body);
    return res.send(result)
}

export async function changeProductPrice(req,res) {
    const result = ServiceFacade.changeProductPrice(req.body);
    return res.send(result)
}

export async function addItems(req,res) {
    const result = ServiceFacade.addItems(req.body);
    return res.send(result)
}

export async function removeItems(req,res) {
    const result = ServiceFacade.removeItems(req.body);
    return res.send(result)
}

export async function removeProductsWithQuantity(req,res) {
    const result = ServiceFacade.removeProductsWithQuantity(req.body);
    return res.send(result)
}

export async function addNewProducts(req,res) {
    const result = ServiceFacade.addNewProducts(req.body);
    return res.send(result)
}

export async function removeProducts(req,res) {
    const result = ServiceFacade.removeProducts(req.body);
    return res.send(result)
}

export async function setDiscountsPolicy(req,res) {
    const result = ServiceFacade.setDiscountsPolicy(req.body);
    return res.send(result)
}

export async function addDiscount(req,res) {
    const result = ServiceFacade.addDiscount(req.body);
    return res.send(result)
}

export async function removeProductDiscount(req,res) {
    const result = ServiceFacade.removeProductDiscount(req.body);
    return res.send(result)
}

export async function assignStoreOwner(req,res) {
    const result = ServiceFacade.assignStoreOwner(req.body);
    return res.send(result)
}

export async function removeStoreOwner(req,res) {
    const result = ServiceFacade.removeStoreOwner(req.body);
    return res.send(result)
}

export async function assignStoreManager(req,res) {
    const result = ServiceFacade.assignStoreManager(req.body);
    return res.send(result)
}

export async function addManagerPermissions(req,res) {
    const result = ServiceFacade.addManagerPermissions(req.body);
    return res.send(result)
}

export async function removeManagerPermissions(req,res) {
    const result = wrapHttp(req.body, ServiceFacade.removeManagerPermissions);
    return res.send(result)
}

export async function viewManagerPermissions(req,res) {
    const result = wrapHttp(req.body, ServiceFacade.viewManagerPermissions);
    return res.send(result)
}

export async function removeStoreManager(req,res) {
    const result = wrapHttp(req.body, ServiceFacade.removeStoreManager);
    return res.send(result)
}

export async function viewUsersContactUsMessages(req,res) {
    const result = wrapHttp(req.body, ServiceFacade.viewUsersContactUsMessages);
    return res.send(result)
}

export async function viewStorePurchasesHistory(req,res) {
    const result = wrapHttp(req.body, ServiceFacade.viewStorePurchasesHistory);
    return res.send(result)
}

export async function setPurchasePolicy(req,res) {
    const result = wrapHttp(req.body, ServiceFacade.setPurchasePolicy);
    return res.send(result)
}

export async function getStoresWithLimit(req, res) {
    try {
        const getStoresWithLimitReq = { body: { offset: req.query.offset, limit: req.query.limit } };
        const result = wrapHttp(getStoresWithLimitReq, ServiceFacade.getStoresWithOffset);
        return res.send(result);
    } catch (err) {
        return res.send(invalidRes);
    }
}