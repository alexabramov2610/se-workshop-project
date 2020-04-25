import {Store} from './internal_api'
import {RegisteredUser, StoreManager, StoreOwner} from "../user/internal_api";
import {ContactUsMessage, Item, Product} from "../trading_system/internal_api";
import * as Res from "../api-ext/Response";
import * as Req from "../api-ext/Request";
import {
    BagItem,
    IItem, IPayment,
    IProduct as ProductReq,
    IReceipt,
    ProductCatalogNumber, ProductInStore,
    ProductWithQuantity, Purchase, SearchFilters, SearchQuery
} from "../api-ext/CommonInterface";
import {Receipt} from "../trading_system/data/Receipt";
import {ManagementPermission} from "../api-ext/Enums";
import {ExternalSystemsManager} from "../external_systems/ExternalSystemsManager";
import {errorMsg, loggerW, UserRole} from '../api-int/internal_api'

const logger = loggerW(__filename)

export class StoreManagement {
    private readonly _stores: Store[];
    private _storeManagerAssigners: Map<RegisteredUser, RegisteredUser[]>;
    private _storeOwnerAssigners: Map<RegisteredUser, RegisteredUser[]>;
    private _externalSystems: ExternalSystemsManager;

    constructor(externalSystems: ExternalSystemsManager) {
        this._externalSystems = externalSystems;
        this._stores = [];
        this._storeManagerAssigners = new Map();
        this._storeOwnerAssigners = new Map();
    }

    addStore(storeName: string, owner: RegisteredUser): Res.BoolResponse {
        if (this.verifyStoreExists(storeName)) {
            return {data: {result: false}, error: {message: errorMsg.E_STORE_EXISTS}}
        }
        if (!storeName || storeName === '') {
            logger.warn(`failed adding store ${storeName} to system`)
            return {data: {result: false}, error: {message: errorMsg.E_STORE_ADDITION}}
        }
        const newStore = new Store(storeName);
        newStore.setFirstOwner(owner);
        this._stores.push(newStore);
        logger.info(`successfully added store: ${newStore.storeName} with first owner: ${owner.name} to system`)
        return {data: {result: true}}

    }

    verifyStoreExists(storeName: string): boolean {
        for (const store of this._stores) {
            if (store.storeName === storeName)
                return true;
        }
        logger.debug(`store "${storeName}" doesn't exist`);
        return false;
    }

