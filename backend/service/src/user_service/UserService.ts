import * as Req from "se-workshop-20-interfaces";
import * as Res from "se-workshop-20-interfaces";
import {tradingSystem as ts} from "../service_facade/ServiceFacade";

export const registerUser = (req: Req.RegisterRequest): Res.BoolResponse => {
    // TODO 1.verify credentials  2.register
    const isCredentialsOk :Res.BoolResponse =ts.verifyNewCredentials({body: {username: req.body.username, password: req.body.password},token:req.token})
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

export const logoutUser = (req: Req.LogoutRequest): Res.BoolResponse => {
    return ts.logout(req);
}

export const saveProductToCart = (req: Req.SaveToCartRequest): Res.BoolResponse => {
    // TODO 1.check products are on stock  2.save to cart
    return ts.saveProductToCart(req);
}

export const removeProductFromCart = (req: Req.RemoveFromCartRequest): Res.BoolResponse => {
    return ts.removeProductFromCart(req);
}

export const viewCart = (req: Req.ViewCartReq): Res.ViewCartRes => {
    return ts.viewCart(req);
}

export const viewRegisteredUserPurchasesHistory = (req: Req.ViewRUserPurchasesHistoryReq): Res.ViewRUserPurchasesHistoryRes => {
    return ts.viewRegisteredUserPurchasesHistory(req);
}
