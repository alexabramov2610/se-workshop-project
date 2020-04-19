import {RegisteredUser, UserManager} from "../user/internal_api";
import {StoreManagement} from '../store/internal_api';
import * as Res from "../api-ext/Response"
import * as Req from "../api-ext/Request"
import {errorMsg} from "../api-int/Error";
import {ExternalSystemsManager} from "../external_systems/internal_api"
import {ExternalSystems, logger, UserRole,} from "../api-int/internal_api";
import {TradingSystemState} from "../api-ext/Enums";
import {v4 as uuid} from 'uuid';
import {User} from "../user/users/User";
import {Product} from "./data/Product";

export class TradingSystemManager {
    private userManager: UserManager;
    private storeManager: StoreManagement;
    private externalSystems: ExternalSystemsManager;
    private state: TradingSystemState;

    constructor() {
        this.userManager = new UserManager();
        this.storeManager = new StoreManagement();
        this.externalSystems = new ExternalSystemsManager();
        this.state = TradingSystemState.CLOSED;
    }

    startNewSession(): string {
        let newID: string = uuid();
        while (this.userManager.getUserByToken(newID)) {
            newID = uuid();
        }
        this.userManager.addGuestToken(newID);
        return newID;
    }

    OpenTradeSystem(req: Req.Request): Res.BoolResponse {
        const user: RegisteredUser = this.userManager.getLoggedInUserByToken(req.token);
        if (!user || !this.userManager.isAdmin(user)) return {data: {result: false}};
        this.state = TradingSystemState.OPEN;
        return {data: {result: true}};
    }

    GetTradeSystemState(req: Req.Request): Res.TradingSystemStateResponse {
        return {data: {state: this.state}};
    }

    register(req: Req.RegisterRequest): Res.BoolResponse {
        logger.info(`registering new user : ${req.body.username} `);
        const res = this.userManager.register(req);
        return res;
    }

    login(req: Req.LoginRequest): Res.BoolResponse {
        logger.info(`try to login ,${req.body.username} `);
        const res = this.userManager.login(req);
        if (res.data.result) {
            this.userManager.removeGuest(req.token);
        }
        return res;
    }

    logout(req: Req.LogoutRequest): Res.BoolResponse {
        const res = this.userManager.logout(req);
        if (!res.data.result) {
            this.userManager.addGuestToken(req.token)
        }
        return res;
    }

    changeProductName = (req: Req.ChangeProductNameRequest): Res.BoolResponse => {
        logger.info(`trying change product ${req.body.catalogNumber} name in store: ${req.body.storeName} to ${req.body.newName}`);
        ;
        const user: RegisteredUser = this.userManager.getLoggedInUserByToken(req.token)
        if (!user)
            return {data: {result: false}, error: {message: errorMsg.E_NOT_AUTHORIZED}};
        return this.storeManager.changeProductName(user, req.body.catalogNumber, req.body.storeName, req.body.newName);
    }

    changeProductPrice = (req: Req.ChangeProductPriceRequest): Res.BoolResponse => {
        logger.info(`trying change product ${req.body.catalogNumber} price in store: ${req.body.storeName} to ${req.body.newPrice}`);
        ;
        const user: RegisteredUser = this.userManager.getLoggedInUserByToken(req.token)
        if (!user)
            return {data: {result: false}, error: {message: errorMsg.E_NOT_AUTHORIZED}};
        return this.storeManager.changeProductPrice(user, req.body.catalogNumber, req.body.storeName, req.body.newPrice);
    }


    addItems(req: Req.ItemsAdditionRequest): Res.ItemsAdditionResponse {
        logger.info(`trying to add items to store: ${req.body.storeName}`);
        const user: RegisteredUser = this.userManager.getLoggedInUserByToken(req.token)
        if (!user)
            return {data: {result: false, itemsNotAdded: req.body.items}, error: {message: errorMsg.E_NOT_AUTHORIZED}};
        if (!user) return {
            data: {result: false, itemsNotAdded: req.body.items},
            error: {message: errorMsg.E_NOT_AUTHORIZED}
        };
        return this.storeManager.addItems(user, req.body.storeName, req.body.items);
    }

    removeItems(req: Req.ItemsRemovalRequest): Res.ItemsRemovalResponse {
        logger.info(`trying to remove items from store: ${req.body.storeName} `);
        const user: RegisteredUser = this.userManager.getLoggedInUserByToken(req.token)
        if (!user) return {
            data: {result: false, itemsNotRemoved: req.body.items},
            error: {message: errorMsg.E_NOT_AUTHORIZED}
        };
        return this.storeManager.removeItems(user, req.body.storeName, req.body.items);
    }

