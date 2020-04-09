import { UserManager, User } from "../user/internal_api";
import { Item, Product } from "../trading_system/internal_api"
import { StoreManager, Store } from '../store/internal_api';
import * as Responses from "../common/Response"
import {errorMsg as Error} from "../common/Error";
import {ExternalSystemsManager} from "../external_systems/internal_api"
import { BoolResponse,ExternalSystems,Logger } from "../common/internal_api";

export class TradingSystemManager {
  private userManager: UserManager;
  private storeManager: StoreManager;
  private externalSystems: ExternalSystemsManager;

  constructor() {
    this.userManager = new UserManager();
    this.storeManager = new StoreManager();
    this.externalSystems = new ExternalSystemsManager();
  }

  register(userName: string, password: string): BoolResponse {
    const res = this.userManager.register(userName,password);
    return res;
  }

  getUserByName(userName: string) {
    
    return this.userManager.getUserByName(userName);
  }

  addItems(items: Item[], user: User, store: Store) : Responses.StoreItemsAdditionResponse {
    return !this.userManager.isLoggedIn(user) ?
        { data: { result: false, ItemsNotAdded: items } , error: { message: Error['E_NOT_LOGGED_IN']}} :
      !this.storeManager.verifyStore(store) ?
        { data: { result: false, ItemsNotAdded: items } , error: { message: Error['E_INVALID_STORE']}} :
          !(this.storeManager.verifyStoreOwner(store, user) || this.storeManager.verifyStoreManager(store, user)) ?
        { data: { result: false, ItemsNotAdded: items } , error: { message: Error['E_NOT_AUTHORIZED']}} :
        store.addItems(items);
  }

  removeItems(items: Item[], user: User, store: Store) : Responses.StoreItemsRemovalResponse {
    return !this.userManager.isLoggedIn(user) ?
        { data: { result: false, ItemsNotRemoved: items } , error: { message: Error['E_NOT_LOGGED_IN']}} :
      !this.storeManager.verifyStore(store) ?
        { data: { result: false, ItemsNotRemoved: items } , error: { message: Error['E_INVALID_STORE']}} :
      !(this.storeManager.verifyStoreOwner(store, user) || this.storeManager.verifyStoreManager(store, user)) ?
        { data: { result: false, ItemsNotRemoved: items } , error: { message: Error['E_NOT_AUTHORIZED']}} :
        store.removeItems(items);

  }

  removeProductsWithQuantity(products : Map<Product, number>, user: User, store: Store) : Responses.StoreProductRemovalResponse {
    return !this.userManager.isLoggedIn(user) ?
        { data: { result: false, ProductsNotRemoved: Array.from(products.keys()) } , error: { message: Error['E_NOT_LOGGED_IN']}} :
        !this.storeManager.verifyStore(store) ?
            { data: { result: false, ProductsNotRemoved: Array.from(products.keys())} , error: { message: Error['E_INVALID_STORE']}} :
            !(this.storeManager.verifyStoreOwner(store, user) || this.storeManager.verifyStoreManager(store, user)) ?
                { data: { result: false, ProductsNotRemoved: Array.from(products.keys()) } , error: { message: Error['E_NOT_AUTHORIZED']}} :
                store.removeProductsWithQuantity(products);
  }

  addNewProducts(products: Product[], user: User, store: Store) : Responses.StoreProductAdditionResponse {
    return !this.userManager.isLoggedIn(user) ?
        { data: { result: false, ProductsNotAdded: products } , error: { message: Error['E_NOT_LOGGED_IN']}} :
        !this.storeManager.verifyStore(store) ?
            { data: { result: false, ProductsNotAdded: products} , error: { message: Error['E_INVALID_STORE']}} :
            !(this.storeManager.verifyStoreOwner(store, user) || this.storeManager.verifyStoreManager(store, user)) ?
                { data: { result: false, ProductsNotAdded: products } , error: { message: Error['E_NOT_AUTHORIZED']}} :
                store.addNewProducts(products);
  }

  removeProducts(products: Product[], user: User, store: Store) : Responses.StoreProductRemovalResponse {
    return !this.userManager.isLoggedIn(user) ?
        { data: { result: false, ProductsNotRemoved: products } , error: { message: Error['E_NOT_LOGGED_IN']}} :
        !this.storeManager.verifyStore(store) ?
            { data: { result: false, ProductsNotRemoved: products} , error: { message: Error['E_INVALID_STORE']}} :
            !(this.storeManager.verifyStoreOwner(store, user) || this.storeManager.verifyStoreManager(store, user)) ?
                { data: { result: false, ProductsNotRemoved: products } , error: { message: Error['E_NOT_AUTHORIZED']}} :
                store.removeProducts(products);
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
    const res:BoolResponse = this.userManager.setAdmin(userName);
    return res;
  }

}


