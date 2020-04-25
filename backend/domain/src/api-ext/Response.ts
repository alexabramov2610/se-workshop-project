import {Error, Request} from "../api-int/internal_api";
import {
    IItem,
    ProductCatalogNumber,
    IProduct,
    BagItem,
    StoreInfo,
    IReceipt,
    ProductInStore, Cart, IPayment
} from "./CommonInterface";
import {ManagementPermission, ProductCategory, TradingSystemState} from "./Enums";
import {ContactUsMessage, Receipt} from "../trading_system/internal_api";


interface Response {
    data: any;
    error?: Error;
}


interface ItemsAdditionResponse extends Response {
    data: { result: boolean, itemsNotAdded: IItem[] }
}

interface ItemsRemovalResponse extends Response {
    data: { result: boolean, itemsNotRemoved: IItem[] }
}

interface ProductAdditionResponse extends Response {
    data: { result: boolean, productsNotAdded: IProduct[] }
}

interface ProductRemovalResponse extends Response {
    data: { result: boolean, productsNotRemoved: ProductCatalogNumber[], itemsRemoved?: IItem[] }
}

interface BoolResponse extends Response {
    data: { result: boolean }
}

interface PaymentResponse extends BoolResponse {
    data: { result: boolean, payment?: IPayment }
}

interface CartFinalPriceRes extends BoolResponse {
    data: { result: boolean , price?: number }
}

interface StoreInfoResponse extends Response {
    data: { result: boolean, info?: StoreInfo }
}

interface TradingSystemStateResponse extends Response {
    data: { state: TradingSystemState }
}

interface ViewShopPurchasesHistoryResponse extends Response {
    data: { result: boolean, receipts: IReceipt[] }
}

interface ViewUsersContactUsMessagesResponse extends Response {
    data: { messages: ContactUsMessage[] }
}

interface ProductInfoResponse extends Response {
    data: { result: boolean, info?: { name: string, catalogNumber: number, price: number, category: ProductCategory, quantity: number, finalPrice: number } }
}

interface AddDiscountResponse extends BoolResponse {
    data: { result: boolean, discountID?:  string }
}
interface ViewRUserPurchasesHistoryRes extends Response {
    data: { result: boolean, receipts: IReceipt[] }
}

interface ViewCartRes extends Response {
    data: { result: boolean, cart: Cart }
}

interface SearchResponse extends Response {
    data: { result: boolean, products: ProductInStore[] }
}

interface PurchaseResponse extends BoolResponse {
    data: { result: boolean, receipt?: IReceipt }
}

interface ViewManagerPermissionResponse extends BoolResponse {
    data: {result: boolean,  permissions?: ManagementPermission[]}
}
export {
    AddDiscountResponse,
    PaymentResponse,
    CartFinalPriceRes,
    ViewManagerPermissionResponse,
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

