import { tradingSystem } from "domain_layer";
import {OpenStoreRequest, BoolResponse} from "domain_layer/src/common/internal_api";
export const createStore = (createStoreReq: OpenStoreRequest):BoolResponse => {
   return tradingSystem.createStore(createStoreReq);

}