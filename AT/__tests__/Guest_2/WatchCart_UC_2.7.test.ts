import {
    Bridge,
    Driver,
    Item,
    Store, Product,
} from "../../";
import {ProductBuilder} from "../../src/test_env/mocks/builders/product-builder";
import {ItemBuilder} from "../../src/test_env/mocks/builders/item-builder";
import * as utils from "../utils"



describe("Guest watch cart, UC: 2.7", () => {
    let _driver = new Driver();
    let _serviceBridge: Bridge;
    let _testStore1: Store;
    let _testProduct1: Product;
    let _testItem1: Item;
    let _testItem2: Item;

    beforeEach(() => {
        _serviceBridge = _driver
            .resetState()
            .startSession()
            .initWithDefaults()
            .registerWithDefaults()
            .loginWithDefaults()
            .getBridge();

        _testProduct1 = new ProductBuilder().withName("testProduct1").withCatalogNumber(123).getProduct();
        _testItem1 = new ItemBuilder().withId(1).withCatalogNumber(_testProduct1.catalogNumber).getItem();
        _testItem2 = new ItemBuilder().withId(2).withCatalogNumber(_testProduct1.catalogNumber).getItem();
        _testStore1 = {name: "testStore1Name"};

        _serviceBridge.createStore(_testStore1);
        _serviceBridge.addProductsToStore(_testStore1, [_testProduct1]);
        _serviceBridge.addItemsToStore(_testStore1, [_testItem1]);

        _serviceBridge.logout();
    });

    afterAll(() => {
        utils.terminateSocket();
     });

    test("Non empty cart", () => {
        _serviceBridge.addToCart(_testStore1, _testProduct1, 1);

        const {data, error} = _serviceBridge.watchCart();
        expect(error).toBeUndefined();
        expect(data).toBeDefined();

        const {cart: {products}} = data;
        expect(products.length).toEqual(1);

        const stores = products.map(p => p.storeName);
        expect(stores.length).toEqual(1);
        expect(stores[0]).toEqual(_testStore1.name);

        const bags = products.map(p => p.bagItems);
        expect(bags.length).toEqual(1);

        const bag = bags[0];
        expect(bag[0].product.catalogNumber).toEqual(_testProduct1.catalogNumber)
        expect(bag[0].amount).toEqual(1);
    });

    test("Non empty cart, adding same product", () => {
        const amountBefore = 1;
        const amountAfter = amountBefore + 1;

        _serviceBridge.addToCart(_testStore1, _testProduct1, 1);
        const res = _serviceBridge.watchCart();
        const productsBefore = res.data.cart.products;

        const bagsBefore = productsBefore.map(p => p.bagItems);
        expect(bagsBefore.length).toEqual(1);

        const bagBefore = bagsBefore[0];
        expect(bagBefore[0].product.catalogNumber).toEqual(_testProduct1.catalogNumber)
        expect(bagBefore[0].amount).toEqual(amountBefore);

        _serviceBridge.addToCart(_testStore1, _testProduct1, 1);

        const {data, error} = _serviceBridge.watchCart();
        expect(error).toBeUndefined();
        expect(data).toBeDefined();

        const {cart: {products}} = data;

        const stores = products.map(p => p.storeName);
        expect(stores.length).toEqual(1);
        expect(stores[0]).toEqual(_testStore1.name);

        const bags = products.map(p => p.bagItems);
        expect(bags.length).toEqual(1);

        const bag = bags[0];
        expect(bag[0].product.catalogNumber).toEqual(_testProduct1.catalogNumber)
        expect(bag[0].amount).toEqual(amountAfter);
    });

    test("Empty cart", () => {
        const {data, error} = _serviceBridge.watchCart();
        expect(error).toBeUndefined();
        expect(data).toBeDefined();

        const {cart: {products}} = data;
        expect(products.length).toEqual(0);
    });
});

