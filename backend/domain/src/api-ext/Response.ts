import { Error } from "../api-int/internal_api";
import {RegisteredUser} from "../user/users/RegisteredUser"
import {Item, ProductCatalogNumber, Product, ProductWithQuantity} from "./CommonInterface";

interface Response {
  data: any;
  error?: Error;
}


interface UserResponse extends Response {
  data: { user: RegisteredUser};
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
  data: {result: boolean}
}

export { Response, BoolResponse, ProductAdditionResponse, ProductRemovalResponse, ItemsAdditionResponse, ItemsRemovalResponse };