import {Discount} from "./Discount";
import {BagItem} from "se-workshop-20-interfaces/dist/src/CommonInterface";
import {DiscountOperators} from "se-workshop-20-interfaces/dist/src/Enums";

export class LogicDiscount extends Discount {
    protected operator: DiscountOperators;
    protected children: Discount[] = [];

    protected constructor(startDate: Date, percentage: number, duration: number, productsInDiscount: number[], operator: DiscountOperators) {
        super(startDate, percentage, duration, productsInDiscount)
        this.operator = operator;
    }

    calc(price: number, amount: number, bag: BagItem[]): number {
        switch (this.operator) {
            case DiscountOperators.OR: {
                for (const discount of this.children) {
                    if (discount.isRelevant(bag))
                        return discount.calc(price, amount, bag);
                }
            }
                break;
            case DiscountOperators.AND: {
                for (const discount of this.children) {
                    return this.children.reduce((prev, curr) => curr.calc(prev, amount, bag), price);
                }
            }
                break;
            case DiscountOperators.XOR: {
                let trueCounter: number = 0;
                let finalXORPrice:number = price*amount;
                for (const discount of this.children) {
                    if (discount.isRelevant(bag)){
                        trueCounter++;
                        if(trueCounter % 2 !== 0){
                            finalXORPrice = discount.calc(price, amount, bag);
                        }
                    }
                }
                return finalXORPrice;
            }
                break;
        }
    }

    /*
    calc(price:number, amount:number){
        return this.children.reduce((prev, curr) => curr.calc(prev, amount), price);
    }

     */

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
                let trueCounter: number = 0;
                for (const discount of this.children) {
                    if (discount.isRelevant(bag))
                        trueCounter++;
                }
                ans = (trueCounter % 2 !== 0) // ODD number of TRUE = TRUE (XOR RULE)
            }
                break;
        }
        return ans;
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