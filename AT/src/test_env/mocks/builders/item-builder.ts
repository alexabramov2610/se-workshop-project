import {Item} from "../../../../index";

export class ItemBuilder {
    private _item: Item;

    constructor() {
        this._item = {
            id: 123,
            catalogNumber: 456
        };
    }

    withId(id: number): ItemBuilder {
        this._item.id = id;
        return this;
    }

    withCatalogNumber(num: number): ItemBuilder {
        this._item.catalogNumber = num;
        return this;
    }

    getItem(): Item {
        return this._item;
    }
}
