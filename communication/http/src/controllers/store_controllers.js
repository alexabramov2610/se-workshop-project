import {ServiceFacade} from "service_layer"
import {invalidRes, wrapHttp} from "./http_request_wrapper";

/*
curl --header "Content-Type: application/json" --request POST --data '{"body": {"username": "tnewusername", "password": "newuser"}, "token": "a8658714-a66b-45c7-9c40-cc9bb6f188dd"}'   http://localhost:4000/users/register
 */


export async function search(req, res) {
    const result = await wrapHttp(req, ServiceFacade.search);
    return res.send(result)
}

export async function purchase(req, res) {
    const result = await wrapHttp(req, ServiceFacade.purchase);
    return res.send(result)
}

export async function createStore(req, res) {
    const result = await wrapHttp(req, ServiceFacade.createStore);
    return res.send(result)
}

export async function changeProductName(req, res) {
    const result = await wrapHttp(req, ServiceFacade.changeProductName);
    return res.send(result)
}

export async function changeProductPrice(req, res) {
    const result = await wrapHttp(req, ServiceFacade.changeProductPrice);
    return res.send(result)
}

export async function addItems(req, res) {
    const result = await wrapHttp(req, ServiceFacade.addItems);
    return res.send(result)
}

export async function removeItems(req, res) {
    const result = await wrapHttp(req, ServiceFacade.removeItems);
    return res.send(result)
}

export async function removeProductsWithQuantity(req, res) {
    const result = await wrapHttp(req, ServiceFacade.removeProductsWithQuantity);
    return res.send(result)
}

export async function addNewProducts(req, res) {
    const result = await wrapHttp(req, ServiceFacade.addNewProducts);
    return res.send(result)
}

export async function removeProducts(req, res) {
    const result = await wrapHttp(req, ServiceFacade.removeProducts);
    return res.send(result)
}

export async function setDiscountsPolicy(req, res) {
    const result = await wrapHttp(req, ServiceFacade.setDiscountsPolicy);
    return res.send(result)
}

export async function addDiscount(req, res) {
    const result = await wrapHttp(req, ServiceFacade.addDiscount);
    return res.send(result)
}

export async function removeProductDiscount(req, res) {
    const result = await wrapHttp(req, ServiceFacade.removeProductDiscount);
    return res.send(result)
}

export async function assignStoreOwner(req, res) {
    const result = await wrapHttp(req, ServiceFacade.assignStoreOwner);
    return res.send(result)
}
export async function approveStoreOwner(req, res) {
    const result = await wrapHttp(req, ServiceFacade.approveStoreOwner);
    return res.send(result)
}

export async function removeStoreOwner(req, res) {
    const result = await wrapHttp(req, ServiceFacade.removeStoreOwner);
    return res.send(result)
}

export async function assignStoreManager(req, res) {
    const result = await wrapHttp(req, ServiceFacade.assignStoreManager);
    return res.send(result)
}

export async function addManagerPermissions(req, res) {
    const result = await wrapHttp(req, ServiceFacade.addManagerPermissions);
    return res.send(result)
}

export async function addMultipleManagersPermissions(req, res) {
    const result = await wrapHttp(req, ServiceFacade.addMultipleManagersPermissions);
    return res.send(result)
}

export async function removeManagerPermissions(req, res) {
    const result = await wrapHttp(req, ServiceFacade.removeManagerPermissions);
    return res.send(result)
}

export async function viewManagerPermissions(req, res) {
    const result = await wrapHttp(req, ServiceFacade.viewManagerPermissions);
    return res.send(result)
}

export async function removeStoreManager(req, res) {
    const result = await wrapHttp(req, ServiceFacade.removeStoreManager);
    return res.send(result)
}

export async function viewUsersContactUsMessages(req, res) {
    const result = await wrapHttp(req, ServiceFacade.viewUsersContactUsMessages);
    return res.send(result)
}

export async function viewStorePurchasesHistory(req, res) {
    try {
        const request = {body: {storeName: req.query.storeName}, token: req.cookies['token']};
        req.body = request;
        const result = await wrapHttp(req, ServiceFacade.viewStorePurchasesHistory);
        return res.send(result);
    } catch (err) {
        return res.send(invalidRes);
    }
}

export async function setPurchasePolicy(req, res) {
    const result = await wrapHttp(req, ServiceFacade.setPurchasePolicy);
    return res.send(result)
}


// get

export async function getDiscountsPolicy(req, res) {
    try {
        const getDiscountsPolicyReq = {body: {storeName: req.query.storeName}, token: req.cookies['token']};
        req.body = getDiscountsPolicyReq;
        const result = await wrapHttp(req, ServiceFacade.viewDiscountsPolicy);
        return res.send(result);
    } catch (err) {
        return res.send(invalidRes);
    }
}
// get

