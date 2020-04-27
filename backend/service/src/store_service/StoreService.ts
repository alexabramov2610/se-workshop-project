import { Res, Req } from "se-workshop-20-interfaces"
import {tradingSystem as ts} from "../service_facade/ServiceFacade";

export const createStore = (req: Req.OpenStoreRequest
): Res.BoolResponse => {
    const verifyStoreReq: Req.VerifyStoreName = {body: {storeName: req.body.storeName}, token: req.token}
    const verifyStoreRes: Res.BoolResponse = ts.verifyNewStore(verifyStoreReq);
    if (!verifyStoreRes.data.result) return verifyStoreRes
    return ts.createStore(req);
}

export const addItems = (req: Req.ItemsAdditionRequest
): Res.ItemsAdditionResponse => {
    return ts.addItems(req);
}

export const viewStoreInfo = (req: Req.StoreInfoRequest
): Res.StoreInfoResponse => {
    return ts.viewStoreInfo(req);
}

export const changeProductName = (req: Req.ChangeProductNameRequest
): Res.BoolResponse => {
    return ts.changeProductName(req);
}

export const changeProductPrice = (req: Req.ChangeProductPriceRequest
): Res.BoolResponse => {
    return ts.changeProductPrice(req);
}

export const removeItems = (req: Req.ItemsRemovalRequest
): Res.ItemsRemovalResponse => {
    return ts.removeItems(req);
}

export const removeProductsWithQuantity = (req: Req.RemoveProductsWithQuantity
): Res.ProductRemovalResponse => {
    return ts.removeProductsWithQuantity(req);
}

export const addNewProducts = (req: Req.AddProductsRequest
): Res.ProductAdditionResponse => {
    return ts.addNewProducts(req);
}

export const viewProductInfo = (req: Req.ProductInfoRequest
): Res.ProductInfoResponse => {
    return ts.viewProductInfo(req);
}

export const removeProducts = (req: Req.ProductRemovalRequest
): Res.ProductRemovalResponse => {
    return ts.removeProducts(req);
}

export const assignStoreOwner = (req: Req.AssignStoreOwnerRequest
): Res.BoolResponse => {
    return ts.assignStoreOwner(req);
}

export const removeStoreOwner = (req: Req.RemoveStoreOwnerRequest
): Res.BoolResponse => {
    return ts.removeStoreOwner(req);
}

export const assignStoreManager = (req: Req.AssignStoreManagerRequest
): Res.BoolResponse => {
    return ts.assignStoreManager(req);
}

export const removeStoreManager = (req: Req.RemoveStoreManagerRequest
): Res.BoolResponse => {
    return ts.removeStoreManager(req);
}

export const viewStorePurchasesHistory = (req: Req.ViewShopPurchasesHistoryRequest
): Res.ViewShopPurchasesHistoryResponse => {
    return ts.viewStorePurchasesHistory(req);
}

export const removeManagerPermissions = (req: Req.ChangeManagerPermissionRequest
): Res.BoolResponse => {
    return ts.removeManagerPermissions(req);
}

export const addManagerPermissions = (req: Req.ChangeManagerPermissionRequest
): Res.BoolResponse => {
    return ts.addManagerPermissions(req);
}
export const viewManagerPermissions = (req: Req.ViewManagerPermissionRequest
): Res.ViewManagerPermissionResponse => {
    return ts.viewManagerPermissions(req);
}

export const search = (req: Req.SearchRequest
): Res.SearchResponse => {
    return ts.search(req);
}

export const viewUsersContactUsMessages = (req: Req.ViewUsersContactUsMessagesRequest
): Res.ViewUsersContactUsMessagesResponse => {
    return ts.viewUsersContactUsMessages(req);
}

export const addProductDiscount = (req: Req.AddDiscountRequest
): Res.AddDiscountResponse => {
    return ts.addProductDiscount(req)
}
export const removeProductDiscount = (req: Req.RemoveDiscountRequest
): Res.BoolResponse => {
    return ts.removeProductDiscount(req)
}

export const setPurchasePolicy = (req: Req.SetPurchasePolicyRequest
): Res.BoolResponse => {
    return ts.setPurchasePolicy(req);
}

export const setDiscountsPolicy = (req: Req.SetDiscountsPolicyRequest
): Res.BoolResponse => {
    return ts.setDiscountsPolicy(req);
}
