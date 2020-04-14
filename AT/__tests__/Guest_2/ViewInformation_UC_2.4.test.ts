import {Bridge,  Driver, Item, CATEGORY, Store} from "../../src/";

// const ITEM_NOT_FOUND = "Item not found";
// const STORE_NOT_FOUND = "Store not found";

describe("Guest - View Information, UC: 2.4", () => {
    let _serviceBridge: Bridge;
    let _testItem: Item;
    let _testStore: Store;

    beforeEach(() => {
        _serviceBridge = Driver.makeBridge();
        _testStore = {
            name: "some-mock-store",
            description: "selling cool items",
            id: "id.stores.boom",
        };
        _testItem = {
            id: "some-id",
            name: "some-name",
            category: CATEGORY.ELECTRONICS,
            description: "some-desc",
            price: 999,
        };
    });

    test("View valid item", () => {
        _testItem.id = "validItemID";
        _testItem.name = "itemTestName";
        _testItem.description = "itemTestDesc";
        _testItem.price = 33.5;

        _testStore.id = "validStoreID";
        _testStore.name = "storeTestName";
        _testStore.description = "storeTestDesc";

        _serviceBridge.addStore(_testStore);
        _serviceBridge.addItemToStore(_testStore, _testItem);

        const {data, error} = _serviceBridge.viewItem(_testItem);
        const {name, price, description} = data;
        expect(error).toBeUndefined();
        expect(name).toEqual(_testItem.name);
        expect(price).toEqual(_testItem.price);
        expect(description).toEqual(_testItem.description);
    });

    test("View invalid item", () => {
        _testItem.id = "invalidItemID";
        _testItem.name = "itemTestName";
        _testItem.description = "itemTestDesc";
        _testItem.price = 33.5;

        const {data, error} = _serviceBridge.viewItem(_testItem);
        expect(data).toBeUndefined();
        expect(error).toBeDefined();
    });

    test("View valid store", () => {
        _testStore.id = "validStoreID";
        _testStore.name = "storeTestName";
        _testStore.description = "storeTestDesc";

        _serviceBridge.addStore(_testStore);

        const {data, error} = _serviceBridge.viewStore(_testItem);
        const {name, description} = data;
        expect(error).toBeUndefined();
        expect(name).toEqual(_testStore.name);
        expect(description).toEqual(_testStore.description);
    });

    test("View invalid store", () => {
        _testStore.id = "invalidStoreID";
        _testStore.name = "storeTestName";
        _testStore.description = "storeTestDesc";

        const {data, error} = _serviceBridge.viewStore(_testStore);
        expect(data).toBeUndefined();
        expect(error).toBeDefined();
    });
});
