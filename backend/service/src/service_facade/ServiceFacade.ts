import {getInstance, CreateInstance} from "domain_layer/dist/src/api-ext/external_api";
import * as Req from "domain_layer/dist/src/api-ext/Request";
import * as Res from "domain_layer/dist/src/api-ext/Response";
import {TradingSystemState} from "domain_layer/dist/src/api-ext/Enums";
import * as UserService from '../user_service/UserService'
import * as StoreService from '../store_service/StoreService'
import {RegisteredUser} from "domain_layer/dist/src/user/users/RegisteredUser";
import {errorMsg} from "domain_layer/dist/src/api-int/Error";

let tradingSystem = getInstance();

export const reset = (): void => {
    tradingSystem = CreateInstance();
}

export const startNewSession = (): string => {
    return tradingSystem.startNewSession();
}

export const systemInit = (req: Req.InitReq): Res.BoolResponse => {
    const registerRequest: Req.RegisterRequest = {
        body: {
            username: req.body.firstAdminName,
            password: req.body.firstAdminPassword
        }, token: req.token
    };
    const registerRes: Res.BoolResponse = tradingSystem.register(registerRequest);
    if (registerRes.error) return registerRes;
    const loginReq: Req.BoolResponse = {
        body: {
            username: req.body.firstAdminName,
            password: req.body.firstAdminPassword
        }, token: req.token
    };
    const loginRes: Res.BoolResponse = tradingSystem.login(loginReq);
    if (!loginRes.data.result) return loginRes;

    const setAdminReq: Req.RegisterRequest = {body: {newAdminUserName: req.body.firstAdminName}, token: req.token};
    const setAdminRes: Res.BoolResponse = tradingSystem.setAdmin(setAdminReq)
    if (setAdminRes.error) return setAdminRes;
    const connectExtReq: Req.Request = {body: {}, token: req.token};
    const connectDeliveryRes: Res.BoolResponse = tradingSystem.connectDeliverySys(connectExtReq);
    if (connectDeliveryRes.error) return connectDeliveryRes;
    const connectPaymentRes: Res.BoolResponse = tradingSystem.connectPaymentSys(connectExtReq);
    if (connectPaymentRes.error) return connectPaymentRes;
    tradingSystem.OpenTradeSystem({body: {}, token: req.token})
    const logout: Res.BoolResponse = tradingSystem.logout({body:{} , token: req.token});
    if (!logout.data.result) return logout;
    return {data: {result: true}}
}

export const registerUser = (req: Req.RegisterRequest): Res.BoolResponse => {
    return runIfOpen(req, UserService.registerUser);
}


export const createStore = (req: Req.OpenStoreRequest): Res.BoolResponse => {
    return runIfOpen(req, StoreService.createStore)
}


export const loginUser = (req: Req.LoginRequest): Res.BoolResponse => {
    return runIfOpen(req, UserService.loginUser);
}

export const logoutUser = (req: Req.LogoutRequest): Res.BoolResponse => {
    return runIfOpen(req, UserService.logoutUser)
}


export const addItems = (req: Req.ItemsAdditionRequest): Res.ItemsAdditionResponse => {
    return runIfOpen(req, StoreService.addItems);
}

export const removeItems = (req: Req.ItemsRemovalRequest): Res.ItemsRemovalResponse => {
    return runIfOpen(req, StoreService.removeItems);
}

export const removeProductsWithQuantity = (req: Req.RemoveProductsWithQuantity): Res.ProductRemovalResponse => {
    return runIfOpen(req, StoreService.removeProductsWithQuantity);
}

export const addNewProducts = (req: Req.AddProductsRequest): Res.ProductAdditionResponse => {
    return runIfOpen(req, StoreService.addNewProducts);
}

export const removeProducts = (req: Req.ProductRemovalRequest): Res.ProductRemovalResponse => {
    return runIfOpen(req, StoreService.removeProducts);
}

export const assignStoreOwner = (req: Req.AssignStoreOwnerRequest): Res.BoolResponse => {
    return runIfOpen(req, StoreService.assignStoreOwner);
}

export const assignStoreManager = (req: Req.AssignStoreManagerRequest): Res.BoolResponse => {
    return runIfOpen(req, StoreService.assignStoreManager);
}

export const viewStoreInfo = (req: Req.StoreInfoRequest): Res.StoreInfoResponse => {
    return runIfOpen(req, StoreService.viewStoreInfo);
}

export const removeStoreManager = (req: Req.AssignStoreManagerRequest): Res.BoolResponse => {
    return runIfOpen(req, StoreService.removeStoreManager);
}


export const viewStorePurchasesHistory = (req: Req.ViewShopPurchasesHistoryRequest): Res.ViewShopPurchasesHistoryResponse => {
    return runIfOpen(req, StoreService.viewStorePurchasesHistory);
}

export const viewUsersContactUsMessages = (req: Req.ViewUsersContactUsMessagesRequest): Res.ViewUsersContactUsMessagesResponse => {
    return runIfOpen(req, StoreService.viewUsersContactUsMessages);
}

const runIfOpen = (req: Req.Request, fn: any): any => {
    const isOpenReq: Req.Request = {body: {}, token: req.token};
    if (tradingSystem.GetTradeSystemState(isOpenReq).data.state !== TradingSystemState.OPEN) return {
        data: {},
        error: {message: "Trading system is closed!"}
    }
    return fn.call(this, req, tradingSystem);
}
