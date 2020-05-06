import {Discount} from "./Discount";
import {BagItem} from "se-workshop-20-interfaces/dist/src/CommonInterface";

export class CondProductDiscount extends Discount {
    private minAmount: number; // buy two bisli and get the 3 in 50% discount - minAmount = 2

    public constructor(startDate: Date, duration: number, percentage: number, productsInDiscount: number[], minAmount: number,) {
        super(startDate, duration, percentage, productsInDiscount);
        this.minAmount = minAmount;
    }

    /*
    number of discount to get for the given amount - min amount is 3
    given 5 bisli get discount for 5/4 = 1
    */
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

    // tslint:disable-next-line:no-empty
    add(discount: Discount): void {
    }

    // tslint:disable-next-line:no-empty
    remove(discount: Discount): void {
    }

    isComposite(): boolean {
        return false;
    }

}