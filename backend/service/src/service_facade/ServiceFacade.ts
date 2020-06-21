import {getInstance, createInstance} from "domain_layer/";
import {Req, Res, Enums, CommonInterface, Event} from "se-workshop-20-interfaces";
import * as UserService from '../user_service/UserService';
import * as StoreService from '../store_service/StoreService';
import * as BuyingService from '../buying_service/BuyingService';
import * as YamlInitializer from './YamlInitializer';
import {IPublisher} from "se-workshop-20-interfaces/dist/src/CommonInterface";

let tradingSystem = getInstance();

/*
UC-1.1
 */
export const systemInit = async (req: Req.InitReq): Promise<Res.BoolResponse> => {
    const isCredentialsOk: Res.BoolResponse = tradingSystem.verifyNewCredentials({
        body: {
            username: req.body.firstAdminName,
            password: req.body.firstAdminPassword
        }, token: req.token
    })
    if (!isCredentialsOk.data.result)
        return isCredentialsOk
    const registerRequest: Req.RegisterRequest = {
        body: {
            username: req.body.firstAdminName,
            password: req.body.firstAdminPassword
        }, token: req.token
    };


    const registerRes: Res.BoolResponse = await tradingSystem.register(registerRequest);
    if (registerRes.error)
        return registerRes;

    const loginReq: Req.LoginRequest = {
        body: {
            username: req.body.firstAdminName,
            password: req.body.firstAdminPassword,
        }, token: req.token
    };
    const loginRes: Res.BoolResponse = await tradingSystem.login(loginReq);
    if (!loginRes.data.result) return loginRes;
    const setAdminReq: Req.SetAdminRequest = {body: {newAdminUserName: req.body.firstAdminName}, token: req.token};
    const setAdminRes: Res.BoolResponse = await tradingSystem.setAdmin(setAdminReq)
    if (setAdminRes.error) return setAdminRes;
    const connectExtReq: Req.Request = {body: {}, token: req.token};
    const connectDeliveryRes: Res.BoolResponse = await tradingSystem.connectDeliverySys(connectExtReq);
    if (connectDeliveryRes.error) return connectDeliveryRes;
    const connectPaymentRes: Res.BoolResponse = await tradingSystem.connectPaymentSys(connectExtReq);
    if (connectPaymentRes.error) return connectPaymentRes;
    await tradingSystem.openTradeSystem({body: {}, token: req.token})
    const logout: Res.BoolResponse = await tradingSystem.logout({body: {}, token: req.token});
    if (!logout.data.result) return logout;
    return {data: {result: true}}
}
export const initFromFile = async (req: Req.InitFromFileRequest): Promise<Res.BoolResponse> => {
    const fn = await runIfHaveToken(YamlInitializer.initSystemFromFile);
    return fn.call(this, req);
}

/*
UC-2.2
 */
export const registerUser = (req: Req.RegisterRequest): Promise<Res.BoolResponse> => {
    return runIfOpen(req, runIfHaveToken(UserService.registerUser));
}
/*
UC-2.3
 */
export const loginUser = (req: Req.LoginRequest): Promise<Res.BoolResponse> => {
    return runIfOpen(req, runIfHaveToken(UserService.loginUser));
}
/*
UC-2.4
 */
export const viewStoreInfo = (req: Req.StoreInfoRequest): Promise<Res.StoreInfoResponse> => {
    return runIfOpen(req, runIfHaveToken(StoreService.viewStoreInfo));
}
export const viewProductInfo = (req: Req.ProductInfoRequest): Promise<Res.ProductInfoResponse> => {
    return runIfOpen(req, runIfHaveToken(StoreService.viewProductInfo));
}
/*
UC-2.5
 */
export const search = (req: Req.SearchRequest): Promise<Res.SearchResponse> => {
    return runIfOpen(req, runIfHaveToken(StoreService.search));
}
/*
UC-2.6
 */
export const saveProductToCart = (req: Req.SaveToCartRequest): Promise<Res.BoolResponse> => {
    return runIfOpen(req, runIfHaveToken(UserService.saveProductToCart));
}
/*
UC-2.7
 */
export const removeProductFromCart = (req: Req.RemoveFromCartRequest): Promise<Res.BoolResponse> => {
    return runIfOpen(req, runIfHaveToken(UserService.removeProductFromCart));
}
export const viewCart = (req: Req.ViewCartReq): Promise<Res.ViewCartRes> => {
    return runIfOpen(req, runIfHaveToken(UserService.viewCart));
}
/*
UC-2.8
 */
