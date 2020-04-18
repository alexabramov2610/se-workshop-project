// import {Bridge, CATEGORY, Driver, Store, Credentials, Item, CreditCard} from "../../src";

// describe("Watch Purchases History, UC: 3.7", () => {
//   let _serviceBridge: Bridge;
//   let _testCreditCard: CreditCard;
//   let _storeInformation: Store;
//   let _credentials: Credentials;
//   let _item: Item;

//   beforeEach(() => {
//     _serviceBridge = Driver.makeBridge();
//     _storeInformation = {
//       name: "some-mock-store",
//       description: "selling cool items",
//       id: "id.stores.boom",
//     };
//     _credentials = { userName: "ron", password: "ronpwd" };
//     _item = {
//       id: "some-id",
//       name: "some-name",
//       category: CATEGORY.ELECTRONICS,
//       description: "some-desc",
//       price: 999,
//     };
//     _testCreditCard = {
//       ownerName: "testName",
//       number: "4242424242424242",
//       expirationMonth: "02",
//       expirationYear: "2030",
//       cvv: 123
//     };
//   });

//   test("Happy Path: logged in user with history", () => {
//     _serviceBridge.register(_credentials);
//     _serviceBridge.login(_credentials);
//     _serviceBridge.addToCart(_item);
//     const { receiptId: receiptId } = _serviceBridge.checkout(_testCreditCard).data;
//     const latestBuy = _serviceBridge
//       .getPurchaseHistory()
//       .data.puchases.filter((p) => p.recieptId === receiptId)[0];
//     expect(latestBuy.recieptId).toBe(receiptId);
//   });

//   test("Happy Path: logged in user no history", () => {
//     _serviceBridge.register(_credentials);
//     _serviceBridge.login(_credentials);
//     const { purchases: purchases } = _serviceBridge.getPurchaseHistory().data;
//     expect(purchases.length).toBe(0);
//   });

//   test("Sad Path: not-logged in user", () => {
//     const error = _serviceBridge.getPurchaseHistory().error;
//     expect(error).toBeDefined();
//   });
// });
