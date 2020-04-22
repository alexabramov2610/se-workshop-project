import {ProductCategory, Rating} from "../../api-ext/Enums";

export class Product {
    private readonly _catalogNumber: number;
    private _name: string;
    private _price: number;
    private _category: ProductCategory;
    private _rating: Rating;

    constructor(name: string, catalogNumber: number, price: number, productCategory: ProductCategory) {
        this._category = productCategory;
        this._name = name;
        this._catalogNumber = catalogNumber;
        this._price = price;
        this._rating = Rating.MEDIUM;
    }

    set price(price: number) {
        this._price = price;
    }

    get price(): number {
        return this._price;
    }

    set name(value: string) {
        this._name = value;
    }

    set rating(value: Rating) {
        this._rating = value;
    }

    get name(): string {
        return this._name;
    }

    get category(): ProductCategory {
        return this._category;
    }

    get catalogNumber(): number {
        return this._catalogNumber;
    }

    get rating(): Rating {
        return this._rating;
    }
}