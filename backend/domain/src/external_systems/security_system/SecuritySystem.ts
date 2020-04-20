import {BoolResponse, errorMsg} from "../../api-int/internal_api";
import bcrypt from 'bcrypt'

export class SecuritySystem {
    private _securitySys: any;
    private _name: string;
    private readonly _saltRounds: number = 10;

    constructor() {
        this._name = "Security System"
        this._securitySys = null;
    }

    encryptPassword(password: string) {
        const hash = bcrypt.hashSync(password, this._saltRounds);
        return hash;
    }

    comparePassword(password:string, hash:string){
       return bcrypt.compareSync(password, hash);
    }

    /*
    connect():BoolResponse{
       const succ: BoolResponse = { data: {result: true}};
       if(this._securitySys) {
          const isConnected = this._securitySys.connect();
          if(isConnected)
          {
             return succ;
          }
          else {
                return {error: {message: errorMsg.E_CON+" : " + this._name}, data: {result: this._securitySys.connect()}};}
       }
       else{
          return succ;
       }
    }
 */
}