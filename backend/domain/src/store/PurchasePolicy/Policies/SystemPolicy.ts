import {PurchasePolicy} from "../PurchasePolicy";
import {BagItem} from "se-workshop-20-interfaces/dist/src/CommonInterface";
import {Operators, WeekDays} from "se-workshop-20-interfaces/dist/src/Enums";

export class SystemPolicy extends PurchasePolicy {
    private _notForSellDays: WeekDays[];

    public constructor(notForSellDays: WeekDays[]) {
        super()
        this._notForSellDays = notForSellDays;
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
        return true;
    }

}