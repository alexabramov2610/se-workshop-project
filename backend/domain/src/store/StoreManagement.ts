import {Store} from './internal_api'
import {BoolResponse, errorMsg, logger, UserRole} from '../api-int/internal_api'
import {RegisteredUser, StoreManager, StoreOwner} from "../user/internal_api";
import {ContactUsMessage, Item, Product} from "../trading_system/internal_api";
import * as Res from "../api-ext/Response";
import {
    Item as ItemReq,
    Product as ProductReq,
    ProductCatalogNumber,
    ProductWithQuantity
} from "../api-ext/CommonInterface";
import {Receipt} from "../trading_system/data/Receipt";
import {ManagementPermission} from "../api-ext/Enums";

export class StoreManagement {

    private _stores: Store[];
    private _storeManagerAssigners: Map<RegisteredUser, RegisteredUser[]>;
    private _storeOwnerAssigners: Map<RegisteredUser, RegisteredUser[]>;


    constructor() {
        this._stores = [];
        this._storeManagerAssigners = new Map();
        this._storeOwnerAssigners = new Map();
    }

    addStore(storeName: string, owner: RegisteredUser): BoolResponse {
        if (storeName !== '') {
            const newStore = new Store(storeName);
            newStore.setFirstOwner(owner);
            this._stores.push(newStore);
            logger.debug(`successfully added store: ${JSON.stringify(newStore)} to system`)
            return {data: {result: true}}
        } else {
            logger.warn(`failed adding store ${storeName} to system`)
            return {data: {result: false}, error: {message: errorMsg.E_STORE_ADDITION}}
        }
    }

    verifyStoreExists(storeName: string): boolean {
        for (const store of this._stores) {
            if (store.storeName === storeName)
                return true;
        }
        logger.warn(`could not verify store ${storeName}`);
        return false;
    }

    isStoreLegal(store: Store) : boolean {
        return store.storeName.length > 0 && store.UUID && store.UUID.length > 0;
    }

    verifyStoreOwner(storeName: string, user: RegisteredUser): boolean {
        const store: Store = this.findStoreByName(storeName);
        return store ? store.verifyIsStoreOwner(user.name) : false;
    }

    verifyStoreManager(storeName: string, user: RegisteredUser): boolean {
        const store: Store = this.findStoreByName(storeName);
        return store ? store.verifyIsStoreManager(user.name) : false;
    }

    verifyStoreOperation(storeName: string, user: RegisteredUser): BoolResponse {
        let error:string = undefined;
        if (!this.verifyStoreExists(storeName))
            error = errorMsg.E_INVALID_STORE;
        else if (!this.verifyStoreOwner(storeName, user) && !this.verifyStoreManager(storeName, user))
             error = errorMsg.E_NOT_AUTHORIZED;
        return error ? {data: {result: false}, error: {message: error}} : {data: {result: true}};
    }

    changeProductName = (user: RegisteredUser, catalogNumber: number, storeName: string, newProductName: string): Res.BoolResponse => {
        logger.debug(`changeProductName: ${user.name} changes product: ${catalogNumber} name in store: ${storeName} 
            to ${newProductName}`);
        const operationValid: BoolResponse = this.verifyStoreOperation(storeName, user);

        if (!operationValid.data.result)
            return {data: {result: false}, error: operationValid.error};

        const store: Store = this.findStoreByName(storeName);
        if (!store)
            return {data: {result: false}, error: {message: errorMsg.E_INVALID_STORE}};

        const product: Product = store.getProductByCatalogNumber(catalogNumber);
        if (!product)
            return {data: {result: false}, error: {message: errorMsg.E_PROD_DOES_NOT_EXIST}};

        product.name = newProductName;
        logger.debug(`changeProductName: successfully changed name`);
        return {data: {result: true}};
    }

