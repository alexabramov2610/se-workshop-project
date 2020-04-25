import {
    Bridge,
    Driver,
    Credentials,
    Store,
    Product
} from "../../";
import {ProductBuilder} from "../mocks/builders/product-builder";
import {ItemBuilder} from "../mocks/builders/item-builder";
import {
    PriceRange,
    ProductCategory,
    SearchFilters,
    SearchQuery
} from "../../../backend/domain/dist/src/api-ext/CommonInterface";
import {Req} from "service_layer/dist/src/service_facade/ServiceFacade";
import {Rating} from "../../../backend/domain/dist/src/api-ext/Enums";

const LOW = 25;
const HIGH = 100;

describe("Guest Search, UC: 2.5", () => {
    let _driver = new Driver();
    let _serviceBridge: Bridge;
    let _testStore1: Store;
    let _testStore2: Store;
    let _testProduct1: Product;
    let _testProduct2: Product;
    let _testProduct3: Product;
    // let _testItem1: Item;
    // let _testItem2: Item;
    // let _testItem3: Item;
    let _testSearchData: Req.SearchRequest;
    let _testSearchQuery: SearchQuery;
    let _testFilters: SearchFilters;
    let _priceRange: PriceRange;
    let _credentials: Credentials;

    beforeEach(() => {
        _serviceBridge = _driver
            .resetState()
            .startSession()
            .initWithDefaults()
            .registerWithDefaults()
            .loginWithDefaults()
            .getBridge();

        _credentials = {userName: "", password: "",};
        _testProduct1 = new ProductBuilder().withName("testProduct1").withCatalogNumber(123).getProduct();
        _testProduct2 = new ProductBuilder().withName("testProduct2").withCatalogNumber(456).getProduct();
        _testProduct3 = new ProductBuilder().withCategory(ProductCategory.ELECTRONICS).withName("testProduct3").withCatalogNumber(789).getProduct();

        // _testItem1 = new ItemBuilder().withId(1).withCatalogNumber(_testProduct1.catalogNumber).getItem();
        // _testItem2 = new ItemBuilder().withId(2).withCatalogNumber(_testProduct2.catalogNumber).getItem();
        // _testItem3 = new ItemBuilder().withId(3).withCatalogNumber(_testProduct1.catalogNumber).getItem();

        _testStore1 = {name: "testStore1Name"};
        _testStore2 = {name: "testStore2Name"};

        _serviceBridge.createStore(_testStore1);
        _serviceBridge.createStore(_testStore2);

        _serviceBridge.addProductsToStore(_testStore1, [_testProduct1, _testProduct3]);
        _serviceBridge.addProductsToStore(_testStore2, [_testProduct1, _testProduct2]);

        // _serviceBridge.addItemsToStore(_testStore1, [_testItem1]);
        // _serviceBridge.addItemsToStore(_testStore2, [_testItem2, _testItem3]);

        _serviceBridge.logout();

        _priceRange = {min: 0, max: Number.MAX_SAFE_INTEGER};
        _testFilters = {
            productCategory: ProductCategory.ELECTRONICS,
            priceRange: _priceRange,
            storeRating: Rating.LOW,
            productRating: Rating.MEDIUM
        };
        _testSearchQuery = {productName: ""};
        _testSearchData = {
            token: "123",
            body: {
                searchQuery: {productName: "test-input"},
                filters: _testFilters,
            }
        }
    });

    test("Valid search input, not filters", () => {
        _testSearchData.body.filters = {};
        _testSearchQuery.productName = _testProduct1.name;
        _testSearchData.body.searchQuery = _testSearchQuery;

        const {data, error} = _serviceBridge.search(_testSearchData);
        expect(error).toBeUndefined();
        expect(data).toBeDefined();

        const productsInStore = data.products;
        const stores: string[] = productsInStore.map(p => p.storeName);
        const products: Product[] = productsInStore.map(p => p.product);
        expect(stores.length).toEqual(2);
        expect(products.length).toEqual(2);
        expect(stores).toContainEqual(_testStore1.name);
        expect(stores).toContainEqual(_testStore2.name);
        expect(products[0].catalogNumber).toEqual(_testProduct1.catalogNumber);
    });

    // test("Valid search input, input is category, no filters", () => {
    //     _testSearchData.filters = undefined;
    //     _testSearchData.query = "Clothing";
    //
    //     const {data, error} = _serviceBridge.search(_testSearchData);
    //     expect(error).toBeUndefined();
    //     expect(data).toBeDefined();
    //
    //     const {products} = data;
    //     expect(products.length > 0).toBeTruthy();
    //
    //     const allSameCategory = products.reduce((acc, curr) => acc && curr.category === CATEGORY.CLOTHING, true);
    //     expect(allSameCategory).toBeTruthy();
    // });
    //
    // test("Invalid search input, not filters", () => {
    //     _testSearchData.filters = undefined;
    //     _testSearchData.query = "";
    //
    //     const {data, error} = _serviceBridge.search(_testSearchData);
    //     expect(data).toBeUndefined();
    //     expect(error).toBeDefined();
    // });
    //
    // test("Valid search input, one filter", () => {
    //     _testSearchData.filters = {
    //         priceRange: {min: LOW, max: HIGH}
    //     };
    //     _testSearchData.query = "";
    //
    //     const {data, error} = _serviceBridge.search(_testSearchData);
    //     expect(error).toBeUndefined();
    //     expect(data).toBeDefined();
    //
    //     const {products} = data;
    //     const areBetweenPriceRange = products.reduce((acc, curr) => acc && curr.price <= HIGH && curr.price >= LOW, true);
    //     expect(areBetweenPriceRange).toBeTruthy();
    // });
    //
    // test("Valid search input, all filter", () => {
    //     _testSearchData.filters = {
    //         productCategory: CATEGORY.CLOTHING,
    //         priceRange: {min: LOW, max: HIGH},
    //         productRating: RATE.ONE_STAR
    //     };
    //     _testSearchData.query = _testProduct1.name;
    //
    //     _credentials.userName = "new test user";
    //     _serviceBridge.register(_credentials);
    //     _serviceBridge.login(_credentials);
    //
    //     _serviceBridge.rate(_testProduct1, RATE.FIVE_STARS);
    //     _serviceBridge.rate(_testProduct2, RATE.ONE_STAR);
    //     _serviceBridge.rate(_testProduct3, RATE.TWO_STARS);
    //
    //     _serviceBridge.logout();
    //
    //     const {data, error} = _serviceBridge.search(_testSearchData);
    //     expect(error).toBeUndefined();
    //     expect(data).toBeDefined();
    //
    //     const {products} = data;
    //     const itemsReducer = (acc, curr) => {
    //         const betweenPriceRange = curr.price <= HIGH && curr.price >= LOW;
    //         const correctCategory = curr.category === CATEGORY.CLOTHING;
    //         const betweenRate = curr.rate >= RATE.ONE_STAR && curr.rate <= RATE.FIVE_STARS;
    //         return acc && betweenRate && betweenPriceRange && correctCategory;
    //     };
    //     const areFiltered = products.reduce(itemsReducer, true);
    //     expect(areFiltered).toBeTruthy();
    //     expect(products.length).toBe(2);
    // });
});
