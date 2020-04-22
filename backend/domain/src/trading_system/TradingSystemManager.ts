import {RegisteredUser, UserManager} from "../user/internal_api";
import {StoreManagement} from '../store/internal_api';
import * as Res from "../api-ext/Response"
import * as Req from "../api-ext/Request"
import {errorMsg} from "../api-int/Error";
import {ExternalSystemsManager} from "../external_systems/internal_api"
import {ExternalSystems, loggerW, UserRole,} from "../api-int/internal_api";
const logger = loggerW(__filename)
import {TradingSystemState} from "../api-ext/Enums";
import {v4 as uuid} from 'uuid';
import {User} from "../user/users/User";
import {Product} from "./data/Product";
import {TradingSystemManager as TS} from "../../dist/src/trading_system/TradingSystemManager";

export class TradingSystemManager {
    private _userManager: UserManager;
    private _storeManager: StoreManagement;
    private _externalSystems: ExternalSystemsManager;
    private state: TradingSystemState;

    constructor() {
        this._externalSystems = new ExternalSystemsManager();
        this._userManager = new UserManager(this._externalSystems);
        this._storeManager = new StoreManagement(this._externalSystems);
        this.state = TradingSystemState.CLOSED;
    }

    startNewSession(): string {
        logger.info(`starting new session...`);
        let newID: string = uuid();
        while (this._userManager.getUserByToken(newID)) {
            newID = uuid();
        }
        this._userManager.addGuestToken(newID);
        return newID;
    }

    OpenTradeSystem(req: Req.Request): Res.BoolResponse {
        logger.info(`opening trading system...`);
        const user: RegisteredUser = this._userManager.getLoggedInUserByToken(req.token);
        if (!user || !this._userManager.isAdmin(user)) return {data: {result: false}};
        this.state = TradingSystemState.OPEN;
        return {data: {result: true}};
    }

    GetTradeSystemState(req: Req.Request): Res.TradingSystemStateResponse {
        logger.info(`retrieving trading system state...`);
        return {data: {state: this.state}};
    }

    register(req: Req.RegisterRequest): Res.BoolResponse {
        logger.info(`registering new user: ${req.body.username} `);
        const user: RegisteredUser = this._userManager.getLoggedInUserByToken(req.token);
        if (user) {
            logger.debug(`logged in user cant register `);
            return {data: {result: false}, error: {message: errorMsg.E_BAD_OPERATION}};
        }
        const res = this._userManager.register(req);
        return res;
    }

    login(req: Req.LoginRequest): Res.BoolResponse {
        logger.info(`logging in user: ${req.body.username} `);
        const res = this._userManager.login(req);
        if (res.data.result) {
            this._userManager.removeGuest(req.token);
        }
        return res;
    }

    logout(req: Req.LogoutRequest): Res.BoolResponse {
        logger.info(`logging out user... `);
        const user: RegisteredUser = this._userManager.getLoggedInUserByToken(req.token);
        const res = this._userManager.logout(req);
        if (res.data.result) {
            this._userManager.addGuestToken(req.token);
            if (user)
                logger.info(`logged out user: ${user.name}`);
        }
        return res;
    }

    changeProductName = (req: Req.ChangeProductNameRequest): Res.BoolResponse => {
        logger.info(`trying to change product ${req.body.catalogNumber} name in store: ${req.body.storeName} to ${req.body.newName}`);
        const user: RegisteredUser = this._userManager.getLoggedInUserByToken(req.token)
        if (!user)
            return {data: {result: false}, error: {message: errorMsg.E_NOT_AUTHORIZED}};
        return this._storeManager.changeProductName(user, req.body.catalogNumber, req.body.storeName, req.body.newName);
    }

    changeProductPrice = (req: Req.ChangeProductPriceRequest): Res.BoolResponse => {
        logger.info(`trying to change product ${req.body.catalogNumber} price in store: ${req.body.storeName} to ${req.body.newPrice}`);
        const user: RegisteredUser = this._userManager.getLoggedInUserByToken(req.token)
        if (!user)
            return {data: {result: false}, error: {message: errorMsg.E_NOT_AUTHORIZED}};
        return this._storeManager.changeProductPrice(user, req.body.catalogNumber, req.body.storeName, req.body.newPrice);
    }

