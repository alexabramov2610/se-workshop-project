import { tradingSystem } from "domain_layer";
import {OpenStoreRequest} from "domain_layer/dist/src/common/Request";

export const createStore = (createStoreReq: OpenStoreRequest):boolean => {
   return !tradingSystem.createStore(createStoreReq).error;

}