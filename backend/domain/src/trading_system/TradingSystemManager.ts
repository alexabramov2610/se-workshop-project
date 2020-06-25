import {RegisteredUser, User, UserManager} from "../user/internal_api";
import {Store, StoreManagement} from '../store/internal_api';
import {Req, Res} from 'se-workshop-20-interfaces'
import {errorMsg} from "../api-int/Error";
import {notificationMsg} from "../api-int/Notifications";
import {ExternalSystemsManager} from "../external_systems/internal_api"
import {
    EventCode,
    ManagementPermission,
    NotificationsType,
    ProductCategory,
    TradingSystemState
} from "se-workshop-20-interfaces/dist/src/Enums";
import {v4 as uuid} from 'uuid';
import {ExternalSystems, loggerW, UserRole} from "../api-int/internal_api";
import {
    BagItem,
    IDiscountPolicy,
    IPurchasePolicy,
    Purchase,
    IProduct,
    Cart,
    CartProduct, IPublisher, DailyStatistics, VisitorsStatistics
} from "se-workshop-20-interfaces/dist/src/CommonInterface";
import {Publisher} from "publisher";
import {Event} from "se-workshop-20-interfaces/dist";
import {formatString} from "../api-int/utils";
import {logoutUserByName} from "../../index";
import {ReceiptModel, UserModel, SystemModel, SubscriberModel, AssignAgreementModel} from "dal";
import * as UserMapper from '../user/UserMapper'
import {StatisticsManager} from "../statistics/StatisticsManager";

const logger = loggerW(__filename)

export class TradingSystemManager {
    private _userManager: UserManager;
    private _storeManager: StoreManagement;
    private readonly _externalSystems: ExternalSystemsManager;
    private state: TradingSystemState;
    private _publisher: IPublisher;
    private statisticsManager: StatisticsManager;
    private isOpen: boolean;

    constructor() {
        this.statisticsManager = new StatisticsManager();
        this._publisher = new Publisher(logoutUserByName);
        this._externalSystems = new ExternalSystemsManager();
        this._userManager = new UserManager(this._externalSystems);
        this._storeManager = new StoreManagement(this._externalSystems);
        this.state = TradingSystemState.CLOSED;
        this.isOpen = false;
        this.initSubscribers()
            .then(() => logger.info("publisher has been successfully initialized"))
            .catch((e) => logger.error(`failed initializing publisher, error: ${e}`));
    }

    async dropAllDB(path?: string) {
        logger.warn("dropping database... ")
        const shell = require('shelljs')
        shell.exec(path ? path : '../../dropall.sh')
    }

    async initSubscribers(): Promise<string> {
        try {
            const subscriptions = await SubscriberModel.findOne({})
            if (!subscriptions)
                return;
            subscriptions.storeOwners.forEach(owner => {
                this._publisher.subscribe(owner.username, EventCode.STORE_OWNER_EVENTS, owner.storeName, owner.storeName);
            })
        } catch (e) {
            logger.error(`unsubscribeStoreOwner DB ERROR: ${e}`)
            throw new Error(e);
        }
        return "ok";
    }

    //region admin ops
    async setAdmin(req: Req.SetAdminRequest): Promise<Res.BoolResponse> {
        logger.info(`setting ${req.body.newAdminUserName} as an admin`)
        const res: Res.BoolResponse = await this._userManager.setAdmin(req);
        return res;
    }

    async openTradeSystem(req: Req.Request): Promise<Res.BoolResponse> {
        logger.info(`opening trading system...`);
        try {
            const ans = await SystemModel.findOneAndUpdate({}, {isSystemUp: true}, {new: true});
            if (!ans) {
                const res = await SystemModel.create({isSystemUp: true})
            }
            return {data: {result: true}};
        } catch (e) {
            logger.error(`openTradeSystem: DB ERROR ${e}`)
            return {data: {result: false}};
        }
    }

    async watchVisitorsInfo(req: Req.WatchVisitorsInfoRequest): Promise<Res.WatchVisitorsInfoResponse> {
        const adminUsername: string = this._userManager.getLoggedInUsernameByToken(req.token);
        if (!adminUsername || !this._userManager.checkIsAdminByToken(req.token))
            return {data: {result: false, statistics: []}, error: {message: errorMsg.E_BAD_OPERATION}}
        this._publisher.subscribe(adminUsername, EventCode.WATCH_STATISTICS, "", "");
        const statistics: DailyStatistics[] = await this.statisticsManager.newStatisticsRequest(adminUsername, req.body.from, req.body.to);
        return {data: {result: true, statistics}}
    }

