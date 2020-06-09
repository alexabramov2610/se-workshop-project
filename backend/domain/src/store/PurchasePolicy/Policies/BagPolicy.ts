import {PurchasePolicy} from "../PurchasePolicy";
import {BagItem} from "se-workshop-20-interfaces/dist/src/CommonInterface";
import {Operators} from "se-workshop-20-interfaces/dist/src/Enums";
import {RegisteredUser} from "../../../user/users/RegisteredUser";

export class BagPolicy extends PurchasePolicy {
    public constructor(minAmount: number, maxAmount: number) {
        super()
        this._minAmount = +minAmount
        this._maxAmount = +maxAmount
    }

    private _minAmount: number;

    get minAmount(): number {
        return this._minAmount;
    }

    private _maxAmount: number;

    get maxAmount(): number {
        return this._maxAmount;
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

    isSatisfied(bagItems: BagItem[], user?: RegisteredUser): boolean {
        let bagSize: number = 0;
        for (const bagItem of bagItems) {
            bagSize += bagItem.amount;
        }
        return this.minAmount <= bagSize && bagSize <= this.maxAmount;
    }

    public getMinAmount(): number {
        return this._minAmount;
    }

    public getMaxAmount(): number {
        return this._maxAmount;
    }

    public getPolicyTag(): string {
        return "bag";
    }
}