import {ProductCategory} from "../../api-ext/CommonInterface";
import {ProductInfoResponse} from "../../api-ext/Response";

export class Product {
    private readonly _catalogNumber: number;
    private readonly _name: string;
    private _price: number;
    private _category: ProductCategory;

    constructor(name: string, catalogNumber: number, price: number, productCategory: ProductCategory) {
        this._category = productCategory;
        this._name = name;
        this._catalogNumber = catalogNumber;
        this._price = price;
    }

    viewProductInfo():ProductInfoResponse{
        return{  data:{result:true, info:{name:this.name,catalogNumber:this.catalogNumber,price:this.price,catagory:this._category}}
        }
    }


    set price(newPrice: number) {
        this.price = newPrice;
    }

    get price(): number {
        return this._price;
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