import {PurchasePolicy} from "./PurchasePolicy";
import {BagItem} from "se-workshop-20-interfaces/dist/src/CommonInterface";
import {Operators} from "se-workshop-20-interfaces/dist/src/Enums";

export class PurchasePolicyImpl extends PurchasePolicy {
    private _children: Map<PurchasePolicy, Operators>;// storename -> items

    public constructor() {
        super()
        this._children = new Map();
    }

    add(discount: PurchasePolicy, operator: Operators): void {
        this._children.set(discount, operator)
    }

    remove(discount: PurchasePolicy): void {
        this._children.delete(discount)
    }

    isComposite(): boolean {
        return true;
    }

    get children(): Map<PurchasePolicy, Operators> {
        return this._children;
    }

    isSatisfied(bagItems: BagItem[]): boolean {
        return false;
    }
}