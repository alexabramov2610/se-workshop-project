import { Item, ProductCatalogNumber, Product, ProductWithQuantity } from "./CommonInterface";
import {Response} from "./Response";

interface Request {
  body: any;
  token: string;
}


interface OpenStoreRequest extends Request {
  body: { storeName: string};
}

interface SetAdminRequest extends Request {
  body: { newAdminUUID: string};
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

interface RegisterRequest extends Request {
  body: { username: string, password: string }
}

interface LoginRequest extends Request {
  body: { username: string, password: string }
}

interface LogoutRequest extends Request {
  body: { username: string}
}

export { AssignStoreOwnerRequest, SetAdminRequest, AssignStoreManagerRequest,
  OpenStoreRequest, ItemsAdditionRequest, ItemsRemovalRequest,
  RemoveProductsWithQuantity, AddProductsRequest, ProductRemovalRequest,RegisterRequest,LoginRequest ,LogoutRequest};