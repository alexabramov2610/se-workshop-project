import {
    Bridge,
    Driver,
    CATEGORY,
    Item,
    Store,
    Cart, Credentials
} from "../../src/";



describe("Guest saves items in the cart, UC: 2.6", () => {
    let _serviceBridge: Bridge;
    let _credentials: Credentials;
    let _testStore1: Store;
    let _testStore2: Store;
    let _testItem1: Item;
    let _testItem2: Item;
    let _testItem3: Item;

    beforeEach(() => {
        _serviceBridge = Driver.makeBridge();

        _credentials = {userName: "test-name", password: "test-PASS-123"};
        _serviceBridge.register(_credentials);
        _serviceBridge.login(_credentials);

        _testItem1 = {
            id: "test-id1",
            name: "test-item1",
            price: 999,
            description: "lovely-test-store",
            category: CATEGORY.ELECTRONICS,
        };
        _testItem2 = {
            id: "test-id2",
            name: "test-item2",
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

        _serviceBridge.createStore(_testStore1);
        _serviceBridge.createStore(_testStore2);

        _serviceBridge.addItemToStore(_testStore1, _testItem1);
        _serviceBridge.addItemToStore(_testStore1, _testItem3);
        _serviceBridge.addItemToStore(_testStore2, _testItem2);

        _serviceBridge.logout();
    });

    test("Valid insertion, item doesn't exist in cart", () => {
        const {data, error} = _serviceBridge.addToCart(_testItem2);
        expect(error).toBeUndefined();
        expect(data).toBeDefined();

        const cart: Cart = _serviceBridge.watchCart().data.cart;
        expect(cart.items.includes(_testItem2)).toBeTruthy();

        const testItem2Idx = cart.items.indexOf(_testItem2);
        expect(cart.quantities[testItem2Idx]).toBe(1);
    });

    test("Valid insertion, item isn't in stock",() => {
        const {data, error} = _serviceBridge.addToCart(_testItem2);
        expect(data).toBeUndefined();
        expect(error).toBeDefined();

        const cart: Cart = _serviceBridge.watchCart().data.cart;
        expect(cart.items.includes(_testItem2)).toBeFalsy();

        const testItem2Idx = cart.items.indexOf(_testItem2);
        expect(cart.quantities[testItem2Idx]).toBeUndefined();
    });

    test("Valid insertion, item already exists in cart", () => {
        const res1 = _serviceBridge.addToCart(_testItem1);
        const data1 = res1.data;
        const error1 = res1.error;
        expect(error1).toBeUndefined();
        expect(data1).toBeDefined();

        const res2 = _serviceBridge.addToCart(_testItem2);
        const data2 = res2.data;
        const error2 = res2.error;
        expect(error2).toBeUndefined();
        expect(data2).toBeDefined();

        const res3 = _serviceBridge.addToCart(_testItem3);
        const data3 = res3.data;
        const error3 = res3.error;
        expect(error3).toBeUndefined();
        expect(data3).toBeDefined();

        const beforeQuantities = _serviceBridge.watchCart().data.cart.quantities;

        const {data, error} = _serviceBridge.addToCart(_testItem1);
        expect(error).toBeUndefined();
        expect(data).toBeDefined();

        const cart: Cart = _serviceBridge.watchCart().data.cart;

        const testItem1Idx = cart.items.indexOf(_testItem1);
        const testItem2Idx = cart.items.indexOf(_testItem2);
        const testItem3Idx = cart.items.indexOf(_testItem3);

        const q1 = cart.quantities[testItem1Idx];
        const q2 = cart.quantities[testItem2Idx];
        const q3 = cart.quantities[testItem3Idx];

        expect(q1).toBe(beforeQuantities[testItem1Idx] + 1);
        expect(q2).toBe(beforeQuantities[testItem2Idx]);
        expect(q3).toBe(beforeQuantities[testItem3Idx]);
    });
});