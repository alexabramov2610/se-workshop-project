import {ConnectResponse} from '../../common/Response'
export class DeliverySystem{

   private deliverySys : any;
   private name: string;

   constructor(){
      this.name = "Delivery System"
      this.deliverySys=null;
      
   }
   setReal(real: any){
      this.deliverySys=real;
   }

   connect():ConnectResponse{
      const succ: ConnectResponse = { data: {name:  this.name  , isConnected: true}};
      if(this.deliverySys) {
         const isConnected = this.deliverySys.connect();
         if(isConnected) 
         {
            return succ;
         }
         else {
            return {error: {message: "cant connect to delivery system"}, data: {name:  this.name  , isConnected: this.deliverySys.connect()}};
         }
      }
      else {
         return succ;
      }
   }
}