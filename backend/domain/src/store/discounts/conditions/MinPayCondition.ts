import {Condition} from "./Condition";
import {BagItem} from "se-workshop-20-interfaces/dist/src/CommonInterface";
import {loggerW} from "../../../api-int/Logger";
const logger = loggerW(__filename)

export class MinPayCondition extends Condition {
    private _minPay: number;

    public constructor(minPay: number) {
        super()
        this._minPay = +minPay;
    }

    isSatisfied(bag: BagItem[]): boolean {
        const totalPrice =  this.getBagTotalPrice(bag)
        logger.info(`total bag price: ${totalPrice} > minPay ${this._minPay}`)
        return totalPrice > this._minPay;
    }

    private getBagTotalPrice(bag: BagItem[]): number {
        return bag.reduce((prev, curr) => prev + curr.finalPrice , 0);
    }

    getMinPay(): number {
        return  this._minPay;
    }
}