    addItems(req: Req.ItemsAdditionRequest): Res.ItemsAdditionResponse {
        logger.info(`trying to add items to store: ${req.body.storeName}`);
        const user: RegisteredUser = this._userManager.getLoggedInUserByToken(req.token)
        if (!user)
            return {data: {result: false, itemsNotAdded: req.body.items}, error: {message: errorMsg.E_NOT_AUTHORIZED}};
        if (!user) return {
            data: {result: false, itemsNotAdded: req.body.items},
            error: {message: errorMsg.E_NOT_AUTHORIZED}
        };
        return this._storeManager.addItems(user, req.body.storeName, req.body.items);
    }

    removeItems(req: Req.ItemsRemovalRequest): Res.ItemsRemovalResponse {
        logger.info(`trying to remove items from store: ${req.body.storeName} `);
        const user: RegisteredUser = this._userManager.getLoggedInUserByToken(req.token)
        if (!user) return {
            data: {result: false, itemsNotRemoved: req.body.items},
            error: {message: errorMsg.E_NOT_AUTHORIZED}
        };
        return this._storeManager.removeItems(user, req.body.storeName, req.body.items);
    }

    removeProductsWithQuantity(req: Req.RemoveProductsWithQuantity): Res.ProductRemovalResponse {
        logger.info(`trying to remove items to store: ${req.body.storeName}`);
        const user: RegisteredUser = this._userManager.getLoggedInUserByToken(req.token)
        if (!user) return {
            data: {result: false, productsNotRemoved: req.body.products},
            error: {message: errorMsg.E_NOT_AUTHORIZED}
        };
        return this._storeManager.removeProductsWithQuantity(user, req.body.storeName, req.body.products);
    }

    addNewProducts(req: Req.AddProductsRequest): Res.ProductAdditionResponse {
        logger.info(`trying to add products to store: ${req.body.storeName}`)
        const user: RegisteredUser = this._userManager.getLoggedInUserByToken(req.token)
        if (!user) return {
            data: {result: false, productsNotAdded: req.body.products},
            error: {message: errorMsg.E_NOT_AUTHORIZED}
        };
        return this._storeManager.addNewProducts(user, req.body.storeName, req.body.products);
    }

    removeProducts(req: Req.ProductRemovalRequest): Res.ProductRemovalResponse {
        logger.info(`trying to remove products from store: ${req.body.storeName} `);
        const user: RegisteredUser = this._userManager.getLoggedInUserByToken(req.token)
        if (!user) return {
            data: {result: false, productsNotRemoved: req.body.products},
            error: {message: errorMsg.E_NOT_AUTHORIZED}
        };
        return this._storeManager.removeProducts(user, req.body.storeName, req.body.products);
    }

    assignStoreOwner(req: Req.AssignStoreOwnerRequest): Res.BoolResponse {
        logger.info(`requested to assign user: ${req.body.usernameToAssign} as store owner of store: ${req.body.storeName}`)
        const usernameWhoAssigns: RegisteredUser = this._userManager.getLoggedInUserByToken(req.token)
        if (!usernameWhoAssigns) return {data: {result: false}, error: {message: errorMsg.E_NOT_AUTHORIZED}};
        const usernameToAssign: RegisteredUser = this._userManager.getUserByName(req.body.usernameToAssign)
        if (!usernameToAssign) return {data: {result: false}, error: {message: errorMsg.E_USER_DOES_NOT_EXIST}};
        return this._storeManager.assignStoreOwner(req.body.storeName, usernameToAssign, usernameWhoAssigns);
    }

    assignStoreManager(req: Req.AssignStoreManagerRequest): Res.BoolResponse {
        logger.info(`requested to assign user: ${req.body.usernameToAssign} as store manager of store: ${req.body.storeName}`)
        const usernameWhoAssigns: RegisteredUser = this._userManager.getLoggedInUserByToken(req.token)
        if (!usernameWhoAssigns) return {data: {result: false}, error: {message: errorMsg.E_NOT_AUTHORIZED}};
        const usernameToAssign: RegisteredUser = this._userManager.getUserByName(req.body.usernameToAssign)
        if (!usernameToAssign) return {data: {result: false}, error: {message: errorMsg.E_USER_DOES_NOT_EXIST}};
        return this._storeManager.assignStoreManager(req.body.storeName, usernameToAssign, usernameWhoAssigns);
    }