    removeProductsWithQuantity(req: Req.RemoveProductsWithQuantity): Res.ProductRemovalResponse {
        logger.info(`trying to remove items to store: ${req.body.storeName}`);
        const user: RegisteredUser = this.userManager.getLoggedInUserByToken(req.token)
        if (!user) return {
            data: {result: false, productsNotRemoved: req.body.products},
            error: {message: errorMsg.E_NOT_AUTHORIZED}
        };
        return this.storeManager.removeProductsWithQuantity(user, req.body.storeName, req.body.products);
    }

    addNewProducts(req: Req.AddProductsRequest): Res.ProductAdditionResponse {
        logger.info(`trying to add products to store: ${req.body.storeName}`)
        const user: RegisteredUser = this.userManager.getLoggedInUserByToken(req.token)
        if (!user) return {
            data: {result: false, productsNotAdded: req.body.products},
            error: {message: errorMsg.E_NOT_AUTHORIZED}
        };
        return this.storeManager.addNewProducts(user, req.body.storeName, req.body.products);
    }

    removeProducts(req: Req.ProductRemovalRequest): Res.ProductRemovalResponse {
        logger.info(`trying to remove products from store: ${req.body.storeName} `);
        const user: RegisteredUser = this.userManager.getLoggedInUserByToken(req.token)
        if (!user) return {
            data: {result: false, productsNotRemoved: req.body.products},
            error: {message: errorMsg.E_NOT_AUTHORIZED}
        };
        return this.storeManager.removeProducts(user, req.body.storeName, req.body.products);
    }

    assignStoreOwner(req: Req.AssignStoreOwnerRequest): Res.BoolResponse {
        logger.info(`requested to assign user as store owner of store: ${req.body.storeName}`)
        const usernameWhoAssigns: RegisteredUser = this.userManager.getLoggedInUserByToken(req.token)
        if (!usernameWhoAssigns) return {data: {result: false}, error: {message: errorMsg.E_NOT_AUTHORIZED}};
        const usernameToAssign: RegisteredUser = this.userManager.getUserByName(req.body.usernameToAssign)
        if (!usernameToAssign) return {data: {result: false}, error: {message: errorMsg.E_USER_DOES_NOT_EXIST}};
        return this.storeManager.assignStoreOwner(req.body.storeName, usernameToAssign, usernameWhoAssigns);
    }

    assignStoreManager(req: Req.AssignStoreManagerRequest): Res.BoolResponse {
        logger.info(`requested to assign user as store manager of store: ${req.body.storeName}`)
        const usernameWhoAssigns: RegisteredUser = this.userManager.getLoggedInUserByToken(req.token)
        if (!usernameWhoAssigns) return {data: {result: false}, error: {message: errorMsg.E_NOT_AUTHORIZED}};
        const usernameToAssign: RegisteredUser = this.userManager.getUserByName(req.body.usernameToAssign)
        if (!usernameToAssign) return {data: {result: false}, error: {message: errorMsg.E_USER_DOES_NOT_EXIST}};
        return this.storeManager.assignStoreManager(req.body.storeName, usernameToAssign, usernameWhoAssigns);
    }

    removeStoreOwner(req: Req.RemoveStoreOwnerRequest): Res.BoolResponse {
        logger.info(`user: ${JSON.stringify(req.token)} requested to assign user:
                ${JSON.stringify(req.body.usernameToRemove)} as an owner in store: ${JSON.stringify(req.body.storeName)} `)
        const usernameWhoRemoves: RegisteredUser = this.userManager.getLoggedInUserByToken(req.token)
        if (!usernameWhoRemoves) return {data: {result: false}, error: {message: errorMsg.E_NOT_AUTHORIZED}};
        const usernameToRemove: RegisteredUser = this.userManager.getUserByName(req.body.usernameToRemove)
        if (!usernameToRemove) return {data: {result: false}, error: {message: errorMsg.E_USER_DOES_NOT_EXIST}};
        return this.storeManager.removeStoreOwner(req.body.storeName, usernameToRemove, usernameWhoRemoves);
    }

    connectDeliverySys(req: Req.Request): Res.BoolResponse {
        logger.info('Trying to connect to delivery system');
        const res: Res.BoolResponse = this.externalSystems.connectSystem(ExternalSystems.DELIVERY);
        return res;
    }

    connectPaymentSys(req: Req.Request): Res.BoolResponse {
        logger.info('Trying to connect to payment system');
        const res: Res.BoolResponse = this.externalSystems.connectSystem(ExternalSystems.PAYMENT);
        return res;
    }

