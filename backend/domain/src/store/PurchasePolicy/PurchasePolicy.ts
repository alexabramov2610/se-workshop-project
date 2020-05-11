import {v4 as uuid} from 'uuid';
import {BagItem} from "se-workshop-20-interfaces/dist/src/CommonInterface";
import {Operators} from "se-workshop-20-interfaces/dist/src/Enums";
import {RegisteredUser} from "../../user/internal_api";

export abstract class PurchasePolicy {

    constructor() {
        this._id = uuid();
    }

    private _id: string;

    get id(): string {
        return this._id;
    }

    abstract isSatisfied(bagItems: BagItem[], user?: RegisteredUser): boolean;

    abstract add(discount: PurchasePolicy, operator: Operators): void;

    abstract remove(discount: PurchasePolicy): void;

    public abstract isComposite(): boolean;

    public abstract getPolicyTag():string;




}