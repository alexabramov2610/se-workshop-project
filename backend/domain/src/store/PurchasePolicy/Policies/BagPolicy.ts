import {PurchasePolicy} from "../PurchasePolicy";
import {BagItem} from "se-workshop-20-interfaces/dist/src/CommonInterface";
import {Operators} from "se-workshop-20-interfaces/dist/src/Enums";
import {RegisteredUser} from "../../../user/users/RegisteredUser";

export class BagPolicy extends PurchasePolicy {
    private _minAmount: number;
    private _maxAmount: number;

    public constructor(minAmount: number, maxAmount: number) {
        super()
        this._minAmount = minAmount
        this._maxAmount = maxAmount
    }

    // tslint:disable-next-line:no-empty
    add(discount: PurchasePolicy, operator: Operators): void {
    }


    // tslint:disable-next-line:no-empty
    remove(discount: PurchasePolicy): void {
    }

    isComposite(): boolean {
        return false;
    }

    isSatisfied(bagItems: BagItem[],user?: RegisteredUser): boolean {
        return true;
    }
    public getPolicyTag():string{
        return "bag";
    }


    get minAmount(): number {
        return this._minAmount;
    }

    get maxAmount(): number {
        return this._maxAmount;
    }
}