import {Discount} from "./Discount";
import {BagItem, ProductCategory} from "se-workshop-20-interfaces/dist/src/CommonInterface";
import {Operators} from "se-workshop-20-interfaces/dist/src/Enums";
import {Condition} from "./conditions/Condition";
import {loggerW} from "../../api-int/Logger";

const logger = loggerW(__filename)

export class CondDiscount extends Discount {
    private _conditions: Map<Condition, Operators>;


    public constructor(startDate: Date, duration: number, percentage: number, productsInDiscount: number[], conditions: Map<Condition, Operators>, category?: ProductCategory) {
        super(startDate, duration, percentage, productsInDiscount, category);
        this._conditions = conditions;
    }

    calc(bag: BagItem[]): BagItem[] {
        if (!this.isSatisfied(bag)) return bag;

        const res: BagItem[] = [];
        for (const bagItem of bag) {
            if (this.isProductInDiscount(bagItem) || this.productsInDiscount.length === 0) {
                const minAmount = this.findMinAmount(bagItem.product.catalogNumber);
                logger.info(`product in discount! calculating price... min amount is ${minAmount}`)
                let diffAmount = 1;
                if (minAmount !== -1){
                    diffAmount = Math.floor(bagItem.amount / (minAmount + 1)) / bagItem.amount;
                }
                logger.info(`new final price ${bagItem.finalPrice - ((bagItem.finalPrice * this.percentage * diffAmount) / (100))}`)

                res.push({
                    product: bagItem.product,
                    amount: bagItem.amount,
                    finalPrice: bagItem.finalPrice - ((bagItem.finalPrice * this.percentage * diffAmount) / (100))
                })
            } else
                res.push({product: bagItem.product, amount: bagItem.amount, finalPrice: bagItem.finalPrice})
        }
        return res;
    }

    isSatisfied(bag: BagItem[]): boolean {
        for (const [condition, nextOp] of this._conditions) {
            logger.info(`check condition ${JSON.stringify(condition)} operator ${nextOp}`)
            if (condition.isSatisfied(bag)) {
                logger.info(`Satisfied!`)
                if (nextOp === Operators.OR)
                    return true;
            } else {
                logger.info(`Not Satisfied!`)
                if (nextOp === Operators.AND) {
                    return false;
                }
            }
        }
        return true;
    }

    isRelevant(bagItem: BagItem[]): boolean {
        return this.isValid() && (bagItem.some((bagItem) => this.isProductInDiscount(bagItem)) || this.productsInDiscount.length === 0);
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

    private findMinAmount(catalogNumber: number) {
        const conditions: Condition[] = Array.from(this._conditions.keys());
        for (const c of conditions) {
            if (c.getCatalogNumber() === catalogNumber) {
                logger.info(`c.getCatalogNumber() ${c.getCatalogNumber()} === catalog number ${catalogNumber}`)
                return c.getMinAmount();
            }
        }
        return -1;
    }

    get conditions(): Map<Condition, Operators> {
        return this._conditions;
    }
}