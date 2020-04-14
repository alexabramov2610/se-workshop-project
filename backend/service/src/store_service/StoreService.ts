import { tradingSystem } from "domain_layer/src/api-ext/external_api";
import * as Req from "domain_layer/dist/src/api-ext/Request";
import * as Res from "domain_layer/dist/src/api-ext/Response";
import {OpenStoreRequest, BoolResponse} from "domain_layer/src/common/internal_api";
export const createStore = (createStoreReq: OpenStoreRequest):BoolResponse => {
   return tradingSystem.createStore(createStoreReq);

}

export const addItems = (req: Req.ItemsAdditionRequest) : Res.ItemsAdditionResponse => {
   return tradingSystem.addItems(req);
}

export const removeItems = (req: Req.ItemsRemovalRequest) : Res.ItemsRemovalResponse => {
   return tradingSystem.removeItems(req);
}

export const removeProductsWithQuantity = (req: Req.RemoveProductsWithQuantity) : Res.ProductRemovalResponse => {
   return tradingSystem.removeProductsWithQuantity(req);
}

export const addNewProducts = (req: Req.AddProductsRequest) : Res.ProductAdditionResponse => {
   return tradingSystem.addNewProducts(req);
}

export const removeProducts = (req: Req.ProductRemovalRequest) : Res.ProductRemovalResponse => {
   return tradingSystem.removeProducts(req);
}

export const assignStoreOwner = (req: Req.AssignStoreOwnerRequest) : Res.BoolResponse => {
   return tradingSystem.assignStoreOwner(req);
}
