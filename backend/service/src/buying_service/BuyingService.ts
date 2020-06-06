import {Res, Req} from "se-workshop-20-interfaces"
import {tradingSystem as ts} from "../service_facade/ServiceFacade";

export const purchase = async (req: Req.PurchaseRequest): Promise<Res.PurchaseResponse> => {
    const isPolicyOkReq: Req.VerifyPurchasePolicy = {body: {}, token: req.token}
    const isPolicyOk: Res.BoolResponse = await ts.verifyStorePolicy(isPolicyOkReq)
    if (!isPolicyOk.data.result) {
        return isPolicyOk;
    }
    const isCartOnStock: Res.BoolResponse = await ts.verifyCart({
        body: {},
        token: req.token,
    });
    if (!isCartOnStock.data.result) {
        return isCartOnStock;
    }
    // calculate price after discount
    const calcRes: Res.CartFinalPriceRes = await ts.calculateFinalPrices({body: {}, token: req.token});
    if (!calcRes)
        return calcRes
    if (req.body.total && +req.body.total !== calcRes.data.price) {
        return {data: {result: false},
            error: {
                message: "Total price has been changed.",
                options: {oldPrice: req.body.total, newPrice: calcRes.data.price}
            }
        }
    }
    const isPaid: Res.PaymentResponse = await ts.pay({
        body: {price: calcRes.data.price, payment: req.body.payment},
        token: req.token,
    });
    if (!isPaid.data.result) return isPaid;
    const updateStockRequest: Req.UpdateStockRequest = {token: req.token, body: {payment: isPaid.data.payment}}
    return ts.purchase(updateStockRequest)
};

export const pay = (req: Req.PayRequest): Promise<Res.PaymentResponse> => {
    return ts.pay(req)

};

export const deliver = (req: Req.DeliveryRequest): Promise<Res.DeliveryResponse> => {
    return ts.deliver(req)
};