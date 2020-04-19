import * as Req from "domain_layer/dist/src/api-ext/Request";
import * as Res from "domain_layer/dist/src/api-ext/Response";
import {TradingSystemManager as TS} from "domain_layer/dist/src/trading_system/TradingSystemManager";

export const createStore = (createStoreReq: Req.OpenStoreRequest, ts: TS): Res.BoolResponse => {
    return ts.createStore(createStoreReq);

}

export const addItems = (req: Req.ItemsAdditionRequest, ts: TS): Res.ItemsAdditionResponse => {
    return ts.addItems(req);
}

export const viewStoreInfo = (req: Req.StoreInfoRequest, ts: TS): Res.StoreInfoResponse => {
    return ts.viewStoreInfo(req);
}

export const changeProductName = (req: Req.ChangeProductNameRequest,ts: TS): Res.ChangeProductNameResponse => {
   return ts.changeProductName(req);
}

export const changeProductPrice = (req: Req.ChangeProductPriceRequest,ts: TS): Res.ChangeProductPriceResponse => {
   return ts.changeProductPrice(req);
}

export const removeItems = (req: Req.ItemsRemovalRequest, ts: TS): Res.ItemsRemovalResponse => {
    return ts.removeItems(req);
}

export const removeProductsWithQuantity = (req: Req.RemoveProductsWithQuantity, ts: TS): Res.ProductRemovalResponse => {
    return ts.removeProductsWithQuantity(req);
}

export const addNewProducts = (req: Req.AddProductsRequest, ts: TS): Res.ProductAdditionResponse => {
    return ts.addNewProducts(req);
}
export const viewProductInfo = (req:Req.ProductInfoRequest, ts: TS):Res.BoolResponse => {
    return ts.viewProductInfo(req);
}

export const removeProducts = (req: Req.ProductRemovalRequest, ts: TS): Res.ProductRemovalResponse => {
    return ts.removeProducts(req);
}

export const assignStoreOwner = (req: Req.AssignStoreOwnerRequest, ts: TS): Res.BoolResponse => {
    return ts.assignStoreOwner(req);
}

export const assignStoreManager = (req: Req.AssignStoreManagerRequest, ts: TS): Res.BoolResponse => {
    return ts.assignStoreManager(req);
}

export const removeStoreManager = (req: Req.RemoveStoreManagerRequest, ts: TS): Res.BoolResponse => {
    return ts.removeStoreManager(req);
}

export const removeStoreOwner = (req: Req.RemoveStoreOwnerRequest, ts: TS): Res.BoolResponse => {
    return ts.removeStoreOwner(req);
}

export const viewStorePurchasesHistory = (req: Req.ViewShopPurchasesHistoryRequest, ts: TS): Res.ViewShopPurchasesHistoryResponse => {
    return ts.viewStorePurchasesHistory(req);
}

export const removeManagerPermissions = (req: Req.ChangeManagerPermissionRequest, ts: TS) : Res.BoolResponse => {
    return ts.removeManagerPermissions(req);
}

export const addManagerPermissions = (req: Req.ChangeManagerPermissionRequest, ts: TS) : Res.BoolResponse => {
    return ts.addManagerPermissions(req);
}

export const viewUsersContactUsMessages = (req: Req.ViewUsersContactUsMessagesRequest, ts: TS): Res.ViewUsersContactUsMessagesResponse => {
    return ts.viewUsersContactUsMessages(req);
}