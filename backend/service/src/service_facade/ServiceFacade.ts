import { tradingSystem } from "domain_layer";
import * as UserService from '../user_service/UserService'
import * as StoreService from '../store_service/StoreService'
import {OpenStoreRequest} from "domain_layer/src/common/internal_api";

export const systemInit = ():boolean=>{
   let res:boolean = true;
   res = res && !tradingSystem.connectDeliverySys().error;
   res = res && !tradingSystem.connectPaymentSys().error;
   const hasAdmin:boolean = tradingSystem.getUserByName("Admin") != undefined
   return hasAdmin? res : res && !tradingSystem.register("Admin","Admin").error
}

export const createStore = (createStoreReq: OpenStoreRequest):boolean => {
   return StoreService.createStore(createStoreReq);
}
   