export const purchase = (req: Req.PurchaseRequest): Promise<Res.PurchaseResponse> => {
    return runIfOpen(req, runIfHaveToken(BuyingService.purchase));
}
/*
UC-3.1
 */
export const logoutUser = (req: Req.LogoutRequest): Promise<Res.BoolResponse> => {
    return runIfOpen(req, runIfLoggedIn(UserService.logoutUser))
}
/*
UC-3.2
 */
export const createStore = (req: Req.OpenStoreRequest): Promise<Res.BoolResponse> => {
    return runIfOpen(req, runIfLoggedIn(StoreService.createStore))
}
/*
UC-3.7
 */
export const viewRegisteredUserPurchasesHistory = (req: Req.ViewRUserPurchasesHistoryReq): Promise<Res.ViewRUserPurchasesHistoryRes> => {
    return runIfOpen(req, runIfLoggedIn(UserService.viewRegisteredUserPurchasesHistory));
}

/*
UC-4.1
 */
export const changeProductName = (req: Req.ChangeProductNameRequest): Promise<Res.BoolResponse> => {
    return runIfOpen(req, runIfLoggedIn(StoreService.changeProductName));
}
export const changeProductPrice = (req: Req.ChangeProductPriceRequest): Promise<Res.BoolResponse> => {
    return runIfOpen(req, runIfLoggedIn(StoreService.changeProductPrice));
}
export const addItems = (req: Req.ItemsAdditionRequest): Promise<Res.ItemsAdditionResponse> => {
    return runIfOpen(req, runIfLoggedIn(StoreService.addItems));
}
export const removeItems = (req: Req.ItemsRemovalRequest): Promise<Res.ItemsRemovalResponse> => {
    return runIfOpen(req, runIfLoggedIn(StoreService.removeItems));
}
// export const removeProductsWithQuantity = (req: Req.RemoveProductsWithQuantity): Promise<Res.ProductRemovalResponse> => {
//     return runIfOpen(req, runIfLoggedIn(StoreService.removeProductsWithQuantity));
// }
export const addNewProducts = (req: Req.AddProductsRequest): Promise<Res.ProductAdditionResponse> => {
    return runIfOpen(req, runIfLoggedIn(StoreService.addNewProducts));
}
export const removeProducts = (req: Req.ProductRemovalRequest): Promise<Res.ProductRemovalResponse> => {
    return runIfOpen(req, runIfLoggedIn(StoreService.removeProducts));
}


/*
UC-4.2 discounts
 */

export const setDiscountsPolicy = (req: Req.SetDiscountsPolicyRequest): Promise<Res.BoolResponse> => {
    return runIfOpen(req, runIfLoggedIn(StoreService.setDiscountsPolicy));
}

export const viewDiscountsPolicy = (req: Req.ViewStoreDiscountsPolicyRequest): Promise<Res.ViewStoreDiscountsPolicyResponse> => {
    return runIfOpen(req, runIfLoggedIn(StoreService.viewDiscountsPolicy));
}
/*
export const addDiscount = (req: Req.AddDiscountRequest): Promise<Res.BoolResponse> => {
    return runIfOpen(req, runIfLoggedIn(StoreService.addDiscount));
}
export const removeProductDiscount = (req: Req.RemoveDiscountRequest): Promise<Res.BoolResponse> => {
    return runIfOpen(req, runIfLoggedIn(StoreService.removeDiscount));
}
*/

/*
UC-4.3
 */
export const assignStoreOwner = (req: Req.AssignStoreOwnerRequest): Promise<Res.BoolResponse> => {
    return runIfOpen(req, runIfLoggedIn(StoreService.assignStoreOwner));
}
export const approveStoreOwner = (req: Req.ApproveNewOwnerRequest): Promise<Res.BoolResponse> => {
    return runIfOpen(req, runIfLoggedIn(StoreService.approveStoreOwner));
}
/*
UC-4.4
 */
export const removeStoreOwner = (req: Req.RemoveStoreOwnerRequest): Promise<Res.BoolResponse> => {
    return runIfOpen(req, runIfLoggedIn(StoreService.removeStoreOwner));
}
/*
UC-4.5
 */
export const assignStoreManager = (req: Req.AssignStoreManagerRequest): Promise<Res.BoolResponse> => {
    return runIfOpen(req, runIfLoggedIn(StoreService.assignStoreManager));
}
/*
UC-4.6
 */
