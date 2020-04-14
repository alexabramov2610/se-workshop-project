import { tradingSystem } from "domain_layer";
<<<<<<< HEAD

export const createStore = (storeName: string, requestor: string):boolean => {
   return true;
=======
import {OpenStoreRequest, BoolResponse} from "domain_layer/src/common/internal_api";
export const createStore = (createStoreReq: OpenStoreRequest):BoolResponse => {
   return tradingSystem.createStore(createStoreReq);
>>>>>>> c3d12d6da9913c0c1a2b3c69aaf01d21af33cbf5

}