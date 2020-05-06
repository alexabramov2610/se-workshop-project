import {Discount} from "./Discount";
import {BagItem} from "se-workshop-20-interfaces/dist/src/CommonInterface";

export class CondStoreDiscount extends Discount {
    private minPay: number;

    public constructor(startDate: Date, duration: number, percentage: number, productsInDiscount: number[], minPay: number) {
        super(startDate, duration, percentage, productsInDiscount);
        this.minPay = minPay;
    }

    calc(bag: BagItem[]): BagItem[] {
        const res: BagItem[] = [];
        for (const bagItem of bag) {
            res.push({
                product: bagItem.product,
                amount: bagItem.amount,
                finalPrice: bagItem.finalPrice - ((bagItem.finalPrice * this.percentage) / 100)
            })
        }
        return res;
    }

    // tslint:disable-next-line:no-empty
    add(discount: Discount): void {
    }

    isRelevant(bag: BagItem[]): boolean {
        return this.isValid() && this.minPay <= this.getBagTotalPrice(bag);
    }

    // tslint:disable-next-line:no-empty
    remove(discount: Discount): void {
    }

    isComposite(): boolean {
        return false;
    }

    private getBagTotalPrice(bag: BagItem[]): number {
        return bag.reduce((prev, curr) => curr.finalPrice ? prev + curr.finalPrice : prev + curr.product.price, 0);
    }

}