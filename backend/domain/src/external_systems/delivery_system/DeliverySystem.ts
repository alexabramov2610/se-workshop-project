import { BoolResponse, errorMsg, loggerW} from "../../api-int/internal_api";
const logger = loggerW(__filename)


export class DeliverySystem{
   private _deliverySys : any;
   private _name: string;
   private _isConnected: boolean;

   constructor(){
      this._name = "Delivery System"
      this._deliverySys=null;
      this._isConnected = false;
   }

   setDeliverySys(real: any) : void{
      this._deliverySys=real;
   }

   connect():BoolResponse{
      logger.info("connecting to connect delivery system...");
      const succ: BoolResponse = { data: {result: true}};
      if(this._deliverySys) {
         try {
            const isConnected = this._deliverySys.connect();
            this._isConnected = isConnected ? true : false;
            return isConnected ? succ :
               {error: {message: errorMsg.E_CON+" : " + this._name}, data: {result: false}};
         } catch (e) {
            const error: string = `${errorMsg.E_CON}. message: ${e}`;
            logger.error(error);
            return {error: {message: error}, data: {result: false}};
         }
      }
      else {
         return succ;
      }
   }
}