// import { Bridge, Driver } from "../../src/";
// import { Store, Credentials } from "../../src/test_env/types";

// describe("Add Remove Edit Products, UC: 3.2", () => {
//   let _serviceBridge: Bridge;
//   let _storeInformation: Store;
//   let _credentials: Credentials;

//   beforeEach(() => {
//     _serviceBridge = Driver.makeBridge();
//     _storeInformation = {
//       name: "some-mock-store",
//       description: "selling cool items",
//       id: "id.stores.boom",
//     };
//     _credentials = { userName: "ron", password: "ronpwd" };
//   });

//   test("Add Store Owner - Happy Path: new user new store", () => {
    
//     _serviceBridge.register(_credentials);
    
//     const res = _serviceBridge.login(_credentials);
//     const { asssigned } = _serviceBridge.addStoreOwner(res.data.id).data;
//     expect(asssigned).toBe(true);
//   });

  

//   test("Add Owner - Sad Path: not logged in user", () => {
//     _serviceBridge.register(_credentials);
//     _serviceBridge.logout();
//     const { error } = _serviceBridge.addStoreOwner({
//       username: _credentials.userName,
//     });
//     expect(error).toBeDefined();
//   });
// });
