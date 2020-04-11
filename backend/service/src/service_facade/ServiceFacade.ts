import { tradingSystem } from "domain_layer";
import * as UserService from '../user_service/UserService'
import * as StoreService from '../store_service/StoreService'

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
   