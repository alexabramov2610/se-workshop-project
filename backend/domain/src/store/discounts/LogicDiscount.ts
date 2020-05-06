import {Discount} from "./Discount";
import {BagItem} from "se-workshop-20-interfaces/dist/src/CommonInterface";
import {DiscountOperators} from "se-workshop-20-interfaces/dist/src/Enums";

export class LogicDiscount extends Discount {
    protected operator: DiscountOperators;
    protected children: Discount[] = [];

    public constructor(startDate: Date, duration: number, operator: DiscountOperators, children: Discount[]) {
        super(startDate, duration, 0, [])
        this.operator = operator;
        this.children = children;
    }

    calc(bag: BagItem[]): BagItem[] {
        switch (this.operator) {
            case DiscountOperators.OR: {
                for (const discount of this.children) {
                    if (discount.isRelevant(bag))
                        return discount.calc(bag);
                }
            }
                break;
            case DiscountOperators.AND: {
                let bagAND: BagItem[] = bag;
                for (const discount of this.children) {
                    if (discount.isRelevant(bag)) {
                        bagAND = discount.calc(bagAND);
                    }
                    // return this.children.reduce((prev, curr) => curr.calc(prev), bag);
                }
                return bagAND;
            }
                break;
            case DiscountOperators.XOR: {
                let trueCounter: number = 0;
                let bagXOR: BagItem[] = bag;
                for (const discount of this.children) {
                    if (discount.isRelevant(bag)) {
                        trueCounter++;
                        if (trueCounter % 2 !== 0) {
                            bagXOR = discount.calc(bagXOR);
                        }
                    }
                }
                return bagXOR;
            }
                break;
        }
    }

    /*
    calc(price:number, amount:number){
        return this.children.reduce((prev, curr) => curr.calc(prev, amount), price);
    }

     */

    /*
        isRelevant(bag: BagItem[]): boolean {
            if (!this.isValid()) return false;
            let ans: boolean;
            switch (this.operator) {
                case DiscountOperators.OR: {
                    ans = false;
                    for (const discount of this.children) {
                        ans = ans || discount.isRelevant(bag)
                    }
                }
                    break;
                case DiscountOperators.AND: {
                    ans = true;
                    for (const discount of this.children) {
                        ans = ans && discount.isRelevant(bag)
                    }
                }
                    break;
                case DiscountOperators.XOR: {
                  //  let trueCounter: number = 0;
                    for (const discount of this.children) {
                        if (discount.isRelevant(bag))
                            return true;
                    }
                    // ans = (trueCounter % 2 !== 0) // ODD number of TRUE = TRUE (XOR RULE)
                }
                    break;
            }
            return ans;
        }
    */
    isRelevant(bag: BagItem[]): boolean {
        if (!this.isValid()) return false;
        for (const discount of this.children) {
            if (discount.isRelevant(bag))
                return true;
        }
        return false;
    }

    add(discount: Discount): void {
        this.children.push(discount);
    }

    remove(discount: Discount): void {
        const componentIndex = this.children.indexOf(discount);
        this.children.splice(componentIndex, 1);
    }

    isComposite(): boolean {
        return true;
    }
}