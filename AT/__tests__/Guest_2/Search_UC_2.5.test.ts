import {Bridge, Driver, Filters, CATEGORY, RATE, Item, PriceRange, Credentials, SearchData, Store} from "../../src/";

const LOW = 25;
const HIGH = 100;

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
        _serviceBridge.register(_credentials);
        _serviceBridge.login(_credentials);

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
            storeRate: RATE.THREE_STARS,
            itemRate: RATE.ONE_STAR
        };
        _testSearchData = {
            input: "test-input",
            filters: _testFilters,
        }

        _serviceBridge.createStore(_testStore1);
        _serviceBridge.createStore(_testStore2);

        _serviceBridge.addItemToStore(_testStore1, _testItem1);
        _serviceBridge.addItemToStore(_testStore1, _testItem3);
        _serviceBridge.addItemToStore(_testStore2, _testItem2);

        _serviceBridge.logout();
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

    test("Valid search input, input is category, no filters", () => {
        _testItem1.category = CATEGORY.HOME_AND_OFFICE;

        _testSearchData.filters = undefined;
        _testSearchData.input = "Electronics";

        const {data, error} = _serviceBridge.search(_testSearchData);
        expect(error).toBeUndefined();
        expect(data).toBeDefined();

        const {items} = data;
        expect(items.length === 2).toBeTruthy();

        const allSameCategory = items.reduce((acc, curr) => acc && curr.category === CATEGORY.ELECTRONICS, true);
        expect(allSameCategory).toBeTruthy();
    });

    test("Invalid search input, not filters", () => {
        _testSearchData.filters = undefined;
        _testSearchData.input = "";

        const {data, error} = _serviceBridge.search(_testSearchData);
        expect(data).toBeUndefined();
        expect(error).toBeDefined();
    });

    test("Valid search input, one filter", () => {
        _testSearchData.filters = {
            priceRange: {low: LOW, high: HIGH}
        };
        _testSearchData.input = "";

        const {data, error} = _serviceBridge.search(_testSearchData);
        expect(error).toBeUndefined();
        expect(data).toBeDefined();

        const {items} = data;
        const areBetweenPriceRange = items.reduce((acc, curr) => acc && curr.price <= HIGH && curr.price >= LOW, true);
        expect(areBetweenPriceRange).toBeTruthy();
    });

    test("Valid search input, all filter", () => {
        _testSearchData.filters = {
            category: CATEGORY.ELECTRONICS,
            priceRange: {low: LOW, high: HIGH},
            itemRate: RATE.ONE_STAR
        };
        _testSearchData.input = _testItem1.name;

        _credentials.userName = "new test user";
        _serviceBridge.register(_credentials);
        _serviceBridge.login(_credentials);

        _serviceBridge.rate(_testItem1, RATE.FIVE_STARS);
        _serviceBridge.rate(_testItem2, RATE.ONE_STAR);
        _serviceBridge.rate(_testItem3, RATE.TWO_STARS);

        _serviceBridge.logout();

        const {data, error} = _serviceBridge.search(_testSearchData);
        expect(error).toBeUndefined();
        expect(data).toBeDefined();

        const {items} = data;
        const itemsReducer = (acc, curr) => {
            const betweenPriceRange = curr.price <= HIGH && curr.price >= LOW;
            const correctCategory = curr.category === CATEGORY.ELECTRONICS;
            const betweenRate = curr.rate >= RATE.ONE_STAR && curr.rate <= RATE.FIVE_STARS;
            return acc && betweenRate && betweenPriceRange && correctCategory;
        };
        const areFiltered = items.reduce(itemsReducer, true);
        expect(areFiltered).toBeTruthy();
        expect(items.length).toBe(2);
    });

});
