// import {
//     Bridge,
//     Driver,
//     CATEGORY,
//     Item,
//     Store, Credentials,
// } from "../../src/";
//
//
//
// describe("Guest watch cart, UC: 2.7", () => {
//     let _serviceBridge: Bridge;
//     let _credentials: Credentials;
//     let _testStore1: Store;
//     let _testStore2: Store;
//     let _testItem1: Item;
//     let _testItem2: Item;
//     let _testItem3: Item;
//
//     beforeEach(() => {
//         _serviceBridge = Driver.makeBridge();
//
//         _credentials = {userName: "testUsername", password: "testPassword"};
//         _serviceBridge.register(_credentials);
//         _serviceBridge.login(_credentials);
//
//         _testItem1 = {
//             id: "test-id1",
//             name: "test-item1",
//             price: 999,
//             description: "lovely-test-store",
//             category: CATEGORY.ELECTRONICS,
//         };
//         _testItem2 = {
//             id: "test-id2",
//             name: "test-item2",
//             price: 999,
//             description: "lovely-test-store",
//             category: CATEGORY.ELECTRONICS,
//         };
//         _testItem3 = {
//             id: "test-id3",
//             name: "test-item3",
//             price: 999,
//             description: "lovely-test-store",
//             category: CATEGORY.CLOTHING,
//         };
//
//         _testStore1 = {
//             id: "test-store-id1",
//             name: "test-store1",
//             description: "lovely-test-store"
//         };
//         _testStore2 = {
//             id: "test-store-id2",
//             name: "test-store2",
//             description: "lovely-test-store"
//         };
//
//         _serviceBridge.createStore(_testStore1);
//         _serviceBridge.createStore(_testStore2);
//
//         _serviceBridge.addItemToStore(_testStore1, _testItem1);
//         _serviceBridge.addItemToStore(_testStore1, _testItem3);
//         _serviceBridge.addItemToStore(_testStore2, _testItem2);
//
//         _serviceBridge.logout();
//     });
//
//     test("Non empty cart", () => {
//         _serviceBridge.addToCart(_testItem2);
//
//         const {data, error} = _serviceBridge.watchCart();
//         expect(error).toBeUndefined();
//         expect(data).toBeDefined();
//
//         const {cart} = data;
//         expect(cart).toBeDefined();
//         expect(cart.items.includes(_testItem2)).toBeTruthy();
//
//         const testItem2Idx = cart.items.indexOf(_testItem2);
//         expect(cart.quantities[testItem2Idx]).toBe(1);
//     });
//
//     test("Empty cart", () => {
//         const {data, error} = _serviceBridge.watchCart();
//         expect(error).toBeUndefined();
//         expect(data).toBeDefined();
//
//         const {cart} = data;
//         expect(cart).toBeDefined();
//         expect(cart.items.length === 0).toBeTruthy();
//         expect(cart.quantities.length === 0).toBeTruthy();
//     });
// });