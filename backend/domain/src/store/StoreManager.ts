import { Store } from './internal_api'
import { logger, BoolResponse , errorMsg , UserRole} from '../api-int/internal_api'
import {RegisteredUser, StoreOwner, StoreManager as StoreManagerUser} from "../user/internal_api";
import {Item, Product} from "../trading_system/internal_api";
import * as Res from "../api-ext/Response";
import {Product as ProductReq, ProductCatalogNumber, ProductWithQuantity, Item as ItemReq} from "../api-ext/CommonInterface";
import * as Req from "../api-ext/Request";

export class StoreManager {

    private _stores: Store[];
    private _storeManagerAssigners: Map<RegisteredUser, RegisteredUser[] >;
    private _storeOwnerAssigners: Map<RegisteredUser, RegisteredUser[] >;

    constructor() {
        this._stores = [];
        this._storeManagerAssigners = new Map();
        this._storeOwnerAssigners = new Map();
    }

    addStore(storeName: string, owner: RegisteredUser) : BoolResponse {
        if(storeName !== ''){
            const newStore = new Store(storeName);
            newStore.setFirstOwner(owner);
            owner.setRole(UserRole.OWNER);
            this._stores.push(newStore);
            logger.debug(`successfully added store: ${JSON.stringify(newStore)} to system`)
            return {data: {result: true}}
        }
        else {
            logger.warn(`failed adding store ${storeName} to system`)
            return {data: {result: false}, error: {message: errorMsg["E_STORE_ADDITION"]}}
        }
    }

    verifyStoreExists(storeName: string) : boolean {
        for (let store of this._stores) {
            if (store.storeName === storeName)
                return true;
        }
        logger.warn(`could not verify store ${storeName}`);
        return false;
    }

    verifyStore(store: Store) {
        return store.storeName && store.storeName !== '' && store.UUID && store.UUID !== '';
    }

    verifyStoreOwner(storeName: string, user: RegisteredUser) : boolean {
        const store: Store = this.findStoreByName(storeName);
        return store ? store.verifyIsStoreOwner(user) : false;
    }

    verifyStoreManager(storeName: string, user: RegisteredUser) : boolean {
        const store: Store = this.findStoreByName(storeName);
        return store ? store.verifyIsStoreManager(user) : false;
    }

    verifyStoreOperation(storeName: string, user: RegisteredUser) : BoolResponse {
        const error: string = !this.verifyStoreExists(storeName) ? errorMsg['E_INVALID_STORE'] :
            !this.verifyStoreOwner(storeName, user) ? errorMsg['E_NOT_AUTHORIZED'] :
                !this.verifyStoreManager(storeName, user) ? errorMsg['E_NOT_AUTHORIZED'] : undefined;

        return error ? { data: { result: false }, error: { message: error } } : { data: { result: true } };
    }

    addItems(user: RegisteredUser, storeName: string, itemsReq: ItemReq[]) : Res.ItemsAdditionResponse {
        const operationValid: BoolResponse = this.verifyStoreOperation(storeName, user);

        if (!operationValid.data.result) {
            return { data: {result: false, itemsNotAdded: itemsReq}, error: operationValid.error };
        }

        const store: Store = this.findStoreByName(storeName);
        const items: Item[] = this.getItemsFromRequest(itemsReq);
        return store.addItems(items);
    }

    removeItems(user: RegisteredUser, storeName: string, itemsReq: ItemReq[]) : Res.ItemsRemovalResponse {
        const operationValid: BoolResponse = this.verifyStoreOperation(storeName, user);
        if (operationValid.error) {
            return { data: {result: false, itemsNotRemoved: itemsReq}, error: operationValid.error };
        }

        const store: Store = this.findStoreByName(storeName);
        const items: Item[] = this.getItemsFromRequest(itemsReq);
        return store.removeItems(items);

    }

    removeProductsWithQuantity(user: RegisteredUser, storeName: string, productsReq: ProductWithQuantity[]) : Res.ProductRemovalResponse {
        const operationValid: BoolResponse = this.verifyStoreOperation(storeName, user);
        if (operationValid.error) {
            return { data: {result: false, productsNotRemoved: productsReq}, error: operationValid.error };
        }

        const store: Store = this.findStoreByName(storeName);
        return store.removeProductsWithQuantity(productsReq);
    }

    addNewProducts(user: RegisteredUser, storeName: string, productsReq: ProductReq[]) : Res.ProductAdditionResponse {
        const operationValid: BoolResponse = this.verifyStoreOperation(storeName, user);
        if (operationValid.error) {
            return { data: {result: false, productsNotAdded: productsReq}, error: operationValid.error };
        }

        const store: Store = this.findStoreByName(storeName);
        const products: Product[] = this.getProductsFromRequest(productsReq);
        return store.addNewProducts(products);
    }

    removeProducts(user: RegisteredUser, storeName: string, products: ProductCatalogNumber[]) : Res.ProductRemovalResponse {
        const operationValid: BoolResponse = this.verifyStoreOperation(storeName, user);
        if (operationValid.error) {
            return { data: {result: false, productsNotRemoved: products}, error: operationValid.error };
        }

        const store: Store = this.findStoreByName(storeName);
        return store.removeProductsByCatalogNumber(products);
    }