export async function getPurchasePolicy(req, res) {
    try {
        const getPurchasePolicyReq = {body: {storeName: req.query.storeName}, token: req.cookies['token']};
        req.body = getPurchasePolicyReq;
        const result = await wrapHttp(req, ServiceFacade.viewPurchasePolicy);
        return res.send(result);
    } catch (err) {
        return res.send(invalidRes);
    }
}
export async function getManagerPermissions(req, res) {
    try {
        const getStoresWithLimitReq = {
            body: {managerToView: "", storeName: req.query.storeName},
            token: req.cookies['token']
        };
        req.body = getStoresWithLimitReq;
        const result = await wrapHttp(req, ServiceFacade.getManagerPermissions);
        return res.send(result);
    } catch (err) {
        return res.send(invalidRes);
    }
}

export async function getStoresWithLimit(req, res) {
    try {
        const getStoresWithLimitReq = {
            body: {offset: req.query.offset, limit: req.query.limit},
            token: req.cookies['token']
        };
        req.body = getStoresWithLimitReq;
        const result = await wrapHttp(req, ServiceFacade.getStoresWithOffset);
        // console.log('ressss : ' +JSON.stringify(result));
        return res.send(result);
    } catch (err) {
        return res.send(invalidRes);
    }
}

export async function getAllProductsInStore(req, res) {
    try {
        const getAllProductsReq = {body: {storeName: req.query.storeName}};
        req.body = getAllProductsReq;
        const result = await wrapHttp(req, ServiceFacade.getAllProductsInStore);
        return res.send(result);
    } catch (err) {
        return res.send(invalidRes);
    }
}

export async function getAllCategoriesInStore(req, res) {
    try {
        const getAllCategoriesReq = {body: {storeName: req.query.storeName}};
        req.body = getAllCategoriesReq;
        const result = await wrapHttp(req, ServiceFacade.getAllCategoriesInStore);
        return res.send(result);
    } catch (err) {
        return res.send(invalidRes);
    }
}

export async function getAllCategories(req, res) {
    const result = await wrapHttp(req, ServiceFacade.getAllCategories);
    return res.send(result);
}

export async function viewStoreInfo(req, res) {
    try {
        const getAllCategoriesReq = {body: {storeName: req.query.storeName}};
        req.body = getAllCategoriesReq;
        const result = await wrapHttp(req, ServiceFacade.viewStoreInfo);
        return res.send(result);
    } catch (err) {
        return res.send(invalidRes);
    }
}

export async function viewProductInfo(req, res) {
    try {
        const viewProductInfoReq = {body: {storeName: req.query.storeName, catalogNumber: +req.query.catalogNumber}};
        req.body = viewProductInfoReq;
        const result = await wrapHttp(req, ServiceFacade.viewProductInfo);
        return res.send(result);
    } catch (err) {
        return res.send(invalidRes);
    }
}

export async function getManagersPermissions(req, res) {
    try {
        const viewProductInfoReq = {body: {storeName: req.query.storeName}};
        req.body = viewProductInfoReq;
        const result = await wrapHttp(req, ServiceFacade.getManagersPermissions);
        return res.send(result);
    } catch (err) {
        return res.send(invalidRes);
    }
}

export async function getOwnersAssignedBy(req, res) {
    try {
        const viewProductInfoReq = {body: {storeName: req.query.storeName}};
        req.body = viewProductInfoReq;
        const result = await wrapHttp(req, ServiceFacade.getOwnersAssignedBy);
        return res.send(result);
    } catch (err) {
        return res.send(invalidRes);
    }
}

export async function getItemIds(req, res) {
    try {
        const getStoresWithLimitReq = {
            body: {storeName: req.query.storeName, product: req.query.product},
            token: req.cookies['token']
        };
        req.body = getStoresWithLimitReq;
        const result = await wrapHttp(req, ServiceFacade.getItemIds);
        // console.log('ressss : ' +JSON.stringify(result));
        return res.send(result);
    } catch (err) {
        return res.send(invalidRes);
    }


}

export async function getStoresNames(req, res) {
    try {
        const getStoresWithLimitReq = {
            body: {prefix: req.query.prefix, limit: req.query.limit},
        };
        req.body = getStoresWithLimitReq;
        const result = await wrapHttp(req, ServiceFacade.getStoresNames);
        // console.log('ressss : ' +JSON.stringify(result));
        return res.send(result);
    } catch (err) {
        return res.send(invalidRes);
    }
}

export async function getProductsNames(req, res) {
    try {
        const getProductssWithLimitReq = {
            body: {prefix: req.query.prefix, limit: req.query.limit},
            token: req.cookies['token']
        };
        req.body = getProductssWithLimitReq;
        const result = await wrapHttp(req, ServiceFacade.getProductsNames);
        // console.log('ressss : ' +JSON.stringify(result));
        return res.send(result);
    } catch (err) {
        return res.send(invalidRes);
    }

}