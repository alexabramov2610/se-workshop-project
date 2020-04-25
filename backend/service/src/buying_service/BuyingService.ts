import * as Req from "domain_layer/dist/src/api-ext/Request";
import * as Res from "domain_layer/dist/src/api-ext/Response";
import {TradingSystemManager as TS} from "domain_layer/dist/src/trading_system/TradingSystemManager";

export const purchase = (
    req: Req.PurchaseRequest,
    ts: TS
): Res.PurchaseResponse => {
    const isCartOnStock: Res.BoolResponse = ts.verifyCart({
        body: {},
        token: req.token,
    });
    if (!isCartOnStock.data.result) {
        return isCartOnStock;
    }
    //calculate price after discount
    const calcRes: Res.CartFinalPriceRes = ts.calculateFinalPrices({body: {}, token: req.token});
    if (!calcRes)
        return calcRes
    const isPaid: Res.PaymentResponse = ts.pay({
        body: {price: calcRes.data.price, payment: req.body.payment},
        token: req.token,
    });
    if (!isPaid.data.result) return isPaid;
    const updateStockRequest : Req.UpdateStockRequest = {token:req.token,body:{payment: isPaid.data.payment}}
    const purchaseRes: Res.PurchaseResponse = ts.purchase(updateStockRequest)
    return purchaseRes;
};