    setAdmin(req: Req.SetAdminRequest): Res.BoolResponse {
        logger.info(`trying to set ${req.body.newAdminUserName} as an admin`)
        const res: Res.BoolResponse = this.userManager.setAdmin(req);
        return res;
    }

    createStore(req: Req.OpenStoreRequest): Res.BoolResponse {
        logger.info(`open store request: ${req.body.storeName}`)
        const user: RegisteredUser = this.userManager.getLoggedInUserByToken(req.token)
        if (!user) return {data: {result: false}, error: {message: errorMsg.E_NOT_AUTHORIZED}}
        const res: Res.BoolResponse = this.storeManager.addStore(req.body.storeName, user);
        return res;
    }

    viewStorePurchasesHistory(req: Req.ViewShopPurchasesHistoryRequest): Res.ViewShopPurchasesHistoryResponse {
        const user: RegisteredUser = this.userManager.getLoggedInUserByToken(req.token)
        if (!user) return {data: {receipts: []}, error: {message: errorMsg.E_NOT_AUTHORIZED}}
        const res: Res.ViewShopPurchasesHistoryResponse = this.storeManager.viewStorePurchaseHistory(user, req.body.storeName);
        return res;
    }

    // @TODO RETURN VALUE?
    viewStoreInfo(req: Req.StoreInfoRequest) {
        return this.storeManager.viewStoreInfo(req.body.storeName);
    }

    removeManagerPermissions = (req: Req.ChangeManagerPermissionRequest) : Res.BoolResponse => {
        logger.info(`trying to remove user: ${req.body.managerToChange} permissions`);
        const user: RegisteredUser = this.userManager.getLoggedInUserByToken(req.token)
        if (!user)
            return {data: {result: false}, error: {message: errorMsg.E_NOT_AUTHORIZED}};
        return this.storeManager.removeManagerPermissions(user, req.body.storeName, req.body.managerToChange, req.body.permissions);;
    }

    addManagerPermissions = (req: Req.ChangeManagerPermissionRequest) : Res.BoolResponse => {
        logger.info(`trying to add user: ${req.body.managerToChange} permissions`);
        const user: RegisteredUser = this.userManager.getLoggedInUserByToken(req.token)
        if (!user)
            return {data: {result: false}, error: {message: errorMsg.E_NOT_AUTHORIZED}};
        return this.storeManager.addManagerPermissions(user, req.body.storeName, req.body.managerToChange, req.body.permissions);;
    }



    viewUsersContactUsMessages(req: Req.ViewUsersContactUsMessagesRequest): Res.ViewUsersContactUsMessagesResponse {
        const user: RegisteredUser = this.userManager.getLoggedInUserByToken(req.token)
        if (!user) return {data: {messages: []}, error: {message: errorMsg.E_NOT_AUTHORIZED}}
        const res: Res.ViewUsersContactUsMessagesResponse = this.storeManager.viewUsersContactUsMessages(user, req.body.storeName);
        return res;
    }

    viewProductInfo(req: Req.ProductInfoRequest): Res.BoolResponse {
        logger.info(`view product info request for store ${req.body.storeName} product number ${req.body.catalogNumber} `)
        const user: User = this.userManager.getUserByToken(req.token)
        if (!user)
            return {data: {result: false}, error: {message: errorMsg.E_NOT_AUTHORIZED}}
        return this.storeManager.viewProductInfo(req);
    }

    saveProductToCart(req: Req.SaveToCartRequest): Res.BoolResponse {
        logger.info(`saving product: ${req.body.catalogNumber} to ${req.token}  cart `)
        const user = this.userManager.getUserByToken(req.token);
        if (!user)
            return {data: {result: false}, error: {message: errorMsg.E_NOT_AUTHORIZED}}
        const store = this.storeManager.findStoreByName(req.body.storeName);
        if (!store)
            return {data: {result: false}, error: {message: errorMsg.E_NF}}
        const product: Product = store.getProductByCatalogNumber(req.body.catalogNumber)
        if (!product)
            return {data: {result: false}, error: {message: errorMsg.E_PROD_DOES_NOT_EXIST}};
        const inStock: boolean = store.isProductInStock(req.body.catalogNumber);
        if (!inStock)
            return {data: {result: false}, error: {message: errorMsg.E_STOCK}};

        logger.debug(` product: ${req.body.catalogNumber} added to ${req.token}  cart `)
        this.userManager.addProductToCart(user, product);
        return {data: {result: true}}
    }


}
