import { UserManagement, User } from "../user/internal_api";
import { Item, Product } from "../trading_system/internal_api"
import { StoreManagement, Store } from '../store/internal_api';
import * as Responses from "../common/Response"
import {errorMsg as Error} from "../common/Error";
import {ExternalSystemsManager} from "../external_systems/internal_api"
import { BoolResponse,ExternalSystems,Logger } from "../common/internal_api";

export class TradingSystem {
  private userManagement: UserManagement;
  private storeManagement: StoreManagement;

  constructor() {
    this.userManagement = new UserManagement();
    this.storeManagement = new StoreManagement();
  }

export class TradingSystem {
  private userManagement: UserManagement;
  private externalSystems: ExternalSystemsManager;
  constructor() {
    this.userManagement = new UserManagement();
    this.externalSystems = new ExternalSystemsManager();
  }

  register(userName: string, password: string): BoolResponse {
    const res = this.userManagement.register(userName,password);
    return res;
  }

  getUserByName(userName: string) {
    
    return this.userManagement.getUserByName(userName);
  }

  addItems(items: Item[], user: User, store: Store) : Responses.StoreItemsAdditionResponse {
    return !this.userManagement.isLoggedIn(user) ?
        { data: { result: false, ItemsNotAdded: items } , error: { message: Error['E_NOT_LOGGED_IN']}} :
      !this.storeManagement.verifyStore(store) ?
        { data: { result: false, ItemsNotAdded: items } , error: { message: Error['E_INVALID_STORE']}} :
          !(this.storeManagement.verifyStoreOwner(store, user) || !this.storeManagement.verifyStoreManager(store, user)) ?
        { data: { result: false, ItemsNotAdded: items } , error: { message: Error['E_NOT_AUTHORIZED']}} :
        store.addItems(items);
  }

  removeItems(items: Item[], user: User, store: Store) : Responses.StoreItemsRemovalResponse {
    return !this.userManagement.isLoggedIn(user) ?
        { data: { result: false, ItemsNotRemoved: items } , error: { message: Error['E_NOT_LOGGED_IN']}} :
      !this.storeManagement.verifyStore(store) ?
        { data: { result: false, ItemsNotRemoved: items } , error: { message: Error['E_INVALID_STORE']}} :
      !(this.storeManagement.verifyStoreOwner(store, user) || !this.storeManagement.verifyStoreManager(store, user)) ?
        { data: { result: false, ItemsNotRemoved: items } , error: { message: Error['E_NOT_AUTHORIZED']}} :
        store.removeItems(items);

  }

  removeProductsWithQuantity(products : Map<Product, number>, user: User, store: Store) : Responses.StoreProductRemovalResponse {
    return !this.userManagement.isLoggedIn(user) ?
        { data: { result: false, productsNotRemoved: Array.from(products.keys()) } , error: { message: Error['E_NOT_LOGGED_IN']}} :
        !this.storeManagement.verifyStore(store) ?
            { data: { result: false, productsNotRemoved: Array.from(products.keys())} , error: { message: Error['E_INVALID_STORE']}} :
            !(this.storeManagement.verifyStoreOwner(store, user) || !this.storeManagement.verifyStoreManager(store, user)) ?
                { data: { result: false, productsNotRemoved: Array.from(products.keys()) } , error: { message: Error['E_NOT_AUTHORIZED']}} :
                store.removeProductsWithQuantity(products);
  }

  addNewProducts(products: Product[], user: User, store: Store) : Responses.StoreProductAdditionResponse {
    return !this.userManagement.isLoggedIn(user) ?
        { data: { result: false, productsNotAdded: products } , error: { message: Error['E_NOT_LOGGED_IN']}} :
        !this.storeManagement.verifyStore(store) ?
            { data: { result: false, productsNotAdded: products} , error: { message: Error['E_INVALID_STORE']}} :
            !(this.storeManagement.verifyStoreOwner(store, user) || !this.storeManagement.verifyStoreManager(store, user)) ?
                { data: { result: false, productsNotAdded: products } , error: { message: Error['E_NOT_AUTHORIZED']}} :
                store.addNewProducts(products);
  }

  removeProducts(products: Product[], user: User, store: Store) : Responses.StoreProductRemovalResponse {
    return !this.userManagement.isLoggedIn(user) ?
        { data: { result: false, productsNotRemoved: products } , error: { message: Error['E_NOT_LOGGED_IN']}} :
        !this.storeManagement.verifyStore(store) ?
            { data: { result: false, productsNotRemoved: products} , error: { message: Error['E_INVALID_STORE']}} :
            !(this.storeManagement.verifyStoreOwner(store, user) || !this.storeManagement.verifyStoreManager(store, user)) ?
                { data: { result: false, productsNotRemoved: products } , error: { message: Error['E_NOT_AUTHORIZED']}} :
                store.removeProducts(products);
  }

}

  connectDeliverySys(): BoolResponse{
    Logger.info('Trying to connect to delivery system');
    const res:BoolResponse = this.externalSystems.connectSystem(ExternalSystems.DELIVERY);
    return res;
  }

  connectPaymentSys(): BoolResponse{
    Logger.info('Trying to connect to payment system');
    const res:BoolResponse = this.externalSystems.connectSystem(ExternalSystems.PAYMENT);
    return res;
  }

  setAdmin(userName: string): BoolResponse{
    const res:BoolResponse = this.userManagement.setAdmin(userName);
    return res;
  }

}


