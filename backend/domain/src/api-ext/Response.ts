import {Error} from "../api-int/internal_api";
import {Item, ProductCatalogNumber, Product, ProductWithQuantity, ProductCategory} from "./CommonInterface";
import {TradingSystemState} from "./Enums";
import {ContactUsMessage, Receipt} from "../trading_system/internal_api";


interface Response {
    data: any;
    error?: Error;
}


interface ItemsAdditionResponse extends Response {
    data: { result: boolean, itemsNotAdded: Item[] }
}

interface ItemsRemovalResponse extends Response {
    data: { result: boolean, itemsNotRemoved: Item[] }
}

interface ProductAdditionResponse extends Response {
    data: { result: boolean, productsNotAdded: Product[] }
}

interface ProductRemovalResponse extends Response {
    data: { result: boolean, productsNotRemoved: ProductCatalogNumber[] }
}

interface BoolResponse extends Response {
    data: { result: boolean }
}

interface LoginResponse extends Response {
    data: { result: boolean, newToken: string }
}

interface StoreInfoResponse extends Response {
    data: { result: boolean, info?: { storeName: string, storeOwnersNames: string[], productNames: string[] } }
}

interface TradingSystemStateResponse extends Response {
    data: { state: TradingSystemState }
}

interface StoreInfoResponse extends Response {
    data: { result: boolean, info?: { storeName: string, storeOwnersNames: string[], productNames: string[] } }
}

interface ViewShopPurchasesHistoryResponse extends Response {
    data: { receipts: Receipt[] }
}

interface ViewUsersContactUsMessagesResponse extends Response {
    data: { messages: ContactUsMessage[] }
}

interface ProductInfoResponse extends Response{
  data:{result:boolean, info?:{name:string,catalogNumber:number,price:number,catagory:ProductCategory}}

}



export {
    Response,
    LoginResponse,
    BoolResponse,
    ProductAdditionResponse,
    StoreInfoResponse,
    ProductRemovalResponse,
    ItemsAdditionResponse,
    ItemsRemovalResponse,
    TradingSystemStateResponse,
    ViewShopPurchasesHistoryResponse,
    ProductInfoResponse,
    ViewUsersContactUsMessagesResponse
};

