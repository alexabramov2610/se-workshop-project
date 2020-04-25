import {
    IItem,
    ProductCatalogNumber,
    IProduct,
    ProductWithQuantity,
    SearchQuery,
    SearchFilters
} from "./CommonInterface";
import {ManagementPermission} from "./Enums";
import {CreditCard} from "../api-ext/CommonInterface"

interface Request {
    body: any;
    token: string;
}

interface OpenStoreRequest extends Request {
    body: { storeName: string };
}

interface SetAdminRequest extends Request {
    body: { newAdminUserName: string };
}

interface InitReq extends Request {
    body: { firstAdminName: string, firstAdminPassword: string };
}

interface ItemsAdditionRequest extends Request {
    body: { storeName: string, items: IItem[] }
}

interface ItemsRemovalRequest extends Request {
    body: { storeName: string, items: IItem[] }
}

interface RemoveProductsWithQuantity extends Request {
    body: { storeName: string, products: ProductWithQuantity[] }
}

interface AddProductsRequest extends Request {
    body: { storeName: string, products: IProduct[] }
}

interface ProductRemovalRequest extends Request {
    body: { storeName: string, products: ProductCatalogNumber[] }
}

interface AssignStoreOwnerRequest extends Request {
    body: { storeName: string, usernameToAssign: string }
}

interface AssignStoreManagerRequest extends Request {
    body: { storeName: string, usernameToAssign: string }
}

interface RemoveStoreOwnerRequest extends Request {
    body: { storeName: string, usernameToRemove: string }
}

interface RemoveStoreManagerRequest extends Request {
    body: { storeName: string, usernameToRemove: string }
}

interface RegisterRequest extends Request {
    body: { username: string, password: string }
}

interface LoginRequest extends Request {
    body: { username: string, password: string, asAdmin?: boolean }
}

interface LogoutRequest extends Request {
    body: {}
}

interface ViewShopPurchasesHistoryRequest extends Request {
    body: { storeName: string }
}

interface ChangeManagerPermissionRequest extends Request {
    body: { managerToChange: string, storeName: string, permissions: ManagementPermission[] }
}

interface ViewBuyerPurchasesHistoryRequest extends Request {
    body: {}
}

interface StoreInfoRequest extends Request {
    body: { storeName: string }
}

interface ChangeManagerPermissionRequest extends Request {
    body: { managerToChange: string, storeName: string, permissions: ManagementPermission[] }
}

interface ProductInfoRequest extends Request {
    body: { storeName: string, catalogNumber: number }
}

interface SaveToCartRequest extends Request {
    body: { storeName: string, catalogNumber: number, amount: number }
}

interface RemoveFromCartRequest extends Request {
    body: { storeName: string, catalogNumber: number, amount: number }
}


interface ChangeProductPriceRequest extends Request {
    body: { storeName: string, catalogNumber: number, newPrice: number }
}

interface ChangeProductNameRequest extends Request {
    body: { storeName: string, catalogNumber: number, newName: string }
}

interface ViewUsersContactUsMessagesRequest extends Request {
    body: { storeName: string }
}

interface ViewRUserPurchasesHistoryReq extends Request {
    body: { userName?: string }
}

interface ViewCartReq extends Request {
    body: {}
}

interface SearchRequest extends Request {
    body: { filters: SearchFilters, searchQuery: SearchQuery }
}

interface VerifyCartRequest extends Request {
    body: {}
}


interface PurchaseRequest extends Request {
    body: {
        payment: {
            cardDetails: CreditCard,
            address: string,
            city: string,
            country: string,
            price: number
        }
    }
}

interface PayRequest extends Request {
    body: {
        cardDetails: CreditCard,
        address: string,
        city: string,
        country: string,
        price: number
    }
}

interface CalcFinalPriceReq extends Request {
    body: {}
}

export {
    CalcFinalPriceReq,
    PayRequest,
    VerifyCartRequest,
    PurchaseRequest,
    SearchRequest,
    RemoveStoreOwnerRequest,
    Request,
    SaveToCartRequest,
    RemoveFromCartRequest,
    ProductInfoRequest,
    AssignStoreOwnerRequest,
    SetAdminRequest,
    AssignStoreManagerRequest,
    OpenStoreRequest,
    ItemsAdditionRequest,
    ItemsRemovalRequest,
    StoreInfoRequest, ChangeManagerPermissionRequest,
    RemoveProductsWithQuantity,
    AddProductsRequest,
    ProductRemovalRequest,
    RegisterRequest,
    LoginRequest,
    LogoutRequest,
    ViewShopPurchasesHistoryRequest,
    RemoveStoreManagerRequest,
    ViewUsersContactUsMessagesRequest,
    ChangeProductPriceRequest,
    ChangeProductNameRequest,
    ViewRUserPurchasesHistoryReq,
    InitReq,
    ViewCartReq
};
