import { Item, ProductCatalogNumber, Product, ProductWithQuantity } from "./CommonInterface";

interface Request {
  body: any;
  token: string;
}

interface OpenStoreRequest extends Request {
  body: { storeName: string};
}

interface SetAdminRequest extends Request {
  body: { newAdminUserName: string};
}
interface InitReq extends Request {
  body: { firstAdminName: string,firstAdminPassword: string};
}

interface ItemsAdditionRequest extends Request {
  body: { storeName: string, items: Item[] }
}

interface ItemsRemovalRequest extends Request {
  body: { storeName: string, items: Item[] }
}

interface RemoveProductsWithQuantity extends Request {
  body: { storeName: string, products: ProductWithQuantity[] }
}

interface AddProductsRequest extends Request {
  body: { storeName: string, products: Product[] }
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
  body: { username: string, password: string, asAdmin?:boolean}
}

interface LogoutRequest extends Request {
  body: { username: string}
}
interface ViewShopPurchasesHistoryRequest extends Request{
  body: {shopName: string}
}

interface ViewBuyerPurchasesHistoryRequest extends Request{
  body: {}
}

interface StoreInfoRequest extends Request{
  body:{storeName:string}
}

interface ChangeProductPriceRequest extends Request {
  body:{storeName:string, catalogNumber: number, newPrice: number}
}

interface ChangeProductNameRequest extends Request {
  body:{storeName:string, catalogNumber: number, newName: number}
}

export {RemoveStoreOwnerRequest, Request,AssignStoreOwnerRequest, SetAdminRequest, AssignStoreManagerRequest,
  OpenStoreRequest, ItemsAdditionRequest, ItemsRemovalRequest, StoreInfoRequest,
  RemoveProductsWithQuantity, AddProductsRequest, ProductRemovalRequest,RegisterRequest,LoginRequest ,LogoutRequest,ViewShopPurchasesHistoryRequest,RemoveStoreManagerRequest};

