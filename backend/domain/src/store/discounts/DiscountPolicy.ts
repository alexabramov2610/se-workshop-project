import {Discount} from "./Discount";
import {CondProductDiscount} from "./CondProductDiscount";
import {ShownDiscount} from "./ShownDiscount";
import {BagItem, IComplexDiscount, IDiscount} from "se-workshop-20-interfaces/dist/src/CommonInterface";

export class DiscountPolicy {

    private _discountPolicies: Discount[];

    constructor() {
        this._discountPolicies = [];
    }

    addSimpleProductsDiscountPolicy(catalogNumber: number, discount: IDiscount) {
        let newDiscount: Discount;
        if (discount.condition) {
            newDiscount = new CondProductDiscount(discount.startDate, discount.percentage, discount.duration, discount.products, discount.condition.minAmount)
        } else if (!discount.condition && !discount.coupon) {
            newDiscount = new ShownDiscount(discount.startDate, discount.percentage, discount.duration, discount.products)
        }
        this._discountPolicies.push(newDiscount);
        return newDiscount.id;
    }

    getBestPrice(bagItems: BagItem[], bagItem: BagItem): number {
        let result = bagItem.amount * bagItem.product.price;
        for (const d of this._discountPolicies) {
            if (d.isRelevant(bagItems)) {
                result = Math.min(result, d.calc(bagItem.amount * bagItem.product.price, bagItem.amount, bagItems))
            }
        }
        return result;
    }
/*
    getBestBagPrices(bagItems: BagItem[]): BagItem[]{
        let bagItemAfterDiscount: BagItem[] =Array.from(bagItems);
        for (const d of this._discountPolicies) {
            if (d.isRelevant(bagItems)) {
                bagItemAfterDiscount = d.calc(bagItems)
                result = Math.min(result, d.calc(bagItem.amount * bagItem.product.price, bagItem.amount, bagItems))
            }
        }
        return result;
    }

 */

    addComplexDiscountPolicy(catalogNumber: number, discount: IComplexDiscount) {
        return "";
    }
}