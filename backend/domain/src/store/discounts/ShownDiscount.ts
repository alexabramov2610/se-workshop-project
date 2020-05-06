import {Discount} from "./Discount";
import {BagItem} from "se-workshop-20-interfaces/dist/src/CommonInterface";
import {Operators} from "se-workshop-20-interfaces/dist/src/Enums";

export class ShownDiscount extends Discount {

    public constructor(startDate: Date, duration: number, percentage: number, productsInDiscount: number[]) {
        super(startDate, duration, percentage, productsInDiscount)
    }

    calc(bag: BagItem[]): BagItem[] {
        const res: BagItem[] = [];
        for (const bagItem of bag) {
            if (this.isProductInDiscount(bagItem.product.catalogNumber))
                res.push({
                    product: bagItem.product,
                    amount: bagItem.amount,
                    finalPrice: bagItem.finalPrice - ((bagItem.finalPrice * this.percentage) / 100)
                })
            else
                res.push({product: bagItem.product, amount: bagItem.amount, finalPrice: bagItem.finalPrice})

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