    changeProductPrice = (user: RegisteredUser, catalogNumber: number, storeName: string, newPrice: number): Res.BoolResponse => {
        logger.debug(`changeProductName: ${user.name} changes product: ${catalogNumber} price in store: ${storeName} 
            to ${newPrice}`);
        const operationValid: BoolResponse = this.verifyStoreOperation(storeName, user);

        if (!operationValid.data.result)
            return {data: {result: false}, error: operationValid.error};

        const store: Store = this.findStoreByName(storeName);
        if (!store)
            return {data: {result: false}, error: {message: errorMsg.E_INVALID_STORE}};

        const product: Product = store.getProductByCatalogNumber(catalogNumber);
        if (!product)
            return {data: {result: false}, error: {message: errorMsg.E_PROD_DOES_NOT_EXIST}};

        product.price = newPrice;
        logger.debug(`changeProductName: successfully changed price`);
        return {data: {result: true}};
    }

    addItems(user: RegisteredUser, storeName: string, itemsReq: ItemReq[]): Res.ItemsAdditionResponse {
        const operationValid: BoolResponse = this.verifyStoreOperation(storeName, user);

        if (!operationValid.data.result) {
            return {data: {result: false, itemsNotAdded: itemsReq}, error: operationValid.error};
        }

        const store: Store = this.findStoreByName(storeName);
        const items: Item[] = this.getItemsFromRequest(itemsReq);
        return store.addItems(items);
    }

    removeItems(user: RegisteredUser, storeName: string, itemsReq: ItemReq[]): Res.ItemsRemovalResponse {
        const operationValid: BoolResponse = this.verifyStoreOperation(storeName, user);
        if (operationValid.error) {
            return {data: {result: false, itemsNotRemoved: itemsReq}, error: operationValid.error};
        }

        const store: Store = this.findStoreByName(storeName);
        const items: Item[] = this.getItemsFromRequest(itemsReq);
        return store.removeItems(items);

    }

    removeProductsWithQuantity(user: RegisteredUser, storeName: string, productsReq: ProductWithQuantity[]): Res.ProductRemovalResponse {
        const operationValid: BoolResponse = this.verifyStoreOperation(storeName, user);
        if (operationValid.error) {
            return {data: {result: false, productsNotRemoved: productsReq}, error: operationValid.error};
        }

        const store: Store = this.findStoreByName(storeName);
        return store.removeProductsWithQuantity(productsReq);
    }

    addNewProducts(user: RegisteredUser, storeName: string, productsReq: ProductReq[]): Res.ProductAdditionResponse {
        const operationValid: BoolResponse = this.verifyStoreOperation(storeName, user);
        if (operationValid.error) {
            return {data: {result: false, productsNotAdded: productsReq}, error: operationValid.error};
        }

        const store: Store = this.findStoreByName(storeName);
        const products: Product[] = this.getProductsFromRequest(productsReq);
        return store.addNewProducts(products);
    }

    removeProducts(user: RegisteredUser, storeName: string, products: ProductCatalogNumber[]): Res.ProductRemovalResponse {
        const operationValid: BoolResponse = this.verifyStoreOperation(storeName, user);
        if (operationValid.error) {
            return {data: {result: false, productsNotRemoved: products}, error: operationValid.error};
        }

        const store: Store = this.findStoreByName(storeName);
        return store.removeProductsByCatalogNumber(products);
    }

