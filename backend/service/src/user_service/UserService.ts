import { getInstance,CreateInstance } from "domain_layer/dist/src/api-ext/external_api";
import * as Req from "domain_layer/dist/src/api-ext/Request";
import * as Res from "domain_layer/dist/src/api-ext/Response";
import {SaveToCartRequest} from "domain_layer/src/api-ext/Request";
let tradingSystem= getInstance();
export const registerUser = (req: Req.RegisterRequest): Res.BoolResponse => {
    return tradingSystem.register(req);
}

export const loginUser = (req: Req.LoginRequest): Res.BoolResponse => {
    return tradingSystem.login(req);
 }

 export const logoutUser = (req: Req.LogoutRequest): Res.BoolResponse => {
    return tradingSystem.logout(req);
 }

 export const saveProductTocart = (req:SaveToCartRequest):Res.BoolResponse =>{
    return tradingSystem.saveProductToCart(req);
}
