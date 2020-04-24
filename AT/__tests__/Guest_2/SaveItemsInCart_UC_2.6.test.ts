import {
    Bridge,
    Driver,
    Item,
    Store,
    Cart, Product
} from "../../";

import {ProductBuilder} from "../mocks/builders/product-builder";
import {ItemBuilder} from "../mocks/builders/item-builder";


describe("Guest saves items in the cart, UC: 2.6", () => {
    let _driver = new Driver();
    let _serviceBridge: Bridge;
    let _testStore1: Store;
    let _testStore2: Store;
    let _testProduct1: Product;
    let _testProduct2: Product;
    let _testProduct3: Product;
    let _testItem1: Item;
    let _testItem2: Item;
    let _testItem3: Item;

    beforeEach(() => {
        _serviceBridge = _driver
            .resetState()
            .startSession()
            .initWithDefaults()
            .loginWithDefaults()
            .getBridge();

        _testProduct1 = new ProductBuilder().withName("testProduct1").withCatalogNumber(123).getProduct();
        _testProduct2 = new ProductBuilder().withName("testProduct2").withCatalogNumber(456).getProduct();
        _testProduct3 = new ProductBuilder().withName("testProduct3").withCatalogNumber(789).getProduct();

        _testItem1 = new ItemBuilder().withId(1).withCatalogNumber(_testProduct1.catalogNumber).getItem();
        _testItem2 = new ItemBuilder().withId(2).withCatalogNumber(_testProduct2.catalogNumber).getItem();
        _testItem3 = new ItemBuilder().withId(3).withCatalogNumber(_testProduct1.catalogNumber).getItem();

        _testStore1 = {name: "testStore1Name"};
        _testStore2 = {name: "testStore2Name"};

        _serviceBridge.createStore(_testStore1);
        _serviceBridge.createStore(_testStore2);

        _serviceBridge.addProductsToStore(_testStore1, [_testProduct1, _testProduct3]);
        _serviceBridge.addProductsToStore(_testStore2, [_testProduct1, _testProduct2]);

        _serviceBridge.addItemsToStore(_testStore1, [_testItem1]);
        _serviceBridge.addItemsToStore(_testStore2, [_testItem3, _testItem2]);

        _serviceBridge.logout();
    });

    test("Valid insertion, item doesn't exist in cart", () => {
        const {data, error} = _serviceBridge.addToCart(_testStore1, _testProduct1, 1);
        expect(error).toBeUndefined();
        expect(data).toBeDefined();

        const cart: Cart = _serviceBridge.watchCart().data.cart;
        const reducer = (acc, curr) => acc && curr.product.catalogNumber === _testProduct1.catalogNumber;
        expect(cart.products.reduce(reducer, true)).toBeTruthy();
    });

    test("Valid insertion, item isn't in stock", () => {
        const {data, error} = _serviceBridge.addToCart(_testStore1, _testProduct3, 1);
        expect(data).toBeUndefined();
        expect(error).toBeDefined();

        const cart: Cart = _serviceBridge.watchCart().data.cart;
        const reducer = (acc, curr) => acc || curr.product.catalogNumber === _testProduct3.catalogNumber;
        expect(cart.products.reduce(reducer, false)).toBeFalsy();
    });

    test("Valid insertion, item already exists in cart", () => {
        const res1 = _serviceBridge.addToCart(_testStore1, _testProduct1, 1);
        const data1 = res1.data;
        const error1 = res1.error;
        expect(error1).toBeUndefined();
        expect(data1).toBeDefined();

        const cart: Cart = _serviceBridge.watchCart().data.cart;
        const filteredCart = cart.products.filter(p => p.product.catalogNumber === _testProduct1.catalogNumber);
        expect(filteredCart.length).toBe(1);
        const amountBefore = filteredCart[0].amount;

        const res2 = _serviceBridge.addToCart(_testStore2, _testProduct1, 1);
        const data2 = res2.data;
        const error2 = res2.error;
        expect(error2).toBeUndefined();
        expect(data2).toBeDefined();

        const cartAfter: Cart = _serviceBridge.watchCart().data.cart;
        const filteredCartAfter = cartAfter.products.filter(p => p.product.catalogNumber === _testProduct1.catalogNumber);
        expect(filteredCartAfter.length).toBe(1);
        const amountAfter = filteredCart[0].amount;
        expect(amountAfter).toEqual(amountBefore + 1);
    });
});