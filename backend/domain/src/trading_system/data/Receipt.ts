import {IPayment, Purchase} from "../../api-ext/CommonInterface";

export class Receipt {

    private _purchases: Purchase[];
    private readonly _date: Date;
    private _payment: IPayment

    constructor(purchases: Purchase[], payment: IPayment) {
        this._purchases = purchases
        this._payment = payment;
        this._date = new Date();
    }

    get purchases(): Purchase[] {
        return this._purchases;
    }

    get date(): Date {
        return this._date;
    }

    addPurchase(newPurchase: Purchase): void {
        this._purchases = this._purchases.concat([newPurchase]);
    }

    removePurchase(purchaseToRemove: Purchase): void {
        this._purchases = this._purchases.filter((p) => p.item.id !== purchaseToRemove.item.id);
    }

}