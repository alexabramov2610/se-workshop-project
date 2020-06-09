import {BagItem} from "se-workshop-20-interfaces/dist/src/CommonInterface";
import {Operators, WeekDays} from "se-workshop-20-interfaces/dist/src/Enums";
import {RegisteredUser} from "../../user/internal_api";

export abstract class PurchasePolicy {

    abstract isSatisfied(bagItems: BagItem[], user?: RegisteredUser): boolean;

    abstract add(discount: PurchasePolicy, operator: Operators): void;

    abstract remove(discount: PurchasePolicy): void;

    public abstract isComposite(): boolean;

    public abstract getPolicyTag():string;
    public getNotForSellDays() : WeekDays[]{
        return undefined;
    }
    public getCountries() : string[]{
        return undefined;
    }
    public getCatalogNumber() : number{
        return undefined;
    }
    public getMinAmount() : number{
        return undefined;
    }
    public getMaxAmount() : number{
        return undefined;
    }



}