import {
    Bridge,
    Driver,
    CATEGORY,
    RATE,
    Item,
    Store,
    Cart
} from "../../src/";



describe("Guest saves items in the cart, UC: 2.6", () => {
    let _serviceBridge: Bridge;
    let _testCart: Cart;
    let _testStore1: Store;
    let _testStore2: Store;
    let _testItem1: Item;
    let _testItem2: Item;
    let _testItem3: Item;

    beforeEach(() => {
        _serviceBridge = Driver.makeBridge();

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

        _testCart = {
            items: [_testItem1],
            quantities: [1]
        }

        _serviceBridge.addStore(_testStore1);
        _serviceBridge.addStore(_testStore2);

        _serviceBridge.addItemToStore(_testStore1, _testItem1);
        _serviceBridge.addItemToStore(_testStore1, _testItem3);
        _serviceBridge.addItemToStore(_testStore2, _testItem2);
    });

    test("Valid insertion, item doesn't exist in cart", () => {
        const {data, error} = _serviceBridge.addToCart(_testCart, _testItem2);
        expect(error).toBeUndefined();
        expect(data).toBeDefined();

        expect(_testCart.items.includes(_testItem2)).toBeTruthy();

        const testItem2Idx = _testCart.items.indexOf(_testItem2);
        expect(_testCart.quantities[testItem2Idx]).toBe(1);
    });

    test("Valid insertion, item isn't in stock",() => {
        const {data, error} = _serviceBridge.addToCart(_testCart, _testItem2);
        expect(data).toBeUndefined();
        expect(error).toBeDefined();

        expect(_testCart.items.includes(_testItem2)).toBeFalsy();

        const testItem2Idx = _testCart.items.indexOf(_testItem2);
        expect(_testCart.quantities[testItem2Idx]).toBeUndefined();
    });

    test("Valid insertion, item already exists in cart", () => {
        _testCart.items = [_testItem1, _testItem2, _testItem3];
        _testCart.quantities = [2, 6, 3];

        const beforeQuantities = _testCart.quantities;

        const {data, error} = _serviceBridge.addToCart(_testCart, _testItem1);
        expect(error).toBeUndefined();
        expect(data).toBeDefined();

        expect(_testCart.items.includes(_testItem1)).toBeTruthy();
        expect(_testCart.items.includes(_testItem2)).toBeTruthy();
        expect(_testCart.items.includes(_testItem3)).toBeTruthy();

        const testItem1Idx = _testCart.items.indexOf(_testItem1);
        const testItem2Idx = _testCart.items.indexOf(_testItem2);
        const testItem3Idx = _testCart.items.indexOf(_testItem3);

        const q1 = _testCart.quantities[testItem1Idx];
        const q2 = _testCart.quantities[testItem2Idx];
        const q3 = _testCart.quantities[testItem3Idx];

        expect(q1).toBe(beforeQuantities[testItem1Idx] + 1);
        expect(q2).toBe(beforeQuantities[testItem2Idx]);
        expect(q3).toBe(beforeQuantities[testItem3Idx]);
    });

});