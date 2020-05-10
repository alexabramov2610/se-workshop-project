import {v4 as uuid} from 'uuid';
import {BagItem} from "se-workshop-20-interfaces/dist/src/CommonInterface";
import {Operators} from "se-workshop-20-interfaces/dist/src/Enums";

export abstract class PurchasePolicy {

    constructor() {
        this._id = uuid();
    }

    private _id: string;

    get id(): string {
        return this._id;
    }

    abstract isSatisfied(bagItems: BagItem[]): boolean;

    abstract add(discount: PurchasePolicy, operator: Operators): void;

    abstract remove(discount: PurchasePolicy): void;

    public abstract isComposite(): boolean;


}