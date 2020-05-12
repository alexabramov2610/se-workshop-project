import {PurchasePolicy} from "../PurchasePolicy";
import {BagItem} from "se-workshop-20-interfaces/dist/src/CommonInterface";
import {Operators, WeekDays} from "se-workshop-20-interfaces/dist/src/Enums";
import {RegisteredUser} from "../../../user/users/RegisteredUser";

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

    isSatisfied(bagItems: BagItem[],user?: RegisteredUser): boolean {
        return true;
    }
    public getPolicyTag():string{
        return "system";
    }


    get notForSellDays(): WeekDays[] {
        return this._notForSellDays;
    }
}