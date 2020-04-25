import {Discount} from "./Discount";

export  class ShownDiscount extends Discount {

    protected constructor(percentage: number, duration: number) {
        super(percentage, duration)
    }

}