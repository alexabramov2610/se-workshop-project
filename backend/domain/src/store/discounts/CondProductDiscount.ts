import {Discount} from "./Discount";
import {BagItem} from "se-workshop-20-interfaces/dist/src/CommonInterface";

export class CondProductDiscount extends Discount {
    private minAmount: number; // buy two bisli and get the 3 in 50% discount - minAmount = 2

    public constructor(startDate: Date, percentage: number, duration: number, productsInDiscount: number[], minAmount: number,) {
        super(startDate, percentage, duration, productsInDiscount);
        this.minAmount = minAmount;
    }

    /*
    number of discount to get for the given amount - min amount is 3
    given 5 bisli get discount for 5/4 = 1
    */
    calc(price: number, amount: number, bag: BagItem[]): number {
        const diffAmount = Math.floor(amount / (this.minAmount + 1));
        return price - ((price * this.percentage * diffAmount) / (100 * amount));
    }

    isRelevant(bagItems: BagItem[]): boolean {
        let ans: boolean = true;
        const relevantBagItems: BagItem[] = bagItems.filter((bag) => this.productsInDiscount.indexOf(bag.product.catalogNumber) !== -1)
        for (const bag of relevantBagItems) {
            ans = ans && this.minAmount < bag.amount;
        }
        return this.isValid() && ans;
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