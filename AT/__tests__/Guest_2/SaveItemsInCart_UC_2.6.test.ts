import {Bridge, Driver, Filters, CATEGORY, RATE, Item, PriceRange, Credentials, SearchData, Store} from "../../src/";


describe("Guest Search, UC: 2.5", () => {
    let _serviceBridge: Bridge;
    let _credentials: Credentials;
    let _testStore1: Store;
    let _testStore2: Store;
    let _testItem1: Item;
    let _testItem2: Item;
    let _testItem3: Item;
    let _testSearchData: SearchData;
    let _testFilters: Filters;
    let _priceRange: PriceRange;

    beforeEach(() => {
        _serviceBridge = Driver.makeBridge();
        _credentials = {userName: "test-name", password: "test-PASS-123"};
        _testItem1 = {
            id: "test-id1",
            name: "test-item",
            price: 999,
            description: "lovely-test-store",
            category: CATEGORY.ELECTRONICS,
        };
        _testItem2 = {
            id: "test-id2",
            name: "test-item",
            price: 999,
            description: "lovely-test-store",
            category: CATEGORY.ELECTRONICS,
        };
        _testItem3 = {
            id: "test-id3",
            name: "test-item3",
            price: 999,
            description: "lovely-test-store",
            category: CATEGORY.CLOTHING,
        };
        _testStore1 = {
            id: "test-store-id1",
            name: "test-store1",
            description: "lovely-test-store"
        };
        _testStore2 = {
            id: "test-store-id2",
            name: "test-store2",
            description: "lovely-test-store"
        };
        _priceRange = {low: 0, high: Number.MAX_SAFE_INTEGER};
        _testFilters = {
            category: CATEGORY.ELECTRONICS,
            priceRange: _priceRange,
            storeRate: RATE.THREES_STARS,
            itemRate: RATE.ONE_STAR
        };
        _testSearchData = {
            input: "test-input",
            filters: _testFilters,
        }

        _serviceBridge.addStore(_testStore1);
        _serviceBridge.addStore(_testStore2);

        _serviceBridge.addItemToStore(_testStore1, _testItem1);
        _serviceBridge.addItemToStore(_testStore1, _testItem3);
        _serviceBridge.addItemToStore(_testStore2, _testItem2);

        _serviceBridge.register(_credentials);
    });

    test("Valid search input, not filters", () => {
        _testSearchData.filters = undefined;
        _testSearchData.input = _testItem1.name;

        const {data, error} = _serviceBridge.search(_testSearchData);
        expect(error).toBeUndefined();
        expect(data).toBeDefined();

        const {items} = data;
        expect(items.filter(item => item.name === _testItem1.name).length === 2).toBeTruthy();
    });
});