export const addManagerPermissions = (req: Req.ChangeManagerPermissionRequest): Promise<Res.BoolResponse> => {
    return runIfOpen(req, runIfLoggedIn(StoreService.addManagerPermissions));
}
export const addMultipleManagersPermissions = (req: Req.ChangeMultipleManagerPermissionRequest): Promise<Res.BoolResponse> => {
    return runIfOpen(req, runIfLoggedIn(StoreService.addMultipleManagersPermissions));
}
export const removeManagerPermissions = (req: Req.ChangeManagerPermissionRequest): Promise<Res.BoolResponse> => {
    return runIfOpen(req, runIfLoggedIn(StoreService.removeManagerPermissions));
}
export const viewManagerPermissions = (req: Req.ViewManagerPermissionRequest): Promise<Res.ViewManagerPermissionResponse> => {
    return runIfOpen(req, runIfLoggedIn(StoreService.viewManagerPermissions));
}
export const getManagerPermissions = (req: Req.ViewManagerPermissionRequest): Promise<Res.ViewManagerPermissionResponse> => {
    return runIfOpen(req, runIfLoggedIn(StoreService.getManagerPermissions));
}

/*
UC-4.7
 */
export const removeStoreManager = (req: Req.RemoveStoreManagerRequest): Promise<Res.BoolResponse> => {
    return runIfOpen(req, runIfLoggedIn(StoreService.removeStoreManager));
}
/*
UC-4.9
 */
// export const viewUsersContactUsMessages = (req: Req.ViewUsersContactUsMessagesRequest): Promise<Res.ViewUsersContactUsMessagesResponse> => {
//     return runIfOpen(req, runIfLoggedIn(StoreService.viewUsersContactUsMessages));
// }
/*
UC-4.10
 */
export const viewStorePurchasesHistory = (req: Req.ViewShopPurchasesHistoryRequest): Promise<Res.ViewShopPurchasesHistoryResponse> => {
    return runIfOpen(req, runIfLoggedIn(StoreService.viewStorePurchasesHistory));
}
/*
UC-6.5
 */
export const watchVisitorsInfo = (req: Req.WatchVisitorsInfoRequest): Promise<Res.WatchVisitorsInfoResponse> => {
    return runIfOpen(req, runIfHaveToken(UserService.watchVisitorsInfo));
}
export const stopVisitorsStatistics = (req: Req.Request): void => {
    runIfOpen(req, runIfHaveToken(UserService.stopVisitorsStatistics))
        .then()
        .catch();
}
/*
UC-7
 */
export const pay = (req: Req.PayRequest): Promise<Res.PaymentResponse> => {
    return runIfOpen(req, runIfHaveToken(BuyingService.pay));
}
export const setPaymentSystem = (req: Req.SetPaymentSystemRequest): Promise<Res.BoolResponse> => {
    return runIfOpen(req, runIfHaveToken(BuyingService.setPaymentSystem));
}
/*
UC-8
 */
export const deliver = (req: Req.DeliveryRequest): Promise<Res.DeliveryResponse> => {
    return runIfOpen(req, runIfHaveToken(BuyingService.deliver));
};
export const setDeliverySystem = (req: Req.SetDeliverySystemRequest): Promise<Res.BoolResponse> => {
    return runIfOpen(req, runIfHaveToken(BuyingService.setDeliverySystem));
}
/*
correctness-constraints
 */
export const setPurchasePolicy = (req: Req.SetPurchasePolicyRequest): Promise<Res.BoolResponse> => {
    return runIfOpen(req, runIfLoggedIn(StoreService.setPurchasePolicy));
}
export const viewPurchasePolicy = (req: Req.ViewStorePurchasePolicyRequest): Promise<Res.ViewStorePurchasePolicyResponse> => {
    return runIfOpen(req, runIfLoggedIn(StoreService.viewPurchasePolicy));
}

/*
Additional req from FE
 */
