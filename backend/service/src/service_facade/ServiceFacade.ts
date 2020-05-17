import {getInstance, createInstance} from "domain_layer/";
import {Req, Res, Enums, CommonInterface, Event} from "se-workshop-20-interfaces";
import * as UserService from '../user_service/UserService';
import * as StoreService from '../store_service/StoreService';
import * as BuyingService from '../buying_service/BuyingService';

let tradingSystem = getInstance();
/*
UC-1.1
 */
export const systemInit = (req: Req.InitReq): Res.BoolResponse => {
    const isCredentialsOk: Res.BoolResponse = tradingSystem.verifyNewCredentials({
        body: {
            username: req.body.firstAdminName,
            password: req.body.firstAdminPassword
        }, token: req.token
    })
    if (!isCredentialsOk.data.result)
        return isCredentialsOk;
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
    tradingSystem.openTradeSystem({body: {}, token: req.token})
    const logout: Res.BoolResponse = tradingSystem.logout({body: {}, token: req.token});
    if (!logout.data.result) return logout;
    return {data: {result: true}}
}
/*
UC-2.2
 */
export const registerUser = (req: Req.RegisterRequest): Res.BoolResponse => {
    return runIfOpen(req, runIfHaveToken(UserService.registerUser));
}
/*
UC-2.3
 */
export const loginUser = (req: Req.LoginRequest): Res.BoolResponse => {
    return runIfOpen(req, runIfHaveToken(UserService.loginUser));
}
/*
UC-2.4
 */
export const viewStoreInfo = (req: Req.StoreInfoRequest): Res.StoreInfoResponse => {
    return runIfOpen(req, runIfHaveToken(StoreService.viewStoreInfo));
}
export const viewProductInfo = (req: Req.ProductInfoRequest): Res.ProductInfoResponse => {
    return runIfOpen(req, runIfHaveToken(StoreService.viewProductInfo));
}
/*
UC-2.5
 */
export const search = (req: Req.SearchRequest): Res.SearchResponse => {
    return runIfOpen(req, runIfHaveToken(StoreService.search));
}
/*
UC-2.6
 */
export const saveProductToCart = (req: Req.SaveToCartRequest): Res.BoolResponse => {
    return runIfOpen(req, runIfHaveToken(UserService.saveProductToCart));
}
/*
UC-2.7
 */
export const removeProductFromCart = (req: Req.RemoveFromCartRequest): Res.BoolResponse => {
    return runIfOpen(req, runIfHaveToken(UserService.removeProductFromCart));
}
export const viewCart = (req: Req.ViewCartReq): Res.ViewCartRes => {
    return runIfOpen(req, runIfHaveToken(UserService.viewCart));
}
/*
UC-2.8
 */
export const purchase = (req: Req.PurchaseRequest): Res.PurchaseResponse => {
    return runIfOpen(req, runIfHaveToken(BuyingService.purchase));
}
/*
UC-3.1
 */
export const logoutUser = (req: Req.LogoutRequest): Res.BoolResponse => {
    return runIfOpen(req, runIfLoggedIn(UserService.logoutUser))
}
/*
UC-3.2
 */
export const createStore = (req: Req.OpenStoreRequest): Res.BoolResponse => {
    return runIfOpen(req, runIfLoggedIn(StoreService.createStore))
}
/*
UC-3.7
 */
export const viewRegisteredUserPurchasesHistory = (req: Req.ViewRUserPurchasesHistoryReq): Res.ViewRUserPurchasesHistoryRes => {
    return runIfOpen(req, runIfLoggedIn(UserService.viewRegisteredUserPurchasesHistory));
}

/*
UC-4.1
 */
