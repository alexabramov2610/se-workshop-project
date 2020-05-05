import {Discount} from "./Discount";
import {BagItem} from "se-workshop-20-interfaces/dist/src/CommonInterface";

export class IfThenDiscount extends Discount {
    protected ifClause: Discount;
    protected thenClause: Discount;

    protected constructor(startDate: Date, percentage: number, duration: number, productsInDiscount: number[], ifClause: Discount, thenClause: Discount) {
        super(startDate, percentage, duration, productsInDiscount)
        this.ifClause = ifClause;
        this.thenClause = thenClause;
    }

    calc(price: number, amount: number, bag: BagItem[]): number {
        return this.thenClause.calc(price, amount, bag);
    }

    isRelevant(bag: BagItem[]): boolean {
        if (!this.isValid()) return false;
        return this.ifClause.isRelevant(bag)
    }

    // tslint:disable-next-line:no-empty
    add(discount: Discount): void {
    }

    // tslint:disable-next-line:no-empty
    remove(discount: Discount): void {
    }

    isComposite(): boolean {
        return true;
    }
}