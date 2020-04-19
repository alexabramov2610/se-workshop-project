import {Bridge, Driver, Item, CATEGORY, Store, Credentials, Product} from "../../";
import {ItemBuilder} from "../mocks/builders/item-builder";
import {ProductBuilder} from "../mocks/builders/product-builder";

// const ITEM_NOT_FOUND = "Item not found";
// const STORE_NOT_FOUND = "Store not found";

describe("Guest - View Information, UC: 2.4", () => {
    let _driver = new Driver();
    let _serviceBridge: Bridge;
    let _testProduct: Product;
    let _testItem: Item;
    let _testStore: Store;

    beforeEach(() => {
        _serviceBridge = _driver
            .resetState()
            .initWithDefaults()
            .startSession()
            .registerWithDefaults()
            .loginWithDefaults()
            .getBridge();

        _testStore = {name: "some-mock-store"};
        _testProduct = new ProductBuilder().withCatalogNumber(123).getProduct();
        _testItem = new ItemBuilder().withId(1).withCatalogNumber(123).getItem();

    });

    test("View valid item", () => {
        _serviceBridge.createStore(_testStore);
        _serviceBridge.addProductsToStore(_testStore, [_testProduct]);
        _serviceBridge.addItemsToStore(_testStore, [_testItem]);

        _serviceBridge.logout();

        const {data, error} = _serviceBridge.viewProduct(_testStore, _testProduct);
        const product = data.info;
        expect(error).toBeUndefined();
        expect(product.name).toEqual(_testProduct.name);
        expect(product.price).toEqual(_testProduct.price);
        expect(product.catalogNumber).toEqual(_testProduct.catalogNumber);
    });

    test("View invalid product", () => {
        _serviceBridge.createStore(_testStore);
        _serviceBridge.logout();

        const {data, error} = _serviceBridge.viewProduct(_testStore, _testProduct);
        expect(data).toBeUndefined();
        expect(error).toBeDefined();
    });

    test("View valid store", () => {
        _serviceBridge.createStore(_testStore);
        _serviceBridge.addProductsToStore(_testStore, [_testProduct]);
        _serviceBridge.logout();

        const {data, error} = _serviceBridge.viewStore(_testStore);
        const {storeName, storeOwnersNames, productNames} = data;
        expect(error).toBeUndefined();
        expect(storeName).toEqual(_testStore.name);
        expect(productNames[0]).toEqual(_testProduct.name);
    });

    test("View invalid store", () => {
        _serviceBridge.logout();

        const {data, error} = _serviceBridge.viewStore(_testStore);
        expect(data).toBeUndefined();
        expect(error).toBeDefined();
    });
});




