import {Error} from "../api-int/internal_api";
import {
    Item,
    ProductCatalogNumber,
    Product,
    BagItem,
    StoreInfo,
    IReciept,
    ProductInStore, Cart
} from "./CommonInterface";
import {ProductCategory, TradingSystemState} from "./Enums";
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
    data: { result: boolean, productsNotRemoved: ProductCatalogNumber[], itemsRemoved?: Item[] }
}

interface BoolResponse extends Response {
    data: { result: boolean }
}

interface StoreInfoResponse extends Response {
    data: { result: boolean, info?: StoreInfo }
}

interface TradingSystemStateResponse extends Response {
    data: { state: TradingSystemState }
}

interface ViewShopPurchasesHistoryResponse extends Response {
    data: { result: boolean, receipts: IReciept[] }
}

interface ViewUsersContactUsMessagesResponse extends Response {
    data: { messages: ContactUsMessage[] }
}

interface ProductInfoResponse extends Response {
    data: { result: boolean, info?: { name: string, catalogNumber: number, price: number, category: ProductCategory, quantity: number } }
}

interface ViewRUserPurchasesHistoryRes extends Response {
    data: { result: boolean, receipts: IReciept[] }
}

interface ViewCartRes extends Response {
    data: { result: boolean, cart: Cart }
}


interface SearchResponse extends Response {
    data: { result: boolean, products: ProductInStore[] }
}

interface PurchaseResponse extends BoolResponse {
    data: { result: boolean, receipt?: Receipt }
}

export {
    PurchaseResponse,
    SearchResponse,
    Response,
    BoolResponse,
    ProductAdditionResponse,
    StoreInfoResponse,
    ProductRemovalResponse,
    ItemsAdditionResponse,
    ItemsRemovalResponse,
    TradingSystemStateResponse,
    ViewShopPurchasesHistoryResponse,
    ProductInfoResponse,
    ViewUsersContactUsMessagesResponse,
    ViewRUserPurchasesHistoryRes,
    ViewCartRes
};

