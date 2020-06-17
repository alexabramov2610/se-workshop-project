import {
    Bridge,
    Driver,
    Item,
    Store,
    Product
} from "../../";

import {ProductBuilder} from "../../src/test_env/mocks/builders/product-builder";
import {ItemBuilder} from "../../src/test_env/mocks/builders/item-builder";
import * as utils from "../../utils"


describe("Guest saves items in the cart, UC: 2.6", () => {
    let _driver = new Driver();
    let _serviceBridge: Partial<Bridge>;
    let _testStore1: Store;
    let _testStore2: Store;
    let _testProduct1: Product;
    let _testProduct2: Product;
    let _testProduct3: Product;
    let _testItem1: Item;
    let _testItem2: Item;
    let _testItem3: Item;

    beforeEach(async() => {

        _driver.dropDB()
        await _driver.reset();
        await _driver.startSession()
        await _driver.initWithDefaults()
        await _driver.registerWithDefaults()
        await _driver.loginWithDefaults()
        _serviceBridge = _driver.getBridge();

        _testProduct1 = new ProductBuilder().withName("testProduct1").withCatalogNumber(123).getProduct();
        _testProduct2 = new ProductBuilder().withName("testProduct2").withCatalogNumber(456).getProduct();
        _testProduct3 = new ProductBuilder().withName("testProduct3").withCatalogNumber(789).getProduct();

        _testItem1 = new ItemBuilder().withId(1).withCatalogNumber(_testProduct1.catalogNumber).getItem();
        _testItem2 = new ItemBuilder().withId(2).withCatalogNumber(_testProduct2.catalogNumber).getItem();
        _testItem3 = new ItemBuilder().withId(3).withCatalogNumber(_testProduct1.catalogNumber).getItem();

        _testStore1 = {name: "testStore1Name"};
        _testStore2 = {name: "testStore2Name"};

        await _serviceBridge.createStore(_testStore1);
        await _serviceBridge.createStore(_testStore2);

        await _serviceBridge.addProductsToStore(_testStore1, [_testProduct1, _testProduct3]);
        await _serviceBridge.addProductsToStore(_testStore2, [_testProduct1, _testProduct2]);

        await _serviceBridge.addItemsToStore(_testStore1, [_testItem1, _testItem3]);
        await _serviceBridge.addItemsToStore(_testStore2, [_testItem3, _testItem2]);

        await _serviceBridge.logout();
    });

    afterAll(() => {
        _driver.dropDB()
        utils.terminateSocket();
    });

    test("Valid insertion, item doesn't exist in cart", async () => {
        const {data, error} = await _serviceBridge.addToCart(_testStore1, _testProduct1, 1);
        expect(error).toBeUndefined();
        expect(data).toBeDefined();

        const res =await _serviceBridge.watchCart();
        const {cart: {products}}= res.data
        const stores = products.map(p => p.storeName);
        const bags = products.map(p => p.bagItems);

        expect(stores).toContainEqual(_testStore1.name);
        expect(bags[0][0].product.catalogNumber).toEqual(_testProduct1.catalogNumber);
    });

    test("Valid insertion, item isn't in stock", async() => {
        const {data, error} = await _serviceBridge.addToCart(_testStore1, _testProduct3, 1);
        expect(data.result).toBe(false);
        expect(error).toBeDefined();
    });

    test("Valid insertion, item already exists in cart", async () => {
        const res1 = await _serviceBridge.addToCart(_testStore1, _testProduct1, 1);
        const data1 = res1.data;
        const error1 = res1.error;
        expect(error1).toBeUndefined();
        expect(data1).toBeDefined();

        const watchCartRes =await _serviceBridge.watchCart();
        const productsBefore = watchCartRes.data.cart.products;
        const bagItemsFromAllStoresBefore = productsBefore.map(p => p.bagItems);
        const bagItemBefore = bagItemsFromAllStoresBefore[0][0]; //product 1 is in bag.
        const amountBefore = bagItemBefore.amount;
        expect(amountBefore).toEqual(1);

        const {data, error} =await _serviceBridge.addToCart(_testStore1, _testProduct1, 1);
        expect(data).toBeDefined();
        expect(error).toBeUndefined();

        const watchCartRes1 =await _serviceBridge.watchCart();
        const {cart: {products}} = watchCartRes1.data
        const stores = products.map(p => p.storeName);
        expect(stores.length).toEqual(1);

        const bagItemsFromAllStores = products.map(p => p.bagItems);
        const bagItem = bagItemsFromAllStores[0][0]; //product 1 is in bag.
        const amountAfter = bagItem.amount;
        expect(amountAfter).toEqual(amountBefore + 1);
    });

    test("Valid insertion, adding with quantity", async() => {
        const quantity = 2;
        const {data, error} = await _serviceBridge.addToCart(_testStore1, _testProduct1, quantity);
        expect(error).toBeUndefined();
        expect(data).toBeDefined();

        const res =await _serviceBridge.watchCart();
        const {cart: {products}} =res.data
        const stores = products.map(p => p.storeName);
        const bags = products.map(p => p.bagItems);

        expect(stores).toContainEqual(_testStore1.name);
        expect(bags[0][0].product.catalogNumber).toEqual(_testProduct1.catalogNumber);
        expect(bags[0][0].amount).toBe(quantity);
    });

    test("Valid insertion, adding with quantity and not enough items in store", async () => {
        const quantity = 20;
        const {data, error} = await _serviceBridge.addToCart(_testStore1, _testProduct1, quantity);
        expect(data.result).toBe(false);
        expect(error).toBeDefined();
    });
});