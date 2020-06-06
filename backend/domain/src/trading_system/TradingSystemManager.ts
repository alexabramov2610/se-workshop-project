import {RegisteredUser, User, UserManager} from "../user/internal_api";
import {Store, StoreManagement} from '../store/internal_api';
import {Req, Res} from 'se-workshop-20-interfaces'
import {errorMsg} from "../api-int/Error";
import {notificationMsg} from "../api-int/Notifications";
import {ExternalSystemsManager} from "../external_systems/internal_api"
import {
    EventCode,
    NotificationsType,
    ProductCategory,
    TradingSystemState
} from "se-workshop-20-interfaces/dist/src/Enums";
import {v4 as uuid} from 'uuid';
import {ExternalSystems, loggerW, StringTuple, UserRole} from "../api-int/internal_api";
import {
    BagItem,
    IDiscountPolicy,
    IPurchasePolicy, IReceipt,
    Purchase, StoreInfo, IProduct
} from "se-workshop-20-interfaces/dist/src/CommonInterface";
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

    //region admin ops
    async setAdmin(req: Req.SetAdminRequest): Promise<Res.BoolResponse> {
        logger.info(`setting ${req.body.newAdminUserName} as an admin`)
        const res: Res.BoolResponse = await this._userManager.setAdmin(req);
        return res;
    }

    openTradeSystem(req: Req.Request): Res.BoolResponse {
        logger.info(`opening trading system...`);
        this.state = TradingSystemState.OPEN;
        logger.info(`trading system has been successfully opened`);
        return {data: {result: true}};
    }
    //endregion

    // region basic ops
    async startNewSession(): Promise<string> {
        logger.info(`starting new session...`);
        const newID: string = uuid();
       // while (this._userManager.isTokenTaken(newID)) {
          //  newID = uuid();
       // }
        this._userManager.addGuestToken(newID);
        logger.debug(`Generated new token!... `);
        return newID;
    }

    async register(req: Req.RegisterRequest): Promise<Res.BoolResponse> {
        logger.info(`trying to register new user: ${req.body.username} `);

        const rUser: RegisteredUser = await this._userManager.getLoggedInUserByToken(req.token);
        if (rUser) {
            logger.debug(`logged in user, can't register`);
            return {data: {result: false}, error: {message: errorMsg.E_BAD_OPERATION}}
        }
        return this._userManager.register(req)
    }

    async login(req: Req.LoginRequest): Promise<Res.BoolResponse> {
        logger.info(`logging in user: ${req.body.username} `);
        const res: Res.BoolResponse = await this._userManager.login(req);
        if (res.data.result) {
            this._publisher.subscribe(req.body.username, EventCode.USER_EVENTS, "", "");
            const user: RegisteredUser = await this._userManager.getUserByName(req.body.username)
            if (user.pendingEvents.length > 0)
                logger.info(`sending ${user.pendingEvents.length} missing notifications..`)
            user.pendingEvents.forEach(event => {
                event.code = EventCode.USER_EVENTS;
                this._publisher.notify(event);
            })
        } else {
            this._publisher.removeClient(req.body.username);
        }
        return res;
    }

    async logout(req: Req.LogoutRequest): Promise<Res.BoolResponse> {
        logger.info(`logging out user... `);
        const user: RegisteredUser = await this._userManager.getLoggedInUserByToken(req.token);
        const res: Res.BoolResponse = await this._userManager.logout(req);
        if (user && res.data.result) {
            logger.info(`removing websocket client... `);
            this._publisher.removeClient(user.name);
            if (user)
                logger.info(`logged out user: ${user.name}`);
        }
        return res;
    }

    async createStore(req: Req.OpenStoreRequest): Promise<Res.BoolResponse> {
        logger.info(`creating store: ${req.body.storeName}`)
        const user: RegisteredUser = await this._userManager.getLoggedInUserByToken(req.token)

        const res: Res.BoolResponse = await this._storeManager.addStore(req.body.storeName, req.body.description, user);
        if (res.data.result) {
            this.subscribeNewStoreOwner(user.name, req.body.storeName);
            logger.debug(`successfully created store: ${req.body.storeName}`)
        }
        return res;
    }

    async saveProductToCart(req: Req.SaveToCartRequest): Promise<Res.BoolResponse> {
        logger.info(`saving product: ${req.body.catalogNumber} to cart`)
        const amount: number = req.body.amount;
        if (amount <= 0)
            return {data: {result: false}, error: {message: errorMsg.E_ITEMS_ADD}}
        const rUser: RegisteredUser = await this._userManager.getLoggedInUserByToken(req.token);

        const user: User = rUser ? rUser : this._userManager.getGuestByToken(req.token);

        const store: Store = await this._storeManager.findStoreByName(req.body.storeName);
        if (!store)
            return {data: {result: false}, error: {message: errorMsg.E_INVALID_STORE}}
        const product: IProduct = store.getProductByCatalogNumber(req.body.catalogNumber)
        if (user.cart.has(req.body.storeName)) {
            const storeBags: BagItem[] = user.cart.get(req.body.storeName);
            let currHoldingAmount: number = 0;
            storeBags.forEach(bag => {
                if (bag.product.catalogNumber === req.body.catalogNumber)
                    currHoldingAmount = bag.amount;
            })
            if (currHoldingAmount + amount > store.getProductQuantity(req.body.catalogNumber))
                return {data: {result: false}, error: {message: errorMsg.E_MAX_AMOUNT_REACHED}}
        }
        logger.debug(`product: ${req.body.catalogNumber} added to cart`)
        await this._userManager.saveProductToCart(user, req.body.storeName, product, amount, rUser ? false : true);
        return {data: {result: true}}
    }

    async removeProductFromCart(req: Req.RemoveFromCartRequest): Promise<Res.BoolResponse> {
        logger.info(`removing product: ${req.body.catalogNumber} from cart`)
        const rUser: RegisteredUser = await this._userManager.getLoggedInUserByToken(req.token);
        const user: User = rUser ? rUser : this._userManager.getGuestByToken(req.token);
        const store = await this._storeManager.findStoreByName(req.body.storeName);
        if (!store)
            return {data: {result: false}, error: {message: errorMsg.E_NF}}
        const product: IProduct = store.getProductByCatalogNumber(req.body.catalogNumber)
        if (!product)
            return {data: {result: false}, error: {message: errorMsg.E_PROD_DOES_NOT_EXIST}};
        return this._userManager.removeProductFromCart(user, req.body.storeName, product, req.body.amount, rUser);
    }

    async search(req: Req.SearchRequest): Promise<Res.SearchResponse> {
        logger.info(`searching products`)
        return this._storeManager.search(req.body.filters, req.body.searchQuery);
    }
    // endregion

    // region manage inventory
    async changeProductName(req: Req.ChangeProductNameRequest): Promise<Res.BoolResponse> {
        logger.info(`changing product ${req.body.catalogNumber} name in store: ${req.body.storeName} to ${req.body.newName}`);
        const user: RegisteredUser = await this._userManager.getLoggedInUserByToken(req.token)
        return this._storeManager.changeProductName(user, req.body.catalogNumber, req.body.storeName, req.body.newName);
    }

    async changeProductPrice(req: Req.ChangeProductPriceRequest): Promise<Res.BoolResponse> {
        logger.info(`changing product ${req.body.catalogNumber} price in store: ${req.body.storeName} to ${req.body.newPrice}`);
        const user: RegisteredUser = await this._userManager.getLoggedInUserByToken(req.token)
        return this._storeManager.changeProductPrice(user, req.body.catalogNumber, req.body.storeName, req.body.newPrice);
    }

    async addItems(req: Req.ItemsAdditionRequest): Promise<Res.ItemsAdditionResponse> {
        logger.info(`adding items to store: ${req.body.storeName}`);
        const user: RegisteredUser = await this._userManager.getLoggedInUserByToken(req.token)
        return this._storeManager.addItems(user, req.body.storeName, req.body.items);
    }

    async removeItems(req: Req.ItemsRemovalRequest): Promise<Res.ItemsRemovalResponse> {
        logger.info(`removing items from store: ${req.body.storeName} `);
        const user: RegisteredUser = await this._userManager.getLoggedInUserByToken(req.token)
        return this._storeManager.removeItems(user, req.body.storeName, req.body.items);
    }

    async addNewProducts(req: Req.AddProductsRequest): Promise<Res.ProductAdditionResponse> {
        logger.info(`adding products to store: ${req.body.storeName}`)
        const user: RegisteredUser = await this._userManager.getLoggedInUserByToken(req.token)
        return this._storeManager.addNewProducts(user, req.body.storeName, req.body.products);
    }

    async removeProducts(req: Req.ProductRemovalRequest): Promise<Res.ProductRemovalResponse> {
        logger.info(`removing products from store: ${req.body.storeName} `);
        const user: RegisteredUser = await this._userManager.getLoggedInUserByToken(req.token)
        return this._storeManager.removeProducts(user, req.body.storeName, req.body.products);
    }
    // endregion

    //region manage managers & owners
    async assignStoreOwner(req: Req.AssignStoreOwnerRequest): Promise<Res.BoolResponse> {
        logger.info(`assigning user: ${req.body.usernameToAssign} as store owner of store: ${req.body.storeName}`)
        const usernameWhoAssigns: RegisteredUser = await this._userManager.getLoggedInUserByToken(req.token)
        const usernameToAssign: RegisteredUser = await this._userManager.getUserByName(req.body.usernameToAssign)
        if (!usernameToAssign)
            return {data: {result: false}, error: {message: errorMsg.E_USER_DOES_NOT_EXIST}};
        const res: Res.BoolResponse = await this._storeManager.assignStoreOwner(req.body.storeName, usernameToAssign, usernameWhoAssigns);
        if (res.data.result) {
            logger.info(`successfully assigned user: ${req.body.usernameToAssign} as store owner of store: ${req.body.storeName}`)
            this.subscribeNewStoreOwner(req.body.usernameToAssign, req.body.storeName);
            const storeName: string = req.body.storeName;
            const msg: string = formatString(notificationMsg.M_ASSIGNED_AS_OWNER, [storeName]);
            const event: Event.StoreOwnerEvent = {
                username: req.body.usernameToAssign, code: EventCode.ASSIGNED_AS_STORE_OWNER, storeName,
                notification: {type: NotificationsType.GREEN, message: msg}
            };
            if (this._publisher.notify(event).length !== 0)
                usernameToAssign.saveNotification(event);           // todo: store in db
        }
        return res;
    }

    async removeStoreOwner(req: Req.RemoveStoreOwnerRequest): Promise<Res.BoolResponse> {
        logger.info(`removing user: ${req.body.usernameToRemove} as an owner in store: ${req.body.storeName} `);

        const usernameWhoRemoves: RegisteredUser = await this._userManager.getLoggedInUserByToken(req.token)
        const usernameToRemove: RegisteredUser = await this._userManager.getUserByName(req.body.usernameToRemove)
        if (!usernameToRemove)
            return {data: {result: false}, error: {message: errorMsg.E_USER_DOES_NOT_EXIST}};

        const res: Res.RemoveStoreOwnerResponse = await this._storeManager.removeStoreOwner(req.body.storeName, usernameToRemove, usernameWhoRemoves);

        if (res.data.result) {
            logger.info(`successfully removed user: ${req.body.usernameToRemove} as store owner of store: ${req.body.storeName}`)
            const msg: string = formatString(notificationMsg.M_REMOVED_AS_OWNER, [req.body.storeName]);

            const events: Event.StoreOwnerEvent[] = res.data.owners.reduce((acc, curr) =>
                acc.concat({
                    username: curr[1], code: EventCode.REMOVED_AS_STORE_OWNER, storeName: req.body.storeName,
                    notification: {type: NotificationsType.GREEN, message: msg}
                }), []);

            for (const event of events) {
                if (this._publisher.notify(event).length !== 0) {
                    const u = await this._userManager.getUserByName(event.username)
                    u.saveNotification(event);      // todo: store in db
                }
                this._publisher.unsubscribe(event.username, EventCode.REMOVED_AS_STORE_OWNER, req.body.storeName);
            }
        }
        return { data: { result: res.data.result }, error: { message: res.error.message ? res.error.message : "" } };
    }

    async assignStoreManager(req: Req.AssignStoreManagerRequest): Promise<Res.BoolResponse> {
        logger.info(`assigning user: ${req.body.usernameToAssign} as store manager of store: ${req.body.storeName}`)
        const usernameWhoAssigns: RegisteredUser = await this._userManager.getLoggedInUserByToken(req.token)
        const usernameToAssign: RegisteredUser = await this._userManager.getUserByName(req.body.usernameToAssign)
        if (!usernameToAssign)
            return {data: {result: false}, error: {message: errorMsg.E_USER_DOES_NOT_EXIST}};
        if (req.body.usernameToAssign === usernameWhoAssigns.name)
            return {data: {result: false}, error: {message: errorMsg.E_ASSIGN_SELF}};
        return this._storeManager.assignStoreManager(req.body.storeName, usernameToAssign, usernameWhoAssigns);
    }

    async removeStoreManager(req: Req.RemoveStoreManagerRequest): Promise<Res.BoolResponse> {
        logger.info(`removing user: ${req.body.usernameToRemove} as a manager in store: ${req.body.storeName}`)
        const usernameWhoRemoves: RegisteredUser = await this._userManager.getLoggedInUserByToken(req.token)
        const usernameToRemove: RegisteredUser = await this._userManager.getUserByName(req.body.usernameToRemove)
        if (!usernameToRemove)
            return {data: {result: false}, error: {message: errorMsg.E_USER_DOES_NOT_EXIST}};
        return this._storeManager.removeStoreManager(req.body.storeName, usernameToRemove, usernameWhoRemoves);
    }
    // endregion

    //region manage permission
    async addManagerPermissions(req: Req.ChangeManagerPermissionRequest): Promise<Res.BoolResponse> {
        logger.info(`adding permissions for user: ${req.body.managerToChange}`);
        const user: RegisteredUser = await this._userManager.getLoggedInUserByToken(req.token)
        return this._storeManager.addManagerPermissions(user, req.body.storeName, req.body.managerToChange, req.body.permissions);
    }

    async removeManagerPermissions(req: Req.ChangeManagerPermissionRequest): Promise<Res.BoolResponse> {
        logger.info(`removing permissions for user: ${req.body.managerToChange}`);
        const user: RegisteredUser = await this._userManager.getLoggedInUserByToken(req.token)
        return this._storeManager.removeManagerPermissions(user, req.body.storeName, req.body.managerToChange, req.body.permissions);
    }

    async viewManagerPermissions(req: Req.ViewManagerPermissionRequest): Promise<Res.ViewManagerPermissionResponse> {
        logger.info(`viewing manager permissions`);
        return this._storeManager.getManagerPermissions(req.body.managerToView, req.body.storeName);
    }

    async getManagerPermissions(req: Req.ViewManagerPermissionRequest): Promise<Res.ViewManagerPermissionResponse> {
        logger.info(`viewing manager permissions`);
        const user: RegisteredUser = await this._userManager.getLoggedInUserByToken(req.token)
        if (!user)
            return {data: {result: false, permissions: []}, error: {message: errorMsg.E_NOT_LOGGED_IN}}
        return this._storeManager.getManagerPermissions(user.name, req.body.storeName);
    }
    //endregion

    //region info
    viewCart(req: Req.ViewCartReq): Promise<Res.ViewCartRes> {
        return this._userManager.viewCart(req);
    }

    async viewStoreInfo(req: Req.StoreInfoRequest): Promise<Res.StoreInfoResponse> {
        logger.info(`retrieving store: ${req.body.storeName} info`);
        return this._storeManager.viewStoreInfo(req.body.storeName);
    }

    async viewProductInfo(req: Req.ProductInfoRequest): Promise<Res.ProductInfoResponse> {
        logger.info(`viewing product number: ${req.body.catalogNumber} info in store ${req.body.storeName}`)
        return this._storeManager.viewProductInfo(req);
    }
    //endregion

    //region needs testing

    // TODO: test after purchase is working
    async viewRegisteredUserPurchasesHistory(req: Req.ViewRUserPurchasesHistoryReq): Promise<Res.ViewRUserPurchasesHistoryRes> {
        logger.info(`retrieving purchases history`)
        const user: RegisteredUser = await this._userManager.getLoggedInUserByToken(req.token)
        const userToView: RegisteredUser = (req.body && req.body.userName) ? await this._userManager.getUserByName(req.body.userName) : user;
        if (!userToView)
            return {data: {result: false, receipts: []}, error: {message: errorMsg.E_NOT_AUTHORIZED}}
        const isAdminReq: boolean = req.body && req.body.userName && user.role === UserRole.ADMIN;
        if (userToView.name !== user.name && !isAdminReq)
            return {data: {result: false, receipts: []}, error: {message: errorMsg.E_NOT_AUTHORIZED}}
        return this._userManager.viewRegisteredUserPurchasesHistory(userToView);
    }

    // TODO: test after purchase is working
    async viewStorePurchasesHistory(req: Req.ViewShopPurchasesHistoryRequest): Promise<Res.ViewShopPurchasesHistoryResponse> {
        logger.info(`retrieving receipts from store: ${req.body.storeName}`);
        const user: RegisteredUser = await this._userManager.getLoggedInUserByToken(req.token)
        return this._storeManager.viewStorePurchaseHistory(user, req.body.storeName);
    }
    //endregion



    getTradeSystemState(): Res.TradingSystemStateResponse {
        return {data: {state: this.state}};
    }

    forceLogout(username: string): void {
        logger.info(`socket disconnected (user: ${username})`);
        const token: string = this._userManager.getTokenOfLoggedInUser(username);
        const req: Req.LogoutRequest = {body: {}, token};
        this.logout(req);
    }




    connectDeliverySys(req: Req.Request): Res.BoolResponse {
        logger.info('connecting to delivery system');
        const res: Res.BoolResponse = this._externalSystems.connectSystem(ExternalSystems.DELIVERY);
        return res;
    }

    connectPaymentSys(req: Req.Request): Res.BoolResponse {
        logger.info('connecting to payment system');
        const res: Res.BoolResponse = this._externalSystems.connectSystem(ExternalSystems.PAYMENT);
        return res;
    }





    async calculateFinalPrices(req: Req.CalcFinalPriceReq): Promise<Res.CartFinalPriceRes> {
        logger.info(`calculating final prices of user cart`)
        const user = await this._userManager.getUserByToken(req.token);
        const cart: Map<string, BagItem[]> = this._userManager.getUserCart(user)
        let finalPrice: number = 0;
        for (const [storeName, bagItems] of cart.entries()) {
            const bagItemsWithPrices: BagItem[] = await this._storeManager.calculateFinalPrices(storeName, bagItems)
            finalPrice = finalPrice + bagItemsWithPrices.reduce((acc, curr) => acc + curr.finalPrice, 0)
            cart.set(storeName, bagItemsWithPrices)
        }
        return {data: {result: true, price: finalPrice}}
    }

    async verifyStorePolicy(req: Req.VerifyPurchasePolicy): Promise<Res.BoolResponse> {
        logger.info(`verifying purchase policy for user cart`)
        const user: User = await this._userManager.getUserByToken(req.token);

        const cart: Map<string, BagItem[]> = this._userManager.getUserCart(user)
        for (const [storeName, bagItems] of cart.entries()) {
            const u: RegisteredUser = await this._userManager.getLoggedInUserByToken(req.token);
            const isPolicyOk: Res.BoolResponse = await this._storeManager.verifyStorePolicy(u, storeName, bagItems)
            if (!isPolicyOk.data.result) {
                logger.warn(`purchase policy verification failed in store ${storeName} `)
                return isPolicyOk;
            }
        }
        return {data: {result: true}}
    }

    async verifyCart(req: Req.VerifyCartRequest): Promise<Res.BoolResponse> {
        logger.info(`verifying products in cart are on stock`)
        const user = await this._userManager.getUserByToken(req.token);
        const cart: Map<string, BagItem[]> = this._userManager.getUserCart(user)
        if (cart.size === 0)
            return {data: {result: false}, error: {message: errorMsg.E_EMPTY_CART}}
        for (const [storeName, bagItems] of cart.entries()) {
            const result: Res.BoolResponse = await this._storeManager.verifyStoreBag(storeName, bagItems)
            if (!result.data.result) {
                logger.debug(`product ${JSON.stringify(result.error.options)} not in stock`)
                return result;
            }
        }
        logger.debug(`All products on cart are available`)
        return {data: {result: true}}
    }

    async pay(req: Req.PayRequest): Promise<Res.PaymentResponse> {
        logger.info(`trying to pay using external system`)
        const isPaid: boolean = this._externalSystems.paymentSystem.pay(req.body.price, req.body.payment.cardDetails);
        if (!isPaid)
            return {data: {result: false}, error: {message: errorMsg.E_PAY_FAILURE}}
        const lastCC4 = req.body.payment.cardDetails.number.slice(req.body.payment.cardDetails.number.length - 4, req.body.payment.cardDetails.number.length)
        logger.debug(`paid with credit card ${lastCC4}`)
        return {data: {result: true, payment: {totalCharged: req.body.price, lastCC4}}}
    }

    // pre condition: already calculated final prices and put them in bagItem.finalPrice
    async purchase(req: Req.UpdateStockRequest): Promise<Res.PurchaseResponse> {
        logger.info(`purchase request: updating the stock of stores`)
        const user: User = await this._userManager.getUserByToken(req.token);
        const rUser: RegisteredUser = await this._userManager.getLoggedInUserByToken(req.token)
        const cart: Map<string, BagItem[]> = this._userManager.getUserCart(user)
        let purchases: Purchase[] = [];
        logger.info(`purchase request: purchasing from relevant stores`)
        for (const [storeName, bagItems] of cart.entries()) {
            const newPurchase = await this._storeManager.purchaseFromStore(storeName, bagItems, rUser ? rUser.name : "guest", req.body.payment)
            purchases = purchases.concat(newPurchase)
        }
        // TODO const receipt: IReceipt = new Receipt(purchases, req.body.payment);
        const receipt: IReceipt = {date: undefined, purchases: []}
        if (rUser) {
            rUser.addReceipt(receipt)
        }
        user.resetCart();

        logger.info(`purchase request: succesfully purchased`)
        const username: string = rUser ? rUser.name : 'guest';
        this.notifyStoreOwnerOfNewPurchases(Array.from(cart.keys()), username);

        return {data: {result: true, receipt: {purchases, date: receipt.date, payment: req.body.payment}}}
    }

    async notifyStoreOwnerOfNewPurchases(storeNames: string[], buyer: string): Promise<void> {
        // TODO
        // logger.info(`notifying store owners about new purchase`)
        // // tslint:disable-next-line:forin
        // for (const storeName in storeNames) {
        //     const notification: Event.Notification = {
        //         message: formatString(notificationMsg.M_NEW_PURCHASE,
        //             [storeName, buyer]), type: NotificationsType.GREEN
        //     };
        //     const store: Store = await this._storeManager.findStoreByName(storeName);
        //     store.storeOwners.forEach(storeOwner => {
        //         const event: Event.NewPurchaseEvent = {
        //             username: storeOwner.name,
        //             code: EventCode.NEW_PURCHASE,
        //             storeName,
        //             notification
        //         };
        //         this._publisher.notify(event).forEach(async (userToNotify) => { // if didn't send
        //             const u = await this._userManager.getUserByName(userToNotify)
        //             u.saveNotification(event);
        //         });
        //     });
        // }
    }

    async verifyNewStore(req: Req.VerifyStoreName): Promise<Res.BoolResponse> {
        logger.info(`verifying new store details`)
        if (!req.body.storeName || req.body.storeName === '')
            return {data: {result: false}, error: {message: errorMsg.E_BAD_STORE_NAME}};
        const storeExists: boolean = await this._storeManager.verifyStoreExists(req.body.storeName);
        if (storeExists) {
            logger.warn(`verifyNewStore: ${errorMsg.E_STORE_EXISTS}`);
            return {data: {result: false}, error: {message: errorMsg.E_STORE_EXISTS}}
        }
        return {data: {result: true}};
    }

    verifyCredentials(req: Req.VerifyCredentialsReq): Promise<Res.BoolResponse> {
        logger.info(`verifying credentials`)
        return this._userManager.verifyCredentials(req);
    }


    // methods that are available for admin also




    async setPurchasePolicy(req: Req.SetPurchasePolicyRequest): Promise<Res.BoolResponse> {
        logger.info(`setting discount policy to store ${req.body.storeName} `)
        const user: RegisteredUser = await this._userManager.getLoggedInUserByToken(req.token)
        return this._storeManager.setPurchasePolicy(user, req.body.storeName, req.body.policy)
    }

    async setDiscountsPolicy(req: Req.SetDiscountsPolicyRequest): Promise<Res.BoolResponse> {
        logger.info(`setting discount policy to store ${req.body.storeName} `)
        const user: RegisteredUser = await this._userManager.getLoggedInUserByToken(req.token)
        return this._storeManager.setDiscountPolicy(user, req.body.storeName, req.body.policy)
    }

    async viewDiscountsPolicy(req: Req.ViewStoreDiscountsPolicyRequest): Promise<Res.ViewStoreDiscountsPolicyResponse> {
        logger.info(`retrieving discount policy of store ${req.body.storeName} `)
        const user: RegisteredUser = await this._userManager.getLoggedInUserByToken(req.token)
        const policy: IDiscountPolicy = await this._storeManager.getStoreDiscountPolicy(user, req.body.storeName)
        return {data: {policy}}
    }

    async viewPurchasePolicy(req: Req.ViewStorePurchasePolicyRequest): Promise<Res.ViewStorePurchasePolicyResponse> {
        logger.info(`retrieving purchase policy of store ${req.body.storeName} `)
        const user: RegisteredUser = await this._userManager.getLoggedInUserByToken(req.token)
        const policy: IPurchasePolicy = await this._storeManager.getStorePurchasePolicy(user, req.body.storeName)
        return {data: {policy}}
    }

    async deliver(req: Req.DeliveryRequest): Promise<Res.DeliveryResponse> {
        logger.info(`trying to deliver using external system`)
        const user = this._userManager.getUserByToken(req.token);
        const isDeliver: boolean = this._externalSystems.deliverySystem.deliver(req.body.userDetails.country, req.body.userDetails.city, req.body.userDetails.address);
        return isDeliver
            ? {data: {result: true, deliveryID: "1"}}
            : {data: {result: false}, error: {message: errorMsg.E_NOT_AUTHORIZED}};
    }

    verifyNewCredentials(req: Req.VerifyCredentialsReq): Res.BoolResponse {
        logger.info(`verifying new credentials`)
        const res: Res.BoolResponse = this._userManager.verifyNewCredentials(req);
        if (res.data.result)
            logger.info(`verified credentials successfully`);
        else
            logger.warn(`failed verifying credentials`);
        return res;
    }

    async verifyUserLoggedIn(req: Req.Request): Promise<Res.BoolResponse> {

        logger.debug(`checking if user is logged in`)
        return await this._userManager.getLoggedInUserByToken(req.token) ? {data: {result: true}} : {
            data: {result: false},
            error: {message: errorMsg.E_NOT_LOGGED_IN}
        }
    }

    async verifyTokenExists(req: Req.Request): Promise<Res.BoolResponse> {
        logger.debug(`checking if token exists`)
        const u: User = await this._userManager.getUserByToken(req.token)
        if (u) {
            return {data: {result: true}}
        } else {
            return {
                data: {result: false},
                error: {message: errorMsg.E_BAD_TOKEN}
            }
        }
    }

    verifyProductOnStock(req: Req.VerifyProductOnStock): Promise<Res.BoolResponse> {
        logger.debug(`checking if products on stock`)
        return this._storeManager.verifyProductOnStock(req);
    }

    verifyProducts(req: Req.VerifyProducts) {
        logger.debug(`verifying products`)
        return this._storeManager.verifyProducts(req);
    }

    async verifyStorePermission(req: Req.VerifyStorePermission): Promise<Res.BoolResponse> {
        logger.debug(`verifying store permissions`)
        const user = await this._userManager.getLoggedInUserByToken(req.token)
        // TODO
        return {data: {result: true}};
        // return this._storeManager.verifyStoreOperation(req.body.storeName, user, req.body.permission)
    }

    subscribeNewStoreOwner(username: string, storeName: string) {
        logger.debug(`subscribing new store ${username} owner to store ${storeName}`);
        this._publisher.subscribe(username, EventCode.STORE_OWNER_EVENTS, storeName, storeName);
        this._publisher.subscribe(username, EventCode.USER_EVENTS, storeName, storeName);
    }

    terminateSocket() {
        logger.debug(`terminating socket`);
        this._publisher.terminateSocket();
    }

    getStoresWithOffset(req: Req.GetStoresWithOffsetRequest): Promise<Res.GetStoresWithOffsetResponse> {
        logger.info(`getting stores by offset`);
        const limit: number = req.body.limit;
        const offset: number = req.body.offset;
        return this._storeManager.getStoresWithOffset(+limit, +offset);
    }

    getAllProductsInStore(req: Req.GetAllProductsInStoreRequest): Promise<Res.GetAllProductsInStoreResponse> {
        logger.info(`getting all products in store ${req.body.storeName}`);
        const storeName: string = req.body.storeName;
        return this._storeManager.getAllProductsInStore(storeName);
    }

    getAllCategoriesInStore(req: Req.GetAllCategoriesInStoreRequest): Promise<Res.GetCategoriesResponse> {
        logger.info(`getting all categories in store ${req.body.storeName}`);
        const storeName: string = req.body.storeName;
        return this._storeManager.getAllCategoriesInStore(storeName);
    }

    async getAllCategories(): Promise<Res.GetAllCategoriesResponse> {
        return {data: {categories: Object.keys(ProductCategory)}}
    }

    async isLoggedInUserByToken(req: Req.Request): Promise<Res.GetLoggedInUserResponse> {
        logger.info(`checking is logged in user by received token`);
        const user: RegisteredUser = await this._userManager.getLoggedInUserByToken(req.token);
        return {data: {username: user ? user.name : undefined}}
    }

    async getPersonalDetails(req: Req.Request): Promise<Res.GetPersonalDetailsResponse> {
        logger.info(`getting personal details`);
        const user: RegisteredUser = await this._userManager.getLoggedInUserByToken(req.token);
        if (!user)
            return {
                data: {
                    result: false,
                    cart: undefined,
                    username: undefined,
                    managedStores: [],
                    ownedStores: [],
                    purchasesHistory: undefined
                }, error: {message: errorMsg.E_USER_DOES_NOT_EXIST}
            };
        const viewCartRes: Res.ViewCartRes = await this.viewCart(req);
        if (!viewCartRes.data.result)
            return {
                data: {
                    result: false,
                    cart: undefined,
                    username: undefined,
                    managedStores: [],
                    ownedStores: [],
                    purchasesHistory: undefined
                }, error: viewCartRes.error
            };

        const managedStores: StoreInfo[] = this._storeManager.getStoresInfoOfManagedBy(user.name);
        const ownedStores: StoreInfo[] = this._storeManager.getStoresInfoOfOwnedBy(user.name);
        const viewUserRes: Res.ViewRUserPurchasesHistoryRes = await this.viewRegisteredUserPurchasesHistory(req)
        const purchasesHistory: IReceipt[] = viewUserRes.data.receipts;
        return {
            data: {
                result: true,
                username: user.name,
                cart: viewCartRes.data.cart,
                managedStores,
                ownedStores,
                purchasesHistory
            }
        };

    }

    async getManagersPermissions(req: Req.GetAllManagersPermissionsRequest): Promise<Res.GetAllManagersPermissionsResponse> {
        logger.info(`retrieving managers permissions in store: ${req.body.storeName}`);
        return this._storeManager.getManagersPermissions(req.body.storeName);
    }

    async getOwnersAssignedBy(req: Req.GetAllManagersPermissionsRequest): Promise<Res.GetOwnersAssignedByResponse> {
        logger.info(`retrieving owners assigned`);
        const usernameWhoRemoves: RegisteredUser = await this._userManager.getLoggedInUserByToken(req.token);
        if (!usernameWhoRemoves)
            return {data: {result: false, owners: []}, error: {message: errorMsg.E_NOT_LOGGED_IN}}
        return this._storeManager.getOwnersAssignedBy(req.body.storeName, usernameWhoRemoves);

    }

    async getItemIds(req: Req.GetItemsIdsRequest): Promise<Res.GetItemsIdsResponse> {
        return this._storeManager.getItemIds(req.body.storeName, +req.body.product)
    }



    //region to be deleted

    // async removeProductsWithQuantity(req: Req.RemoveProductsWithQuantity): Promise<Res.ProductRemovalResponse> {
    //     logger.info(`removing items from store: ${req.body.storeName}`);
    //     const user: RegisteredUser = await this._userManager.getLoggedInUserByToken(req.token)
    //     return this._storeManager.removeProductsWithQuantity(user, req.body.storeName, req.body.products, false);
    // }

    // async viewUsersContactUsMessages(req: Req.ViewUsersContactUsMessagesRequest): Promise<Res.ViewUsersContactUsMessagesResponse> {
    //     logger.info(`retrieving store: ${req.body.storeName} contact us messages`);
    //     const user: RegisteredUser = await this._userManager.getLoggedInUserByToken(req.token)
    //     return this._storeManager.viewUsersContactUsMessages(user, req.body.storeName);
    // }


    //endregion
}