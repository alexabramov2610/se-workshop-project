import * as Res from "../../common/Response"
export class Product {
    private readonly _catalogNumber: number;
    private readonly _name: string;
    private _price: number;

    constructor(name: string, catalogNumber: number) {
        this._name = name;
        this._catalogNumber = catalogNumber;
    }

    set price(newPrice: number) {
        this._price = newPrice;
    }

    get price(): number {
        return this.price;
    }

    get name(): string {
        return this._name;
    }

    get catalogNumber(): number {
        return this._catalogNumber;
    }

    isEqual(other: Product): Boolean {
        return this._catalogNumber === other._catalogNumber;
    }

    viewInfo():Res.ProductInfoResponse{
        return{data:{result:true,info:{name:this._name,catalogNumber:this._catalogNumber,price:this._price}}}
    }



}