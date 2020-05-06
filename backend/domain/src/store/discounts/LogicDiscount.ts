import {Discount} from "./Discount";
import {BagItem} from "se-workshop-20-interfaces/dist/src/CommonInterface";
import {Operators} from "se-workshop-20-interfaces/dist/src/Enums";

export class LogicDiscount extends Discount {
    protected operator: Operators;
    protected children: Discount[] = [];

    public constructor(startDate: Date, duration: number, operator: Operators, children: Discount[]) {
        super(startDate, duration, 0, [])
        this.operator = operator;
        this.children = children;
    }

    calc(bag: BagItem[]): BagItem[] {
        switch (this.operator) {
            case Operators.OR: {
                for (const discount of this.children) {
                    if (discount.isRelevant(bag))
                        return discount.calc(bag);
                }
            }
                break;
            case Operators.AND: {
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
            case Operators.XOR: {
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
                case Operators.OR: {
                    ans = false;
                    for (const discount of this.children) {
                        ans = ans || discount.isRelevant(bag)
                    }
                }
                    break;
                case Operators.AND: {
                    ans = true;
                    for (const discount of this.children) {
                        ans = ans && discount.isRelevant(bag)
                    }
                }
                    break;
                case Operators.XOR: {
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

    add(discount: Discount, operator: Operators): void {
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