import { tradingSystem } from "domain_layer";
import * as UserService from '../user_service/UserService'
import * as StoreService from '../store_service/StoreService'
import {OpenStoreRequest, BoolResponse} from "domain_layer/src/common/internal_api";

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
   