import {Req, Res, Enums, CommonInterface} from "se-workshop-20-interfaces"
import {tradingSystem as ts} from "../service_facade/ServiceFacade";

export const registerUser = (req: Req.RegisterRequest): Res.BoolResponse => {
    const isCredentialsOk: Res.BoolResponse = ts.verifyNewCredentials({
        body: {
            username: req.body.username,
            password: req.body.password
        }, token: req.token
    })
    if (!isCredentialsOk.data.result)
        return isCredentialsOk;
    return ts.register(req);
}

export const loginUser = (req: Req.LoginRequest): Res.BoolResponse => {
    const verifyCredentialsReq: Req.VerifyCredentialsReq = {
        body: {
            username: req.body.username,
            password: req.body.password
        }, token: req.token
    }
    const isValid: Res.BoolResponse = ts.verifyCredentials(verifyCredentialsReq);
    if (!isValid.data.result)
        return isValid
    return ts.login(req);
}

export const forceLogout = (username: string): void => {
    return ts.forceLogout(username);
}

export const logoutUser = (req: Req.LogoutRequest): Res.BoolResponse => {
    return ts.logout(req);
}

export const saveProductToCart = (req: Req.SaveToCartRequest): Res.BoolResponse => {
    const isProductsAvailable: Res.BoolResponse = ts.verifyProductOnStock({
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

export const removeProductFromCart = (req: Req.RemoveFromCartRequest): Res.BoolResponse => {
    return ts.removeProductFromCart(req);
}

export const getPersonalDetails = (req: Req.Request): Res.GetPersonalDetailsResponse => {
    return ts.getPersonalDetails(req);
}

export const viewCart = (req: Req.ViewCartReq): Res.ViewCartRes => {
    const calcRes: Res.CartFinalPriceRes = ts.calculateFinalPrices({body: {}, token: req.token});
    if (!calcRes)
        return calcRes
    const viewCartRes: Res.ViewCartRes  = ts.viewCart(req);
    if(!viewCartRes)
        return viewCartRes
    return {data: { result: true, cart: viewCartRes.data.cart, total: calcRes.data.price}};
    return ts.viewCart(req);
}

export const viewRegisteredUserPurchasesHistory = (req: Req.ViewRUserPurchasesHistoryReq): Res.ViewRUserPurchasesHistoryRes => {
    return ts.viewRegisteredUserPurchasesHistory(req);
}

export const isLoggedInUser = (req: Req.Request): Res.GetLoggedInUserResponse => {
    return ts.isLoggedInUserByToken(req);
}

export const verifyToken = (req: Req.Request): Res.BoolResponse => {
    return ts.verifyTokenExists(req);
}
