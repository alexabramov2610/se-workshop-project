import {tradingSystem} from "domain_layer/src/api-ext/external_api";
import * as UserService from '../user_service/UserService'
import * as StoreService from '../store_service/StoreService'
import * as Req from "domain_layer/dist/src/api-ext/Request";
import * as Res from "domain_layer/dist/src/api-ext/Response";
import {logger} from "domain_layer/dist/src/api-int/Logger";

export const systemInit = ():boolean=>{
    let res:boolean = true;
    res = res && !tradingSystem.connectDeliverySys().error;
    res = res && !tradingSystem.connectPaymentSys().error;
    const hasAdmin:boolean = tradingSystem.getUserByName("Admin") != undefined
    return hasAdmin? res : res && !tradingSystem.register("Admin","Admin").error
}

export const createStore = (storeName: string, requestor: string):boolean => {
    return StoreService.createStore(storeName, requestor);
}

export const addItems = (req: Req.ItemsAdditionRequest) : Res.ItemsAdditionResponse => {
    return StoreService.addItems(req);
}

export const removeItems = (req: Req.ItemsRemovalRequest) : Res.ItemsRemovalResponse => {
    return StoreService.removeItems(req);
}

export const removeProductsWithQuantity = (req: Req.RemoveProductsWithQuantity) : Res.ProductRemovalResponse => {
    return StoreService.removeProductsWithQuantity(req);
}

export const addNewProducts = (req: Req.AddProductsRequest) : Res.ProductAdditionResponse => {
    return StoreService.addNewProducts(req);
}

export const removeProducts = (req: Req.ProductRemovalRequest) : Res.ProductRemovalResponse => {
    return StoreService.removeProducts(req);
}

export const assignStoreOwner = (req: Req.AssignStoreOwnerRequest) : Res.BoolResponse => {
    return StoreService.assignStoreOwner(req);
}