export const changeProductName = (req: Req.ChangeProductNameRequest): Res.BoolResponse => {
    return runIfOpen(req, runIfLoggedIn(StoreService.changeProductName));
}
export const changeProductPrice = (req: Req.ChangeProductPriceRequest): Res.BoolResponse => {
    return runIfOpen(req, runIfLoggedIn(StoreService.changeProductPrice));
}
export const addItems = (req: Req.ItemsAdditionRequest): Res.ItemsAdditionResponse => {
    return runIfOpen(req, runIfLoggedIn(StoreService.addItems));
}
export const removeItems = (req: Req.ItemsRemovalRequest): Res.ItemsRemovalResponse => {
    return runIfOpen(req, runIfLoggedIn(StoreService.removeItems));
}
export const removeProductsWithQuantity = (req: Req.RemoveProductsWithQuantity): Res.ProductRemovalResponse => {
    return runIfOpen(req, runIfLoggedIn(StoreService.removeProductsWithQuantity));
}
export const addNewProducts = (req: Req.AddProductsRequest): Res.ProductAdditionResponse => {
    return runIfOpen(req, runIfLoggedIn(StoreService.addNewProducts));
}
export const removeProducts = (req: Req.ProductRemovalRequest): Res.ProductRemovalResponse => {
    return runIfOpen(req, runIfLoggedIn(StoreService.removeProducts));
}


/*
UC-4.2 discounts
 */

export const setDiscountsPolicy = (req: Req.SetDiscountsPolicyRequest): Res.BoolResponse => {
    return runIfOpen(req, runIfLoggedIn(StoreService.setDiscountsPolicy));
}

export const viewDiscountsPolicy = (req: Req.ViewStoreDiscountsPolicyRequest): Res.ViewStoreDiscountsPolicyResponse => {
    return runIfOpen(req, runIfLoggedIn(StoreService.viewDiscountsPolicy));
}
export const addDiscount = (req: Req.AddDiscountRequest): Res.BoolResponse => {
    return runIfOpen(req, runIfLoggedIn(StoreService.addDiscount));
}
export const removeProductDiscount = (req: Req.RemoveDiscountRequest): Res.BoolResponse => {
    return runIfOpen(req, runIfLoggedIn(StoreService.removeDiscount));
}

/*
UC-4.3
 */
export const assignStoreOwner = (req: Req.AssignStoreOwnerRequest): Res.BoolResponse => {
    return runIfOpen(req, runIfLoggedIn(StoreService.assignStoreOwner));
}
/*
UC-4.4
 */
export const removeStoreOwner = (req: Req.RemoveStoreOwnerRequest): Res.BoolResponse => {
    return runIfOpen(req, StoreService.removeStoreOwner);
}
/*
UC-4.5
 */
export const assignStoreManager = (req: Req.AssignStoreManagerRequest): Res.BoolResponse => {
    return runIfOpen(req, runIfLoggedIn(StoreService.assignStoreManager));
}
/*
UC-4.6
 */
export const addManagerPermissions = (req: Req.ChangeManagerPermissionRequest): Res.BoolResponse => {
    return runIfOpen(req, runIfLoggedIn(StoreService.addManagerPermissions));
}
export const removeManagerPermissions = (req: Req.ChangeManagerPermissionRequest): Res.BoolResponse => {
    return runIfOpen(req, runIfLoggedIn(StoreService.removeManagerPermissions));
}
export const viewManagerPermissions = (req: Req.ViewManagerPermissionRequest): Res.ViewManagerPermissionResponse => {
    return runIfOpen(req, runIfLoggedIn(StoreService.viewManagerPermissions));
}

/*
UC-4.7
 */
export const removeStoreManager = (req: Req.RemoveStoreManagerRequest): Res.BoolResponse => {
    return runIfOpen(req, runIfLoggedIn(StoreService.removeStoreManager));
}
/*
UC-4.9
 */
export const viewUsersContactUsMessages = (req: Req.ViewUsersContactUsMessagesRequest): Res.ViewUsersContactUsMessagesResponse => {
    return runIfOpen(req, runIfLoggedIn(StoreService.viewUsersContactUsMessages));
}
/*
UC-4.10
 */
export const viewStorePurchasesHistory = (req: Req.ViewShopPurchasesHistoryRequest): Res.ViewShopPurchasesHistoryResponse => {
    return runIfOpen(req, runIfLoggedIn(StoreService.viewStorePurchasesHistory));
}
/*
UC-7
 */
export const pay = (req: Req.PayRequest): Res.PaymentResponse => {
    return runIfOpen(req, runIfHaveToken(BuyingService.pay));
}
/*
UC-8
 */
