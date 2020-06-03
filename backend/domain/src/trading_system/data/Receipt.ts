import {IPayment, IReceipt, Purchase} from "se-workshop-20-interfaces/dist/src/CommonInterface";

export class Receipt implements IReceipt{

    private _purchases: Purchase[];
    private readonly _date: Date;
    private readonly _payment: IPayment

    constructor(purchases: Purchase[], payment: IPayment, date?: Date) {
        this._purchases = purchases
        this._payment = payment;
        this._date = date? date :new Date();
    }

    get purchases(): Purchase[] {
        return this._purchases;
    }

    get date(): Date {
        return this._date;
    }


    get payment(): IPayment {
        return this._payment;
    }

    addPurchase(newPurchase: Purchase): void {
        this._purchases = this._purchases.concat([newPurchase]);
    }

    removePurchase(purchaseToRemove: Purchase): void {
        this._purchases = this._purchases.filter((p) => p.item.id !== purchaseToRemove.item.id);
    }

}