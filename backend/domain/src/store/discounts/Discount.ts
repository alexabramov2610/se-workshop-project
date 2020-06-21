import {BagItem, ProductCategory} from "se-workshop-20-interfaces/dist/src/CommonInterface";
import {Operators} from "se-workshop-20-interfaces/dist/src/Enums";
import {loggerW} from "../../api-int/Logger";
import {Condition} from "./conditions/Condition";
const logger = loggerW(__filename)
export abstract class Discount {
    protected _category: ProductCategory;

    constructor(startDate: Date, duration: number, percentage: number, productsInDiscount: number[], category?: ProductCategory) {
        this._percentage = +percentage;
        this._duration = +duration;
        this._startDate = new Date(startDate);
        this._productsInDiscount = productsInDiscount.map((p)=> +p);
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
        const isValid : boolean = this.isValid();
        const bagOnDiscount: boolean = bagItem.some((bagItem) => this.isProductInDiscount(bagItem));
        logger.info(`isValid? ${isValid} , bagOnDiscount ${bagOnDiscount}`)
        return isValid && bagOnDiscount;
    }

    abstract add(discount: Discount, operator: Operators): void;

    abstract remove(discount: Discount): void;

    public abstract isComposite(): boolean;

    isValid(): boolean {
        const today = new Date();
        const endDate = this.addMinutes(this.startDate, this.duration * 24 * 60);
        return today < endDate;
    }
    protected addMinutes(date, minutes): Date {
        return new Date(date.getTime() + minutes * 60000);
    }
    protected isProductInDiscount(bagItem: BagItem): boolean {
        return this._productsInDiscount.indexOf(bagItem.product.catalogNumber) !== -1 || this._category === bagItem.product.category
    }



    public getConditions(): Map<Condition, Operators>{
        return undefined
    }



}