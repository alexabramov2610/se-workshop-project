import {PurchasePolicy} from "../PurchasePolicy";
import {BagItem} from "se-workshop-20-interfaces/dist/src/CommonInterface";
import {Operators} from "se-workshop-20-interfaces/dist/src/Enums";
import {RegisteredUser} from "../../../user/users/RegisteredUser";

export class UserPolicy extends PurchasePolicy {
    private _countries: string[];


    public constructor(countries: string[]) {
        super()
        this._countries = countries;
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
        return "user";
    }

    public getCountries() : string[]{
        return this._countries;
    }
    get countries(): string[] {
        return this._countries;
    }
}