import { ConnectResponse } from "../../common/internal_api";

export class SecuritySystem{
   private securitySys : any;
   private name: string;

   constructor(){
      this.name = "Security System"
      this.securitySys=null;
   }

   setReal(real: any){
      this.securitySys=real;
   }

   connect():ConnectResponse{
      const succ: ConnectResponse = { data: {name: this.name , isConnected: true}};
      if(this.securitySys) {
         const isConnected = this.securitySys.connect();
         if(isConnected) 
         {
            return succ;
         }
         else {
            return {error: {message: "cant connect to payment system"}, data: {name:this.name , isConnected: this.securitySys.connect()}};
         }
      }
      else{
         return succ;
      }
   }

}