import * as Req from "domain_layer/dist/src/api-ext/Request";
import * as Res from "domain_layer/dist/src/api-ext/Response";
import { TradingSystemManager as TS } from "domain_layer/dist/src/trading_system/TradingSystemManager";

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
  //TODO i put a price of 1 just to make it run.
  ts.calculateFinalPrices({ body: {}, token: req.token });
  const isPaid: Res.BoolResponse = ts.pay({
    body: { price: 1, payment: req.body.payment },
    token: req.token,
  });
  if (!isPaid.data.result) return isPaid;
  return ts.purchase(req);
};
