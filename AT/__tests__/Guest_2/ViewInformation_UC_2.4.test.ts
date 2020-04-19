// import {Bridge, Driver, Item, CATEGORY, Store, Credentials, Product} from "../../";
// import {ItemBuilder} from "../mocks/builders/item-builder";
// import {ProductBuilder} from "../mocks/builders/product-builder";
//
// // const ITEM_NOT_FOUND = "Item not found";
// // const STORE_NOT_FOUND = "Store not found";
//
// describe("Guest - View Information, UC: 2.4", () => {
//     let _driver = new Driver();
//     let _serviceBridge: Bridge;
//     let _testProduct: Product;
//     let _testItem: Item;
//     let _testStore: Store;
//     let _credentials: Credentials;
//
//     beforeEach(() => {
//         _serviceBridge = _driver
//             .resetState()
//             .initWithDefaults()
//             .startSession()
//             .getBridge();
//
//         _testStore = {name: "some-mock-store"};
//         _testProduct = new ProductBuilder().withCatalogNumber(123).getProduct();
//         _testItem = new ItemBuilder().withId(1).withCatalogNumber(123).getItem();
//     });
//
//     test("View valid item", () => {
//         _testItem.id = "validItemID";
//         _testItem.name = "itemTestName";
//         _testItem.description = "itemTestDesc";
//         _testItem.price = 33.5;
//
//         _testStore.id = "validStoreID";
//         _testStore.name = "storeTestName";
//         _testStore.description = "storeTestDesc";
//
//         _serviceBridge.register(_credentials);
//         _serviceBridge.login(_credentials);
//
//         _serviceBridge.createStore(_testStore);
//         _serviceBridge.addItemToStore(_testStore, _testItem);
//
//         _serviceBridge.logout();
//
//         const {data, error} = _serviceBridge.viewItem(_testItem);
//         const {name, price, description} = data;
//         expect(error).toBeUndefined();
//         expect(name).toEqual(_testItem.name);
//         expect(price).toEqual(_testItem.price);
//         expect(description).toEqual(_testItem.description);
//     });
//
//     test("View invalid item", () => {
//         _testItem.id = "invalidItemID";
//         _testItem.name = "itemTestName";
//         _testItem.description = "itemTestDesc";
//         _testItem.price = 33.5;
//
//         const {data, error} = _serviceBridge.viewItem(_testItem);
//         expect(data).toBeUndefined();
//         expect(error).toBeDefined();
//     });
//
//     test("View valid store", () => {
//         _testStore.id = "validStoreID";
//         _testStore.name = "storeTestName";
//         _testStore.description = "storeTestDesc";
//
//         _serviceBridge.register(_credentials);
//         _serviceBridge.login(_credentials);
//
//         _serviceBridge.createStore(_testStore);
//
//         _serviceBridge.logout();
//
//         const {data, error} = _serviceBridge.viewStore(_testItem);
//         const {name, description} = data;
//         expect(error).toBeUndefined();
//         expect(name).toEqual(_testStore.name);
//         expect(description).toEqual(_testStore.description);
//     });
//
//     test("View invalid store", () => {
//         _testStore.id = "invalidStoreID";
//         _testStore.name = "storeTestName";
//         _testStore.description = "storeTestDesc";
//
//         const {data, error} = _serviceBridge.viewStore(_testStore);
//         expect(data).toBeUndefined();
//         expect(error).toBeDefined();
//     });
// });
//
