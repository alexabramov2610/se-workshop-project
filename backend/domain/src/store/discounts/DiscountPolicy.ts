import {Discount} from "./Discount";
import {BagItem} from "se-workshop-20-interfaces/dist/src/CommonInterface";
import {Operators} from "se-workshop-20-interfaces/dist/src/Enums";
import {loggerW} from "../../api-int/Logger";
const logger = loggerW(__filename)

export class DiscountPolicy extends Discount {
    private _children: Map<Discount, Operators>;

    public constructor() {
        super(new Date(), 0, 0, [])
        this._children = new Map();
    }

    calc(bag: BagItem[]): BagItem[] {
        let currentBag: BagItem[] = Array.from(bag);
        let skip: boolean = false;
        for (const [discount, nextOp] of this._children) {
            logger.info(`check if discount is relevant ${JSON.stringify(discount)}`)
            if (discount.isRelevant(bag) && !skip) {
                logger.info(`calc discount ${JSON.stringify(discount)} operator ${nextOp}`)
                currentBag = discount.calc(currentBag);
                if (nextOp === Operators.OR)
                    return currentBag;
                if (skip) skip = false;
                if (nextOp === Operators.XOR) skip = true;
            }
        }
        return currentBag;
    }

    isRelevant(bag: BagItem[]): boolean {
        return true;
    }

    add(discount: Discount, operator: Operators): void {
        this._children.set(discount, operator)
    }

    remove(discount: Discount): void {
        this._children.delete(discount)
    }

    isComposite(): boolean {
        return true;
    }


    get children(): Map<Discount, Operators> {
        return this._children;
    }
}