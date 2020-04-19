// import {
//     Bridge,
//     Driver,
//     Filters,
//     CATEGORY,
//     RATE,
//     Item,
//     PriceRange,
//     Credentials,
//     SearchData,
//     Store,
//     Product
// } from "../../";
// import {ProductBuilder} from "../mocks/builders/product-builder";
// import {ItemBuilder} from "../mocks/builders/item-builder";
//
// const LOW = 25;
// const HIGH = 100;
//
// describe("Guest Search, UC: 2.5", () => {
//     let _driver = new Driver();
//     let _serviceBridge: Bridge;
//     let _testStore1: Store;
//     let _testStore2: Store;
//     let _testProduct1: Product;
//     let _testProduct2: Product;
//     let _testProduct3: Product;
//     let _testItem1: Item;
//     let _testItem2: Item;
//     let _testItem3: Item;
//     let _testSearchData: SearchData;
//     let _testFilters: Filters;
//     let _priceRange: PriceRange;
//     let _credentials: Credentials;
//
//
//     beforeEach(() => {
//         _serviceBridge = _driver
//             .resetState()
//             .initWithDefaults()
//             .startSession()
//             .loginWithDefaults()
//             .getBridge();
//
//         _credentials = {userName: "", password: "",};
//         _testProduct1 = new ProductBuilder().withName("testProduct1").withCatalogNumber(123).getProduct();
//         _testProduct2 = new ProductBuilder().withName("testProduct2").withCatalogNumber(456).getProduct();
//         _testProduct3 = new ProductBuilder().withCategory(CATEGORY.ELECTRONICS).withName("testProduct3").withCatalogNumber(789).getProduct();
//
//         _testItem1 = new ItemBuilder().withId(1).withCatalogNumber(_testProduct1.catalogNumber).getItem();
//         _testItem2 = new ItemBuilder().withId(2).withCatalogNumber(_testProduct2.catalogNumber).getItem();
//         _testItem3 = new ItemBuilder().withId(3).withCatalogNumber(_testProduct1.catalogNumber).getItem();
//
//         _testStore1 = {name: "testStore1Name"};
//         _testStore2 = {name: "testStore2Name"};
//
//         _serviceBridge.createStore(_testStore1);
//         _serviceBridge.createStore(_testStore2);
//
//         _serviceBridge.addProductsToStore(_testStore1, [_testProduct1, _testProduct3]);
//         _serviceBridge.addProductsToStore(_testStore2, [_testProduct1, _testProduct2]);
//
//         _serviceBridge.addItemsToStore(_testStore1, [_testItem1]);
//         _serviceBridge.addItemsToStore(_testStore2, [_testItem2, _testItem3]);
//
//         _serviceBridge.logout();
//
//         _priceRange = {low: 0, high: Number.MAX_SAFE_INTEGER};
//         _testFilters = {
//             category: CATEGORY.ELECTRONICS,
//             priceRange: _priceRange,
//             storeRate: RATE.THREE_STARS,
//             itemRate: RATE.ONE_STAR
//         };
//         _testSearchData = {
//             input: "test-input",
//             filters: _testFilters,
//         }
//     });
//
//     test("Valid search input, not filters", () => {
//         _testSearchData.filters = undefined;
//         _testSearchData.input = _testProduct1.name;
//
//         const {data, error} = _serviceBridge.search(_testSearchData);
//         expect(error).toBeUndefined();
//         expect(data).toBeDefined();
//
//         const {products} = data;
//         expect(products.filter(product => product.name === _testProduct1.name).length > 0).toBeTruthy();
//     });
//
//     test("Valid search input, input is category, no filters", () => {
//         _testSearchData.filters = undefined;
//         _testSearchData.input = "Clothing";
//
//         const {data, error} = _serviceBridge.search(_testSearchData);
//         expect(error).toBeUndefined();
//         expect(data).toBeDefined();
//
//         const {products} = data;
//         expect(products.length > 0).toBeTruthy();
//
//         const allSameCategory = products.reduce((acc, curr) => acc && curr.category === CATEGORY.CLOTHING, true);
//         expect(allSameCategory).toBeTruthy();
//     });
//
//     test("Invalid search input, not filters", () => {
//         _testSearchData.filters = undefined;
//         _testSearchData.input = "";
//
//         const {data, error} = _serviceBridge.search(_testSearchData);
//         expect(data).toBeUndefined();
//         expect(error).toBeDefined();
//     });
//
//     test("Valid search input, one filter", () => {
//         _testSearchData.filters = {
//             priceRange: {low: LOW, high: HIGH}
//         };
//         _testSearchData.input = "";
//
//         const {data, error} = _serviceBridge.search(_testSearchData);
//         expect(error).toBeUndefined();
//         expect(data).toBeDefined();
//
//         const {products} = data;
//         const areBetweenPriceRange = products.reduce((acc, curr) => acc && curr.price <= HIGH && curr.price >= LOW, true);
//         expect(areBetweenPriceRange).toBeTruthy();
//     });
//
//     test("Valid search input, all filter", () => {
//         _testSearchData.filters = {
//             category: CATEGORY.CLOTHING,
//             priceRange: {low: LOW, high: HIGH},
//             itemRate: RATE.ONE_STAR
//         };
//         _testSearchData.input = _testProduct1.name;
//
//         _credentials.userName = "new test user";
//         _serviceBridge.register(_credentials);
//         _serviceBridge.login(_credentials);
//
//         _serviceBridge.rate(_testProduct1, RATE.FIVE_STARS);
//         _serviceBridge.rate(_testProduct2, RATE.ONE_STAR);
//         _serviceBridge.rate(_testProduct3, RATE.TWO_STARS);
//
//         _serviceBridge.logout();
//
//         const {data, error} = _serviceBridge.search(_testSearchData);
//         expect(error).toBeUndefined();
//         expect(data).toBeDefined();
//
//         const {products} = data;
//         const itemsReducer = (acc, curr) => {
//             const betweenPriceRange = curr.price <= HIGH && curr.price >= LOW;
//             const correctCategory = curr.category === CATEGORY.CLOTHING;
//             const betweenRate = curr.rate >= RATE.ONE_STAR && curr.rate <= RATE.FIVE_STARS;
//             return acc && betweenRate && betweenPriceRange && correctCategory;
//         };
//         const areFiltered = products.reduce(itemsReducer, true);
//         expect(areFiltered).toBeTruthy();
//         expect(products.length).toBe(2);
//     });
// });
