import {Discount} from "./Discount";
import {CondProductDiscount} from "./CondProductDiscount";
import {ShownDiscount} from "./ShownDiscount";
import {BagItem, IComplexDiscount, IDiscount, IifClause} from "se-workshop-20-interfaces/dist/src/CommonInterface";
import {DiscountOperators} from "se-workshop-20-interfaces/dist/src/Enums";
import {LogicDiscount} from "./LogicDiscount";
import {IfThenDiscount} from "./IfThenDiscount";
import {CondStoreDiscount} from "./CondStoreDiscount";
import {IfLeaf} from "./IfLeaf";

export class DiscountPolicy {

    private _discountPolicies: Discount[];

    constructor() {
        this._discountPolicies = [];
    }

    addSimpleProductsDiscountPolicy(catalogNumber: number, discount: IDiscount): string {
        let newDiscount: Discount;
        if (discount.condition) {
            newDiscount = new CondProductDiscount(discount.startDate, discount.duration, discount.percentage, discount.products, discount.condition.minAmount)
        } else if (!discount.condition && !discount.coupon) {
            newDiscount = new ShownDiscount(discount.startDate, discount.duration, discount.percentage, discount.products)
        }
        this._discountPolicies.push(newDiscount);
        return newDiscount.id;
    }

    addDiscountPolicy(discount: IDiscount): string {
        const newDiscount: Discount = this.parseIDiscount(discount);
        this._discountPolicies.push(newDiscount);
        return newDiscount.id;

    }

    getBestBagPrices(bagItems: BagItem[]): BagItem[] {
        let minBag: BagItem[] = bagItems;
        let minBagPrice: number = this.getBagPrice(bagItems);
        for (const d of this._discountPolicies) {
            if (d.isRelevant(bagItems)) {
                const bagItemAfterDiscount: BagItem[] = d.calc(bagItems);
                const priceAfterDiscount = this.getBagPrice(bagItemAfterDiscount);
                if (priceAfterDiscount < minBagPrice) {
                    minBagPrice = priceAfterDiscount;
                    minBag = bagItemAfterDiscount
                }
            }
        }
        return minBag;
    }

    getBagPrice(bagItems: BagItem[]): number {
        let finalPrice: number = 0;
        for (const bagItem of bagItems) {
            finalPrice += bagItem.finalPrice;
        }
        return finalPrice;
    }

    private parseIDiscount(iDiscount: IDiscount): Discount {
        if (iDiscount.percentage) {
            if (iDiscount.condition) {
                if (iDiscount.condition.minAmount)
                    return new CondProductDiscount(iDiscount.startDate, iDiscount.duration, iDiscount.percentage, iDiscount.products, iDiscount.condition.minAmount)
                else if (iDiscount.condition.minPay)
                    return new CondStoreDiscount(iDiscount.startDate, iDiscount.duration, iDiscount.percentage, iDiscount.products, iDiscount.condition.minPay)
            }
            return new ShownDiscount(iDiscount.startDate, iDiscount.duration, iDiscount.percentage, iDiscount.products)
        }
        if (iDiscount.complex) {
            if (iDiscount.complex.operator === DiscountOperators.IFTHEN) {
                const ifClaue: Discount = this.parseIDiscount(iDiscount.complex.ifClause)
                const thenClaue: Discount = this.parseIDiscount(iDiscount.complex.thenClause)
                return new IfThenDiscount(iDiscount.startDate, iDiscount.duration, ifClaue, thenClaue);

            } else {
                const children: Discount[] = iDiscount.complex.children.map((idiscount) => this.parseIDiscount(idiscount))
                return new LogicDiscount(iDiscount.startDate, iDiscount.duration, iDiscount.complex.operator, children)
            }
        }
        if (iDiscount.ifCondClause) {
            return new IfLeaf(iDiscount.startDate, iDiscount.duration, iDiscount.ifCondClause.productInBag, iDiscount.ifCondClause.productInDiscount);
        }

    }
}