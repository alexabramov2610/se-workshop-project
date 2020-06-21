import {
  IItem,
  ProductCatalogNumber,
  IProduct,
  BagItem,
  StoreInfo,
  IReceipt,
  ProductInStore,
  Cart,
  IPayment,
  IContactUsMessage,
  Error, IDiscountPolicy, IPurchasePolicy, ManagerNamePermission, AssignAgreement, DailyStatistics,
} from "./CommonInterface";
import {
    ManagementPermission,
    ProductCategory,
    TradingSystemState,
} from "./Enums";

interface Response {
    data: any;
    error?: Error;
}

interface ItemsAdditionResponse extends BoolResponse {
    data: { result: boolean; itemsNotAdded: IItem[], itemsAdded?: IItem[] };
}

interface ItemsRemovalResponse extends Response {
    data: { result: boolean; itemsNotRemoved: IItem[], itemsRemoved?: IItem[] };
}

interface ProductAdditionResponse extends Response {
    data: { result: boolean; productsNotAdded: IProduct[], productsAdded?: IProduct[] };
}

interface ProductRemovalResponse extends Response {
    data: {
        result: boolean;
        productsNotRemoved: ProductCatalogNumber[];
        itemsRemoved?: IItem[];
        productsRemoved?: IProduct[];
    };
}

interface BoolResponse extends Response {
    data: { result: boolean };
}

interface PaymentResponse extends BoolResponse {
    data: { result: boolean; payment?: IPayment };
}

interface CartFinalPriceRes extends BoolResponse {
    data: { result: boolean; price?: number };
}

interface StoreInfoResponse extends Response {
    data: { result: boolean; info?: StoreInfo };
}

interface TradingSystemStateResponse extends Response {
    data: { state: TradingSystemState };
}

interface ViewShopPurchasesHistoryResponse extends Response {
    data: { result: boolean; receipts: IReceipt[] };
}

interface ViewUsersContactUsMessagesResponse extends BoolResponse {
    data: { result: boolean, messages: IContactUsMessage[] };
}

interface ProductInfoResponse extends Response {
    data: {
        result: boolean;
        info?: {
            name: string;
            catalogNumber: number;
            price: number;
            category: ProductCategory;
            quantity: number;
            finalPrice: number;
        };
    };
}

interface AddDiscountResponse extends BoolResponse {
    data: { result: boolean; discountID?: string };
}

interface ViewStoreDiscountsPolicyResponse extends Response {
    data: { policy: IDiscountPolicy; };
}

interface ViewStorePurchasePolicyResponse extends Response {
    data: { policy: IPurchasePolicy; };
}

interface ViewRUserPurchasesHistoryRes extends Response {
    data: { result: boolean; receipts: IReceipt[] };
}

interface ViewCartRes extends BoolResponse {
    data: { result: boolean; cart?: Cart, total?: number };
}

interface SearchResponse extends Response {
    data: { result: boolean; products: ProductInStore[] };
}

interface PurchaseResponse extends BoolResponse {
    data: { result: boolean; receipt?: IReceipt };
}

interface ViewManagerPermissionResponse extends BoolResponse {
    data: { result: boolean; permissions?: ManagementPermission[] };
}

interface DeliveryResponse extends BoolResponse {
    data: { result: boolean, deliveryID?: number }
}

interface GetStoresWithOffsetResponse extends Response {
    data: { stores: StoreInfo[] }
}

interface GetAllProductsInStoreResponse extends Response {
    data: { products: ProductInStore[] }
}

interface GetLoggedInUserResponse extends Response {
    data: { username: string }
}

interface GetCategoriesResponse extends Response {
    data: { categories: ProductCategory[] }
}

interface GetAllCategoriesResponse extends Response {
    data: { categories: string[] }
}

interface GetPersonalDetailsResponse extends Response {
    // data: {result: boolean, username: string, cart: Cart, purchasesHistory: IReceipt[], managedStores: StoreInfo[], ownedStores: StoreInfo[] }
    data: { result: boolean, username: string, cart: Cart, purchasesHistory: IReceipt[] }
}

interface GetAllManagersPermissionsResponse extends Response {
    data: { result: boolean, permissions: ManagerNamePermission[] }
}

interface GetOwnersAssignedByResponse extends Response {
    data: { result: boolean, owners: string[], agreements: AssignAgreement[] }
}

interface GetItemsIdsResponse extends Response {
    data: { result: boolean, items: number[] }
}

interface RemoveStoreOwnerResponse extends Response {
    data: { result: boolean, owners: string[] }
}

interface GetAllUsersResponse extends Response {
    data: { result: boolean, users: string[] }
}

interface WatchVisitorsInfoResponse extends Response {
    data: { result: boolean, statistics: DailyStatistics[] }
}

interface GetNamesResponse extends Response {
    data: { result: boolean, names: string[] }
}



export {
    WatchVisitorsInfoResponse,
    RemoveStoreOwnerResponse,
    GetNamesResponse,
    GetItemsIdsResponse,
    GetOwnersAssignedByResponse,
    GetAllManagersPermissionsResponse,
    GetPersonalDetailsResponse,
    GetAllCategoriesResponse,
    GetCategoriesResponse,
    GetLoggedInUserResponse,
    GetAllProductsInStoreResponse,
    GetStoresWithOffsetResponse,
    DeliveryResponse,
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
    ViewCartRes,
    ViewStoreDiscountsPolicyResponse,
    ViewStorePurchasePolicyResponse,
    GetAllUsersResponse
};
