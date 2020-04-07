import { tradingSystem } from "domain_layer";
import * as UserSerice from '../user_service/UserService'


export const systemInit = ():boolean=>{
   let res:boolean = true;
   res = res && !tradingSystem.connectDeliverySys().error;
   res = res && !tradingSystem.connectPaymentSys().error;
   const hasAdmin:boolean = tradingSystem.getUserByName("Admin") != undefined
   return hasAdmin? res : res && !tradingSystem.register("Admin","Admin").error
}