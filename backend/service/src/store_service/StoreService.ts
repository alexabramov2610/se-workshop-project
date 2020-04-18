import {getInstance, CreateInstance} from "domain_layer/dist/src/api-ext/external_api";
import * as Req from "domain_layer/dist/src/api-ext/Request";
import * as Res from "domain_layer/dist/src/api-ext/Response";

let tradingSystem = getInstance();
export const createStore = (createStoreReq: Req.OpenStoreRequest): Res.BoolResponse => {
    return tradingSystem.createStore(createStoreReq);

}

export const addItems = (req: Req.ItemsAdditionRequest): Res.ItemsAdditionResponse => {
    return tradingSystem.addItems(req);
}

export const viewStoreInfo = (req: Req.StoreInfoRequest): Res.StoreInfoResponse => {
    return tradingSystem.viewStoreInfo(req);
}

export const removeItems = (req: Req.ItemsRemovalRequest): Res.ItemsRemovalResponse => {
    return tradingSystem.removeItems(req);
}

export const removeProductsWithQuantity = (req: Req.RemoveProductsWithQuantity): Res.ProductRemovalResponse => {
    return tradingSystem.removeProductsWithQuantity(req);
}

export const addNewProducts = (req: Req.AddProductsRequest): Res.ProductAdditionResponse => {
    return tradingSystem.addNewProducts(req);
}

export const removeProducts = (req: Req.ProductRemovalRequest): Res.ProductRemovalResponse => {
    return tradingSystem.removeProducts(req);
}

export const assignStoreOwner = (req: Req.AssignStoreOwnerRequest): Res.BoolResponse => {
    return tradingSystem.assignStoreOwner(req);
}

export const assignStoreManager = (req: Req.AssignStoreManagerRequest): Res.BoolResponse => {
    return tradingSystem.assignStoreManager(req);
}

export const removeStoreManager = (req: Req.RemoveStoreManagerRequest): Res.BoolResponse => {
    return tradingSystem.removeStoreManager(req);
}

export const removeManagerPermissions = (req: Req.ChangeManagerPermissionRequest) : Res.BoolResponse => {
    return tradingSystem.removeManagerPermissions(req);
}

export const addManagerPermissions = (req: Req.ChangeManagerPermissionRequest) : Res.BoolResponse => {
    return tradingSystem.addManagerPermissions(req);
}

export const removeStoreOwner = (req: Req.RemoveStoreOwnerRequest): Res.BoolResponse => {
    return tradingSystem.removeStoreOwner(req);
}