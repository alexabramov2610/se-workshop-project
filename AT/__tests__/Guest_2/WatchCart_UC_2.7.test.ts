import {
    Bridge,
    Driver,
    Item,
    Store, Product,
} from "../../";
import {ProductBuilder} from "../mocks/builders/product-builder";
import {ItemBuilder} from "../mocks/builders/item-builder";


describe("Guest watch cart, UC: 2.7", () => {
    let _driver = new Driver();
    let _serviceBridge: Bridge;
    let _testStore1: Store;
    let _testProduct1: Product;
    let _testItem1: Item;

    beforeEach(() => {
        _serviceBridge = _driver
            .resetState()
            .initWithDefaults()
            .startSession()
            .loginWithDefaults()
            .getBridge();

        _testProduct1 = new ProductBuilder().withName("testProduct1").withCatalogNumber(123).getProduct();
        _testItem1 = new ItemBuilder().withId(1).withCatalogNumber(_testProduct1.catalogNumber).getItem();
        _testStore1 = {name: "testStore1Name"};

        _serviceBridge.createStore(_testStore1);
        _serviceBridge.addProductsToStore(_testStore1, [_testProduct1]);
        _serviceBridge.addItemsToStore(_testStore1, [_testItem1]);

        _serviceBridge.logout();
    });

    test("Non empty cart", () => {
        _serviceBridge.addToCart(_testStore1, _testProduct1);

        const {data, error} = _serviceBridge.watchCart();
        expect(error).toBeUndefined();
        expect(data).toBeDefined();

        let {cart} = data;
        cart.products = cart.products.filter(p => p.product.catalogNumber === _testProduct1.catalogNumber);
        expect(cart.products.length).toBe(1);

        const product = cart.products[0];
        expect(product.amount).toBe(1);
    });

    test("Empty cart", () => {
        const {data, error} = _serviceBridge.watchCart();
        expect(error).toBeUndefined();
        expect(data).toBeDefined();

        const {cart} = data;
        expect(cart).toBeDefined();
        expect(cart.products.length === 0).toBeTruthy();
    });
});