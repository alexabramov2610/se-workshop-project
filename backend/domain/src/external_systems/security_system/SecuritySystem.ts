import { BoolResponse,errorMsg } from "../../common/internal_api";

export class SecuritySystem{
   private securitySys : any;
   private name: string;

   constructor(){
      this.name = "Security System"
      this.securitySys=null;
   }

   setSecuritySys(real: any){
      this.securitySys=real;
   }

   connect():BoolResponse{
      const succ: BoolResponse = { data: {result: true}};
      if(this.securitySys) {
         const isConnected = this.securitySys.connect();
         if(isConnected) 
         {
            return succ;
         }
         else {
               return {error: {message: errorMsg['E_CON']+" : " + this.name}, data: {result: this.securitySys.connect()}};}
      }
      else{
         return succ;
      }
   }

}