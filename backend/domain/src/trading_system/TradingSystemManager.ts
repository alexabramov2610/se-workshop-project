import {RegisteredUser, UserManager} from "../user/internal_api";
import {StoreManagement} from '../store/internal_api';
import {Req, Res} from 'se-workshop-20-interfaces'
import {errorMsg} from "../api-int/Error";
import {notificationMsg} from "../api-int/Notifications";
import {ExternalSystemsManager} from "../external_systems/internal_api"
import {EventCode, NotificationsType, TradingSystemState} from "se-workshop-20-interfaces/dist/src/Enums";
import {v4 as uuid} from 'uuid';
import {Product} from "./data/Product";
import {ExternalSystems, loggerW, UserRole,} from "../api-int/internal_api";
import {BagItem, IDiscountPolicy, IPurchasePolicy, Purchase} from "se-workshop-20-interfaces/dist/src/CommonInterface";
import {Receipt} from "./internal_api";
import {Publisher} from "publisher";
import {Event} from "se-workshop-20-interfaces/dist";
import {formatString} from "../api-int/utils";
import {logoutUserByName} from "../../index";

const logger = loggerW(__filename)

export class TradingSystemManager {
    private _userManager: UserManager;
    private _storeManager: StoreManagement;
    private readonly _externalSystems: ExternalSystemsManager;
    private state: TradingSystemState;
    private _publisher: Publisher;