export const getStoresWithOffset = async (req: Req.GetStoresWithOffsetRequest): Promise<Res.GetStoresWithOffsetResponse> => {
    return runIfOpen(req, runIfHaveToken(StoreService.getStoresWithOffset));
}
export const getAllProductsInStore = async (req: Req.GetAllProductsInStoreRequest): Promise<Res.GetAllProductsInStoreResponse> => {
    return runIfOpen(req, runIfHaveToken(StoreService.getAllProductsInStore));
}
export const getAllCategoriesInStore = async (req: Req.GetAllCategoriesInStoreRequest): Promise<Res.GetCategoriesResponse> => {
    return runIfOpen(req, runIfHaveToken(StoreService.getAllCategoriesInStore));
}
export const isSystemUp = async (): Promise<Res.BoolResponse> => {
    // return runIfOpen(req, runIfHaveToken(StoreService.getStoresWithOffset));
    const res = await tradingSystem.getTradeSystemState()
    return {data: {result: res.data.state === Enums.TradingSystemState.OPEN}}
}
export const verifyToken = async (req: Req.Request): Promise<Res.BoolResponse> => {
    return runIfOpen(req, UserService.verifyToken);
}
export const isLoggedInUser = async (req: Req.Request): Promise<Res.GetLoggedInUserResponse> => {
    return runIfOpen(req, UserService.isLoggedInUser);
}
export const getAllCategories = async (req: Req.Request): Promise<Res.GetAllCategoriesResponse> => {
    return runIfOpen(req, runIfHaveToken(StoreService.getAllCategories))
}
export const getManagersPermissions = async (req: Req.GetAllManagersPermissionsRequest): Promise<Res.GetAllManagersPermissionsResponse> => {
    return runIfOpen(req, runIfHaveToken(StoreService.getManagersPermissions))
}
export const getOwnersAssignedBy = async (req: Req.GetOwnersAssignedByRequest): Promise<Res.GetOwnersAssignedByResponse> => {
    return runIfOpen(req, runIfHaveToken(StoreService.getOwnersAssignedBy))
}
export const getPersonalDetails = async (req: Req.Request): Promise<Res.GetPersonalDetailsResponse> => {
    return runIfOpen(req, runIfHaveToken(UserService.getPersonalDetails))
}
export const getItemIds = async (req: Req.GetItemsIdsRequest): Promise<Res.GetItemsIdsResponse> => {
    return runIfOpen(req, runIfHaveToken(StoreService.getItemIds))
}
export const getAllUsers = async (req: Req.Request): Promise<Res.GetAllUsersResponse> => {
    return runIfOpen(req, runIfHaveToken(UserService.getAllUsers))
}

export const getStoresNames = async (req: Req.GetNamesRequest): Promise<Res.GetNamesResponse> => {
    return runIfOpen(req, runIfHaveToken(StoreService.getStoresNames));
}

export const getProductsNames = async (req: Req.GetNamesRequest): Promise<Res.GetNamesResponse> => {
    return runIfOpen(req, runIfHaveToken(StoreService.getProductsNames));
}

/*
Utils
 */
export const reset = async (): Promise<void> => {
    tradingSystem = createInstance();
}
export const safeShutdown = async (): Promise<void> => {
    await tradingSystem.terminateSocket();
    await tradingSystem.dropAllDB();
}
export const dropDB = async (path?: string): Promise<void> => {
    await tradingSystem.dropAllDB(path);
}
export const setPublisher = async (publisher: IPublisher): Promise<void> => {
    tradingSystem.setPublisher(publisher);
}

//todo: set publisher and test

export const startNewSession = (): Promise<string> => {
    return tradingSystem.startNewSession();
}
const runIfOpen = async (req: Req.Request, fn: any): Promise<any> => {
    const res = await tradingSystem.getTradeSystemState()
    if (res.data.state !== Enums.TradingSystemState.OPEN)
        return {data: {}, error: {message: "Trading system is closed!"}}
    const func = await fn
    return func.call(this, req);
}

const runIfHaveToken = async (fn: any): Promise<any> => {
    const f = async function (req: Req.Request) {
        const isTokenExistsReq: Req.Request = {body: {}, token: req.token};
        const isTokenExistsRes: Res.BoolResponse = await tradingSystem.verifyTokenExists(isTokenExistsReq);
        if (!isTokenExistsRes.data.result)
            return isTokenExistsRes
        return fn.call(this, req);
    }
    return f;
}

const runIfLoggedIn = async (fn: any): Promise<any> => {
    const f = async function (req: Req.Request) {
        const isLoginReq: Req.Request = {body: {}, token: req.token};
        const isLoginRes: Res.BoolResponse = await tradingSystem.verifyUserLoggedIn(isLoginReq);
        if (!isLoginRes.data.result)
            return isLoginRes
        return fn.call(this, req);
    }
    return f;
}

export {tradingSystem}


/** --------------------------------- testing --------------------------------- */
import {t1, t2, t3, t4, t5} from "../testSocket";

export const test1 = (): any => {
    return t1();
}
export const test2 = (): any => {
    return t2();
}
export const test3 = (): any => {
    return t3();
}
export const test4 = (): any => {
    return t4();
}
export const test5 = (): any => {
    return t5();
}
