import {Discount} from "./Discount";
import {BagItem} from "se-workshop-20-interfaces/dist/src/CommonInterface";

export class CondStoreDiscount extends Discount {
    private minPay: number;

    public constructor(startDate: Date, percentage: number, duration: number, productsInDiscount: number[], minPay: number) {
        super(startDate, percentage, duration, productsInDiscount);
        this.minPay = minPay;
    }

    calc(price: number, amount: number, bag: BagItem[]): number {
        return price - ((price * this.percentage) / 100);
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