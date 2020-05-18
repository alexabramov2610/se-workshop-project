import {v4 as uuid} from 'uuid';
import {BagItem, ProductCategory} from "se-workshop-20-interfaces/dist/src/CommonInterface";
import {Operators} from "se-workshop-20-interfaces/dist/src/Enums";

export abstract class Discount {
    protected _category: ProductCategory;

    constructor(startDate: Date, duration: number, percentage: number, productsInDiscount: number[], category?: ProductCategory) {
        this._id = uuid();
        this._percentage = percentage;
        this._duration = duration;
        this._startDate = startDate;
        this._productsInDiscount = productsInDiscount;
        this._category = category
    }

    protected _productsInDiscount: number[];

    get productsInDiscount(): number[] {
        return this._productsInDiscount;
    }

    private _id: string;

    get id(): string {
        return this._id;
    }

    private _startDate: Date;

    get startDate(): Date {
        return this._startDate;
    }

    private _duration: number;

    get duration(): number {
        return this._duration;
    }

    set duration(value: number) {
        this._duration = value;
    }

    private _percentage: number;

    get percentage(): number {
        return this._percentage;
    }

    set percentage(value: number) {
        this._percentage = value;
    }

    get category(): ProductCategory{
        return this._category;
    }
    abstract calc(bag: BagItem[]): BagItem[];

    isRelevant(bagItem: BagItem[]): boolean {
        return this.isValid() && bagItem.some((bagItem) => this.isProductInDiscount(bagItem));
    }

    abstract add(discount: Discount, operator: Operators): void;

    abstract remove(discount: Discount): void;

    public abstract isComposite(): boolean;

    isValid(): boolean {
        const today = new Date();
        const endDate = this.addMinutes(this.startDate, this.duration * 24 * 60);
        return today < endDate;
    }

    protected isProductInDiscount(bagItem: BagItem): boolean {
        return this._productsInDiscount.indexOf(bagItem.product.catalogNumber) !== -1 || this._category === bagItem.product.category
    }

    protected addMinutes(date, minutes): Date {
        return new Date(date.getTime() + minutes * 60000);
    }



}