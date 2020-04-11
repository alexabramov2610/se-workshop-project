import { Error } from "./internal_api";
import { Item, Product } from "../trading_system/internal_api";
import {RegisteredUser} from "../user/users/RegisteredUser"
import { StoreOwner } from "../user/internal_api";

interface Response {
  data: any;
  error?: Error;
}


interface UserResponse extends Response {
  data: { user: RegisteredUser};
}

interface StoreItemsAdditionResponse extends Response {
  data: {result: boolean, itemsNotAdded: Item[] }
}

interface StoreItemsRemovalResponse extends Response {
  data: {result: boolean, itemsNotRemoved: Item[] }
}

interface StoreProductAdditionResponse extends Response {
  data: {result: boolean, productsNotAdded: Product[] }
}

interface StoreProductRemovalResponse extends Response {
  data: {result: boolean, productsNotRemoved: Product[] }
}

interface BoolResponse extends Response {
  data: {result: boolean}
}

interface StoreInfoResponse extends Response{
  data:{result:boolean,info:{storeName:string,storeOwners:StoreOwner[],products:Product[]}}
}

interface ProductInfoResponse extends Response{
  data:{result:boolean,info:{name:string,catalogNumber:number,price:number}}
}


export { Response, BoolResponse, StoreProductAdditionResponse, StoreProductRemovalResponse, StoreItemsAdditionResponse, StoreItemsRemovalResponse,StoreInfoResponse,ProductInfoResponse };