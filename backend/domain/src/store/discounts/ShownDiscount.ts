import {Discount} from "./Discount";
import {BagItem} from "se-workshop-20-interfaces/dist/src/CommonInterface";
import {Operators, ProductCategory} from "se-workshop-20-interfaces/dist/src/Enums";
import {loggerW} from "../../api-int/Logger";

const logger = loggerW(__filename)
export class ShownDiscount extends Discount {

    public constructor(startDate: Date, duration: number, percentage: number, productsInDiscount: number[], category?: ProductCategory) {
        super(startDate, duration, percentage, productsInDiscount, category)
    }

    calc(bag: BagItem[]): BagItem[] {
        const res: BagItem[] = [];
        for (const bagItem of bag) {
            if (this.isProductInDiscount(bagItem)) {
                const finalPrice: number = bagItem.finalPrice - ((bagItem.finalPrice * this.percentage) / 100);
                logger.info(`product ${bagItem.product.catalogNumber} cat ${bagItem.product.category} in discount! calculating.. new price ${finalPrice}`)
                res.push({
                    product: bagItem.product,
                    amount: bagItem.amount,
                    finalPrice
                })
            } else {
                logger.info(`product ${bagItem.product.catalogNumber} cat ${bagItem.product.category} NOT in discount!`)
                res.push({product: bagItem.product, amount: bagItem.amount, finalPrice: bagItem.finalPrice})
            }

        }
        return res;
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