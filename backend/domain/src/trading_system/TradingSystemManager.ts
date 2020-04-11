import { UserManager, User } from "../user/internal_api";
import { Item, Product } from "../trading_system/internal_api"
import { StoreManager, Store } from '../store/internal_api';
import * as Responses from "../common/Response"
import {errorMsg as Error} from "../common/Error";
import {ExternalSystemsManager} from "../external_systems/internal_api"
import { BoolResponse,ExternalSystems,Logger } from "../common/internal_api";
import { Logger as logger } from "../common/Logger";

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
        logger.info(`trying to add items to store: ${JSON.stringify(store)} by user: ${JSON.stringify(user)}`);
        if (!this.userManager.isLoggedIn(user)) {
            const error = Error['E_NOT_LOGGED_IN'];
            logger.error(error);
            return { data: { result: false, itemsNotAdded: items } , error: { message: error}};
        }
        else if (!this.storeManager.verifyStoreExists(store)){
            const error = Error['E_INVALID_STORE'];
            logger.error(error);
            return { data: { result: false, itemsNotAdded: items } , error: { message: Error['E_INVALID_STORE']}};
        }
        else if (!(this.storeManager.verifyStoreOwner(store, user) || this.storeManager.verifyStoreManager(store, user))) {
            const error = Error['E_NOT_AUTHORIZED'];
            logger.error(error);
            return { data: { result: false, itemsNotAdded: items } , error: { message: Error['E_NOT_AUTHORIZED']}};
        }
        else {
            return store.addItems(items);
        }
    }

    removeItems(items: Item[], user: User, store: Store) : Responses.StoreItemsRemovalResponse {
        logger.info(`trying to remove items from store: ${JSON.stringify(store)} by user: ${JSON.stringify(user)}`);
        if (!this.userManager.isLoggedIn(user)) {
            const error = Error['E_NOT_LOGGED_IN'];
            logger.error(error);
            return { data: { result: false, itemsNotRemoved: items } , error: { message: error}};
        }
        else if (!this.storeManager.verifyStoreExists(store)){
            const error = Error['E_INVALID_STORE'];
            logger.error(error);
            return { data: { result: false, itemsNotRemoved: items } , error: { message: error}};
        }
        else if (!(this.storeManager.verifyStoreOwner(store, user) || this.storeManager.verifyStoreManager(store, user))) {
            const error = Error['E_NOT_AUTHORIZED'];
            logger.error(error);
            return { data: { result: false, itemsNotRemoved: items } , error: { message: error}};
        }
        else {
            return store.removeItems(items);
        }
    }

    removeProductsWithQuantity(products : Map<Product, number>, user: User, store: Store) : Responses.StoreProductRemovalResponse {
        logger.info(`trying to remove items to store: ${JSON.stringify(store)} from user: ${JSON.stringify(user)}`);
        if (!this.userManager.isLoggedIn(user)) {
            const error = Error['E_NOT_LOGGED_IN'];
            logger.error(error);
            return { data: { result: false, productsNotRemoved: Array.from(products.keys()) } , error: { message: error}};
        }
        else if (!this.storeManager.verifyStoreExists(store)){
            const error = Error['E_INVALID_STORE'];
            logger.error(error);
            return { data: { result: false, productsNotRemoved: Array.from(products.keys()) } , error: { message: error}};
        }
        else if (!(this.storeManager.verifyStoreOwner(store, user) || this.storeManager.verifyStoreManager(store, user))) {
            const error = Error['E_NOT_AUTHORIZED'];
            logger.error(error);
            return { data: { result: false, productsNotRemoved: Array.from(products.keys()) } , error: { message: error}};
        }
        else {
            return store.removeProductsWithQuantity(products);
        }
    }

    addNewProducts(products: Product[], user: User, store: Store) : Responses.StoreProductAdditionResponse {
        logger.info(`trying to add products to store: ${JSON.stringify(store)} by user: ${JSON.stringify(user)}`)
        if (!this.userManager.isLoggedIn(user)) {
            const error = Error['E_NOT_LOGGED_IN'];
            logger.error(error);
            return { data: { result: false, productsNotAdded: products } , error: { message: error}};
        }
        else if (!this.storeManager.verifyStoreExists(store)){
            const error = Error['E_INVALID_STORE'];
            logger.error(error);
            return { data: { result: false, productsNotAdded: products } , error: { message: error}};
        }
        else if (!(this.storeManager.verifyStoreOwner(store, user) || this.storeManager.verifyStoreManager(store, user))) {
            const error = Error['E_NOT_AUTHORIZED'];
            logger.error(error);
            return { data: { result: false, productsNotAdded: products } , error: { message: error}};
        }
        else {
            return store.addNewProducts(products);
        }
    }

    removeProducts(products: Product[], user: User, store: Store) : Responses.StoreProductRemovalResponse {
        logger.info(`trying to remove products from store: ${JSON.stringify(store)} by user: ${JSON.stringify(user)}`)
        if (!this.userManager.isLoggedIn(user)) {
            const error = Error['E_NOT_LOGGED_IN'];
            logger.error(error);
            return { data: { result: false, productsNotRemoved: products } , error: { message: error}};
        }
        else if (!this.storeManager.verifyStoreExists(store)){
            const error = Error['E_INVALID_STORE'];
            logger.error(error);
            return { data: { result: false, productsNotRemoved: products } , error: { message: error}};
        }
        else if (!(this.storeManager.verifyStoreOwner(store, user) || this.storeManager.verifyStoreManager(store, user))) {
            const error = Error['E_NOT_AUTHORIZED'];
            logger.error(error);
            return { data: { result: false, productsNotRemoved: products } , error: { message: error}};
        }
        else {
            return store.removeProducts(products);
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
        logger.info(`trying set ${userName} as an admin`)
        const res:BoolResponse = this.userManager.setAdmin(userName);
        return res;
    }

}