export const deliver = (req: Req.DeliveryRequest): Res.DeliveryResponse => {
    return runIfOpen(req, runIfHaveToken(BuyingService.deliver));
};

/*
correctness-constraints
 */
export const setPurchasePolicy = (req: Req.SetPurchasePolicyRequest): Res.BoolResponse => {
    return runIfOpen(req, runIfLoggedIn(StoreService.setPurchasePolicy));
}
export const viewPurchasePolicy = (req: Req.ViewStorePurchasePolicyRequest): Res.ViewStorePurchasePolicyResponse => {
    return runIfOpen(req, runIfLoggedIn(StoreService.viewPurchasePolicy));
}

/*
Additional req from FE
 */
export const getStoresWithOffset = (req: Req.GetStoresWithOffsetRequest): Res.GetStoresWithOffsetResponse => {
    return runIfOpen(req, runIfHaveToken(StoreService.getStoresWithOffset));
    // return runIfOpen(req, StoreService.getStoresWithOffset);
}
export const getAllProductsInStore = (req: Req.GetAllProductsInStoreRequest): Res.GetAllProductsInStoreResponse => {
    return runIfOpen(req, runIfHaveToken(StoreService.getAllProductsInStore));
    // return runIfOpen(req, StoreService.getAllProductsInStore);
}
export const getAllCategoriesInStore = (req: Req.GetAllCategoriesInStoreRequest): Res.GetCategoriesResponse => {
    return runIfOpen(req, runIfHaveToken(StoreService.getAllCategoriesInStore));
    // return runIfOpen(req, StoreService.getAllCategoriesInStore);
}
export const isSystemUp = (): Res.BoolResponse => {
    // return runIfOpen(req, runIfHaveToken(StoreService.getStoresWithOffset));
    return { data: { result: tradingSystem.getTradeSystemState().data.state === Enums.TradingSystemState.OPEN}}
}
export const verifyToken = (req: Req. Request): Res.BoolResponse => {
    return runIfOpen(req, UserService.verifyToken);
}
export const isLoggedInUser = (req: Req.Request): Res.GetLoggedInUserResponse => {
    return runIfOpen(req, runIfHaveToken(UserService.isLoggedInUser));
    // return runIfOpen(req, UserService.isLoggedInUser);
}
export const getAllCategories = (req: Req.Request): Res.GetCategoriesResponse => {
    return runIfOpen(req, runIfHaveToken(StoreService.getAllCategories))
}

/*
Utils
 */
export const reset = (): void => {
    tradingSystem = createInstance();
}
export const startNewSession = (): string => {
    return tradingSystem.startNewSession();
}
const runIfOpen = (req: Req.Request, fn: any): any => {
    const isOpenReq: Req.Request = {body: {}, token: req.token};
    if (tradingSystem.getTradeSystemState().data.state !== Enums.TradingSystemState.OPEN)
        return {data: {}, error: {message: "Trading system is closed!"}}
    return fn.call(this, req);
}

const runIfHaveToken = (fn: any): any => {
    const f = function (req: Req.Request) {
        const isTokenExistsReq: Req.Request = {body: {}, token: req.token};
        const isTokenExistsRes: Res.BoolResponse = tradingSystem.verifyTokenExists(isTokenExistsReq);
        if (!isTokenExistsRes.data.result)
            return isTokenExistsRes
        return fn.call(this, req);
    }
    return f;
}

const runIfLoggedIn = (fn: any): any => {
    const f = function (req: Req.Request) {
        const isLoginReq: Req.Request = {body: {}, token: req.token};
        const isLoginRes: Res.BoolResponse = tradingSystem.verifyUserLoggedIn(isLoginReq);
        if (!isLoginRes.data.result)
            return isLoginRes
        return fn.call(this, req);
    }
    return f;
}

export {tradingSystem}





/** --------------------------------- testing --------------------------------- */
import {t1, t2, t3, t4} from "../testSocket";
export const test1 = () : any => {
    t1();
}
export const test2 = () : any => {
    t2();
}
export const test3 = () : any => {
    t3();
}
export const test4 = () : any => {
    t4();
}

