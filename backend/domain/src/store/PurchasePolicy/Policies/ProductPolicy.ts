import {PurchasePolicy} from "../PurchasePolicy";
import {BagItem} from "se-workshop-20-interfaces/dist/src/CommonInterface";
import {Operators} from "se-workshop-20-interfaces/dist/src/Enums";
import {RegisteredUser} from "../../../user/users/RegisteredUser";

export class ProductPolicy extends PurchasePolicy {
    public constructor(catalogNumber: number, minAmount: number, maxAmount: number) {
        super()
        this._catalogNumber = +catalogNumber;
        this._minAmount = +minAmount
        this._maxAmount = +maxAmount
    }

    private _catalogNumber: number;

    get catalogNumber(): number {
        return this._catalogNumber;
    }

    private _minAmount: number;

    get minAmount(): number {
        return this._minAmount;
    }

    private _maxAmount: number;

    get maxAmount(): number {
        return this._maxAmount;
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

    isSatisfied(bagItems: BagItem[], user?: RegisteredUser): boolean {
        const bagItem: BagItem = bagItems.find((item) => item.product.catalogNumber === this.catalogNumber)
        if(!bagItem && this._minAmount !== 0)
            return false;
        if (!bagItem)
            return true;
        return this.minAmount <= bagItem.amount && bagItem.amount <= this.maxAmount;
    }
    public getCatalogNumber() : number{
        return this._catalogNumber;
    }
    public getMinAmount() : number{
        return this._minAmount;
    }
    public getMaxAmount() : number{
        return this._maxAmount;
    }
    public getPolicyTag(): string {
        return "product";
    }
}