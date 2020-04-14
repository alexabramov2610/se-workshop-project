import {tradingSystem} from "domain_layer/src/api-ext/external_api";
import * as UserService from '../user_service/UserService'
import * as StoreService from '../store_service/StoreService'
import * as Req from "domain_layer/dist/src/api-ext/Request";
import * as Res from "domain_layer/dist/src/api-ext/Response";
import {logger} from "domain_layer/dist/src/api-int/Logger";
import {RegisteredUser} from "domain_layer/dist/src/user/users/RegisteredUser";
import {UserRole} from "domain_layer/dist/src/api-int/Enums";

export const systemInit = (): Res.BoolResponse=>{
    let res:boolean = true;
    const connectDelivery: Res.BoolResponse = tradingSystem.connectDeliverySys();
   if(connectDelivery.error) return connectDelivery;
    const connectPayment: Res.BoolResponse =  tradingSystem.connectPaymentSys();
   if(connectPayment.error) return connectPayment;
    return tradingSystem.register("Admin","Admin");
}

export const createStore = (createStoreReq: Req.OpenStoreRequest): Res.BoolResponse => {
    return StoreService.createStore(createStoreReq);
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

export const assignStoreManager = (req: Req.AssignStoreManagerRequest) : Res.BoolResponse => {
    return StoreService.assignStoreManager(req);
}

export const removeStoreManager = (req: Req.AssignStoreManagerRequest) : Res.BoolResponse => {
    return StoreService.removeStoreManager(req);
}