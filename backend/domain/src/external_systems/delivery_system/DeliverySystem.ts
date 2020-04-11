import { BoolResponse,errorMsg} from "../../common/internal_api";


export class DeliverySystem{
   private deliverySys : any;
   private name: string;

   constructor(){
      this.name = "Delivery System"
      this.deliverySys=null;
      
   }
   setDeliverySys(real: any) : void{
      this.deliverySys=real;
   }

   connect():BoolResponse{
      const succ: BoolResponse = { data: {result: true}};
      if(this.deliverySys) {
         const isConnected = this.deliverySys.connect();
         if(isConnected) 
         {
            return succ;
         }
         else {
            return {error: {message: errorMsg['E_CON']+" : " + this.name}, data: {result: this.deliverySys.connect()}};
         }
      }
      else {
         return succ;
      }
   }
}