    removeStoreOwner(req: Req.RemoveStoreOwnerRequest): Res.BoolResponse {
        logger.info(`user: ${JSON.stringify(req.token)} requested to remove user:
                ${JSON.stringify(req.body.usernameToRemove)} as an owner in store: ${JSON.stringify(req.body.storeName)} `)
        const usernameWhoRemoves: RegisteredUser = this._userManager.getLoggedInUserByToken(req.token)
        if (!usernameWhoRemoves) return {data: {result: false}, error: {message: errorMsg.E_NOT_AUTHORIZED}};
        const usernameToRemove: RegisteredUser = this._userManager.getUserByName(req.body.usernameToRemove)
        if (!usernameToRemove) return {data: {result: false}, error: {message: errorMsg.E_USER_DOES_NOT_EXIST}};
        return this._storeManager.removeStoreOwner(req.body.storeName, usernameToRemove, usernameWhoRemoves);
    }

    removeStoreManager(req: Req.RemoveStoreManagerRequest): Res.BoolResponse {
        logger.info(`user: ${JSON.stringify(req.token)} requested to remove user:
                ${JSON.stringify(req.body.usernameToRemove)} as a manager in store: ${JSON.stringify(req.body.storeName)} `)
        const usernameWhoRemoves: RegisteredUser = this._userManager.getLoggedInUserByToken(req.token)
        if (!usernameWhoRemoves) return {data: {result: false}, error: {message: errorMsg.E_NOT_AUTHORIZED}};
        const usernameToRemove: RegisteredUser = this._userManager.getUserByName(req.body.usernameToRemove)
        if (!usernameToRemove) return {data: {result: false}, error: {message: errorMsg.E_USER_DOES_NOT_EXIST}};
        return this._storeManager.removeStoreManager(req.body.storeName, usernameToRemove, usernameWhoRemoves);
    }

    connectDeliverySys(req: Req.Request): Res.BoolResponse {
        logger.info('Trying to connect to delivery system');
        const res: Res.BoolResponse = this._externalSystems.connectSystem(ExternalSystems.DELIVERY);
        return res;
    }

    connectPaymentSys(req: Req.Request): Res.BoolResponse {
        logger.info('Trying to connect to payment system');
        const res: Res.BoolResponse = this._externalSystems.connectSystem(ExternalSystems.PAYMENT);
        return res;
    }

    setAdmin(req: Req.SetAdminRequest): Res.BoolResponse {
        logger.info(`trying to set ${req.body.newAdminUserName} as an admin`)
        const res: Res.BoolResponse = this._userManager.setAdmin(req);
        return res;
    }

    createStore(req: Req.OpenStoreRequest): Res.BoolResponse {
        logger.info(`open store request: ${req.body.storeName}`)
        const user: RegisteredUser = this._userManager.getLoggedInUserByToken(req.token)
        if (!user) return {data: {result: false}, error: {message: errorMsg.E_NOT_AUTHORIZED}}
        const res: Res.BoolResponse = this._storeManager.addStore(req.body.storeName, user);
        return res;
    }

    viewStorePurchasesHistory(req: Req.ViewShopPurchasesHistoryRequest): Res.ViewShopPurchasesHistoryResponse {
        logger.info(`Trying to get receipts from store: ${req.body.storeName}`);
        const user: RegisteredUser = this._userManager.getLoggedInUserByToken(req.token)
        if (!user) return {data: {result: false, receipts: []}, error: {message: errorMsg.E_NOT_AUTHORIZED}}
        const res: Res.ViewShopPurchasesHistoryResponse = this._storeManager.viewStorePurchaseHistory(user, req.body.storeName);
        return res;
    }

    viewStoreInfo(req: Req.StoreInfoRequest): Res.StoreInfoResponse {
        logger.info(`trying to retrieve store: ${req.body.storeName} info`);
        return this._storeManager.viewStoreInfo(req.body.storeName);
    }

