// import {
//     Bridge,
//     Driver,
//     CATEGORY,
//     Item,
//     Store,
//     CreditCard,
//     Credentials,
//     Discount
// } from "../../src/";
//
//
//
// describe("Guest buy items, UC: 2.8", () => {
//     let _driver = new Driver();
//     let _serviceBridge: Bridge;
//     let _testCreditCard: CreditCard;
//     let _testDiscount: Discount;
//     let _credentials: Credentials;
//     let _testStore1: Store;
//     let _testStore2: Store;
//     let _testItem1: Item;
//     let _testItem2: Item;
//     let _testItem3: Item;
//
//     beforeEach(() => {
//         _serviceBridge = _driver.initWithDefaults().startSession().getBridge();
//
//         _credentials = {userName: "test-name", password: "test-PASS-123"};
//         _serviceBridge.register(_credentials);
//         _serviceBridge.login(_credentials);
//
//         _testItem1 = {
//             id: "test-id1",
//             name: "test-item1",
//             price: 999,
//             description: "lovely-test-item",
//             category: CATEGORY.ELECTRONICS,
//         };
//         _testItem2 = {
//             id: "test-id2",
//             name: "test-item2",
//             price: 999,
//             description: "lovely-test-item",
//             category: CATEGORY.ELECTRONICS,
//         };
//         _testItem3 = {
//             id: "test-id3",
//             name: "test-item3",
//             price: 999,
//             description: "lovely-test-item",
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
//         _testCreditCard = {
//             ownerName: "testName",
//             number: "4242424242424242",
//             expirationMonth: "02",
//             expirationYear: "2030",
//             cvv: 123
//         };
//
//         _testDiscount = {percents: 20, timePeriod: {startTime: new Date(), endTime: new Date()}};
//
//         _serviceBridge.createStore(_testStore1);
//         _serviceBridge.createStore(_testStore2);
//
//         _serviceBridge.addItemToStore(_testStore1, _testItem1);
//         _serviceBridge.addItemToStore(_testStore2, _testItem3);
//
//         _serviceBridge.logout();
//     });
//
//     test("Non empty cart, items in stock, no discount",() => {
//         _serviceBridge.addToCart(_testItem1);
//         const {data, error} = _serviceBridge.checkout(_testCreditCard);
//         expect(data).toBeDefined();
//         expect(error).toBeUndefined();
//
//         const {transaction, receiptId} = data;
//         expect(receiptId.length > 0).toBeTruthy();
//         expect(transaction.ccHoldName).toEqual(_testCreditCard.ownerName);
//         expect(transaction.amountCharged).toEqual(_testItem1.price);
//
//         const start = _testCreditCard.number.length - 4;
//         const last4 = _testCreditCard.number.substring(start);
//         expect(transaction.ccLast4).toEqual(last4);
//     });
//
//     test("Non empty cart, items not in stock, no discount",() => {
//         _serviceBridge.addToCart(_testItem2);
//         const {data, error} = _serviceBridge.checkout(_testCreditCard);
//         expect(error).toBeDefined();
//         expect(data).toBeUndefined();
//     });
//
//     test("Non empty cart, items in stock, with discount" ,() => {
//         _serviceBridge.register(_credentials);
//         _serviceBridge.login(_credentials);
//
//         const originPrice = _testItem1.price;
//         const discount = (originPrice * _testDiscount.percents) / 100;
//         const priceAfterDiscount = originPrice - discount;
//
//         _serviceBridge.setDiscountToStore(_testStore1, _testDiscount);
//         _serviceBridge.logout();
//         _serviceBridge.addToCart(_testItem1);
//
//         const {data, error} = _serviceBridge.checkout(_testCreditCard);
//         expect(data).toBeDefined();
//         expect(error).toBeUndefined();
//
//         const {transaction, receiptId} = data;
//         expect(receiptId.length > 0).toBeTruthy();
//         expect(transaction.ccHoldName).toEqual(_testCreditCard.ownerName);
//         expect(transaction.amountCharged).toEqual(priceAfterDiscount);
//
//         const start = _testCreditCard.number.length - 4;
//         const last4 = _testCreditCard.number.substring(start);
//         expect(transaction.ccLast4).toEqual(last4);
//     });
//
// });