    async updateAdminsForRealTimeStatisticsChange(adminsToUpdate: string[]) {
        logger.info(`updating ${adminsToUpdate.length} admins about new statistics`);
        for (const admin of adminsToUpdate) {
            const event: Event.StatisticsUpdateEvent = {
                username: admin, code: EventCode.WATCH_STATISTICS,
                notification: {type: NotificationsType.STATISTICS, message: notificationMsg.M_STATS_UPDATE},
                statistics: this.statisticsManager.getDailyVisitorsStatistics()
            };
            this._publisher.notify(event)
        }
    }

    stopVisitorsStatistics(req: Req.Request): void {
        const adminUsername: string = this._userManager.getLoggedInUsernameByToken(req.token);
        this.statisticsManager.clearDailyRealTimeStatisticsSubscription(adminUsername);
    }

    //endregion

    // region basic ops
    async startNewSession(): Promise<string> {
        logger.info(`starting new session...`);
        let newID: string = uuid();
        while (this._userManager.isTokenTaken(newID)) {
            newID = uuid();
        }
        this._userManager.addGuestToken(newID);
        this.statisticsManager.updateGuestVisit()
            .then((updateAdmins: boolean) => {
                if (updateAdmins)
                    this.updateAdminsForRealTimeStatisticsChange(this.statisticsManager.getRealTimeStatisticsSubscribers());
            })
            .catch((error) =>
                logger.error(`startNewSession failed in updateGuestVisit: ${error}`)
            )
        logger.debug(`Generated new token!... ${newID} `);
        return newID;
    }

