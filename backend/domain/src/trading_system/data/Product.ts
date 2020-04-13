export class Product {
    private readonly _catalogNumber: number;
    private readonly _name: string;
    private _price: number;

    constructor(name: string, catalogNumber: number, price: number)  {
        this._name = name;
        this._catalogNumber = catalogNumber;
        this._price = price;
    }

    set price(price: number) {
        this.price = price;
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


}