    removeManagerPermissions = (req: Req.ChangeManagerPermissionRequest): Res.BoolResponse => {
        logger.info(`trying to remove user: ${req.body.managerToChange} permissions`);
        const user: RegisteredUser = this._userManager.getLoggedInUserByToken(req.token)
        if (!user)
            return {data: {result: false}, error: {message: errorMsg.E_NOT_AUTHORIZED}};
        return this._storeManager.removeManagerPermissions(user, req.body.storeName, req.body.managerToChange, req.body.permissions);
    }

    addManagerPermissions = (req: Req.ChangeManagerPermissionRequest): Res.BoolResponse => {
        logger.info(`trying to add user: ${req.body.managerToChange} permissions`);
        const user: RegisteredUser = this._userManager.getLoggedInUserByToken(req.token)
        if (!user)
            return {data: {result: false}, error: {message: errorMsg.E_NOT_AUTHORIZED}};
        return this._storeManager.addManagerPermissions(user, req.body.storeName, req.body.managerToChange, req.body.permissions);
    }

    viewUsersContactUsMessages(req: Req.ViewUsersContactUsMessagesRequest): Res.ViewUsersContactUsMessagesResponse {
        logger.info(`trying to retrieve store: ${req.body.storeName} contact us messages`);
        const user: RegisteredUser = this._userManager.getLoggedInUserByToken(req.token)
        if (!user) return {data: {messages: []}, error: {message: errorMsg.E_NOT_AUTHORIZED}}
        const res: Res.ViewUsersContactUsMessagesResponse = this._storeManager.viewUsersContactUsMessages(user, req.body.storeName);
        return res;
    }

    viewProductInfo(req: Req.ProductInfoRequest): Res.ProductInfoResponse {
        logger.info(`view product info request for store ${req.body.storeName} product number ${req.body.catalogNumber} `)
        const user: User = this._userManager.getUserByToken(req.token)
        if (!user)
            return {data: {result: false}, error: {message: errorMsg.E_NOT_AUTHORIZED}}
        return this._storeManager.viewProductInfo(req);
    }

    saveProductToCart(req: Req.SaveToCartRequest): Res.BoolResponse {
        logger.info(`saving product: ${req.body.catalogNumber} to ${req.token}  cart `)
        const user = this._userManager.getUserByToken(req.token);
        if (!user)
            return {data: {result: false}, error: {message: errorMsg.E_NOT_AUTHORIZED}}
        const store = this._storeManager.findStoreByName(req.body.storeName);
        if (!store)
            return {data: {result: false}, error: {message: errorMsg.E_NF}}
        const product: Product = store.getProductByCatalogNumber(req.body.catalogNumber)
        if (!product)
            return {data: {result: false}, error: {message: errorMsg.E_PROD_DOES_NOT_EXIST}};
        const inStock: boolean = store.isProductInStock(req.body.catalogNumber);
        if (!inStock)
            return {data: {result: false}, error: {message: errorMsg.E_STOCK}};

        logger.debug(` product: ${req.body.catalogNumber} added to ${req.token}  cart `)
        this._userManager.addProductToCart(user, product);
        return {data: {result: true}}
    }

    viewRegisteredUserPurchasesHistory(req: Req.ViewRUserPurchasesHistoryReq): Res.ViewRUserPurchasesHistoryRes {
        logger.info(`retrieving purchases history`)
        const user: RegisteredUser = this._userManager.getLoggedInUserByToken(req.token)
        if (!user)
            return {data: {result: false,receipts: []}, error: {message: errorMsg.E_NOT_AUTHORIZED}}
        const userToView: RegisteredUser = req.body.userName ? this._userManager.getUserByName(req.body.userName) : user;
        if (!userToView)
            return {data: {result: false ,receipts: []}, error: {message: errorMsg.E_NOT_AUTHORIZED}}
        const isAdminReq: boolean = req.body.userName && user.role === UserRole.ADMIN;
        if (userToView.name !== user.name && !isAdminReq)
            return {data: {result: false,receipts: []}, error: {message: errorMsg.E_NOT_AUTHORIZED}}
        const res: Res.ViewRUserPurchasesHistoryRes = this._userManager.viewRegisteredUserPurchasesHistory(userToView);
        return res;
    }

    search(req: Req.SearchRequest): Res.SearchResponse {
        logger.info(`searching products`)
        return this._storeManager.search(req.body.filters, req.body.searchQuery);
    }
}
