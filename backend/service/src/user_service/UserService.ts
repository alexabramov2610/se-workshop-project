import {tradingSystem} from "domain_layer/dist/src/api-ext/external_api";
import * as Req from "domain_layer/dist/src/api-ext/Request";
import * as Res from "domain_layer/dist/src/api-ext/Response";

export const registerUser = (registerReq: Req.RegisterRequest):Res.BoolResponse => {
   return tradingSystem.register(registerReq);
}

export const loginUser = (loginReq: Req.LoginRequest):Res.BoolResponse => {
    return tradingSystem.login(loginReq);
 }

 export const logoutUser = (logoutReq: Req.LogoutRequest):Res.BoolResponse => {
    return tradingSystem.logout(logoutReq);
 }
