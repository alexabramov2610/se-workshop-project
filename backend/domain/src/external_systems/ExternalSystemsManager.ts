import {DeliverySystem} from "./delivery_system/DeliverySystem"
import {PaymentSystem} from "./payment_system/PaymentSystem"
import {SecuritySystem} from "./security_system/SecuritySystem"
import {ConnectResponse,errorMsg} from "../common/internal_api"

export class ExternalSystemsManager {
   private paymentSystem:PaymentSystem;
   private deliverySystem:DeliverySystem;
   private securitySystem:SecuritySystem

  constructor() {
    this.deliverySystem = new DeliverySystem();
    this.paymentSystem = new PaymentSystem();
    this.securitySystem = new SecuritySystem();
  }
  
  connectSystem(system:string): ConnectResponse {
     switch(system){
        case "Delivery":
           return this.deliverySystem.connect();
         case "Payment":
            return this.paymentSystem.connect();
         case "Security":
            return this.securitySystem.connect();
     }
  }
     
}
  /*
  connectAllSystems(): ConnectResponse {
   const responses: ConnectResponse[] = [this.deliverySystem.connect(),this.paymentSystem.connect(),this.securitySystem.connect()];
   const errors = responses.filter(val=> val.error)
   if (errors.length === 0) {
      const names = responses.map(prev => prev.data.name).join(" ")
      return {data: {name: names, isConnected:true}}
   }
   else{
      return { data: {name: "", isConnected:false}, error: {message: errorMsg['E_CON'], options: errors} }
   }
}
*/
