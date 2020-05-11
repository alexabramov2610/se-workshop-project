import {v4 as uuid} from 'uuid';
import {BagItem} from "se-workshop-20-interfaces/dist/src/CommonInterface";

export abstract class Condition {

    constructor() {
        this._id = uuid();
    }

    private _id: string;

    get id(): string {
        return this._id;
    }

    abstract isSatisfied(bag: BagItem[]): boolean;

    getCatalogNumber(): number {
        return undefined
    }

    getMinAmount(): number {
        return undefined;
    }

    getMinPay(): number {
        return undefined;
    }

}