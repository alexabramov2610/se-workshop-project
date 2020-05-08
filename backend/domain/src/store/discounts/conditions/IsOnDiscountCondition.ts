import {Condition} from "./Condition";
import {BagItem} from "se-workshop-20-interfaces/dist/src/CommonInterface";

export class IsOnDiscountCondition extends Condition {
    private _catalogNumber: number;
    private _minPay: number;

    public constructor(catalogNumber: number, minPay: number) {
        super()
        this._catalogNumber = catalogNumber;
        this._minPay = minPay;
    }

    isSatisfied(bag: BagItem[]): boolean {
        const bagItem: BagItem = bag.find((b) => b.product.catalogNumber === this._catalogNumber)
        return bagItem.product.price * bagItem.amount > bagItem.finalPrice
    }

}