import { tradingSystem } from "domain_layer";
import {RegisterRequest,LoginRequest,LogoutRequest, BoolResponse} from "domain_layer/src/common/internal_api";


export const registerUser = (registerReq: RegisterRequest):BoolResponse => {
   return tradingSystem.register(registerReq);
}

export const loginUser = (loginReq: LoginRequest):BoolResponse => {
    return tradingSystem.login(loginReq);
 }

 export const logoutUser = (logoutReq: LogoutRequest):BoolResponse => {
    return tradingSystem.logout(logoutReq);
 }
