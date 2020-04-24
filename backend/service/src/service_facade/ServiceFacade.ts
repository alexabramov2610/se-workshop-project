import {getInstance, CreateInstance} from "domain_layer/dist/src/api-ext/external_api";
import * as Req from "domain_layer/dist/src/api-ext/Request";
import * as Res from "domain_layer/dist/src/api-ext/Response";
import {TradingSystemState} from "domain_layer/dist/src/api-ext/Enums";
import * as UserService from '../user_service/UserService'
import * as StoreService from '../store_service/StoreService'
import * as BuyingService from '../buying_service/BuyingService'
import {TradingSystemManager as TS} from "domain_layer/dist/src/trading_system/TradingSystemManager";

let tradingSystem = getInstance();

/*
UC-1.1
 */
export const systemInit = (req: Req.InitReq): Res.BoolResponse => {
    const registerRequest: Req.RegisterRequest = {
        body: {
            username: req.body.firstAdminName,
            password: req.body.firstAdminPassword
        }, token: req.token
    };
    const registerRes: Res.BoolResponse = tradingSystem.register(registerRequest);
    if (registerRes.error) return registerRes;
    const loginReq: Req.LoginRequest = {
        body: {
            username: req.body.firstAdminName,
            password: req.body.firstAdminPassword,
        }, token: req.token
    };
    const loginRes: Res.BoolResponse = tradingSystem.login(loginReq);
    if (!loginRes.data.result) return loginRes;

    const setAdminReq: Req.SetAdminRequest = {body: {newAdminUserName: req.body.firstAdminName}, token: req.token};
    const setAdminRes: Res.BoolResponse = tradingSystem.setAdmin(setAdminReq)
    if (setAdminRes.error) return setAdminRes;
    const connectExtReq: Req.Request = {body: {}, token: req.token};
    const connectDeliveryRes: Res.BoolResponse = tradingSystem.connectDeliverySys(connectExtReq);
    if (connectDeliveryRes.error) return connectDeliveryRes;
    const connectPaymentRes: Res.BoolResponse = tradingSystem.connectPaymentSys(connectExtReq);
    if (connectPaymentRes.error) return connectPaymentRes;
    tradingSystem.OpenTradeSystem({body: {}, token: req.token})
    const logout: Res.BoolResponse = tradingSystem.logout({body: {}, token: req.token});
    if (!logout.data.result) return logout;
    return {data: {result: true}}
}
/*
UC-2.2
 */
export const registerUser = (req: Req.RegisterRequest): Res.BoolResponse => {
    return runIfOpen(req, UserService.registerUser);
}
/*
UC-2.3
 */
export const loginUser = (req: Req.LoginRequest): Res.BoolResponse => {
    return runIfOpen(req, UserService.loginUser);
}
/*
UC-2.4
 */
export const viewStoreInfo = (req: Req.StoreInfoRequest): Res.StoreInfoResponse => {
    return runIfOpen(req, StoreService.viewStoreInfo);
}
export const viewProductInfo = (req: Req.ProductInfoRequest): Res.BoolResponse => {
    return runIfOpen(req, StoreService.viewProductInfo);
}
/*
UC-2.5
 */
export const search = (req: Req.SearchRequest): Res.SearchResponse => {
    return runIfOpen(req, StoreService.search);
}
/*
UC-2.6
 */
export const saveProductToCart = (req: Req.SaveToCartRequest): Res.BoolResponse => {
    return runIfOpen(req, UserService.saveProductToCart);
}
/*
UC-2.7
 */
export const removeProductFromCart = (req:Req.RemoveFromCartRequest):Res.BoolResponse =>{
    return runIfOpen(req, UserService.removeProductFromCart);
}
export const viewCart = (req:Req.ViewCartReq,ts: TS):Res.ViewCartRes =>{
    return runIfOpen(req, UserService.viewCart);

}
/*
UC-2.8
 */
export const purchase = (req: Req.PurchaseRequest): Res.PurchaseResponse =>{
    return runIfOpen(req, BuyingService.purchase);
}
/*
UC-3.1
 */
export const logoutUser = (req: Req.LogoutRequest): Res.BoolResponse => {
    return runIfOpen(req, UserService.logoutUser)
}
/*
UC-3.2
 */
export const createStore = (req: Req.OpenStoreRequest): Res.BoolResponse => {
    return runIfOpen(req, StoreService.createStore)
}
/*
UC-3.7
 */
export const viewRegisteredUserPurchasesHistory = (req: Req.ViewRUserPurchasesHistoryReq): Res.ViewRUserPurchasesHistoryRes => {
    return runIfOpen(req, UserService.viewRegisteredUserPurchasesHistory);
}

/*
UC-4.1
 */
export const changeProductName = (req: Req.ChangeProductNameRequest): Res.BoolResponse => {
    return runIfOpen(req, StoreService.changeProductName);
}
export const changeProductPrice = (req: Req.ChangeProductPriceRequest): Res.BoolResponse => {
    return runIfOpen(req, StoreService.changeProductPrice);
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
/*
UC-4.3
 */
export const assignStoreOwner = (req: Req.AssignStoreOwnerRequest): Res.BoolResponse => {
    return runIfOpen(req, StoreService.assignStoreOwner);
}
/*
UC-4.5
 */
export const assignStoreManager = (req: Req.AssignStoreManagerRequest): Res.BoolResponse => {
    return runIfOpen(req, StoreService.assignStoreManager);
}
/*
UC-4.6
 */
export const addManagerPermissions = (req: Req.ChangeManagerPermissionRequest): Res.BoolResponse => {
    return runIfOpen(req, StoreService.addManagerPermissions);
}
export const removeManagerPermissions = (req: Req.ChangeManagerPermissionRequest): Res.BoolResponse => {
    return runIfOpen(req, StoreService.removeManagerPermissions);
}
/*
UC-4.7
 */
export const removeStoreManager = (req: Req.AssignStoreManagerRequest): Res.BoolResponse => {
    return runIfOpen(req, StoreService.removeStoreManager);
}
/*
UC-4.9
 */
export const viewUsersContactUsMessages = (req: Req.ViewUsersContactUsMessagesRequest): Res.ViewUsersContactUsMessagesResponse => {
    return runIfOpen(req, StoreService.viewUsersContactUsMessages);
}
/*
UC-4.10
 */
export const viewStorePurchasesHistory = (req: Req.ViewShopPurchasesHistoryRequest): Res.ViewShopPurchasesHistoryResponse => {
    return runIfOpen(req, StoreService.viewStorePurchasesHistory);
}

/*
Utils
 */
export const reset = (): void => {
    tradingSystem = CreateInstance();
}
export const startNewSession = (): string => {
    return tradingSystem.startNewSession();
}
const runIfOpen = (req: Req.Request, fn: any): any => {
    const isOpenReq: Req.Request = {body: {}, token: req.token};
    if (tradingSystem.GetTradeSystemState(isOpenReq).data.state !== TradingSystemState.OPEN)
        return {data: {}, error: {message: "Trading system is closed!"}}
    return fn.call(this, req, tradingSystem);
}

export {Req, Res};