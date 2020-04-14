import { UserManager, RegisteredUser } from "../user/internal_api";
import { Item, Product } from "../trading_system/internal_api"
import { StoreManager, Store } from '../store/internal_api';
import * as Res from "../common/Response"
import * as Req from "../common/Request"

import { errorMsg as Error , errorMsg} from "../common/Error";
import {ExternalSystemsManager} from "../external_systems/internal_api"
import {BoolResponse, ExternalSystems, logger, OpenStoreRequest, SetAdminRequest} from "../common/internal_api";

export class TradingSystemManager {
    private userManager: UserManager;
    private storeManager: StoreManager;
    private externalSystems: ExternalSystemsManager;

    constructor() {
        this.userManager = new UserManager();
        this.storeManager = new StoreManager();
        this.externalSystems = new ExternalSystemsManager();
    }

    register(req:Req.RegisterRequest): BoolResponse {        
        const res = this.userManager.register(req);
        return res;
    }

    login(req:Req.LoginRequest): BoolResponse {        
        const res = this.userManager.login(req);
        return res;
    }

    logout(req:Req.LogoutRequest): BoolResponse {        
        const res = this.userManager.logout(req);
        return res;
    }

    getUserByName(userName: string) {
        return this.userManager.getUserByName(userName);
    }

    addItems(items: Item[], user: RegisteredUser, store: Store) : Res.StoreItemsAdditionResponse {
        logger.info(`trying to add items to store: ${JSON.stringify(store.UUID)} by user: ${JSON.stringify(user.UUID)}`);
        if (!this.userManager.isLoggedIn(user.UUID)) {
            const error = Error['E_NOT_LOGGED_IN'];
            logger.warn(error);
            return { data: { result: false, itemsNotAdded: items } , error: { message: error}};
        }

        const isOperationValid: Res.BoolResponse = this.storeManager.verifyStoreOperation(store, user);

        return isOperationValid.error ?
            { data: {result: false, itemsNotAdded: items} , error: isOperationValid.error} :
            store.addItems(items);
    }

    removeItems(items: Item[], user: RegisteredUser, store: Store) : Res.StoreItemsRemovalResponse {
        logger.info(`trying to remove items from store: ${JSON.stringify(store.UUID)} by user: ${JSON.stringify(user.UUID)}`);
        if (!this.userManager.isLoggedIn(user.UUID)) {
            const error = Error['E_NOT_LOGGED_IN'];
            logger.warn(error);
            return { data: { result: false, itemsNotRemoved: items } , error: { message: error}};
        }

        const isOperationValid: Res.BoolResponse = this.storeManager.verifyStoreOperation(store, user);

        return isOperationValid.error ?
            { data: {result: false, itemsNotRemoved: items} , error: isOperationValid.error} :
            store.removeItems(items);
    }

    removeProductsWithQuantity(products : Map<Product, number>, user: RegisteredUser, store: Store) : Res.StoreProductRemovalResponse {
        logger.info(`trying to remove items to store: ${JSON.stringify(store.UUID)} from user: ${JSON.stringify(user.UUID)}`);
        if (!this.userManager.isLoggedIn(user.UUID)) {
            const error = Error['E_NOT_LOGGED_IN'];
            logger.warn(error);
            return { data: { result: false, productsNotRemoved: Array.from(products.keys()) } , error: { message: error}};
        }

        const isOperationValid: Res.BoolResponse = this.storeManager.verifyStoreOperation(store, user);

        return isOperationValid.error ?
            { data: {result: false, productsNotRemoved: Array.from(products.keys())} , error: isOperationValid.error} :
            store.removeProductsWithQuantity(products);
    }

    addNewProducts(products: Product[], user: RegisteredUser, store: Store) : Res.StoreProductAdditionResponse {
        logger.info(`trying to add products to store: ${JSON.stringify(store.UUID)} by user: ${JSON.stringify(user.UUID)}`)
        if (!this.userManager.isLoggedIn(user.UUID)) {
            const error = Error['E_NOT_LOGGED_IN'];
            logger.warn(error);
            return { data: { result: false, productsNotAdded: products } , error: { message: error}};
        }

        const isOperationValid: Res.BoolResponse = this.storeManager.verifyStoreOperation(store, user);

        return isOperationValid.error ?
            { data: {result: false, productsNotAdded: products} , error: isOperationValid.error} :
            store.addNewProducts(products);
    }

    removeProducts(products: Product[], user: RegisteredUser, store: Store) : Res.StoreProductRemovalResponse {
        logger.info(`trying to remove products from store: ${JSON.stringify(store.UUID)} by user: ${JSON.stringify(user.UUID)}`)
        if (!this.userManager.isLoggedIn(user.UUID)) {
            const error = Error['E_NOT_LOGGED_IN'];
            logger.warn(error);
            return { data: { result: false, productsNotRemoved: products } , error: { message: error}};
        }

        const isOperationValid: Res.BoolResponse = this.storeManager.verifyStoreOperation(store, user);

        return isOperationValid.error ?
            { data: {result: false, productsNotRemoved: products} , error: isOperationValid.error} :
            store.removeProducts(products);
    }

    connectDeliverySys(): BoolResponse{
        logger.info('Trying to connect to delivery system');
        const res:BoolResponse = this.externalSystems.connectSystem(ExternalSystems.DELIVERY);
        return res;
    }

    connectPaymentSys(): BoolResponse{
        logger.info('Trying to connect to payment system');
        const res:BoolResponse = this.externalSystems.connectSystem(ExternalSystems.PAYMENT);
        return res;
    }

    setAdmin(setAdminRequest: SetAdminRequest): BoolResponse{
        logger.info(`user ${setAdminRequest.token} trying set ${setAdminRequest.body.newAdminUUID} as an admin`)
        const res:BoolResponse = this.userManager.setAdmin(setAdminRequest);
        return res;
    }

    createStore(storeReq: OpenStoreRequest) : BoolResponse{
        logger.info(`user ${storeReq.token} trying open store: ${storeReq.body.storeName}`)
        const u: RegisteredUser = this.userManager.getUserByToken(storeReq.token);
        if(!u) return {data: {result:false}, error:{message: errorMsg['E_NOT_AUTHORIZED']}}
        if(!this.userManager.isLoggedIn(u.UUID)) return {data: {result:false}, error:{message: errorMsg['E_NOT_LOGGED_IN']}}
        const res:BoolResponse = this.storeManager.addStore(storeReq.body.storeName, u);
        return res;
    }

}
