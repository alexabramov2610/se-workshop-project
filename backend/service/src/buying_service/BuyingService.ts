import {Res, Req} from "se-workshop-20-interfaces"
import {tradingSystem as ts} from "../service_facade/ServiceFacade";

export const purchase = async (req: Req.PurchaseRequest): Promise<Res.PurchaseResponse> => {
    const isPolicyOkReq: Req.VerifyPurchasePolicy = {body: {}, token: req.token}
    let verifyRes: Res.BoolResponse = await ts.verifyStorePolicy(isPolicyOkReq);
    if (!verifyRes.data.result)
        return verifyRes;

    verifyRes = await ts.verifyCart(isPolicyOkReq);
    if (!verifyRes.data.result)
        return verifyRes;

    // calculate price after discount
    const calcRes: Res.CartFinalPriceRes = await ts.calculateFinalPrices({body: {}, token: req.token});
    if (!calcRes)
        return calcRes
    if (req.body.total && +req.body.total !== calcRes.data.price) {
        return {
            data: {result: false},
            error: {
                message: "Total price has been changed.",
                options: {oldPrice: req.body.total, newPrice: calcRes.data.price}
            }
        }
    }

    let lock: string[] = [];
    while (!lock.length) {
        lock = await ts.lockStores(req.token);
    }
    try {
        const isCartOnStockVer: Res.BoolResponse = await ts.verifyCart({
            body: {},
            token: req.token,
        });
        if (!isCartOnStockVer.data.result) {
            await ts.unlockStores(lock)
            return isCartOnStockVer;
        }
        const isPaid: Res.PaymentResponse = await ts.pay({
            body: {price: calcRes.data.price, payment: req.body.payment},
            token: req.token,
        });
        if (!isPaid.data.result)
        {
            await ts.unlockStores(lock)
            return isPaid;
        }
        const updateStockRequest: Req.UpdateStockRequest = {token: req.token, body: {payment: isPaid.data.payment}}
        const purchaseRes: Res.PurchaseResponse = await ts.purchase(updateStockRequest)
        await ts.unlockStores(lock)
        return purchaseRes
    } catch (e) {
        await ts.unlockStores(lock)
        return {data: {result: false}}
    }


};

export const pay = (req: Req.PayRequest): Promise<Res.PaymentResponse> => {
    return ts.pay(req)

};

export const deliver = (req: Req.DeliveryRequest): Promise<Res.DeliveryResponse> => {
    return ts.deliver(req)
};


export const setPaymentSystem = (req: Req.SetPaymentSystemRequest): Promise<Res.BoolResponse> => {
    return ts.setPaymentSystem(req)
}

export const setDeliverySystem = (req: Req.SetDeliverySystemRequest): Promise<Res.BoolResponse> => {
    return ts.setDeliverySystem(req)}