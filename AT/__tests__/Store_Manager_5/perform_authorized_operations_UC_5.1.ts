// import {Bridge, Driver, Store, Credentials, Item, CATEGORY, PERMISSION} from "../../src/";
//
// describe("Perform authorized operations, UC: 5.1", () => {
//     let _serviceBridge: Bridge;
//     let _testDiscount;
//     let _testItem: Item;
//     let _testStore: Store;
//     let _storeOwnerCredentials: Credentials;
//     let _storeManagerCredentials: Credentials;
//
//     beforeEach(() => {
//         _serviceBridge = Driver.makeBridge();
//         _testItem = {
//             id: 123,
//             catalogNumber: 789,
//         };
//         _testStore = {
//             name: "some-mock-store",
//         };
//
//         const date = new Date();
//         const dateTomorrow = new Date(date.getDate() + 1);
//         _testDiscount = {percents: 20, timePeriod: {startTime: date, endTime: dateTomorrow}};
//
//         _storeOwnerCredentials = {userName: "test-store-owner", password: "ronPwd123"};
//         _serviceBridge.register(_storeOwnerCredentials);
//         _serviceBridge.login(_storeOwnerCredentials);
//         _serviceBridge.createStore(_testStore);
//         _serviceBridge.addItemToStore(_testStore, _testItem);
//
//         _serviceBridge.logout();
//         _serviceBridge.register(_storeManagerCredentials);
//         _serviceBridge.login(_storeOwnerCredentials);
//
//         _serviceBridge.assignManager(_testStore, _storeManagerCredentials);
//     });
//
//     test("Act, no permissions", () => {
//         _serviceBridge.logout() // Owner signs out
//         _serviceBridge.login(_storeManagerCredentials); // Manager is logged in
//
//         const {data, error} = _serviceBridge.setDiscountToStore(_testStore, _testDiscount);
//         expect(data).toBeUndefined();
//         expect(error).toBeDefined();
//     });
//
//     test("Act, with permissions", () => {
//         _serviceBridge.grantPermission(_storeManagerCredentials, PERMISSION.SET_DISCOUNT);
//         _serviceBridge.logout() // Owner signs out
//         _serviceBridge.login(_storeManagerCredentials); // Manager is logged in
//
//         const {data, error} = _serviceBridge.setDiscountToStore(_testStore, _testDiscount);
//         expect(error).toBeUndefined();
//         expect(data).toBeDefined();
//     });
// });
