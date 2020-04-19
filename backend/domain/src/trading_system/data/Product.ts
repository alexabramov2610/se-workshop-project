import {ProductInfoResponse} from "../../api-ext/Response";
import {ProductCategory} from "../../api-ext/Enums";

export class Product {
    private readonly _catalogNumber: number;
    private _name: string;
    private _price: number;
    private _category: ProductCategory;

    constructor(name: string, catalogNumber: number, price: number, productCategory: ProductCategory) {
        this._category = productCategory;
        this._name = name;
        this._catalogNumber = catalogNumber;
        this._price = price;
    }

    viewProductInfo():ProductInfoResponse{
        return{  data:{result:true, info:{name:this._name,catalogNumber:this._catalogNumber,price:this._price,catagory:this._category}}
        }
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

    get name(): string {
        return this._name;
    }

    get category(): ProductCategory {
        return this._category;
    }

    get catalogNumber(): number {
        return this._catalogNumber;
    }

}