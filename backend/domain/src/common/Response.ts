import { Error } from "./internal_api";
import { Item, Product } from "../trading_system/internal_api";
import {User} from "../user/users/User"

interface Response {
  data: any;
  error?: Error;
}


interface UserResponse extends Response {
  data: { user: User};
}

interface StoreItemsAdditionResponse extends Response {
  data: {result: boolean, ItemsNotAdded: Item[] }
}

interface StoreItemsRemovalResponse extends Response {
  data: {result: boolean, ItemsNotRemoved: Item[] }
}

interface StoreProductAdditionResponse extends Response {
  data: {result: boolean, ProductsNotAdded: Product[] }
}

interface StoreProductRemovalResponse extends Response {
  data: {result: boolean, ProductsNotRemoved: Product[] }
}

interface BoolResponse extends Response {
  data: {result: boolean}
}


export { Response, BoolResponse, StoreProductAdditionResponse, StoreProductRemovalResponse, StoreItemsAdditionResponse, StoreItemsRemovalResponse };