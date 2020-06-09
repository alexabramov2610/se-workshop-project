import {PurchasePolicy} from "./PurchasePolicy";
import {BagItem} from "se-workshop-20-interfaces/dist/src/CommonInterface";
import {Operators} from "se-workshop-20-interfaces/dist/src/Enums";
import {RegisteredUser} from "../../user/users/RegisteredUser";

export class PurchasePolicyImpl extends PurchasePolicy {

    public constructor(children?:Map<PurchasePolicy, Operators>) {
        super()
        this._children = children? children : new Map();
    }

    private _children: Map<PurchasePolicy, Operators>;// storeName -> items

    get children(): Map<PurchasePolicy, Operators> {
        return this._children;
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

    isSatisfied(bagItems: BagItem[], user?: RegisteredUser): boolean {

        if (this._children.size === 1) {
            const isSatisfied: boolean = this._children.keys().next().value.isSatisfied(bagItems, user);
            return isSatisfied;
        }
        let ans: boolean = false;
        let lastOp: Operators;
        const temp: PurchasePolicy[] = Array.from(this._children.keys());
        for (const [policy, nextOp] of this._children) {
            const isSatisfied: boolean = policy.isSatisfied(bagItems, user);
            if (temp.indexOf(policy) === temp.length - 1) {
                switch (lastOp) {
                    case Operators.OR: {
                        return isSatisfied;
                    }
                        break;
                    case Operators.AND: {
                        return isSatisfied;
                    }
                        break
                    case Operators.XOR: {
                        return ans !== isSatisfied;
                    }
                        break;
                }
            } else {
                switch (nextOp) {
                    case Operators.OR: {
                        if (isSatisfied)
                            return true;
                    }
                        break;
                    case Operators.AND: {
                        if(!isSatisfied)
                            return false;
                    }
                        break;
                    case Operators.XOR: {
                        ans = ans !== isSatisfied
                    }
                        break;
                }
                lastOp = nextOp;
            }

        }
        return this._children.size === 0 ? true : ans;
    }

    getPolicyTag()
        :
        string {
        return "impl";
    }

}