    assignStoreOwner(storeName: string, userToAssign: RegisteredUser, userWhoAssigns: RegisteredUser): BoolResponse {
        logger.debug(`user: ${userWhoAssigns.name} requested to assign user:
                ${userToAssign.name} as an owner in store: ${JSON.stringify(storeName)}`)

        let error: string;
        const store: Store = this.findStoreByName(storeName);
        if (!store) {
            error = errorMsg.E_INVALID_STORE;
            logger.warn(`user: ${userWhoAssigns.name} failed to assign user:
                ${userToAssign.name} as an owner in store: ${storeName}. error: ${error}`);
            return {data: {result: false}, error: {message: errorMsg.E_INVALID_STORE}};
        }

        const userWhoAssignsOwner: StoreOwner = store.getStoreOwner(userWhoAssigns.name);
        if (!userWhoAssignsOwner) {
            error = errorMsg.E_NOT_AUTHORIZED;
            logger.warn(`user: ${userWhoAssigns.name} failed to assign user:
                ${userToAssign.name} as an owner in store: ${storeName}. error: ${error}`);
            return {data: {result: false}, error: {message: errorMsg.E_NOT_AUTHORIZED}};
        }

        if (store.verifyIsStoreOwner(userToAssign.name)) {   // already store manager
            error = errorMsg.E_AL;
            logger.warn(`user: ${userWhoAssigns.name} failed to assign user:
                ${userToAssign.name} as an owner in store: ${storeName}. error: ${error}`);
            return {data: {result: false}, error: {message: error}};
        }

        const newUserToAssign: StoreOwner = new StoreOwner(userToAssign.name);

        logger.debug(`successfully assigned user: ${userToAssign} as an owner in store: ${storeName}, assigned by user ${userWhoAssigns.name}`)
        const additionRes: Res.BoolResponse = store.addStoreOwner(newUserToAssign);
        if (additionRes.data.result)
            userWhoAssignsOwner.assignStoreOwner(newUserToAssign);
        return additionRes;
    }

    assignStoreManager(storeName: string, userToAssign: RegisteredUser, userWhoAssigns: RegisteredUser): BoolResponse {
        logger.debug(`user: ${userWhoAssigns.name} requested to assign user:
                ${userToAssign.name} as a manager in store: ${storeName}`)
        let error: string;

        const store: Store = this.findStoreByName(storeName);
        if (!store) {
            error = errorMsg.E_INVALID_STORE;
            logger.warn(`user: ${userWhoAssigns.name} failed to assign user:
                ${userToAssign.name} as a manager in store: ${storeName}. error: ${error}`);
            return {data: {result: false}, error: {message: errorMsg.E_INVALID_STORE}};
        }

        const userWhoAssignsOwner: StoreOwner = store.getStoreOwner(userWhoAssigns.name);
        if (!userWhoAssignsOwner) {
            error = errorMsg.E_NOT_AUTHORIZED;
            logger.warn(`user: ${userWhoAssigns.name} failed to assign user:
                ${userToAssign.name} as a manager in store: ${storeName}. error: ${error}`);
            return {data: {result: false}, error: {message: errorMsg.E_NOT_AUTHORIZED}};
        }

        if (store.verifyIsStoreManager(userToAssign.name)) {   // already store manager
            error = errorMsg.E_AL;
            logger.warn(`user: ${userWhoAssigns.name} failed to assign user:
                ${userToAssign.name} as a manager in store: ${storeName}. error: ${error}`);
            return {data: {result: false}, error: {message: error}};
        }

        const newUserToAssign: StoreManager = new StoreManager(userToAssign.name);

        logger.debug(`successfully assigned user: ${userToAssign} as a manager in store: ${storeName}, assigned by user ${userWhoAssigns.name}`)
        const additionRes: Res.BoolResponse = store.addStoreManager(newUserToAssign);
        if (additionRes.data.result)
            userWhoAssignsOwner.assignStoreManager(newUserToAssign);
        return additionRes;
    }

    removeStoreOwner(storeName: string, userToRemove: RegisteredUser, userWhoRemoves: RegisteredUser): BoolResponse {
        logger.debug(`user: ${JSON.stringify(userWhoRemoves.name)} requested to assign user:
                ${JSON.stringify(userToRemove.name)} as an owner in store: ${JSON.stringify(storeName)} `)
        let error: string;

        const store: Store = this.findStoreByName(storeName);
        if (!store) {
            error = errorMsg.E_INVALID_STORE;
            logger.warn(`user: ${userWhoRemoves.name} failed to remove user:
                ${userToRemove.name} as an owner in store: ${storeName}. error: ${error}`);
            return {data: {result: false}, error: {message: errorMsg.E_INVALID_STORE}};
        }

        const userWhoAssignsOwner: StoreOwner = store.getStoreOwner(userWhoRemoves.name);
        if (!userWhoAssignsOwner) {
            error = errorMsg.E_NOT_AUTHORIZED;
            logger.warn(`user: ${userWhoRemoves.name} failed to remove user:
                ${userToRemove.name} as an owner in store: ${storeName}. error: ${error}`);
            return {data: {result: false}, error: {message: errorMsg.E_NOT_AUTHORIZED}};
        }

        const userOwnerToRemove: StoreOwner = store.getStoreOwner(userToRemove.name);
        if (!userOwnerToRemove) {   // not store owner
            error = errorMsg.E_NOT_OWNER;
            logger.warn(`user: ${userWhoRemoves.name} failed to remove user:
                ${userToRemove.name} as an owner in store: ${storeName}. error: ${error}`);
            return {data: {result: false}, error: {message: error}};
        }

        const additionRes: Res.BoolResponse = store.removeStoreOwner(userOwnerToRemove);
        if (additionRes.data.result)
            userWhoAssignsOwner.removeStoreOwner(userOwnerToRemove);
        return additionRes;
    }

