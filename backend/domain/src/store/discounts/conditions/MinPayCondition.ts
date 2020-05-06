import {Condition} from "./Condition";
import {BagItem} from "se-workshop-20-interfaces/dist/src/CommonInterface";

export class MinPayCondition extends Condition {
    private _catalogNumber: number;
    private _minPay: number;

    public constructor(catalogNumber: number, minPay: number) {
        super()
        this._catalogNumber = catalogNumber;
        this._minPay = minPay;
    }

    isSatisfied(bag: BagItem[]): boolean {
        return this.getBagTotalPrice(bag) > this._minPay;
    }

    private getBagTotalPrice(bag: BagItem[]): number {
        return bag.reduce((prev, curr) => prev + curr.finalPrice , 0);
    }
}