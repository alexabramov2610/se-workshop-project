import {RegisteredUser, UserManager} from "../user/internal_api";
import {StoreManager} from '../store/internal_api';
import * as Res from "../api-ext/Response"
import * as Req from "../api-ext/Request"
import {errorMsg} from "../api-int/Error";
import {ExternalSystemsManager} from "../external_systems/internal_api"
import {
    BoolResponse,
    ExternalSystems,
    logger,
    OpenStoreRequest,
    UserRole,
} from "../api-int/internal_api";
import {TradingSystemState} from "../api-ext/Enums";


export class TradingSystemManager {
    private userManager: UserManager;
    private storeManager: StoreManager;
    private externalSystems: ExternalSystemsManager;
    private state: TradingSystemState;

    constructor() {
        this.userManager = new UserManager();
        this.storeManager = new StoreManager();
        this.externalSystems = new ExternalSystemsManager();
        this.state= TradingSystemState.CLOSED;
    }

    OpenTradeSystem(req: Req.Request): BoolResponse{
        const u:RegisteredUser=  this.userManager.getUserByToken(req.token);
        if(!u || u.getRole() != UserRole.ADMIN) return {data: {result: false}};
        this.state = TradingSystemState.OPEN;
        return {data:{result:true}};
    }

    GetTradeSystemState(req: Req.Request): Res.TradingSystemStateResponse{
        return {data:{state: this.state}};
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

    addItems(req: Req.ItemsAdditionRequest) : Res.ItemsAdditionResponse {
        logger.info(`trying to add items to store: ${JSON.stringify(req.body.storeName)} by user: ${JSON.stringify(req.token)}`);

        const userVerification: Res.BoolResponse = this.userManager.verifyUser(req.token, true);

        if (userVerification.error)
            return { data: {result: false, itemsNotAdded: req.body.items} , error: userVerification.error};

        return this.storeManager.addItems(this.userManager.getUserByToken(req.token), req.body.storeName, req.body.items);

    }

    removeItems(req: Req.ItemsRemovalRequest) : Res.ItemsRemovalResponse {
        logger.info(`trying to remove items from store: ${JSON.stringify(req.body.storeName)} by user: ${JSON.stringify(req.token)}`);

        const userVerification: Res.BoolResponse = this.userManager.verifyUser(req.token, true);

        if (userVerification.error)
            return { data: {result: false, itemsNotRemoved: req.body.items} , error: userVerification.error};

        return this.storeManager.removeItems(this.userManager.getUserByToken(req.token), req.body.storeName, req.body.items);
    }

    removeProductsWithQuantity(req: Req.RemoveProductsWithQuantity) : Res.ProductRemovalResponse {
        logger.info(`trying to remove items to store: ${JSON.stringify(req.body.storeName)} from user: ${JSON.stringify(req.token)}`);

        const userVerification: Res.BoolResponse = this.userManager.verifyUser(req.token, true);

        if (userVerification.error)
            return { data: {result: false, productsNotRemoved: req.body.products} , error: userVerification.error};

        return this.storeManager.removeProductsWithQuantity(this.userManager.getUserByToken(req.token), req.body.storeName, req.body.products);
    }

    addNewProducts(req: Req.AddProductsRequest) : Res.ProductAdditionResponse {
        logger.info(`trying to add products to store: ${JSON.stringify(req.body.storeName)} by user: ${JSON.stringify(req.token)}`)

        const userVerification: Res.BoolResponse = this.userManager.verifyUser(req.token, true);

        if (userVerification.error)
            return { data: {result: false, productsNotAdded: req.body.products} , error: userVerification.error};

        return this.storeManager.addNewProducts(this.userManager.getUserByToken(req.token), req.body.storeName, req.body.products);
    }

    removeProducts(req: Req.ProductRemovalRequest) : Res.ProductRemovalResponse {
        logger.info(`trying to remove products from store: ${JSON.stringify(req.body.storeName)} by user: ${JSON.stringify(req.token)}`);

        const userVerification: Res.BoolResponse = this.userManager.verifyUser(req.token, true);

        if (userVerification.error)
            return { data: {result: false, productsNotRemoved: req.body.products} , error: userVerification.error};

        return this.storeManager.removeProducts(this.userManager.getUserByToken(req.token), req.body.storeName, req.body.products);
    }

    assignStoreOwner(req: Req.AssignStoreOwnerRequest) : Res.BoolResponse {
        logger.info(`user: ${JSON.stringify(req.token)} requested to assign user:
                ${JSON.stringify(req.body.usernameToAssign)} as an owner in store: ${JSON.stringify(req.body.storeName)} `)

        const usernameWhoAssignsVerification: Res.BoolResponse = this.userManager.verifyUser(req.token, true);
        const usernameToAssignVerification: Res.BoolResponse = this.userManager.verifyUser(req.body.usernameToAssign, false);

        let error: string = usernameWhoAssignsVerification.error ? usernameWhoAssignsVerification.error.message + " " : "";
        error = usernameToAssignVerification.error ? error + usernameToAssignVerification.error.message : error + "";

        if (error.length > 0) {
            return { data: { result: false } , error: { message: error}};
        }

        const usernameWhoAssigns: RegisteredUser = this.userManager.getUserByToken(req.token);
        const usernameToAssign: RegisteredUser = this.userManager.getUserByToken(req.body.usernameToAssign);

        const res: Res.BoolResponse = this.storeManager.assignStoreOwner(req.body.storeName, usernameToAssign, usernameWhoAssigns);
        if (res.data.result) {
            this.userManager.setUserRole(usernameToAssign.name, UserRole.OWNER);
        }
        return res;
    }

    assignStoreManager(req: Req.AssignStoreManagerRequest) : Res.BoolResponse {
        logger.info(`user: ${JSON.stringify(req.token)} requested to assign user:
                ${JSON.stringify(req.body.usernameToAssign)} as a manager in store: ${JSON.stringify(req.body.storeName)} `)

        const usernameWhoAssignsVerification: Res.BoolResponse = this.userManager.verifyUser(req.token, true);
        const usernameToAssignVerification: Res.BoolResponse = this.userManager.verifyUser(req.body.usernameToAssign, false);

        let error: string = usernameWhoAssignsVerification.error ? usernameWhoAssignsVerification.error.message + " " : "";
        error = usernameToAssignVerification.error ? error + usernameToAssignVerification.error.message : error + "";

        if (error.length > 0) {
            return { data: { result: false } , error: { message: error}};
        }

        const usernameWhoAssigns: RegisteredUser = this.userManager.getUserByToken(req.token);
        const usernameToAssign: RegisteredUser = this.userManager.getUserByToken(req.body.usernameToAssign);

        const res: Res.BoolResponse = this.storeManager.assignStoreManager(req.body.storeName, usernameToAssign, usernameWhoAssigns);
        if (res.data.result) {
            this.userManager.setUserRole(usernameToAssign.name, UserRole.MANAGER);
            this.userManager.assignStoreManagerBasicPermissions(usernameToAssign.name);
        }
        return res;
    }

    connectDeliverySys(connectExtReq: Req.Request): BoolResponse{
        logger.info('Trying to connect to delivery system');
        const res:BoolResponse = this.externalSystems.connectSystem(ExternalSystems.DELIVERY);
        return res;
    }

    connectPaymentSys(connectExtReq: Req.Request): BoolResponse{
        logger.info('Trying to connect to payment system');
        const res:BoolResponse = this.externalSystems.connectSystem(ExternalSystems.PAYMENT);
        return res;
    }

    setAdmin(setAdminRequest: Req.SetAdminRequest): BoolResponse{
        logger.info(`user ${setAdminRequest.token} trying set ${setAdminRequest.body.newAdminUUID} as an admin`)
        const res:BoolResponse = this.userManager.setAdmin(setAdminRequest);
        return res;
    }

    createStore(storeReq: OpenStoreRequest) : BoolResponse{
        logger.info(`user ${storeReq.token} trying open store: ${storeReq.body.storeName}`)
        const u: RegisteredUser = this.userManager.getUserByToken(storeReq.token);
        if(!u) return {data: {result:false}, error:{message: errorMsg['E_NOT_AUTHORIZED']}}
        if(!this.userManager.isLoggedIn(u)) return {data: {result:false}, error:{message: errorMsg['E_NOT_LOGGED_IN']}}
        const res:BoolResponse = this.storeManager.addStore(storeReq.body.storeName, u);
        return res;
    }

}
