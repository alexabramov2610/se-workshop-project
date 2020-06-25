import {Condition} from "./Condition";
import {BagItem} from "se-workshop-20-interfaces/dist/src/CommonInterface";

export class IsOnDiscountCondition extends Condition {
    private _catalogNumber: number;

    public constructor(catalogNumber: number) {
        super()
        this._catalogNumber = +catalogNumber;
    }

    isSatisfied(bag: BagItem[]): boolean {
        const bagItem: BagItem = bag.find((b) => b.product.catalogNumber === this._catalogNumber)
        return bagItem && bagItem.product.price * bagItem.amount > bagItem.finalPrice
    }
    getCatalogNumber(){
        return this._catalogNumber;
    }

}