import {PurchasePolicy} from "./PurchasePolicy";
import {BagItem} from "se-workshop-20-interfaces/dist/src/CommonInterface";
import {Operators} from "se-workshop-20-interfaces/dist/src/Enums";
import {RegisteredUser} from "../../user/users/RegisteredUser";

export class PurchasePolicyImpl extends PurchasePolicy {
    public constructor() {
        super()
        this._children = new Map();
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
        let ans: boolean = false;
        for (const [policy, nextOp] of this._children) {
            const isSatisfied: boolean = policy.isSatisfied(bagItems, user);
            if (isSatisfied) {
                if (nextOp === Operators.OR) {
                    return true;
                }
                if (nextOp === Operators.XOR) {
                    // @ts-ignore
                    ans = ans !== true;
                }
                if (nextOp === Operators.AND) {
                    // @ts-ignore
                    ans = true;
                }
            } else {
                if (nextOp === Operators.AND) {
                    return false;
                }
                if (nextOp === Operators.XOR) {
                    ans = ans !== false;
                }

            }

        }
        return this._children.size === 0? true : ans;
    }

    public getPolicyTag(): string {
        return "impl";
    }

}