    removeManagerPermissions = (userWhoChanges: RegisteredUser, storeName: string, managerToChange: string, permissions: ManagementPermission[]) : Res.BoolResponse => {
        logger.debug(`user: ${JSON.stringify(userWhoChanges.name)} requested to remove permissions from user: ${managerToChange}
         in store ${storeName}`)
        let error: string;

        const store: Store = this.findStoreByName(storeName);
        if (!store) {
            error = errorMsg.E_INVALID_STORE;
            logger.warn(`user: ${userWhoChanges.name} failed to remove permissions to user:
                ${managerToChange}. error: ${error}`);
            return {data: {result: false}, error: {message: errorMsg.E_INVALID_STORE}};
        }

        const userWhoAssignsOwner: StoreOwner = store.getStoreOwner(userWhoChanges.name);
        if (!userWhoAssignsOwner) {
            error = errorMsg.E_NOT_AUTHORIZED;
            logger.warn(`user: ${userWhoChanges.name} failed to remove permissions to user:
                ${managerToChange}. error: ${error}`);
            return {data: {result: false}, error: {message: errorMsg.E_NOT_AUTHORIZED}};
        }

        const userManagerToRemove: StoreManager = store.getStoreManager(managerToChange);
        if (!userManagerToRemove) {   // not store owner
            error = errorMsg.E_NOT_OWNER;
            logger.warn(`user: ${userWhoChanges.name} failed to remove permissions to user:
                ${managerToChange}. error: ${error}`);
            return {data: {result: false}, error: {message: error}};
        }

        if (!userWhoAssignsOwner.isAssignerOfManager(userManagerToRemove)) {
            error = errorMsg.E_NOT_ASSIGNER + managerToChange;
            logger.warn(`user: ${userWhoChanges.name} failed to remove permissions to user:
                ${managerToChange}. error: ${error}`);
            return {data: {result: false}, error: {message: error}};
        }

        if (!this.verifyPermissions(permissions)) {
            error = errorMsg.E_INVALID_PERM;
            logger.warn(`user: ${userWhoChanges.name} failed to add permissions to user:
                ${userWhoChanges}. error: ${error}`);
            return {data: {result: false}, error: {message: error}};
        }

        permissions.forEach(permission => userManagerToRemove.removePermission(permission));
        return {data: {result: true}};
    }

