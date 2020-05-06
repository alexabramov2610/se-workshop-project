import {Condition} from "./Condition";
import {BagItem} from "se-workshop-20-interfaces/dist/src/CommonInterface";

export class MinAmountCondition extends Condition {
    private _catalogNumber: number;
    private _minAmount: number;

    public constructor(catalogNumber: number, minAmount: number) {
        super()
        this._catalogNumber = catalogNumber;
        this._minAmount = minAmount;
    }

    isSatisfied(bag: BagItem[]): boolean {
        const bagItem: BagItem = bag.find((b) => b.product.catalogNumber === this._catalogNumber)
        return bagItem && bagItem.amount > this._minAmount
    }

    getCatalogNumber(){
        return this._catalogNumber;
    }
    getMin(){
        return this._minAmount;
    }

}