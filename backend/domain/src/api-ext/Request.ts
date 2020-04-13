import { Item, ProductCatalogNumber, Product, ProductWithQuantity } from "./CommonInterface";
import {Response} from "./Response";

interface Request {
  body: any;
  requester: string;
}


interface OpenStoreRequest extends Request {
  body: { storeName: string}
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

export { AssignStoreOwnerRequest, OpenStoreRequest, ItemsAdditionRequest, ItemsRemovalRequest, RemoveProductsWithQuantity, AddProductsRequest, ProductRemovalRequest };