import {BagItem} from "se-workshop-20-interfaces/dist/src/CommonInterface";

export abstract class Condition {

    constructor() {
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