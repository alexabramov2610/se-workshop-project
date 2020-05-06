export class Item {

    private readonly _id: number;
    private readonly _catalogNumber: number;

    constructor(id: number, catalogNumber: number) {
        this._catalogNumber = catalogNumber;
        this._id = id;
    }

    get id(): number {
        return this._id;
    }

    get catalogNumber(): number {
        return this._catalogNumber;
    }



}