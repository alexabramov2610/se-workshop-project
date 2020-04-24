import * as Req from "domain_layer/dist/src/api-ext/Request";
import * as Res from "domain_layer/dist/src/api-ext/Response";
import {TradingSystemManager as TS} from "domain_layer/dist/src/trading_system/TradingSystemManager";

export const purchase = (req: Req.PurchaseRequest, ts: TS): Res.PurchaseResponse => {
    const isCartOnStock: Res.BoolResponse = ts.verifyCart({body: {}, token: req.token})
    if (!isCartOnStock.data.result) {
        return isCartOnStock
    }
    //calculate price after discount
    const isPaid :Res.BoolResponse = ts.pay({body: req.body.payment , token: req.token});
    //return ts.purchase(req);
}



