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
            if (this.isProductInDiscount(bagItem) || this.isStoreDiscount()) {
                logger.info(`isProductInDiscount ${this.isProductInDiscount(bagItem)}  isStoreDiscount ${this.isStoreDiscount()}`)

                const minAmount = this.findMinAmount(bagItem.product.catalogNumber);
                logger.info(`product ${bagItem.product.catalogNumber}  cat ${bagItem.product.category} in discount! calculating price... min amount is ${minAmount}`)
                let diffAmount = 1;
                if (minAmount !== -1) {
                    diffAmount = Math.floor(bagItem.amount / (minAmount + 1)) / bagItem.amount;
                }
                const newPrice: number = bagItem.finalPrice - ((bagItem.finalPrice * this.percentage * diffAmount) / (100));
                logger.info(`new final price for product ${bagItem.product.catalogNumber} amount ${bagItem.amount} is ${newPrice}`)
                res.push({
                    product: bagItem.product,
                    amount: bagItem.amount,
                    finalPrice: newPrice
                })
            } else {
                logger.info(`product ${bagItem.product.catalogNumber} cat ${bagItem.product.category} NOT in discount!`)
                res.push({product: bagItem.product, amount: bagItem.amount, finalPrice: bagItem.finalPrice})
            }

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
        const isValid : boolean = this.isValid();
        const bagOnDiscount: boolean = bagItem.some((bagItem) => this.isProductInDiscount(bagItem));
        const isStoreDiscount : boolean = this.productsInDiscount.length === 0 && (this.isStoreDiscount());
        logger.info(`isValid? ${isValid} , bagOnDiscount ${bagOnDiscount} isStoreDiscount ${isStoreDiscount}`)
        return isValid && (bagOnDiscount || isStoreDiscount);
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

    private isStoreDiscount(): boolean {
        const conditions: Condition[] = Array.from(this._conditions.keys());
        for (const c of conditions) {
            if (this.productsInDiscount.length === 0 && typeof c.getMinPay() !== undefined &&  c.getMinPay() >= 0)
                return true;
        }
        return false;
    }
    public getConditions(): Map<Condition, Operators>{
        return this._conditions;
    }
}