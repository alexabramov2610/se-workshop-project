import { BoolResponse,errorMsg } from "../../common/internal_api";


export class PaymentSystem{
   private paymentSys : any;
   private name: string;
   constructor(){
      this.name = "Payment System"
      this.paymentSys=null;
   }

   setPaymentSys(real: any){
      this.paymentSys=real;
   }

   connect():BoolResponse{
      const succ: BoolResponse = { data: {result: true}};
      if(this.paymentSys) {
         const isConnected = this.paymentSys.connect();
         if(isConnected) 
         {
            return succ;
         }
         else {
               return {error: {message: errorMsg['E_CON']+" : " + this.name}, data: {result: this.paymentSys.connect()}};}
         }
      else{
         return succ;
      }
   }
}
