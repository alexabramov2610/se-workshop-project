import { getInstance,CreateInstance } from "domain_layer/dist/src/api-ext/external_api";
import * as Req from "domain_layer/dist/src/api-ext/Request";
import * as Res from "domain_layer/dist/src/api-ext/Response";
import {TradingSystemManager} from "domain_layer/dist/src/trading_system/TradingSystemManager";

export const registerUser = (req: Req.RegisterRequest,ts:TradingSystemManager): Res.BoolResponse => {
    return ts.register(req);
}

export const loginUser = (req: Req.LoginRequest,ts:TradingSystemManager): Res.BoolResponse => {
    return ts.login(req);
 }

 export const logoutUser = (req: Req.LogoutRequest,ts:TradingSystemManager): Res.BoolResponse => {
    return ts.logout(req);
 }
