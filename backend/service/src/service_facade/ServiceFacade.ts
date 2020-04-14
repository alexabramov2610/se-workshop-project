import { tradingSystem } from "domain_layer";
import * as UserService from '../user_service/UserService'
import * as StoreService from '../store_service/StoreService'
import {OpenStoreRequest, LoginRequest,BoolResponse, RegisterRequest,LogoutRequest} from "domain_layer/src/common/internal_api";

export const systemInit = ():BoolResponse=>{
   let res:boolean = true;
   const connectDelivery: BoolResponse = tradingSystem.connectDeliverySys();
   if(connectDelivery.error) return connectDelivery;
   const connectPayment: BoolResponse =  tradingSystem.connectPaymentSys();
   if(connectPayment.error) return connectPayment;
   return tradingSystem.register("Admin","Admin");
}

export const createStore = (createStoreReq: OpenStoreRequest):BoolResponse => {
   return StoreService.createStore(createStoreReq);
}

export const registerUser = (registerUserReq: RegisterRequest):BoolResponse => {
   return UserService.registerUser(registerUserReq);
}

export const loginUser = (loginUserReq: LoginRequest):BoolResponse => {
   return UserService.loginUser(loginUserReq);
}

export const logoutUser = (logoutUserReq: LogoutRequest):BoolResponse => {
   return UserService.logoutUser(logoutUserReq);
}

   