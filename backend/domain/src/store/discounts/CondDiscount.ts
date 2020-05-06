import {Discount} from "./Discount";
import {BagItem} from "se-workshop-20-interfaces/dist/src/CommonInterface";
import {Operators} from "se-workshop-20-interfaces/dist/src/Enums";
import {Condition} from "./conditions/Condition";

export class CondDiscount extends Discount {
    private _conditions: Map<Condition, Operators>;

    public constructor(startDate: Date, duration: number, percentage: number, productsInDiscount: number[], conditions: Map<Condition, Operators>) {
        super(startDate, duration, percentage, productsInDiscount);
        this._conditions = conditions;
    }

    /*
    number of discount to get for the given amount - min amount is 3
    given 5 bisli get discount for 5/4 = 1

    calc(bag: BagItem[]): BagItem[] {
        const res: BagItem[] = [];
        for (const bagItem of bag) {
            if (this.isProductInDiscount(bagItem.product.catalogNumber) && this.minAmount < bagItem.amount) {
                const diffAmount = Math.floor(bagItem.amount / (this.minAmount + 1));
                res.push({
                    product: bagItem.product,
                    amount: bagItem.amount,
                    finalPrice: bagItem.finalPrice - ((bagItem.finalPrice * this.percentage * diffAmount) / (100 * bagItem.amount))
                })
            } else
                res.push({product: bagItem.product, amount: bagItem.amount, finalPrice: bagItem.finalPrice})
        }
        return res;
    }
    */
    calc(bag: BagItem[]): BagItem[] {
        const res: BagItem[] = [];
        for (const bagItem of bag) {
            if (this.isProductInDiscount(bagItem.product.catalogNumber) && this.isSatisfied(bag)) {
              //  const diffAmount = Math.floor(bagItem.amount / (this.minAmount + 1));
                res.push({
                    product: bagItem.product,
                    amount: bagItem.amount,
                    finalPrice: bagItem.finalPrice - ((bagItem.finalPrice * this.percentage) / (100 * bagItem.amount))
                })
            } else
                res.push({product: bagItem.product, amount: bagItem.amount, finalPrice: bagItem.finalPrice})
        }
        return res;
    }

    isSatisfied(bag: BagItem[]): boolean {
        for (const [condition, nextOp] of this._conditions) {
            if (condition.isSatisfied(bag)) {
                if (nextOp === Operators.OR)
                    return true;
            } else {
                if (nextOp === Operators.AND) {
                    return false;
                }
            }
        }
        return true;
    }

    // tslint:disable-next-line:no-empty
    add(discount: Discount, operator: Operators): void {
    }

    // tslint:disable-next-line:no-empty
    remove(discount: Discount): void {
    }

    isComposite(): boolean {
        return false;
    }

}