import { Error } from "./internal_api";
import { Item, Product } from "../trading_system/internal_api";

interface Response {
  data: any;
  error?: Error;
}

interface RegisterResponse extends Response {
  data: { isAdded: boolean };
}

interface StoreItemsAdditionResponse extends Response {
  data: {result: boolean, ItemsNotAdded: Item[] }
}

interface StoreItemsRemovalResponse extends Response {
  data: {result: boolean, ItemsNotRemoved: Item[] }
}

interface StoreProductAdditionResponse extends Response {
  data: {result: boolean, productsNotAdded: Product[] }
}

interface StoreProductRemovalResponse extends Response {
  data: {result: boolean, productsNotRemoved: Product[] }
}

interface StoreAdditionResponse extends Response {
  data: {result: boolean}
}

interface StoreOwnerAdditionResponse extends Response {
  data: {result: boolean}
}

interface StoreManagerAdditionResponse extends Response {
  data: {result: boolean}
}

export { Response, StoreOwnerAdditionResponse, StoreManagerAdditionResponse, StoreAdditionResponse, RegisterResponse, StoreProductAdditionResponse, StoreProductRemovalResponse, StoreItemsAdditionResponse, StoreItemsRemovalResponse };