    assignStoreOwner(storeName: string, userToAssign: RegisteredUser, userWhoAssigns: RegisteredUser) : BoolResponse {
        logger.debug(`user: ${JSON.stringify(userWhoAssigns.UUID)} requested to assign user:
                ${JSON.stringify(userToAssign.UUID)} as an owner in store: ${JSON.stringify(storeName)} `)

        const operationValid: BoolResponse = this.verifyStoreOperation(storeName, userWhoAssigns);
        if (!operationValid.data.result) {
            logger.warn(`user: ${JSON.stringify(userWhoAssigns.UUID)} failed to assign user:
                ${JSON.stringify(userToAssign.UUID)} as an owner in store: ${JSON.stringify(storeName)}. error: ${operationValid.error.message}`);
            return operationValid;
        }

        const store: Store = this.findStoreByName(storeName);

        if (store.verifyIsStoreOwner(userToAssign)) {   // already store owner
            const error = errorMsg['E_AL'];
            logger.warn(`user: ${JSON.stringify(userWhoAssigns.UUID)} failed to assign user:
                ${JSON.stringify(userToAssign.UUID)} as a manager in store: ${JSON.stringify(store.UUID)}. error: ${error}`);
            return {data : {result: false}, error : {message : error}};
        }

        logger.debug(`successfully assigned user: ${JSON.stringify(userToAssign.UUID)} as a manager in store: ${JSON.stringify(storeName)}, assigned by user ${userWhoAssigns.UUID}`)
        const additionRes: Res.BoolResponse = store.addStoreOwner(new StoreOwner(userToAssign.name, userWhoAssigns.password, userToAssign.UUID));
        if (additionRes.data.result)
            this.addStoreAssigner(userWhoAssigns, userToAssign, false);
        return additionRes;

    }

    assignStoreManager(storeName: string, userToAssign: RegisteredUser, userWhoAssigns: RegisteredUser) : BoolResponse {
        logger.debug(`user: ${JSON.stringify(userWhoAssigns.UUID)} requested to assign user:
                ${JSON.stringify(userToAssign.UUID)} as a manager in store: ${JSON.stringify(storeName)} `)

        const operationValid: BoolResponse = this.verifyStoreOperation(storeName, userWhoAssigns);
        if (operationValid.error) {
            logger.warn(`user: ${JSON.stringify(userWhoAssigns.UUID)} failed to assign user:
                ${JSON.stringify(userToAssign.UUID)} as a manager in store: ${JSON.stringify(storeName)}. error: ${operationValid.error.message}`);
            return operationValid;
        }

        const store: Store = this.findStoreByName(storeName);

        if (store.verifyIsStoreManager(userToAssign)) {   // already store manager
            const error = errorMsg['E_AL'];
            logger.warn(`user: ${JSON.stringify(userWhoAssigns.UUID)} failed to assign user:
                ${JSON.stringify(userToAssign.UUID)} as a manager in store: ${JSON.stringify(store.UUID)}. error: ${error}`);
            return {data : {result: false}, error : {message : error}};
        }

        logger.debug(`successfully assigned user: ${JSON.stringify(userToAssign.UUID)} as a manager in store: ${JSON.stringify(storeName)}, assigned by user ${userWhoAssigns.UUID}`)
        const additionRes: Res.BoolResponse = store.addStoreManager(new StoreManagerUser(userToAssign.name, userWhoAssigns.password, userWhoAssigns.UUID));
        if (additionRes.data.result)
            this.addStoreAssigner(userWhoAssigns, userToAssign, true);
        return additionRes;
    }

    findStoreByName(storeName: string): Store {
        for (let store of this._stores) {
            if (store.storeName === storeName)
                return store;
        }

        return undefined;
    }

    private addStoreAssigner(userToAssign: RegisteredUser, userWhoAssigns: RegisteredUser, isManager: boolean) :void{
        if (isManager) {
            let usersList: RegisteredUser[] = this._storeManagerAssigners.get(userWhoAssigns);
            usersList = usersList ? usersList.concat([userToAssign]) : [userToAssign];
            this._storeManagerAssigners.set(userWhoAssigns, usersList)
        }
        else {
            let usersList: RegisteredUser[] = this._storeOwnerAssigners.get(userWhoAssigns);
            usersList = usersList ? usersList.concat([userToAssign]) : [userToAssign];
            this._storeOwnerAssigners.set(userWhoAssigns, usersList)
        }
    }

    private getProductsFromRequest(productsReq: ProductReq[]) : Product[] {
        let products: Product[] = [];
        for (let productReq of productsReq){
            const product: Product = new Product(productReq.name, productReq.catalogNumber, productReq.price, productReq.category);
            products.push(product);
        }

        return products;
    }

    private getItemsFromRequest(itemsReq: ItemReq[]) : Item[] {
        let items: Item[] = [];
        for (let itemReq of itemsReq){
            const item: Item = new Item(itemReq.id, itemReq.catalogNumber);
            items.push(item);
        }

        return items;
    }

}