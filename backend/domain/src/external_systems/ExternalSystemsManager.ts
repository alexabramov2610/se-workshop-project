import {DeliverySystem} from "./delivery_system/DeliverySystem"
import {PaymentSystem} from "./payment_system/PaymentSystem"
import {SecuritySystem} from "./security_system/SecuritySystem"
import {errorMsg,ExternalSystems,BoolResponse} from "../api-int/internal_api"

export class ExternalSystemsManager {
   private paymentSystem:PaymentSystem;
   private deliverySystem:DeliverySystem;
   private securitySystem:SecuritySystem

  constructor() {
    this.deliverySystem = new DeliverySystem();
    this.paymentSystem = new PaymentSystem();
    this.securitySystem = new SecuritySystem();
  }
  
  connectSystem(system:ExternalSystems): BoolResponse {
     switch(system){
        case (ExternalSystems.DELIVERY):
           return this.deliverySystem.connect();
         case (ExternalSystems.PAYMENT):
            return this.paymentSystem.connect();
         case (ExternalSystems.SECURITY):
            return this.securitySystem.connect();
     }
  }
   connectAllSystems(): BoolResponse {
      const responses: BoolResponse[] = [this.deliverySystem.connect(),this.paymentSystem.connect(),this.securitySystem.connect()];
      const errors = responses.filter(val=> val.error)
      if (errors.length === 0) {
         return {data: {result:true}}
      }
      else{
         return { data: {result:false}, error: {message: errorMsg['E_CON'], options: errors} }
      }
   }
}



