import {PurchasePolicy} from "../PurchasePolicy";
import {BagItem} from "se-workshop-20-interfaces/dist/src/CommonInterface";
import {Operators} from "se-workshop-20-interfaces/dist/src/Enums";

export class ProductPolicy extends PurchasePolicy {
    private _catalogNumber: number;
    private _minAmount: number;
    private _maxAmount: number;

    public constructor(catalogNumber: number, minAmount: number, maxAmount: number) {
        super()
        this._catalogNumber = catalogNumber;
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


    isSatisfied(bagItems: BagItem[]): boolean {
        return false;
    }

}