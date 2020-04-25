import {Discount} from "./Discount";

export  class ShownDiscount extends Discount {

    public constructor(startDate: Date, percentage: number, duration: number) {
        super(startDate,percentage, duration)
    }

}