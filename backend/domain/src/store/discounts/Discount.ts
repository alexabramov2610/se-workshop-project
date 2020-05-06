import {v4 as uuid} from 'uuid';
import {BagItem} from "se-workshop-20-interfaces/dist/src/CommonInterface";

export abstract class Discount {

    protected _productsInDiscount: number[];

    protected constructor(startDate: Date, duration: number, percentage: number, productsInDiscount: number[]) {
        this._id = uuid();
        this._percentage = percentage;
        this._duration = duration;
        this._startDate = startDate;
        this._productsInDiscount = productsInDiscount;
    }

    private _id: string;

    get id(): string {
        return this._id;
    }

    private _startDate: Date;

    get startDate(): Date {
        return this._startDate;
    }

    private _percentage: number;

    get percentage(): number {
        return this._percentage;
    }

    set percentage(value: number) {
        this._percentage = value;
    }

    private _duration: number;

    get duration(): number {
        return this._duration;
    }

    set duration(value: number) {
        this._duration = value;
    }

    abstract calc(bag: BagItem[]): BagItem[];

    isRelevant(bag: BagItem[]): boolean {
        return this.isValid() && bag.some((bagItem)=> this.isProductInDiscount(bagItem.product.catalogNumber));
    }

    abstract add(discount: Discount): void;

    abstract remove(discount: Discount): void;

    public abstract isComposite(): boolean;

    isValid(): boolean {
        const today = new Date();
        const endDate = this.addMinutes(this.startDate, this.duration * 24 * 60);
        return today < endDate;
    }

    protected isProductInDiscount(catalogNumber: number): boolean {
        return  this._productsInDiscount.indexOf(catalogNumber) !== -1
    }

    protected addMinutes(date, minutes): Date {
        return new Date(date.getTime() + minutes * 60000);
    }
}