    addManagerPermissions = (userWhoChanges: RegisteredUser, storeName: string, usernameToChange: string, permissions: ManagementPermission[]) : Res.BoolResponse => {
        logger.debug(`user: ${JSON.stringify(userWhoChanges.name)} requested to add permissions from user: ${usernameToChange}
         in store ${storeName}`)
        let error: string;

        const store: Store = this.findStoreByName(storeName);
        if (!store) {
            error = errorMsg.E_INVALID_STORE;
            logger.warn(`user: ${userWhoChanges.name} failed to add permissions to user:
                ${usernameToChange}. error: ${error}`);
            return {data: {result: false}, error: {message: errorMsg.E_INVALID_STORE}};
        }

        const userWhoAssignsOwner: StoreOwner = store.getStoreOwner(userWhoChanges.name);
        if (!userWhoAssignsOwner) {
            error = errorMsg.E_NOT_AUTHORIZED;
            logger.warn(`user: ${userWhoChanges.name} failed to add permissions to user:
                ${usernameToChange}. error: ${error}`);
            return {data: {result: false}, error: {message: errorMsg.E_NOT_AUTHORIZED}};
        }

        const userManagerToAdd: StoreManager = store.getStoreManager(usernameToChange);
        if (!userManagerToAdd) {   // not store owner
            error = errorMsg.E_NOT_OWNER;
            logger.warn(`user: ${userWhoChanges.name} failed to add permissions to user:
                ${usernameToChange}. error: ${error}`);
            return {data: {result: false}, error: {message: error}};
        }

        if (!userWhoAssignsOwner.isAssignerOfManager(userManagerToAdd)) {
            error = errorMsg.E_NOT_ASSIGNER + usernameToChange;
            logger.warn(`user: ${userWhoChanges.name} failed to add permissions to user:
                ${usernameToChange}. error: ${error}`);
            return {data: {result: false}, error: {message: error}};
        }

        if (!this.verifyPermissions(permissions)) {
            error = errorMsg.E_INVALID_PERM;
            logger.warn(`user: ${userWhoChanges.name} failed to add permissions to user:
                ${usernameToChange}. error: ${error}`);
            return {data: {result: false}, error: {message: error}};
        }

        permissions.forEach(permission => userManagerToAdd.addPermission(permission));
        return {data: {result: true}};
    }

    findStoreByName(storeName: string): Store {
        for (const store of this._stores) {
            if (store.storeName === storeName)
                return store;
        }

        return undefined;
    }

    viewStoreInfo(storeName: string): Res.StoreInfoResponse {
        const store = this.findStoreByName(storeName);
        if (store) {
            return store.viewStoreInfo();
        } else {   // store not found
            return {data: {result: false}, error: {message: errorMsg.E_NF}}
        }

    }

    viewStorePurchaseHistory(user: RegisteredUser, storeName: string): Res.ViewShopPurchasesHistoryResponse {
        const store: Store = this.findStoreByName(storeName);
        if (!store) return {data: {receipts: []}, error: {message: errorMsg.E_NF}}
        if (!store.verifyPermission(user.name, ManagementPermission.WATCH_PURCHASES_HISTORY) && (user.role !== UserRole.ADMIN)) return {
            data: {receipts: []},
            error: {message: errorMsg.E_PERMISSION}
        }
        const receipts: Receipt[] = store.getPurchasesHistory();
        return {data: {receipts}}
    }

    private verifyPermissions(permissions: ManagementPermission[]) : boolean {
        return permissions.reduce((acc, perm) => Object.values(ManagementPermission).includes(perm) || acc, false);
    }

    viewUsersContactUsMessages(user: RegisteredUser, storeName: string): Res.ViewUsersContactUsMessagesResponse {
        const store: Store = this.findStoreByName(storeName);
        if (!store) return {data: {messages: []}, error: {message: errorMsg.E_NF}}
        if (!store.verifyPermission(user.name, ManagementPermission.WATCH_USER_QUESTIONS) && (user.role !== UserRole.ADMIN)) return {
            data: {messages: []},
            error: {message: errorMsg.E_PERMISSION}
        }
        const messages: ContactUsMessage[] = store.getContactUsMessages();
        return {data: {messages}}
    }

    private getProductsFromRequest(productsReqs: ProductReq[]): Product[] {
        const products: Product[] = [];
        for (const productReq of productsReqs) {
            const product: Product = new Product(productReq.name, productReq.catalogNumber, productReq.price, productReq.category);
            products.push(product);
        }
        return products;
    }

    private getItemsFromRequest(itemsReq: ItemReq[]): Item[] {
        const items: Item[] = [];
        for (const itemReq of itemsReq) {
            const item: Item = new Item(itemReq.id, itemReq.catalogNumber);
            items.push(item);
        }

        return items;
    }


}