    constructor() {
        this._publisher = new Publisher(logoutUserByName);
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

    openTradeSystem(req: Req.Request): Res.BoolResponse {
        logger.info(`opening trading system...`);
        const user: RegisteredUser = this._userManager.getLoggedInUserByToken(req.token);
        if (!user || !this._userManager.isAdmin(user))
            return {data: {result: false}};
        this.state = TradingSystemState.OPEN;
        return {data: {result: true}};
    }

    getTradeSystemState(req: Req.Request): Res.TradingSystemStateResponse {
        return {data: {state: this.state}};
    }

    register(req: Req.RegisterRequest): Res.BoolResponse {
        logger.info(`registering new user: ${req.body.username} `);
        const rUser: RegisteredUser = this._userManager.getLoggedInUserByToken(req.token);
        if (rUser) {
            logger.debug(`logged in user cant register `);
            return {data: {result: false}, error: {message: errorMsg.E_BAD_OPERATION}};
        }
        const res = this._userManager.register(req);
        return res;
    }

    login(req: Req.LoginRequest): Res.BoolResponse {
        logger.info(`logging in user: ${req.body.username} `);
        const res: Res.BoolResponse = this._userManager.login(req);
        if (res.data.result) {
            this._userManager.removeGuest(req.token);
            this._publisher.subscribe(req.body.username, EventCode.USER_EVENTS, "", "");
            this._userManager.getUserByName(req.body.username).pendingEvents.forEach(event => {
                event.code = EventCode.USER_EVENTS;
                this._publisher.notify(event);
            })
        } else {
            this._publisher.removeClient(req.body.username);
        }
        return res;
    }

    logout(req: Req.LogoutRequest): Res.BoolResponse {
        logger.info(`request received: logging out user... `);
        const user: RegisteredUser = this._userManager.getLoggedInUserByToken(req.token);
        const res: Res.BoolResponse = this._userManager.logout(req);
        if (res.data.result) {
            this._userManager.addGuestToken(req.token);
            this._publisher.removeClient(user.name);
            if (user)
                logger.info(`logged out user: ${user.name}`);
        }
        return res;
    }

    forceLogout(username: string): void {
        logger.info(`socket disconnected, logging out user: ${username}... `);
        const token: string = this._userManager.getTokenOfLoggedInUser(username);
        const req: Req.LogoutRequest = {body: {}, token};
        const user: RegisteredUser = this._userManager.getLoggedInUserByToken(token);
        const res: Res.BoolResponse = this._userManager.logout(req);
        if (res.data.result) {
            this._userManager.addGuestToken(req.token);
            if (user)
                logger.info(`logged out user: ${user.name}`);
        }
    }

    changeProductName(req: Req.ChangeProductNameRequest): Res.BoolResponse {
        logger.info(`trying to change product ${req.body.catalogNumber} name in store: ${req.body.storeName} to ${req.body.newName}`);
        const user: RegisteredUser = this._userManager.getLoggedInUserByToken(req.token)
        return this._storeManager.changeProductName(user, req.body.catalogNumber, req.body.storeName, req.body.newName);
    }

    changeProductPrice(req: Req.ChangeProductPriceRequest): Res.BoolResponse {
        logger.info(`trying to change product ${req.body.catalogNumber} price in store: ${req.body.storeName} to ${req.body.newPrice}`);
        const user: RegisteredUser = this._userManager.getLoggedInUserByToken(req.token)
        return this._storeManager.changeProductPrice(user, req.body.catalogNumber, req.body.storeName, req.body.newPrice);
    }

    addItems(req: Req.ItemsAdditionRequest): Res.ItemsAdditionResponse {
        logger.info(`trying to add items to store: ${req.body.storeName}`);
        const user: RegisteredUser = this._userManager.getLoggedInUserByToken(req.token)
        return this._storeManager.addItems(user, req.body.storeName, req.body.items);
    }

    removeItems(req: Req.ItemsRemovalRequest): Res.ItemsRemovalResponse {
        logger.info(`trying to remove items from store: ${req.body.storeName} `);
        const user: RegisteredUser = this._userManager.getLoggedInUserByToken(req.token)
        return this._storeManager.removeItems(user, req.body.storeName, req.body.items);
    }

    removeProductsWithQuantity(req: Req.RemoveProductsWithQuantity): Res.ProductRemovalResponse {
        logger.info(`trying to remove items to store: ${req.body.storeName}`);
        const user: RegisteredUser = this._userManager.getLoggedInUserByToken(req.token)
        return this._storeManager.removeProductsWithQuantity(user, req.body.storeName, req.body.products, false);
    }

    addNewProducts(req: Req.AddProductsRequest): Res.ProductAdditionResponse {
        logger.info(`trying to add products to store: ${req.body.storeName}`)
        const user: RegisteredUser = this._userManager.getLoggedInUserByToken(req.token)
        return this._storeManager.addNewProducts(user, req.body.storeName, req.body.products);
    }

    removeProducts(req: Req.ProductRemovalRequest): Res.ProductRemovalResponse {
        logger.info(`trying to remove products from store: ${req.body.storeName} `);
        const user: RegisteredUser = this._userManager.getLoggedInUserByToken(req.token)
        return this._storeManager.removeProducts(user, req.body.storeName, req.body.products);
    }

    assignStoreOwner(req: Req.AssignStoreOwnerRequest): Res.BoolResponse {
        logger.info(`requested to assign user: ${req.body.usernameToAssign} as store owner of store: ${req.body.storeName}`)
        const usernameWhoAssigns: RegisteredUser = this._userManager.getLoggedInUserByToken(req.token)
        const usernameToAssign: RegisteredUser = this._userManager.getUserByName(req.body.usernameToAssign)
        if (!usernameToAssign)
            return {data: {result: false}, error: {message: errorMsg.E_USER_DOES_NOT_EXIST}};
        const res: Res.BoolResponse = this._storeManager.assignStoreOwner(req.body.storeName, usernameToAssign, usernameWhoAssigns);
        if (res.data.result) {
            this.subscribeNewStoreOwner(req.body.usernameToAssign, req.body.storeName);
            const storeName: string = req.body.storeName;
            const msg: string = formatString(notificationMsg.M_ASSIGNED_AS_OWNER, [storeName]);
            const event: Event.StoreOwnerEvent = {
                username: req.body.usernameToAssign, code: EventCode.ASSIGNED_AS_STORE_OWNER, storeName,
                notification: {type: NotificationsType.GREEN, message: msg}
            };
            if (this._publisher.notify(event).length !== 0)
                usernameToAssign.saveNotification(event);
        }
        return res;
    }

    assignStoreManager(req: Req.AssignStoreManagerRequest): Res.BoolResponse {
        logger.info(`requested to assign user: ${req.body.usernameToAssign} as store manager of store: ${req.body.storeName}`)
        const usernameWhoAssigns: RegisteredUser = this._userManager.getLoggedInUserByToken(req.token)
        const usernameToAssign: RegisteredUser = this._userManager.getUserByName(req.body.usernameToAssign)
        if (!usernameToAssign)
            return {data: {result: false}, error: {message: errorMsg.E_USER_DOES_NOT_EXIST}};
        return this._storeManager.assignStoreManager(req.body.storeName, usernameToAssign, usernameWhoAssigns);
    }

    removeStoreOwner(req: Req.RemoveStoreOwnerRequest): Res.BoolResponse {
        logger.info(`user: ${JSON.stringify(req.token)} requested to remove user:
                ${JSON.stringify(req.body.usernameToRemove)} as an owner in store: ${JSON.stringify(req.body.storeName)} `)
        const usernameWhoRemoves: RegisteredUser = this._userManager.getLoggedInUserByToken(req.token)
        const usernameToRemove: RegisteredUser = this._userManager.getUserByName(req.body.usernameToRemove)
        if (!usernameToRemove)
            return {data: {result: false}, error: {message: errorMsg.E_USER_DOES_NOT_EXIST}};
        const res: Res.BoolResponse = this._storeManager.removeStoreOwner(req.body.storeName, usernameToRemove, usernameWhoRemoves);
        if (res.data.result) {
            const storeName: string = req.body.storeName;
            const msg: string = formatString(notificationMsg.M_REMOVED_AS_OWNER, [storeName]);
            const event: Event.StoreOwnerEvent = {
                username: req.body.usernameToRemove, code: EventCode.REMOVED_AS_STORE_OWNER, storeName,
                notification: {type: NotificationsType.GREEN, message: msg}
            };
            if (this._publisher.notify(event).length !== 0)
                usernameToRemove.saveNotification(event);

            this._publisher.unsubscribe(req.body.usernameToRemove, EventCode.REMOVED_AS_STORE_OWNER, req.body.storeName);
        }
        return res;
    }

    removeStoreManager(req: Req.RemoveStoreManagerRequest): Res.BoolResponse {
        logger.info(`user requested to remove user:
                ${req.body.usernameToRemove} as a manager in store: ${req.body.storeName} `)
        const usernameWhoRemoves: RegisteredUser = this._userManager.getLoggedInUserByToken(req.token)
        const usernameToRemove: RegisteredUser = this._userManager.getUserByName(req.body.usernameToRemove)
        if (!usernameToRemove)
            return {data: {result: false}, error: {message: errorMsg.E_USER_DOES_NOT_EXIST}};
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

        const res: Res.BoolResponse = this._storeManager.addStore(req.body.storeName, req.body.description, user);
        if (res.data.result)
            this.subscribeNewStoreOwner(user.name, req.body.storeName);
        return res;
    }

    viewStoreInfo(req: Req.StoreInfoRequest): Res.StoreInfoResponse {
        logger.info(`trying to retrieve store: ${req.body.storeName} info`);
        return this._storeManager.viewStoreInfo(req.body.storeName);
    }

    removeManagerPermissions(req: Req.ChangeManagerPermissionRequest): Res.BoolResponse {
        logger.info(`trying to remove user: ${req.body.managerToChange} permissions`);
        const user: RegisteredUser = this._userManager.getLoggedInUserByToken(req.token)
        return this._storeManager.removeManagerPermissions(user, req.body.storeName, req.body.managerToChange, req.body.permissions);
    }

    addManagerPermissions(req: Req.ChangeManagerPermissionRequest): Res.BoolResponse {
        logger.info(`trying to add user: ${req.body.managerToChange} permissions`);
        const user: RegisteredUser = this._userManager.getLoggedInUserByToken(req.token)
        return this._storeManager.addManagerPermissions(user, req.body.storeName, req.body.managerToChange, req.body.permissions);
    }

    viewUsersContactUsMessages(req: Req.ViewUsersContactUsMessagesRequest): Res.ViewUsersContactUsMessagesResponse {
        logger.info(`trying to retrieve store: ${req.body.storeName} contact us messages`);
        const user: RegisteredUser = this._userManager.getLoggedInUserByToken(req.token)
        const res: Res.ViewUsersContactUsMessagesResponse = this._storeManager.viewUsersContactUsMessages(user, req.body.storeName);
        return res;
    }

    viewProductInfo(req: Req.ProductInfoRequest): Res.ProductInfoResponse {
        logger.info(`view product info request for store ${req.body.storeName} product number ${req.body.catalogNumber} `)
        return this._storeManager.viewProductInfo(req);
    }

    saveProductToCart(req: Req.SaveToCartRequest): Res.BoolResponse {
        logger.info(`request to saving product: ${req.body.catalogNumber} to cart`)
        const amount: number = req.body.amount;
        if (amount <= 0)
            return {data: {result: false}, error: {message: errorMsg.E_ITEMS_ADD}}
        const user = this._userManager.getUserByToken(req.token);
        const store = this._storeManager.findStoreByName(req.body.storeName);
        if (!store)
            return {data: {result: false}, error: {message: errorMsg.E_INVALID_STORE}}
        const product: Product = store.getProductByCatalogNumber(req.body.catalogNumber)
        logger.debug(` product: ${req.body.catalogNumber} added to cart`)
        this._userManager.saveProductToCart(user, req.body.storeName, product, amount);
        return {data: {result: true}}
    }

    removeProductFromCart(req: Req.RemoveFromCartRequest): Res.BoolResponse {
        logger.info(`request to remove product: ${req.body.catalogNumber} from cart`)
        const user = this._userManager.getUserByToken(req.token);
        const store = this._storeManager.findStoreByName(req.body.storeName);
        if (!store)
            return {data: {result: false}, error: {message: errorMsg.E_NF}}
        const product: Product = store.getProductByCatalogNumber(req.body.catalogNumber)
        if (!product)
            return {data: {result: false}, error: {message: errorMsg.E_PROD_DOES_NOT_EXIST}};
        return this._userManager.removeProductFromCart(user, req.body.storeName, product, req.body.amount);
    }

    viewCart(req: Req.ViewCartReq): Res.ViewCartRes {
        return this._userManager.viewCart(req);
    }

    search(req: Req.SearchRequest): Res.SearchResponse {
        logger.info(`searching products`)
        return this._storeManager.search(req.body.filters, req.body.searchQuery);
    }

    calculateFinalPrices(req: Req.CalcFinalPriceReq): Res.CartFinalPriceRes {
        logger.info(`calculate final prices of user cart`)
        const user = this._userManager.getUserByToken(req.token);
        const cart: Map<string, BagItem[]> = this._userManager.getUserCart(user)
        let finalPrice: number = 0;
        for (const [storeName, bagItems] of cart.entries()) {
            const bagItemsWithPrices: BagItem[] = this._storeManager.calculateFinalPrices(storeName, bagItems)
            finalPrice = finalPrice + bagItemsWithPrices.reduce((acc, curr) => acc + curr.finalPrice, 0)
            cart.set(storeName, bagItemsWithPrices)
        }
        return {data: {result: true, price: finalPrice}}
    }

    verifyCart(req: Req.VerifyCartRequest): Res.BoolResponse {
        logger.info(`Verify that products in cart are on stock`)
        const user = this._userManager.getUserByToken(req.token);
        const cart: Map<string, BagItem[]> = this._userManager.getUserCart(user)
        if (cart.size === 0)
            return {data: {result: false}, error: {message: errorMsg.E_EMPTY_CART}}
        for (const [storeName, bagItems] of cart.entries()) {
            const result: Res.BoolResponse = this._storeManager.verifyStoreBag(storeName, bagItems)
            if (!result.data.result) {
                logger.debug(`product ${JSON.stringify(result.error.options)} not in stock`)
                return result;
            }
        }
        logger.debug(`All products on cart are available`)
        return {data: {result: true}}
    }

    pay(req: Req.PayRequest): Res.PaymentResponse {
        logger.info(`request to pay via external system`)
        const isPaid: boolean = this._externalSystems.paymentSystem.pay(req.body.price, req.body.payment.cardDetails);
        if (!isPaid)
            return {data: {result: false}, error: {message: errorMsg.E_PAY_FAILURE}}
        const lastCC4 = req.body.payment.cardDetails.number.slice(req.body.payment.cardDetails.number.length - 4, req.body.payment.cardDetails.number.length)
        logger.debug(`paid with credit card ${lastCC4}`)
        return {data: {result: true, payment: {totalCharged: req.body.price, lastCC4}}}
    }

    // pre condition: already calculated final prices and put them in bagItem.finalPrice
    purchase(req: Req.UpdateStockRequest): Res.PurchaseResponse {
        logger.info(`request to update the stock of stores (purchase)`)
        const user = this._userManager.getUserByToken(req.token);
        const rUser: RegisteredUser = this._userManager.getLoggedInUserByToken(req.token)
        const cart: Map<string, BagItem[]> = this._userManager.getUserCart(user)
        let purchases: Purchase[] = []
        for (const [storeName, bagItems] of cart.entries()) {
            purchases = purchases.concat(this._storeManager.purchaseFromStore(storeName, bagItems, rUser ? rUser.name : "guest", req.body.payment))
        }
        const receipt: Receipt = new Receipt(purchases, req.body.payment);
        if (rUser) {
            rUser.addReceipt(receipt)
        }
        user.resetCart();

        const username: string = rUser ? rUser.name : 'guest';
        this.notifyStoreOwnerOfNewPurchases(Array.from(cart.keys()), username);

        return {data: {result: true, receipt: {purchases, date: receipt.date, payment: req.body.payment}}}
    }

    notifyStoreOwnerOfNewPurchases(storeNames: string[], buyer: string) {
        storeNames.forEach(storeName => {
            const notification: Event.Notification = {
                message: formatString(notificationMsg.M_NEW_PURCHASE,
                    [storeName, buyer]), type: NotificationsType.GREEN
            };
            this._storeManager.findStoreByName(storeName).storeOwners.forEach(storeOwner => {
                const event: Event.NewPurchaseEvent = {
                    username: storeOwner.name,
                    code: EventCode.NEW_PURCHASE,
                    storeName,
                    notification
                };
                this._publisher.notify(event).forEach(userToNotify => { // if didn't send
                    this._userManager.getUserByName(userToNotify).saveNotification(event);
                });
            });
        });
    }

    verifyNewStore(req: Req.VerifyStoreName): Res.BoolResponse {
        logger.info(`request to verify new store details`)
        if (!req.body.storeName || req.body.storeName === '') {
            return {data: {result: false}, error: {message: errorMsg.E_BAD_STORE_NAME}}
        }
        if (this._storeManager.verifyStoreExists(req.body.storeName)) {
            return {data: {result: false}, error: {message: errorMsg.E_STORE_EXISTS}}
        }

        return {data: {result: true}};
    }

    verifyCredentials(req: Req.VerifyCredentialsReq): Res.BoolResponse {
        logger.info(`request to verify credentials`)
        return this._userManager.verifyCredentials(req);
    }

    viewManagerPermissions(req: Req.ViewManagerPermissionRequest): Res.ViewManagerPermissionResponse {
        logger.info(`request to view manager permissions`)
        const user: RegisteredUser = this._userManager.getLoggedInUserByToken(req.token)
        const manager: RegisteredUser = this._userManager.getUserByName(req.body.managerToView);
        return this._storeManager.viewManagerPermissions(user, manager, req);
    }


    addDiscount(req: Req.AddDiscountRequest): Res.AddDiscountResponse {
        logger.info(`request to add discount to store ${req.body.storeName}`)
        const user: RegisteredUser = this._userManager.getLoggedInUserByToken(req.token)
        return this._storeManager.addDiscount(user, req.body.storeName, req.body.discount)
    }

    removeDiscount(req: Req.RemoveDiscountRequest): Res.BoolResponse {
        logger.info(`request to remove discount id ${req.body.discountID} sat store ${req.body.storeName} to product ${req.body.catalogNumber}`)
        const user: RegisteredUser = this._userManager.getLoggedInUserByToken(req.token)
        return this._storeManager.removeProductDiscount(user, req.body.storeName, req.body.catalogNumber, req.body.discountID)
        return {data: {result: true}}
    }

    // methods that are available for admin also
    viewRegisteredUserPurchasesHistory(req: Req.ViewRUserPurchasesHistoryReq): Res.ViewRUserPurchasesHistoryRes {
        logger.info(`retrieving purchases history`)
        const user: RegisteredUser = this._userManager.getLoggedInUserByToken(req.token)
        const userToView: RegisteredUser = req.body.userName ? this._userManager.getUserByName(req.body.userName) : user;
        if (!userToView)
            return {data: {result: false, receipts: []}, error: {message: errorMsg.E_NOT_AUTHORIZED}}
        const isAdminReq: boolean = req.body.userName && user.role === UserRole.ADMIN;
        if (userToView.name !== user.name && !isAdminReq)
            return {data: {result: false, receipts: []}, error: {message: errorMsg.E_NOT_AUTHORIZED}}
        const res: Res.ViewRUserPurchasesHistoryRes = this._userManager.viewRegisteredUserPurchasesHistory(userToView);
        return res;
    }

    viewStorePurchasesHistory(req: Req.ViewShopPurchasesHistoryRequest): Res.ViewShopPurchasesHistoryResponse {
        logger.info(`Trying to get receipts from store: ${req.body.storeName}`);
        const user: RegisteredUser = this._userManager.getLoggedInUserByToken(req.token)
        const res: Res.ViewShopPurchasesHistoryResponse = this._storeManager.viewStorePurchaseHistory(user, req.body.storeName);
        return res;
    }


    setPurchasePolicy(req: Req.SetPurchasePolicyRequest): Res.BoolResponse {
        return {data: {result: false}};
    }

    setDiscountsPolicy(req: Req.SetDiscountsPolicyRequest): Res.BoolResponse {
        logger.info(`request to set discount policy to store ${req.body.storeName} `)
        const user: RegisteredUser = this._userManager.getLoggedInUserByToken(req.token)
        return this._storeManager.setDiscountPolicy(user, req.body.storeName, req.body.policy)
    }

    viewDiscountsPolicy(req: Req.ViewStoreDiscountsPolicyRequest): Res.ViewStoreDiscountsPolicyResponse {
        logger.info(`request to view discount policy of store ${req.body.storeName} `)
        const user: RegisteredUser = this._userManager.getLoggedInUserByToken(req.token)
        const policy: IDiscountPolicy = this._storeManager.getStoreDiscountPolicy(user, req.body.storeName)
        return {data: {policy}}
    }

    viewPurchasePolicy(req: Req.ViewStorePurchasePolicyRequest): Res.ViewStorePurchasePolicyResponse {
        logger.info(`request to view purchase policy of store ${req.body.storeName} `)
        const user: RegisteredUser = this._userManager.getLoggedInUserByToken(req.token)
        const policy: IPurchasePolicy = this._storeManager.getStorePurchasePolicy(user, req.body.storeName)
        return {data: {policy}}
    }

    deliver(req: Req.DeliveryRequest): Res.DeliveryResponse {
        logger.info(`request to deliver via external system`)
        const user = this._userManager.getUserByToken(req.token);
        const isDeliver: boolean = this._externalSystems.deliverySystem.deliver(req.body.userDetails.country, req.body.userDetails.city, req.body.userDetails.address);
        return isDeliver
            ? {data: {result: true, deliveryID: "1"}}
            : {data: {result: false}, error: {message: errorMsg.E_NOT_AUTHORIZED}};
    }

    verifyNewCredentials(req: Req.VerifyCredentialsReq): Res.BoolResponse {
        return this._userManager.verifyNewCredentials(req);
    }

    verifyUserLoggedIn(req: Req.Request): Res.BoolResponse {
        return this._userManager.getLoggedInUserByToken(req.token) ? {data: {result: true}} : {
            data: {result: false},
            error: {message: errorMsg.E_NOT_LOGGED_IN}
        }
    }

    verifyTokenExists(req: Req.Request): Res.BoolResponse {
        return this._userManager.getUserByToken(req.token) ? {data: {result: true}} : {
            data: {result: false},
            error: {message: errorMsg.E_BAD_TOKEN}
        }
    }

    verifyProductOnStock(req: Req.VerifyProductOnStock): Res.BoolResponse {
        return this._storeManager.verifyProductOnStock(req);
    }

    verifyProducts(req: Req.VerifyProducts) {
        return this._storeManager.verifyProducts(req);
    }

    verifyStorePermission(req: Req.VerifyStorePermission): Res.BoolResponse {
        const user = this._userManager.getLoggedInUserByToken(req.token)
        return this._storeManager.verifyStoreOperation(req.body.storeName, user, req.body.permission)
    }

    subscribeNewStoreOwner(username: string, storeName: string) {
        this._publisher.subscribe(username, EventCode.STORE_OWNER_EVENTS, storeName, storeName);
        this._publisher.subscribe(username, EventCode.USER_EVENTS, storeName, storeName);
    }

    async terminateSocket() {
        await this._publisher.terminateSocket();
    }

    // getSocket():any {
    //     return this._publisher.socket;
    // }

}
