import * as Req from "domain_layer/dist/src/api-ext/Request";
import * as Res from "domain_layer/dist/src/api-ext/Response";
import {TradingSystemManager as TS} from "domain_layer/dist/src/trading_system/TradingSystemManager";

export const registerUser = (req: Req.RegisterRequest, ts: TS): Res.BoolResponse => {
    // TODO 1.verify credentials  2.register

    return ts.register(req);
}

export const loginUser = (req: Req.LoginRequest, ts: TS): Res.BoolResponse => {
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

export const logoutUser = (req: Req.LogoutRequest, ts: TS): Res.BoolResponse => {
    return ts.logout(req);
}

export const saveProductToCart = (req: Req.SaveToCartRequest, ts: TS): Res.BoolResponse => {
    // TODO 1.check products are on stock  2.save to cart
    return ts.saveProductToCart(req);
}

export const removeProductFromCart = (req: Req.RemoveFromCartRequest, ts: TS): Res.BoolResponse => {
    return ts.removeProductFromCart(req);
}

export const viewCart = (req: Req.ViewCartReq, ts: TS): Res.ViewCartRes => {
    return ts.viewCart(req);
}

export const viewRegisteredUserPurchasesHistory = (req: Req.ViewRUserPurchasesHistoryReq, ts: TS): Res.ViewRUserPurchasesHistoryRes => {
    return ts.viewRegisteredUserPurchasesHistory(req);
}
