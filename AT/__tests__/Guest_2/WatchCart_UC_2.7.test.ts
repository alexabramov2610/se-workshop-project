import {
    Bridge,
    Driver,
    Item,
    Store, Product,
} from "../../";
import {ProductBuilder} from "../../src/test_env/mocks/builders/product-builder";
import {ItemBuilder} from "../../src/test_env/mocks/builders/item-builder";
import * as utils from "../../utils"


describe("Guest watch cart, UC: 2.7", () => {
    let _driver = new Driver();
    let _serviceBridge: Partial<Bridge>;
    let _testStore1: Store;
    let _testProduct1: Product;
    let _testItem1: Item;
    let _testItem2: Item;

    beforeEach(async () => {
        _driver = new Driver();
        _driver.dropDBDor();
        await _driver.reset();
        _serviceBridge = await _driver.getBridge()
        await _driver.startSession()
        await _driver.initWithDefaults()
        await _driver.registerWithDefaults()
        await _driver.loginWithDefaults()

        _testProduct1 = new ProductBuilder().withName("testProduct1").withCatalogNumber(123).getProduct();
        _testItem1 = new ItemBuilder().withId(1).withCatalogNumber(_testProduct1.catalogNumber).getItem();
        _testItem2 = new ItemBuilder().withId(2).withCatalogNumber(_testProduct1.catalogNumber).getItem();
        _testStore1 = {name: "testStore1Name"};

        await _serviceBridge.createStore(_testStore1);
        await _serviceBridge.addProductsToStore(_testStore1, [_testProduct1]);
        await _serviceBridge.addItemsToStore(_testStore1, [_testItem1]);
        await _serviceBridge.addItemsToStore(_testStore1, [_testItem2]);
        await _serviceBridge.logout();
    });

    afterAll(() => {
        _driver.dropDBDor();
        utils.terminateSocket();


    });

    test("Non empty cart", async () => {
        const req = {
            body: {
                storeName: _testStore1.name,
                catalogNumber: _testProduct1.catalogNumber,
                amount: 1,
            },
        }
        await _serviceBridge.saveProductToCart(req);

        const {data, error} = await _serviceBridge.watchCart();
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

    test("Non empty cart, adding same product", async () => {
        const amountBefore = 1;
        const amountAfter = amountBefore + 1;

        const req = {
            body: {
                storeName: _testStore1.name,
                catalogNumber: _testProduct1.catalogNumber,
                amount: 1,
            },
        }
        await _serviceBridge.saveProductToCart(req);
        const res = await _serviceBridge.watchCart();
        const productsBefore = res.data.cart.products;

        const bagsBefore = productsBefore.map(p => p.bagItems);
        expect(bagsBefore.length).toEqual(1);

        const bagBefore = bagsBefore[0];
        expect(bagBefore[0].product.catalogNumber).toEqual(_testProduct1.catalogNumber)
        expect(bagBefore[0].amount).toEqual(amountBefore);


        await _serviceBridge.saveProductToCart(req);
        const {data, error} = await _serviceBridge.watchCart();
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

    test("Empty cart", async () => {
        const {data, error} = await _serviceBridge.watchCart();
        expect(error).toBeUndefined();
        expect(data).toBeDefined();

        const {cart: {products}} = data;
        expect(products.length).toEqual(0);
    });
});

