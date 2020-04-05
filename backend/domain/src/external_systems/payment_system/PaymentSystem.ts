import { ConnectResponse } from "../../common/internal_api";


export class PaymentSystem{
   private paymentSys : any;
   private name: string;
   constructor(){
      this.name = "Payment System"
      this.paymentSys=null;
   }

   setReal(real: any){
      this.paymentSys=real;
   }

   connect():ConnectResponse{
      const succ: ConnectResponse = { data: {name: this.name  , isConnected: true}};
      if(this.paymentSys) {
         const isConnected = this.paymentSys.connect();
         if(isConnected) 
         {
            return succ;
         }
         else {
            return {error: {message: "cant connect to payment system"}, data: {name: this.name , isConnected: this.paymentSys.connect()}};
         }
      }
      else{
         return succ;
      }
   }

}