    isStoreLegal(store: Store): boolean {
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

    verifyStoreOperation(storeName: string, user: RegisteredUser, permission: ManagementPermission): Res.BoolResponse {
        let error: string;
        const store: Store = this.findStoreByName(storeName);
        if (!store)
            error = errorMsg.E_INVALID_STORE;
        else if (!store.verifyPermission(user.name, permission))
            error = errorMsg.E_NOT_AUTHORIZED;
        return error ? {data: {result: false}, error: {message: error}} : {data: {result: true}};
    }

    changeProductName = (user: RegisteredUser, catalogNumber: number, storeName: string, newProductName: string): Res.BoolResponse => {
        logger.debug(`changeProductName: ${user.name} changes product: ${catalogNumber} name in store: ${storeName} 
            to ${newProductName}`);
        const operationValid: Res.BoolResponse = this.verifyStoreOperation(storeName, user, ManagementPermission.MANAGE_INVENTORY);

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
        const operationValid: Res.BoolResponse = this.verifyStoreOperation(storeName, user, ManagementPermission.MANAGE_INVENTORY);

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

    addItems(user: RegisteredUser, storeName: string, itemsReq: IItem[]): Res.ItemsAdditionResponse {
        const operationValid: Res.BoolResponse = this.verifyStoreOperation(storeName, user, ManagementPermission.MANAGE_INVENTORY);

        if (!operationValid.data.result) {
            return {data: {result: false, itemsNotAdded: itemsReq}, error: operationValid.error};
        }

        const store: Store = this.findStoreByName(storeName);
        const items: Item[] = this.getItemsFromRequest(itemsReq);
        return store.addItems(items);
    }

    removeItems(user: RegisteredUser, storeName: string, itemsReq: IItem[]): Res.ItemsRemovalResponse {
        const operationValid: Res.BoolResponse = this.verifyStoreOperation(storeName, user, ManagementPermission.MANAGE_INVENTORY);
        if (!operationValid.data.result) {
            return {data: {result: false, itemsNotRemoved: itemsReq}, error: operationValid.error};
        }

        const store: Store = this.findStoreByName(storeName);
        const items: Item[] = this.getItemsFromRequest(itemsReq);
        return store.removeItems(items);

    }

    removeProductsWithQuantity(user: RegisteredUser, storeName: string, productsReq: ProductWithQuantity[], isReturnItems: boolean): Res.ProductRemovalResponse {
        const operationValid: Res.BoolResponse = this.verifyStoreOperation(storeName, user, ManagementPermission.MANAGE_INVENTORY);
        if (!operationValid.data.result) {
            return {data: {result: false, productsNotRemoved: productsReq}, error: operationValid.error};
        }

        const store: Store = this.findStoreByName(storeName);
        return store.removeProductsWithQuantity(productsReq, isReturnItems);
    }

    addNewProducts(user: RegisteredUser, storeName: string, productsReq: ProductReq[]): Res.ProductAdditionResponse {
        const operationValid: Res.BoolResponse = this.verifyStoreOperation(storeName, user, ManagementPermission.MANAGE_INVENTORY);
        if (!operationValid.data.result) {
            return {data: {result: false, productsNotAdded: productsReq}, error: operationValid.error};
        }

        const store: Store = this.findStoreByName(storeName);
        const products: Product[] = this.getProductsFromRequest(productsReq);
        return store.addNewProducts(products);
    }

    removeProducts(user: RegisteredUser, storeName: string, products: ProductCatalogNumber[]): Res.ProductRemovalResponse {
        const operationValid: Res.BoolResponse = this.verifyStoreOperation(storeName, user, ManagementPermission.MANAGE_INVENTORY);
        if (!operationValid.data.result) {
            return {data: {result: false, productsNotRemoved: products}, error: operationValid.error};
        }

        const store: Store = this.findStoreByName(storeName);
        return store.removeProductsByCatalogNumber(products);
    }

    assignStoreOwner(storeName: string, userToAssign: RegisteredUser, userWhoAssigns: RegisteredUser): Res.BoolResponse {
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

        logger.debug(`successfully assigned user: ${userToAssign.name} as an owner in store: ${storeName}, assigned by user ${userWhoAssigns.name}`)
        const additionRes: Res.BoolResponse = store.addStoreOwner(newUserToAssign);
        if (additionRes.data.result)
            userWhoAssignsOwner.assignStoreOwner(newUserToAssign);
        return additionRes;
    }

    assignStoreManager(storeName: string, userToAssign: RegisteredUser, userWhoAssigns: RegisteredUser): Res.BoolResponse {
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

        logger.debug(`successfully assigned user: ${userToAssign.name} as a manager in store: ${storeName}, assigned by user ${userWhoAssigns.name}`)
        const additionRes: Res.BoolResponse = store.addStoreManager(newUserToAssign);
        if (additionRes.data.result)
            userWhoAssignsOwner.assignStoreManager(newUserToAssign);
        return additionRes;
    }

    removeStoreOwner(storeName: string, userToRemove: RegisteredUser, userWhoRemoves: RegisteredUser): Res.BoolResponse {
        logger.debug(`user: ${JSON.stringify(userWhoRemoves.name)} requested to remove user:
                ${JSON.stringify(userToRemove.name)} as an owner in store: ${JSON.stringify(storeName)} `)
        let error: string;

        const store: Store = this.findStoreByName(storeName);
        if (!store) {
            error = errorMsg.E_INVALID_STORE;
            logger.warn(`user: ${userWhoRemoves.name} failed to remove user:
                ${userToRemove.name} as an owner in store: ${storeName}. error: ${error}`);
            return {data: {result: false}, error: {message: errorMsg.E_INVALID_STORE}};
        }

        const userWhoRemovesOwner: StoreOwner = store.getStoreOwner(userWhoRemoves.name);
        if (!userWhoRemovesOwner || userToRemove.name === userWhoRemoves.name) {
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

        if (!userWhoRemovesOwner.isAssignerOfOwner(userOwnerToRemove)) {
            error = errorMsg.E_NOT_ASSIGNER + userOwnerToRemove.name;
            logger.warn(`user: ${userWhoRemovesOwner.name} failed to remove owner:
                ${userOwnerToRemove.name}. error: ${error}`);
            return {data: {result: false}, error: {message: error}};
        }

        const additionRes: Res.BoolResponse = store.removeStoreOwner(userOwnerToRemove);
        if (additionRes.data.result)
            userWhoRemovesOwner.removeStoreOwner(userOwnerToRemove);
        return additionRes;
    }

    removeStoreManager(storeName: string, userToRemove: RegisteredUser, userWhoRemoves: RegisteredUser): Res.BoolResponse {
        logger.debug(`user: ${JSON.stringify(userWhoRemoves.name)} requested to remove user:
                ${JSON.stringify(userToRemove.name)} as a manager in store: ${JSON.stringify(storeName)} `)
        let error: string;

        const store: Store = this.findStoreByName(storeName);
        if (!store) {
            error = errorMsg.E_INVALID_STORE;
            logger.warn(`user: ${userWhoRemoves.name} failed to remove user:
                ${userToRemove.name} as a manager in store: ${storeName}. error: ${error}`);
            return {data: {result: false}, error: {message: errorMsg.E_INVALID_STORE}};
        }

        const userWhoRemovesOwner: StoreOwner = store.getStoreOwner(userWhoRemoves.name);
        if (!userWhoRemovesOwner || userToRemove.name === userWhoRemoves.name) {
            error = errorMsg.E_NOT_AUTHORIZED;
            logger.warn(`user: ${userWhoRemoves.name} failed to remove user:
                ${userToRemove.name} as a manager in store: ${storeName}. error: ${error}`);
            return {data: {result: false}, error: {message: errorMsg.E_NOT_AUTHORIZED}};
        }

        const userManagerToRemove: StoreManager = store.getStoreManager(userToRemove.name);
        if (!userManagerToRemove) {   // not store owner
            error = errorMsg.E_NOT_OWNER;
            logger.warn(`user: ${userWhoRemoves.name} failed to remove user:
                ${userToRemove.name} as a manager in store: ${storeName}. error: ${error}`);
            return {data: {result: false}, error: {message: error}};
        }

        if (!userWhoRemovesOwner.isAssignerOfManager(userManagerToRemove)) {
            error = errorMsg.E_NOT_ASSIGNER + userManagerToRemove.name;
            logger.warn(`user: ${userWhoRemovesOwner.name} failed to remove manager:
                ${userManagerToRemove.name}. error: ${error}`);
            return {data: {result: false}, error: {message: error}};
        }

        const additionRes: Res.BoolResponse = store.removeStoreManager(userManagerToRemove);
        if (additionRes.data.result)
            userWhoRemovesOwner.removeStoreManager(userManagerToRemove);
        return additionRes;
    }

    removeManagerPermissions = (userWhoChanges: RegisteredUser, storeName: string, managerToChange: string, permissions: ManagementPermission[]): Res.BoolResponse => {
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

    addManagerPermissions = (userWhoChanges: RegisteredUser, storeName: string, usernameToChange: string, permissions: ManagementPermission[]): Res.BoolResponse => {
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
        if (!store) return {data: {result: false, receipts: []}, error: {message: errorMsg.E_NF}}
        if (!store.verifyPermission(user.name, ManagementPermission.WATCH_PURCHASES_HISTORY) && (user.role !== UserRole.ADMIN)) return {
            data: {result: false, receipts: []},
            error: {message: errorMsg.E_PERMISSION}
        }
        const ireceipts: IReceipt[] = store.getPurchasesHistory().map(r => {
            return {purchases: r.purchases, date: r.date}
        })
        return {data: {result: true, receipts: ireceipts}}
    }

    viewProductInfo(req: Req.ProductInfoRequest): Res.ProductInfoResponse {
        const store = this.findStoreByName(req.body.storeName);
        if (!store)
            return {data: {result: false}, error: {message: errorMsg.E_NF}}
        const product = store.getProductByCatalogNumber(req.body.catalogNumber)
        if (product) {
            const quantity: number = store.getProductQuantity(product.catalogNumber);
            return {
                data: {
                    result: true,
                    info: {
                        name: product.name,
                        catalogNumber: product.catalogNumber,
                        price: product.price,
                        category: product.category,
                        quantity,
                        finalPrice: store.getProductFinalPrice(req.body.catalogNumber)
                    }
                }
            }
        } else {
            return {data: {result: false}, error: {message: errorMsg.E_PROD_DOES_NOT_EXIST}}
        }
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

    search(filters: SearchFilters, query: SearchQuery): Res.SearchResponse {
        if (query.storeName) {
            const store: Store = this.findStoreByName(query.storeName);
            if (!store)
                return {data: {result: false, products: []}, error: {message: errorMsg.E_INVALID_STORE}};
            if (!filters.storeRating || filters.storeRating === store.rating)
                return {data: {result: true, products: store.search(filters, query)}};
            else
                return {data: {result: true, products: []}};
        }

        let productsFound: ProductInStore[] = [];
        for (const store of this._stores) {
            if (typeof filters.storeRating === "undefined" || filters.storeRating === store.rating)
                productsFound = productsFound.concat(store.search(filters, query));
        }
        return {data: {result: true, products: productsFound}};
    }

    private getProductsFromRequest(productsReqs: ProductReq[]): Product[] {
        const products: Product[] = [];
        for (const productReq of productsReqs) {
            const product: Product = new Product(productReq.name, productReq.catalogNumber, productReq.price, productReq.category);
            products.push(product);
        }
        return products;
    }

    private getItemsFromRequest(itemsReq: IItem[]): Item[] {
        const items: Item[] = [];
        for (const itemReq of itemsReq) {
            const item: Item = new Item(itemReq.id, itemReq.catalogNumber);
            items.push(item);
        }
        return items;
    }

    private verifyPermissions(permissions: ManagementPermission[]): boolean {
        return permissions.reduce((acc, perm) => Object.values(ManagementPermission).includes(perm) || acc, false);
    }

    verifyStoreBag(storeName: string, bagItems: BagItem[]): Res.BoolResponse {
        const store: Store = this.findStoreByName(storeName);
        if (!store)
            return {data: {result: false}, error: {message: errorMsg.E_INVALID_STORE}};
        const notInStock: BagItem[] = bagItems.filter((bagItem) => (store.getProductQuantity(bagItem.product.catalogNumber) - bagItem.amount) < 0)
        return notInStock.length === 0 ? {data: {result: true}} : {
            data: {result: false},
            error: {message: errorMsg.E_STOCK, options: notInStock}
        }

    }

    purchaseFromStore(storeName: string, bagItems: BagItem[], userName: string, payment: IPayment): Purchase[] {
        const store: Store = this.findStoreByName(storeName);
        const purchases: Purchase[] = [];

        for (const bagItem of bagItems) {
            const items: Item[] = store.getItemsFromStock(bagItem.product, bagItem.amount)
            for (const item of items) {
                const outputItem: IItem = {catalogNumber: item.catalogNumber, id: item.id}
                purchases.push({storeName, userName, item: outputItem, price: bagItem.finalPrice})
            }
        }
        store.addReceipt(purchases, payment)
        return purchases
    }


    calculateFinalPrices(storeName: string, bagItems: BagItem[]): BagItem[] {
        const store: Store = this.findStoreByName(storeName);
        return bagItems.map((bagItem): BagItem => {
            return {
                product: bagItem.product,
                amount: bagItem.amount,
                finalPrice: store.getProductFinalPrice(bagItem.product.catalogNumber)
            }
        })
    }

    viewManagerPermissions(owner: RegisteredUser, manager: RegisteredUser, req: Req.ViewManagerPermissionRequest): Res.ViewManagerPermissionResponse {
        const store: Store = this.findStoreByName(req.body.storeName);
        if (!store)
            return {data: {result: false}, error: {message: errorMsg.E_INVALID_STORE}};
        const storeOwner: StoreOwner = store.getStoreOwner(owner.name)
        if (!storeOwner && manager.name !== owner.name)
            return {data: {result: false}, error: {message: errorMsg.E_PERMISSION}};
        const managerToView: StoreManager = store.getStoreManager(manager.name);
        if (!managerToView)
            return {data: {result: false}, error: {message: errorMsg.E_MANGER_NOT_EXISTS}};
        const permissions = managerToView.getPermissions();
        return {data: {result: true, permissions}}
    }
}