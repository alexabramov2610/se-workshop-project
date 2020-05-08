import {Discount} from "./Discount";
import {BagItem} from "se-workshop-20-interfaces/dist/src/CommonInterface";
import {Operators} from "se-workshop-20-interfaces/dist/src/Enums";

export class IfThenDiscount extends Discount {
    protected ifClause: Discount;
    protected thenClause: Discount;

    public constructor(startDate: Date, duration: number, ifClause: Discount, thenClause: Discount) {
        super(startDate, duration, 0, [])
        this.ifClause = ifClause;
        this.thenClause = thenClause;
    }

    calc(bag: BagItem[]): BagItem[] {
        return this.thenClause.calc(bag);
    }

    isRelevant(bag: BagItem[]): boolean {
        if (!this.isValid()) return false;
        return this.ifClause.isRelevant(bag)
    }

    // tslint:disable-next-line:no-empty
    add(discount: Discount, operator: Operators): void {
    }

    // tslint:disable-next-line:no-empty
    remove(discount: Discount): void {
    }

    isComposite(): boolean {
        return true;
    }
}