    async register(req: Req.RegisterRequest): Promise<Res.BoolResponse> {
        logger.info(`trying to register new user: ${req.body.username} `);
        const rUser: RegisteredUser = await this._userManager.getLoggedInUserByToken(req.token, []);
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
            await this.sendPendingEvents(req.body.username);
            this.statisticsManager.updateRegisteredUserVisit(req.body.username, req.token)
                .then((updateAdmins: boolean) => {
                    if (updateAdmins)
                        this.updateAdminsForRealTimeStatisticsChange(this.statisticsManager.getRealTimeStatisticsSubscribers());
                })
                .catch((error) =>
                    logger.error(`startNewSession failed in updateGuestVisit: ${error}`)
                )
        } else {
            this._publisher.removeClient(req.body.username);
        }
        return res;
    }

    async sendPendingEvents(username: string): Promise<void> {
        const userModel = await this._userManager.getUserModelByName(username)

        if (!userModel) {
            logger.error(`login: DB ERROR: ${errorMsg.E_USER_DOES_NOT_EXIST}`)
            return;
        } else if (userModel.pendingEvents.length === 0)
            return;

        logger.info(`sending ${userModel.pendingEvents.length} missing notifications..`)
        const eventToResend = [];
        userModel.pendingEvents.forEach(event => {
            event.code = EventCode.USER_EVENTS;
            if (this._publisher.notify(event).length > 0)
                eventToResend.push(event);
        })
        try {
            userModel.pendingEvents = eventToResend;
            await userModel.save();
            this._userManager.pushToUserCache(username, userModel)
        } catch (e) {
            logger.error(`login: DB ERROR: ${e}`)
        }
    }

    async logout(req: Req.LogoutRequest): Promise<Res.BoolResponse> {
        logger.info(`logging out user... `);
        const username: string = this._userManager.getLoggedInUsernameByToken(req.token);
        const res: Res.BoolResponse = await this._userManager.logout(req);
        if (username && res.data.result) {
            logger.info(`removing websocket client... `);
            this._publisher.removeClient(username);
            logger.info(`logged out user: ${username}`);
        }
        return res;
    }

    async forceLogout(username: string): Promise<void> {
        logger.info(`socket disconnected (user: ${username})`);
        const token: string = this._userManager.getTokenOfLoggedInUser(username);
        const req: Req.LogoutRequest = {body: {}, token};
        await this.logout(req);
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

    async createStore(req: Req.OpenStoreRequest): Promise<Res.BoolResponse> {
        logger.info(`creating store: ${req.body.storeName}`)
        const user: RegisteredUser = await this._userManager.getLoggedInUserByToken(req.token)

        const res: Res.BoolResponse = await this._storeManager.addStore(req.body.storeName, req.body.description, user);
        if (res.data.result) {
            await this.subscribeAndNotifyStoreOwner(user.name, req.body.storeName, true);
            logger.debug(`successfully created store: ${req.body.storeName}`)
        }
        return res;
    }

    async saveProductToCart(req: Req.SaveToCartRequest): Promise<Res.BoolResponse> {
        logger.info(`saving product: ${req.body.catalogNumber} to cart`)
        const amount: number = req.body.amount;
        if (amount <= 0)
            return {data: {result: false}, error: {message: errorMsg.E_ITEMS_ADD}}
        const rUser: RegisteredUser = await this._userManager.getLoggedInUserByToken(req.token, ["cart"]);
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
        const username: string = this._userManager.getLoggedInUsernameByToken(req.token)
        return this._storeManager.changeProductName(username, req.body.catalogNumber, req.body.storeName, req.body.newName);
    }

    async changeProductPrice(req: Req.ChangeProductPriceRequest): Promise<Res.BoolResponse> {
        logger.info(`changing product ${req.body.catalogNumber} price in store: ${req.body.storeName} to ${req.body.newPrice}`);
        const username: string = this._userManager.getLoggedInUsernameByToken(req.token)
        return this._storeManager.changeProductPrice(username, req.body.catalogNumber, req.body.storeName, req.body.newPrice);
    }

    async addItems(req: Req.ItemsAdditionRequest): Promise<Res.ItemsAdditionResponse> {
        logger.info(`adding items to store: ${req.body.storeName}`);
        const username: string = this._userManager.getLoggedInUsernameByToken(req.token)
        return this._storeManager.addItems(username, req.body.storeName, req.body.items);
    }

    async removeItems(req: Req.ItemsRemovalRequest): Promise<Res.ItemsRemovalResponse> {
        logger.info(`removing items from store: ${req.body.storeName} `);
        const user: RegisteredUser = await this._userManager.getLoggedInUserByToken(req.token)
        return this._storeManager.removeItems(user, req.body.storeName, req.body.items);
    }

    async addNewProducts(req: Req.AddProductsRequest): Promise<Res.ProductAdditionResponse> {
        logger.info(`adding products to store: ${req.body.storeName}`)
        const username: string = this._userManager.getLoggedInUsernameByToken(req.token)
        return this._storeManager.addNewProducts(username, req.body.storeName, req.body.products);
    }

    async removeProducts(req: Req.ProductRemovalRequest): Promise<Res.ProductRemovalResponse> {
        logger.info(`removing products from store: ${req.body.storeName} `);
        const username: string = this._userManager.getLoggedInUsernameByToken(req.token)
        return this._storeManager.removeProducts(username, req.body.storeName, req.body.products);
    }

    async getItemIds(req: Req.GetItemsIdsRequest): Promise<Res.GetItemsIdsResponse> {
        return this._storeManager.getItemIds(req.body.storeName, +req.body.product)
    }

    // endregion

    //region manage managers & owners
    async assignStoreOwner(req: Req.AssignStoreOwnerRequest): Promise<Res.BoolResponse> {
        logger.info(`assigning user: ${req.body.usernameToAssign} as store owner of store: ${req.body.storeName}`)
        const usernameWhoAssigns: RegisteredUser = await this._userManager.getLoggedInUserByToken(req.token)
        const usernameToAssign: RegisteredUser = await this._userManager.getUserByName(req.body.usernameToAssign)
        if (!usernameToAssign)
            return {data: {result: false}, error: {message: errorMsg.E_USER_DOES_NOT_EXIST}};
        const res: { res: Res.BoolResponse, notify?: string[] } = await this._storeManager.assignStoreOwner(req.body.storeName, usernameToAssign, usernameWhoAssigns);
        if (res.res.data.result) {
            if (res.notify && res.notify.length > 0)
                await this.notifyStoreOwnerOfNewApproveRequired(res.notify, req.body.storeName, req.body.usernameToAssign, usernameWhoAssigns.name)
            else
                await this.addOwnerIfAccepted(req.body.usernameToAssign, req.body.storeName);
        }
        return res.res;
    }

    async addOwnerIfAccepted(newOwner: string, storeName: string): Promise<boolean> {
        const isAdded: boolean = await this._storeManager.addOwnerIfAccepted(newOwner, storeName);
        if (isAdded) {
            logger.info(`successfully assigned user: ${newOwner} as store owner of store: ${storeName}`)
            await this.subscribeAndNotifyStoreOwner(newOwner, storeName, false)
        }
        return isAdded;
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
            await this.unsubscribeAndNotifyStoreOwner(req.body.usernameToRemove, req.body.storeName, res.data.owners)
            await this.removePendingsByOwners(res.data.owners, req.body.storeName)

        }
        return res;
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

    async approveStoreOwner(req: Req.ApproveNewOwnerRequest): Promise<Res.BoolResponse> {
        logger.info(`approving user: ${req.body.newOwnerName} as store owner of store: ${req.body.storeName}`)
        const usernameWhoApprove: RegisteredUser = await this._userManager.getLoggedInUserByToken(req.token)
        const usernameToAssign: RegisteredUser = await this._userManager.getUserByName(req.body.newOwnerName)
        const x = 3;
        if (!usernameToAssign)
            return {data: {result: false}, error: {message: errorMsg.E_USER_DOES_NOT_EXIST}};
        const approved: Res.BoolResponse = await this._storeManager.approveStoreOwner(req.body.storeName, usernameToAssign, usernameWhoApprove);
        if (approved.data.result) {
            await this.addOwnerIfAccepted(usernameToAssign.name, req.body.storeName)
        }
        return approved
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

    //region discount & purchase policy
    async setPurchasePolicy(req: Req.SetPurchasePolicyRequest): Promise<Res.BoolResponse> {
        logger.info(`setting purchase policy to store ${req.body.storeName} `)
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

    //endregion

    //region info
    async viewCart(req: Req.ViewCartReq): Promise<Res.ViewCartRes> {
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

    async getStoresWithOffset(req: Req.GetStoresWithOffsetRequest): Promise<Res.GetStoresWithOffsetResponse> {
        logger.info(`getting stores by offset`);
        const limit: number = req.body.limit;
        const offset: number = req.body.offset;
        return this._storeManager.getStoresWithOffset(+limit, +offset);
    }

    async getStoresNames(req: Req.GetNamesRequest): Promise<Res.GetNamesResponse> {
        logger.info(`fetching all stores names starts with prefix: ${req.body.prefix}`);
        const limit: number = req.body.limit;
        const prefix: string = req.body.prefix;
        return this._storeManager.findStoresNamesByPrefix(prefix, limit);
    }

    async getProductsNames(req: Req.GetNamesRequest): Promise<Res.GetNamesResponse> {
        logger.info(`fetching all products names starts with prefix: ${req.body.prefix}`);
        const limit: number = req.body.limit;
        const prefix: string = req.body.prefix;
        return this._storeManager.findProductsNamesByPrefix(prefix, limit);
    }

    async getAllProductsInStore(req: Req.GetAllProductsInStoreRequest): Promise<Res.GetAllProductsInStoreResponse> {
        logger.info(`getting all products in store ${req.body.storeName}`);
        const storeName: string = req.body.storeName;
        return this._storeManager.getAllProductsInStore(storeName);
    }

    async getAllCategoriesInStore(req: Req.GetAllCategoriesInStoreRequest): Promise<Res.GetCategoriesResponse> {
        logger.info(`getting all categories in store ${req.body.storeName}`);
        const storeName: string = req.body.storeName;
        return this._storeManager.getAllCategoriesInStore(storeName);
    }

    async getAllCategories(): Promise<Res.GetAllCategoriesResponse> {
        return {data: {categories: Object.keys(ProductCategory)}}
    }

    async getManagersPermissions(req: Req.GetAllManagersPermissionsRequest): Promise<Res.GetAllManagersPermissionsResponse> {
        logger.info(`retrieving managers permissions in store: ${req.body.storeName}`);
        return this._storeManager.getManagersPermissions(req.body.storeName);
    }

    async getOwnersAssignedBy(req: Req.GetAllManagersPermissionsRequest): Promise<Res.GetOwnersAssignedByResponse> {
        const assignedBy: RegisteredUser = await this._userManager.getLoggedInUserByToken(req.token);
        if (!assignedBy)
            return {data: {result: false, owners: [], agreements: []}, error: {message: errorMsg.E_NOT_LOGGED_IN}}
        logger.info(`retrieving owners assigned by ${assignedBy.name}`);
        return this._storeManager.getOwnersAssignedBy(req.body.storeName, assignedBy);
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
                    purchasesHistory: undefined
                }, error: {message: errorMsg.E_USER_DOES_NOT_EXIST}
            };

        const storeNames: string[] = [...user.cart.keys()];
        const usersCart: Cart = {
            products: storeNames.reduce((acc: CartProduct[], curr: string) =>
                acc.concat({storeName: curr, bagItems: user.cart.get(curr)}), [])
        }
        return {
            data: {
                result: true,
                username: user.name,
                cart: usersCart,
                purchasesHistory: user.receipts
            }
        };

    }

    async getAllUsers(req: Req.Request): Promise<Res.GetAllUsersResponse> {
        logger.info(`retrieving all users in system`)
        return this._userManager.getAllUsers(req);
    }

    //endregion

    //region verifications
    async verifyTokenExists(req: Req.Request): Promise<Res.BoolResponse> {
        logger.debug(`checking if token exists ${req.token}`)
        return this._userManager.isTokenTaken(req.token) ? {data: {result: true}} :
            {data: {result: false}, error: {message: errorMsg.E_BAD_TOKEN}}
    }

    async isLoggedInUserByToken(req: Req.Request): Promise<Res.GetLoggedInUserResponse> {
        logger.debug(`checking is logged in user by received token`);
        return {data: {username: this._userManager.getLoggedInUsernameByToken(req.token)}}
    }

    async verifyStorePermission(req: Req.VerifyStorePermission, storeModel?): Promise<Res.BoolResponse> {
        logger.debug(`verifying store permissions`)
        const username = this._userManager.getLoggedInUsernameByToken(req.token)
        const isAdminWatchesHistories: boolean = req.body.permission === ManagementPermission.WATCH_PURCHASES_HISTORY && this._userManager.checkIsAdminByToken(req.token)
        if (isAdminWatchesHistories)
            return {data: {result: true}};
        return username ? this._storeManager.verifyStoreOperation(req.body.storeName, username, req.body.permission, storeModel) :
            {data: {result: false}, error: {message: errorMsg.E_BAD_OPERATION}}
    }

    async verifyProducts(req: Req.VerifyProducts): Promise<Res.BoolResponse> {
        logger.debug(`verifying products`)
        const res: Res.BoolResponse = await this._storeManager.verifyProducts(req);
        return res;
    }

    verifyProductOnStock(req: Req.VerifyProductOnStock): Promise<Res.BoolResponse> {
        logger.debug(`checking if products on stock`)
        return this._storeManager.verifyProductOnStock(req);
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

    verifyCredentials(req: Req.VerifyCredentialsReq): Promise<Res.BoolResponse> {
        logger.info(`verifying credentials`)
        return this._userManager.verifyCredentials(req);
    }

    verifyUserLoggedIn(req: Req.Request): Res.BoolResponse {
        logger.debug(`checking if user is logged in`)
        return this._userManager.getLoggedInUsernameByToken(req.token) ? {data: {result: true}} : {
            data: {result: false},
            error: {message: errorMsg.E_NOT_LOGGED_IN}
        }
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

    //endregion

    //region notifications
    async subscribeAndNotifyStoreOwner(username: string, storeName: string, isFirst: boolean): Promise<void> {
        this.subscribeNewStoreOwner(username, storeName);
        if (!isFirst) {
            const msg: string = formatString(notificationMsg.M_ASSIGNED_AS_OWNER, [storeName]);
            const event: Event.StoreOwnerEvent = {
                username, code: EventCode.ASSIGNED_AS_STORE_OWNER, storeName,
                notification: {type: NotificationsType.GREEN, message: msg}
            };

            if (this._publisher.notify(event).length !== 0)
                await this._userManager.saveNotification(username, event)
        }

        try {
            let subscriptions = await SubscriberModel.findOne({})
            if (!subscriptions)
                subscriptions = await SubscriberModel.create({storeOwners: []})
            subscriptions.storeOwners.push({storeName, username});
            subscriptions.markModified('storeOwners');
            await subscriptions.save();
        } catch (e) {
            logger.error(`subscribeStoreOwner DB ERROR: ${e}`)
        }
    }

    subscribeNewStoreOwner(username: string, storeName: string) {
        logger.debug(`subscribing new store ${username} owner to store ${storeName}`);
        this._publisher.subscribe(username, EventCode.STORE_OWNER_EVENTS, storeName, storeName);
        this._publisher.subscribe(username, EventCode.USER_EVENTS, storeName, storeName);
    }

    async unsubscribeAndNotifyStoreOwner(username: string, storeName: string, owners: string[]): Promise<void> {
        const msg: string = formatString(notificationMsg.M_REMOVED_AS_OWNER, [storeName]);
        const toRemoveMap: Map<string, string> = new Map<string, string>();
        const events: Event.StoreOwnerEvent[] = owners.reduce((acc, curr) =>
            acc.concat({
                username: curr, code: EventCode.REMOVED_AS_STORE_OWNER, storeName,
                notification: {type: NotificationsType.GREEN, message: msg}
            }), []);

        for (const event of events) {
            if (this._publisher.notify(event).length !== 0) {
                await this._userManager.saveNotification(event.username, event)
            }
            this._publisher.unsubscribe(event.username, EventCode.REMOVED_AS_STORE_OWNER, storeName);
            toRemoveMap.set(event.username, "junk");
        }

        try {
            const subscriptions = await SubscriberModel.findOne({})
            if (!subscriptions)
                return;
            subscriptions.storeOwners = subscriptions.storeOwners.filter(owner => !toRemoveMap.has(owner.username));
            subscriptions.markModified('storeOwners');
            await subscriptions.save();

        } catch (e) {
            logger.error(`unsubscribeStoreOwner DB ERROR: ${e}`)
        }
    }

    async notifyStoreOwnerOfNewPurchases(storeNames: string[], buyer: string): Promise<void> {
        logger.info(`notifying store owners about new purchase`)
        for (const storeName of storeNames) {
            const notification: Event.Notification = {
                message: formatString(notificationMsg.M_NEW_PURCHASE,
                    [storeName, buyer]), type: NotificationsType.GREEN
            };
            const storeModel = await this._storeManager.findStoreModelByName(storeName);
            // for (const storeOwner of storeModel.storeOwners) {
                const event: Event.NewPurchaseEvent = {
                    username: buyer,
                    code: EventCode.NEW_PURCHASE,
                    storeName,
                    notification
                };
                const usersNotSend: string[] = this._publisher.notify(event);
                for (const userToSave of usersNotSend) {
                    event.username = userToSave;
                    await this._userManager.saveNotification(userToSave, event)
                }
            // }
        }
    }

    async notifyStoreOwnerOfNewApproveRequired(owners: string[], storeName: string, newOwner: string, assigner: string): Promise<void> {
        logger.info(`notifying store owners about new approve required by him`)
        const notification: Event.Notification = {
            message: formatString(notificationMsg.M_NEED_APPROVE,
                [newOwner, storeName]), type: NotificationsType.GREEN
        };
        for (const storeOwner of owners) {
            const event: Event.ApproveOwnerEvent = {
                username: storeOwner,
                code: EventCode.APPROVE_NEW_STORE_OWNER_REQUIRED,
                storeName,
                notification,
                assigner
            };
            const usersNotSend: string[] = this._publisher.notify(event);
            for (const userToSave of usersNotSend) {
                await this._userManager.saveNotification(userToSave, event)
            }
        }
    }

    terminateSocket() {
        logger.debug(`terminating socket`);
        this._publisher.terminateSocket();
    }

    async viewRegisteredUserPurchasesHistory(req: Req.ViewRUserPurchasesHistoryReq): Promise<Res.ViewRUserPurchasesHistoryRes> {
        logger.info(`retrieving purchases history`)
        const user: RegisteredUser = await this._userManager.getLoggedInUserByToken(req.token)
        const userToView: RegisteredUser = (req.body && req.body.userName) ? await this._userManager.getUserByName(req.body.userName) : user;
        if (!userToView)
            return {data: {result: false, receipts: []}, error: {message: errorMsg.E_USER_DOES_NOT_EXIST}}
        const isAdminReq: boolean = req.body && req.body.userName && this._userManager.checkIsAdminByToken(req.token);
        if (userToView.name !== user.name && !isAdminReq)
            return {data: {result: false, receipts: []}, error: {message: errorMsg.E_NOT_AUTHORIZED}}
        return this._userManager.viewRegisteredUserPurchasesHistory(userToView);
    }

    async viewStorePurchasesHistory(req: Req.ViewShopPurchasesHistoryRequest): Promise<Res.ViewShopPurchasesHistoryResponse> {
        logger.info(`retrieving receipts from store: ${req.body.storeName}`);
        const user: RegisteredUser = await this._userManager.getLoggedInUserByToken(req.token)
        const isAdmin: boolean = this._userManager.checkIsAdminByToken(req.token)
        return this._storeManager.viewStorePurchaseHistory(user, req.body.storeName, isAdmin);
    }

    //endregion


    //region external systems
    setPublisher(publisher: IPublisher): void {
        if (publisher)
            this._publisher = publisher;
    }

    async connectDeliverySys(req: Req.Request): Promise<Res.BoolResponse> {
        logger.info('connecting to delivery system');
        return this._externalSystems.connectSystem(ExternalSystems.DELIVERY);

    }

    async connectPaymentSys(req: Req.Request): Promise<Res.BoolResponse> {
        logger.info('connecting to payment system');
        return this._externalSystems.connectSystem(ExternalSystems.PAYMENT);
    }

    async deliver(req: Req.DeliveryRequest): Promise<Res.DeliveryResponse> {
        logger.info(`trying to deliver using external system`)
        const user = this._userManager.getUserByToken(req.token);
        const deliveryID: number = await this._externalSystems.deliverySystem.deliver(req.body.userDetails.name, req.body.userDetails.country, req.body.userDetails.city, req.body.userDetails.address, req.body.userDetails.zip);
        return (deliveryID !== -1) ? {data: {result: true, deliveryID}}
            : {data: {result: false}, error: {message: errorMsg.E_NOT_AUTHORIZED}};
    }


    //endregion

    //region purchase
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
        try {
            const receipt = await ReceiptModel.create({
                date: new Date(),
                lastCC4: req.body.payment.lastCC4,
                totalCharged: req.body.payment.totalCharged,
                transactionID: req.body.payment.transactionID,
                purchases
            });
            this._userManager.resetUserCart(user);
            if (rUser) {
                rUser.receipts.push(receipt)
                const uModel = await UserModel.findOne({name: rUser.name});
                uModel.cart.clear();
                uModel.receipts = rUser.receipts;
                await this._userManager.updateUserModel(rUser.name, {
                    cart: uModel.cart,
                    receipts: uModel.receipts
                })
                logger.debug(`user saved after reset the cart and added receipt `);
            }
            logger.info(`purchase request: successfully purchased`)
            const username: string = rUser ? rUser.name : 'guest';
            await this.notifyStoreOwnerOfNewPurchases(Array.from(cart.keys()), username)
            return {data: {result: true, receipt: {purchases, date: receipt.date, payment: req.body.payment}}}
        } catch (e) {
            logger.error(`purchase: DB ERROR ${e}`);
            return {data: {result: false}, error: {message: errorMsg.E_DB}}
        }
    }

    async pay(req: Req.PayRequest): Promise<Res.PaymentResponse> {
        logger.info(`trying to pay using external system`)
        const transactionID: number = await this._externalSystems.paymentSystem.pay(req.body.price, req.body.payment.cardDetails);
        if (transactionID === -1)
            return {data: {result: false}, error: {message: errorMsg.E_PAY_FAILURE}}
        const lastCC4 = req.body.payment.cardDetails.number.slice(req.body.payment.cardDetails.number.length - 4, req.body.payment.cardDetails.number.length)
        logger.debug(`paid with credit card ${lastCC4}`)
        return {data: {result: true, payment: {totalCharged: req.body.price, lastCC4, transactionID}}}
    }

    async calculateFinalPrices(req: Req.CalcFinalPriceReq): Promise<Res.CartFinalPriceRes> {
        logger.info(`calculating final prices of user cart`)
        const user = await this._userManager.getUserByToken(req.token);
        if (!user)
            return {data: {result: false}, error: {message: errorMsg.E_NF}}
        const cart: Map<string, BagItem[]> = user.cart;
        let finalPrice: number = 0;

        for (const [storeName, bagItems] of cart.entries()) {

            const bagItemsWithPrices: BagItem[] = await this._storeManager.calculateFinalPrices(storeName, bagItems)

            finalPrice = finalPrice + bagItemsWithPrices.reduce((acc, curr) => acc + curr.finalPrice, 0)
            cart.set(storeName, bagItemsWithPrices)
        }
        const rUser: RegisteredUser = await this._userManager.getLoggedInUserByToken(req.token);
        if (rUser) {
            try {
                await this._userManager.updateUserModel(rUser.name, {cart: UserMapper.cartMapperToDB(cart)})
            } catch (e) {
                logger.error(`calculateFinalPrices DB ERROR ${e}`)
                return {data: {result: false}, error: {message: errorMsg.E_DB}}
            }
        }
        return {data: {result: true, price: finalPrice}}
    }

    //endregion

    async getTradeSystemState(): Promise<Res.TradingSystemStateResponse> {
        try {
            const ans = await SystemModel.findOne({}).maxTimeMS(2000);
            if (ans) {
                this.isOpen = ans.isSystemUp;
                return {data: {state: this.isOpen ? TradingSystemState.OPEN : TradingSystemState.CLOSED}};
            }
            return {data: {state: TradingSystemState.CLOSED}};
        } catch (e) {
            logger.error(`getTradeSystemState: DB ERROR ${e}`)
            return {data: {state: this.isOpen ? TradingSystemState.OPEN : TradingSystemState.CLOSED}};
        }
    }

    async lockStores(token: string): Promise<string[]> {
        const user: User = await this._userManager.getUserByToken(token);
        const storesName: string[] = Array.from(user.cart.keys())
        logger.debug(`trying to get locks for ${storesName}`)
        logger.debug(`locks on: ${this._storeManager.locks}`)
        const newLocks: string[] = [];
        for (const s of storesName) {
            if (this._storeManager.locks.length > 0 && this._storeManager.locks.some((name) => name === s))
                return []
            else
                newLocks.push(s);
        }
        this._storeManager.locks = this._storeManager.locks.concat(newLocks)
        logger.debug(`GOT THE LOCK! ${newLocks}`)
        return newLocks;
    }

    async unlockStores(stores: string[]): Promise<boolean> {
        logger.debug(`trying to unlock: ${stores}`)
        this._storeManager.locks = this._storeManager.locks.filter((s) => !stores.some((locks) => locks === s))
        return true;
    }

    async setPaymentSystem(req: Req.SetPaymentSystemRequest): Promise<Res.BoolResponse> {
        logger.info(`setting external payment system `)
        const isAdmin: boolean = await this._userManager.checkIsAdminByToken(req.token);
        if (!isAdmin)
            return {data: {result: false}, error: {message: errorMsg.E_NA}}
        this._externalSystems.paymentSystem.setPaymentSys(req.body.system)
        return {data: {result: true}}
    }

    async setDeliverySystem(req: Req.SetDeliverySystemRequest): Promise<Res.BoolResponse> {
        logger.info(`setting external delivery system `)
        const isAdmin: boolean = await this._userManager.checkIsAdminByToken(req.token);
        if (!isAdmin) {
            logger.warn(`setting external delivery system failed, not admin! admins: ${this._userManager.admins} `)
            return {data: {result: false}, error: {message: errorMsg.E_NA}}
        }
        this._externalSystems.deliverySystem.setDeliverySys(req.body.system)
        return {data: {result: true}}
    }

    private async removePendingsByOwners(owners: string[], storeName: string): Promise<void> {
        try {
            await AssignAgreementModel.deleteMany({
                "$or": [{
                    assignedByOwner: {"$in": owners},
                    storeName
                }, {newOwner: {"$in": owners}, storeName}]
            })
        } catch (e) {
            logger.error(`removePendingsByOwners DB ERROR delete agreements`)
        }
        try {
            const agreements = await AssignAgreementModel.find({
                storeName,
                requiredApprove: {"$in": owners}
            })
            for (const agreement of agreements) {
                agreement.requiredApprove = agreement.requiredApprove.filter((user) => !owners.find((o) => o === user))
                agreement.markModified('requiredApprove')
                await agreement.save()
                this.addOwnerIfAccepted(agreement.newOwner, storeName)
            }
        } catch (e) {
            logger.error(`removePendingsByOwners DB ERROR delete required`)
        }
    }
}