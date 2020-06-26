import {Req, Res} from "se-workshop-20-interfaces"
import {tradingSystem as ts} from "../service_facade/ServiceFacade";

export const registerUser = async (req: Req.RegisterRequest): Promise<Res.BoolResponse> => {
    const isCredentialsOk: Res.BoolResponse = ts.verifyNewCredentials({
        body: {
            username: req.body.username,
            password: req.body.password
        }, token: req.token
    })
    if (!isCredentialsOk.data.result)
        return isCredentialsOk
    return ts.register(req);
}

export const loginUser = async (req: Req.LoginRequest): Promise<Res.BoolResponse> => {
    const verifyCredentialsReq: Req.VerifyCredentialsReq = {
        body: {
            username: req.body.username,
            password: req.body.password
        }, token: req.token
    }
    const isValid: Res.BoolResponse = await ts.verifyCredentials(verifyCredentialsReq);
    if (!isValid.data.result)
        return isValid
    return ts.login(req);
}

export const forceLogout = (username: string): Promise<void> => {
    return ts.forceLogout(username);
}

export const logoutUser = (req: Req.LogoutRequest): Promise<Res.BoolResponse> => {
    return ts.logout(req);
}

export const saveProductToCart = async (req: Req.SaveToCartRequest): Promise<Res.BoolResponse> => {
    const isProductsAvailable: Res.BoolResponse = await ts.verifyProductOnStock({
        body: {
            storeName: req.body.storeName,
            catalogNumber: req.body.catalogNumber,
            amount: req.body.amount
        }, token: req.token
    })
    if (!isProductsAvailable.data.result)
        return isProductsAvailable

    return ts.saveProductToCart(req);
}

export const removeProductFromCart = (req: Req.RemoveFromCartRequest): Promise<Res.BoolResponse> => {
    return ts.removeProductFromCart(req);
}

export const getPersonalDetails = (req: Req.Request): Promise<Res.GetPersonalDetailsResponse> => {
    return ts.getPersonalDetails(req);
}

export const viewCart = async (req: Req.ViewCartReq): Promise<Res.ViewCartRes> => {
    const calcRes: Res.CartFinalPriceRes = await ts.calculateFinalPrices({body: {}, token: req.token});
    if (!calcRes)
        return calcRes
    const viewCartRes: Res.ViewCartRes  = await ts.viewCart(req);
    if(!viewCartRes)
        return viewCartRes
    return {data: { result: true, cart: viewCartRes.data.cart, total:calcRes.data.price}};
    return ts.viewCart(req);
}

export const viewRegisteredUserPurchasesHistory = (req: Req.ViewRUserPurchasesHistoryReq): Promise<Res.ViewRUserPurchasesHistoryRes> => {
    return ts.viewRegisteredUserPurchasesHistory(req);
}

export const isLoggedInUser = (req: Req.Request): Promise<Res.GetLoggedInUserResponse>  => {
    return ts.isLoggedInUserByToken(req);
}

export const verifyToken = (req: Req.Request): Promise<Res.BoolResponse> => {
    return ts.verifyTokenExists(req);
}

export const getAllUsers = (req: Req.Request): Promise<Res.GetAllUsersResponse> => {
    return ts.getAllUsers(req);
}

export const watchVisitorsInfo = (req: Req.WatchVisitorsInfoRequest): Promise<Res.WatchVisitorsInfoResponse> => {
    return ts.watchVisitorsInfo(req);
}

export const stopVisitorsStatistics = (req: Req.Request): void => {
    return ts.stopVisitorsStatistics(req);
}