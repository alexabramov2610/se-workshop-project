import * as Req from "domain_layer/dist/src/api-ext/Request";
import * as Res from "domain_layer/dist/src/api-ext/Response";
import {TradingSystemManager} from "domain_layer/dist/src/trading_system/TradingSystemManager";
export const createStore = (createStoreReq: Req.OpenStoreRequest,ts:TradingSystemManager): Res.BoolResponse => {
    return ts.createStore(createStoreReq);

}

export const addItems = (req: Req.ItemsAdditionRequest,ts:TradingSystemManager): Res.ItemsAdditionResponse => {
    return ts.addItems(req);
}

export const viewStoreInfo = (req: Req.StoreInfoRequest,ts:TradingSystemManager): Res.StoreInfoResponse => {
    return ts.viewStoreInfo(req);
}

export const removeItems = (req: Req.ItemsRemovalRequest,ts:TradingSystemManager): Res.ItemsRemovalResponse => {
    return ts.removeItems(req);
}

export const removeProductsWithQuantity = (req: Req.RemoveProductsWithQuantity,ts:TradingSystemManager): Res.ProductRemovalResponse => {
    return ts.removeProductsWithQuantity(req);
}

export const addNewProducts = (req: Req.AddProductsRequest,ts:TradingSystemManager): Res.ProductAdditionResponse => {
    return ts.addNewProducts(req);
}

export const removeProducts = (req: Req.ProductRemovalRequest,ts:TradingSystemManager): Res.ProductRemovalResponse => {
    return ts.removeProducts(req);
}

export const assignStoreOwner = (req: Req.AssignStoreOwnerRequest,ts:TradingSystemManager): Res.BoolResponse => {
    return ts.assignStoreOwner(req);
}

export const assignStoreManager = (req: Req.AssignStoreManagerRequest,ts:TradingSystemManager): Res.BoolResponse => {
    return ts.assignStoreManager(req);
}

export const removeStoreManager = (req: Req.RemoveStoreManagerRequest,ts:TradingSystemManager): Res.BoolResponse => {
    return ts.removeStoreManager(req);
}

export const removeStoreOwner = (req: Req.RemoveStoreOwnerRequest,ts:TradingSystemManager): Res.BoolResponse => {
    return ts.removeStoreOwner(req);
}