import {Error} from "../api-int/internal_api";
import {Item, ProductCatalogNumber, Product, ProductWithQuantity} from "./CommonInterface";
import {TradingSystemState} from "./Enums";

interface Response {
  data: any;
  error?: Error;
}


interface ItemsAdditionResponse extends Response {
  data: {result: boolean, itemsNotAdded: Item[] }
}

interface ItemsRemovalResponse extends Response {
  data: {result: boolean, itemsNotRemoved: Item[] }
}

interface ProductAdditionResponse extends Response {
  data: {result: boolean, productsNotAdded: Product[] }
}

interface ProductRemovalResponse extends Response {
  data: {result: boolean, productsNotRemoved: ProductCatalogNumber[] }
}

interface BoolResponse extends Response {
  data: {result: boolean, value?: any}
}

interface StoreInfoResponse extends Response{
  data:{result:boolean, info?:{storeName:string,storeOwnersNames:string[],productNames:string[]}}
}

interface TradingSystemStateResponse extends Response{
  data: {state: TradingSystemState}
}
export { Response, BoolResponse, ProductAdditionResponse,StoreInfoResponse, ProductRemovalResponse, ItemsAdditionResponse, ItemsRemovalResponse,TradingSystemStateResponse };