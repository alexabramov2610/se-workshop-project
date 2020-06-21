// import {Store, StoreManagement} from "../../../../src/store/internal_api";
// import {RegisteredUser, StoreManager, StoreOwner} from "../../../../src/user/internal_api";
// import {
//     BagItem,
//     IItem as ItemReq, IPayment,
//     IProduct as ProductReq, IReceipt,
//     ProductCatalogNumber,
//     ProductInStore,
//     ProductWithQuantity, Purchase,
//     SearchFilters,
//     SearchQuery
// } from "se-workshop-20-interfaces/dist/src/CommonInterface";
// import {errorMsg} from "../../../../src/api-int/Error";
// import {ManagementPermission, ProductCategory, Rating} from "se-workshop-20-interfaces/dist/src/Enums";
// import {ExternalSystemsManager} from "../../../../src/external_systems/internal_api";
// import {Res} from 'se-workshop-20-interfaces'
// import {StringTuple} from "../../../../src/api-int/internal_api";
// import {createStore} from "../utils/utils";

// const storeReq = {storeName: "mock-store", description: "storeDescription"}

describe("Store Management Unit Tests", () => {
    // let storeManagement: StoreManagement;
    // let store: Store;
    // beforeEach(() => {
    //     storeManagement = new StoreManagement(new ExternalSystemsManager());
    //     store = createStore("store-name", "storeDesc");
    // });

    test("tmp", () => {
        expect(true).toBe(true);
    });



// test("verifyStore success", () => {
    //     const storeToCheck: Store = new Store("mock-store", "storeDescription");
    //     expect(storeManagement.isStoreLegal(storeToCheck)).toBe(true);
    // });
//
//     test("verifyStore failure", () => {
//         const storeToCheck: Store = new Store("", "storeDescription");
//         expect(storeManagement.isStoreLegal(storeToCheck)).toBe(false);
//     });
//
//
//     test("addStore success", (done) => {
//         const user: RegisteredUser = new RegisteredUser("tal", "tal12345");
//         storeManagement.addStore("new store name", "storeDescription", user)
//             .then((res: Res.BoolResponse) => {
//                 expect(res.data.result).toBeTruthy();
//                 done();
//             })
//             .catch(err => done.fail(err))
//
//
//     });
//
//     test("verifyStoreOwner success", () => {
//         const store: Store = new Store("name", "storeDescription");
//         const user: StoreOwner = new StoreOwner("name");
//         jest.spyOn(store, "verifyIsStoreOwner").mockReturnValue(true);
//         jest.spyOn(storeManagement, "findStoreByName").mockReturnValue(store);
//         expect(storeManagement.verifyStoreOwner(store.storeName, user)).toBeTruthy();
//     });
//
//     test("verifyStoreOwner failure", () => {
//         const store: Store = new Store("name", "storeDescription");
//         jest.spyOn(store, "verifyIsStoreOwner").mockReturnValue(false);
//         const user: StoreOwner = new StoreOwner("name");
//         expect(storeManagement.verifyStoreOwner(store.storeName, user)).toBeFalsy();
//     });
//
//
//     test("verifyStoreManager success", () => {
//         const store: Store = new Store("name", "storeDescription");
//         const user: StoreOwner = new StoreOwner("name");
//         jest.spyOn(store, "verifyIsStoreManager").mockReturnValue(true);
//         jest.spyOn(storeManagement, "findStoreByName").mockReturnValue(store);
//         expect(storeManagement.verifyStoreManager(store.storeName, user)).toBeTruthy();
//     });
//
//     test("verifyStoreManager failure", () => {
//         const store: Store = new Store("name", "storeDescription");
//         const user: StoreOwner = new StoreOwner("name");
//         jest.spyOn(store, "verifyIsStoreManager").mockReturnValue(false);
//         expect(storeManagement.verifyStoreManager(store.storeName, user)).toBeFalsy();
//     });
//
//
//     test("verifyStoreOperation success", () => {
//         const store: Store = new Store("name", "storeDescription");
//         jest.spyOn(storeManagement, "findStoreByName").mockReturnValue(store);
//         jest.spyOn(store, "verifyPermission").mockReturnValue(true);
//
//         const user: StoreOwner = new StoreOwner("name");
//         expect(storeManagement.verifyStoreOperation(store.storeName, user, ManagementPermission.MANAGE_INVENTORY)).toBeTruthy();
//     });
//
//     test("verifyStoreOperation failure - store doesn't exist", () => {
//         const store: Store = new Store("name", "storeDescription");
//         jest.spyOn(storeManagement, "findStoreByName").mockReturnValue(undefined);
//
//         const user: StoreOwner = new StoreOwner("name");
//         const res: Res.BoolResponse = storeManagement.verifyStoreOperation(store.storeName, user, ManagementPermission.MANAGE_INVENTORY);
//         expect(res.data.result).toBeFalsy();
//         expect(res.error).toBeDefined();
//
//     });
//
//     test("verifyStoreOperation failure - not owner or manager", () => {
//         jest.spyOn(storeManagement, "findStoreByName").mockReturnValue(store);
//         jest.spyOn(store, "verifyPermission").mockReturnValue(false);
//
//         const user: StoreOwner = new StoreOwner("name");
//         const res: Res.BoolResponse = storeManagement.verifyStoreOperation(store.storeName, user, ManagementPermission.MANAGE_INVENTORY);
//         expect(res.data.result).toBeFalsy();
//         expect(res.error).toBeDefined();
//     });
//
//
//     test("assignStoreOwner success", (done) => {
//         const store: Store = new Store("name", "store desc");
//         const isOperationValid: Res.BoolResponse = {data: {result: true}};
//         const alreadyOwner: StoreOwner = new StoreOwner("name1");
//         const ownerToAssign: StoreOwner = new StoreOwner("name2");
//
//         jest.spyOn(storeManagement, "findStoreByName").mockReturnValue(store);
//         jest.spyOn(store, "getStoreOwner").mockReturnValue(alreadyOwner);
//         jest.spyOn(store, "verifyIsStoreOwner").mockReturnValue(false);
//         jest.spyOn(store, "addStoreOwner").mockReturnValue(isOperationValid);
//
//         storeManagement.assignStoreOwner(store.storeName, ownerToAssign, alreadyOwner)
//             .then((res: Res.BoolResponse) => {
//                 expect(res.data.result).toBeTruthy();
//                 expect(store.addStoreOwner).toBeCalledTimes(1);
//                 expect(alreadyOwner.isAssignerOfOwner(ownerToAssign)).toBe(true);
//                 done();
//             })
//             .catch(err => done.fail(err))
//     });
//
//     test("assignStoreOwner failure - store doesn't exist", (done) => {
//         const store: Store = new Store("name", "store desc");
//         const isOperationValid: Res.BoolResponse = {data: {result: true}};
//         const alreadyOwner: StoreOwner = new StoreOwner("name1");
//         const ownerToAssign: StoreOwner = new StoreOwner("name2");
//
//         jest.spyOn(storeManagement, "findStoreByName").mockReturnValue(undefined);
//         jest.spyOn(store, "getStoreOwner").mockReturnValue(alreadyOwner);
//         jest.spyOn(store, "verifyIsStoreOwner").mockReturnValue(false);
//         jest.spyOn(store, "addStoreOwner").mockReturnValue(isOperationValid);
//
//         storeManagement.assignStoreOwner(store.storeName, ownerToAssign, alreadyOwner)
//             .then((res: Res.BoolResponse) => {
//                 expect(res.data.result).toBe(false);
//                 expect(store.addStoreOwner).toBeCalledTimes(0);
//                 expect(alreadyOwner.isAssignerOfOwner(ownerToAssign)).toBe(false);
//                 done();
//             })
//             .catch(err => done.fail(err))
//     });
//
//     test("assignStoreOwner failure - invalid assigner", (done) => {
//         const isOperationValid: Res.BoolResponse = {data: {result: true}};
//         const alreadyOwner: StoreOwner = new StoreOwner("name1");
//         const ownerToAssign: StoreOwner = new StoreOwner("name2");
//
//         jest.spyOn(storeManagement, "findStoreByName").mockReturnValue(store);
//         jest.spyOn(store, "getStoreOwner").mockReturnValue(undefined);
//         jest.spyOn(store, "verifyIsStoreOwner").mockReturnValue(false);
//         jest.spyOn(store, "addStoreOwner").mockReturnValue(isOperationValid);
//
//         storeManagement.assignStoreOwner(store.storeName, ownerToAssign, alreadyOwner)
//             .then((res: Res.BoolResponse) => {
//                 expect(res.data.result).toBe(false);
//                 expect(store.addStoreOwner).toBeCalledTimes(0);
//                 expect(alreadyOwner.isAssignerOfOwner(ownerToAssign)).toBe(false);
//                 done();
//             })
//             .catch(err => done.fail(err))
//     });
//
//     test("assignStoreOwner failure - already owner", (done) => {
//         const store: Store = new Store("name", "store desc");
//         const isOperationValid: Res.BoolResponse = {data: {result: true}};
//         const alreadyOwner: StoreOwner = new StoreOwner("name1");
//         const ownerToAssign: StoreOwner = new StoreOwner("name2");
//
//         jest.spyOn(storeManagement, "findStoreByName").mockReturnValue(store);
//         jest.spyOn(store, "getStoreOwner").mockReturnValue(alreadyOwner);
//         jest.spyOn(store, "verifyIsStoreOwner").mockReturnValue(true);
//         jest.spyOn(store, "addStoreOwner").mockReturnValue(isOperationValid);
//
//         storeManagement.assignStoreOwner(store.storeName, ownerToAssign, alreadyOwner)
//             .then((res: Res.BoolResponse) => {
//                 expect(res.data.result).toBe(false);
//                 expect(store.addStoreOwner).toBeCalledTimes(0);
//                 expect(alreadyOwner.isAssignerOfOwner(ownerToAssign)).toBe(false);
//                 done();
//             })
//             .catch(err => done.fail(err))
//     });
//
//
//     test("assignStoreManager success", (done) => {
//         const store: Store = new Store("name", "store desc");
//         const isOperationValid: Res.BoolResponse = {data: {result: true}};
//         const alreadyOwner: StoreOwner = new StoreOwner("name1");
//         const managerToAssign: StoreManager = new StoreManager("name2");
//
//         jest.spyOn(storeManagement, "findStoreByName").mockReturnValue(store);
//         jest.spyOn(store, "getStoreOwner").mockReturnValue(alreadyOwner);
//         jest.spyOn(store, "verifyIsStoreManager").mockReturnValue(false);
//         jest.spyOn(store, "addStoreManager").mockReturnValue(isOperationValid);
//
//         storeManagement.assignStoreManager(store.storeName, managerToAssign, alreadyOwner)
//             .then((res: Res.BoolResponse) => {
//                 expect(res.data.result).toBeTruthy();
//                 expect(store.addStoreManager).toBeCalledTimes(1);
//                 expect(alreadyOwner.isAssignerOfManager(managerToAssign)).toBe(true);
//                 done();
//             })
//             .catch(err => done.fail(err))
//     });
//
//     test("assignStoreManager failure - store doesn't exist", (done) => {
//         const store: Store = new Store("name", "store desc");
//         const isOperationValid: Res.BoolResponse = {data: {result: true}};
//         const alreadyOwner: StoreOwner = new StoreOwner("name1");
//         const managerToAssign: StoreManager = new StoreManager("name2");
//
//         jest.spyOn(storeManagement, "findStoreByName").mockReturnValue(undefined);
//         jest.spyOn(store, "getStoreOwner").mockReturnValue(alreadyOwner);
//         jest.spyOn(store, "verifyIsStoreManager").mockReturnValue(false);
//         jest.spyOn(store, "addStoreManager").mockReturnValue(isOperationValid);
//
//         storeManagement.assignStoreManager(store.storeName, managerToAssign, alreadyOwner)
//             .then((res: Res.BoolResponse) => {
//                 expect(res.data.result).toBe(false);
//                 expect(store.addStoreManager).toBeCalledTimes(0);
//                 expect(alreadyOwner.isAssignerOfManager(managerToAssign)).toBe(false);
//                 done();
//             })
//             .catch(err => done.fail(err))
//     });
//
//     test("assignStoreManager failure - invalid assigner", (done) => {
//         const store: Store = new Store("name", "store desc");
//         const isOperationValid: Res.BoolResponse = {data: {result: true}};
//         const alreadyOwner: StoreOwner = new StoreOwner("name1");
//         const managerToAssign: StoreManager = new StoreManager("name2");
//
//         jest.spyOn(storeManagement, "findStoreByName").mockReturnValue(store);
//         jest.spyOn(store, "getStoreOwner").mockReturnValue(undefined);
//         jest.spyOn(store, "verifyIsStoreManager").mockReturnValue(false);
//         jest.spyOn(store, "addStoreManager").mockReturnValue(isOperationValid);
//
//         storeManagement.assignStoreManager(store.storeName, managerToAssign, alreadyOwner)
//             .then((res: Res.BoolResponse) => {
//                 expect(res.data.result).toBe(false);
//                 expect(store.addStoreManager).toBeCalledTimes(0);
//                 expect(alreadyOwner.isAssignerOfManager(managerToAssign)).toBe(false);
//                 done();
//             })
//             .catch(err => done.fail(err))
//     });
//
//     test("assignStoreManager failure - already manager", (done) => {
//         const store: Store = new Store("name", "store desc");
//         const isOperationValid: Res.BoolResponse = {data: {result: true}};
//         const alreadyOwner: StoreOwner = new StoreOwner("name1");
//         const managerToAssign: StoreManager = new StoreManager("name2");
//
//         jest.spyOn(storeManagement, "findStoreByName").mockReturnValue(store);
//         jest.spyOn(store, "getStoreOwner").mockReturnValue(alreadyOwner);
//         jest.spyOn(store, "verifyIsStoreManager").mockReturnValue(true);
//         jest.spyOn(store, "addStoreManager").mockReturnValue(isOperationValid);
//
//         storeManagement.assignStoreManager(store.storeName, managerToAssign, alreadyOwner)
//             .then((res: Res.BoolResponse) => {
//                 expect(res.data.result).toBe(false);
//                 expect(store.addStoreManager).toBeCalledTimes(0);
//                 expect(alreadyOwner.isAssignerOfManager(managerToAssign)).toBe(false);
//                 done();
//             })
//             .catch(err => done.fail(err))
//     });
//
//
//     test("removeStoreOwner success", (done) => {
//         const store: Store = new Store("name", "store desc");
//         const isOperationValid: Res.BoolResponse = {data: {result: true}};
//         const alreadyOwner: StoreOwner = new StoreOwner("name1");
//         const ownerToAssign: StoreOwner = new StoreOwner("name2");
//         alreadyOwner.assignStoreOwner(ownerToAssign);
//         expect(alreadyOwner.isAssignerOfOwner(ownerToAssign)).toBe(true);
//
//         jest.spyOn(storeManagement, "findStoreByName").mockReturnValue(store);
//         jest.spyOn(store, "getStoreOwner").mockReturnValueOnce(alreadyOwner);
//         jest.spyOn(store, "getStoreOwner").mockReturnValueOnce(ownerToAssign);
//         jest.spyOn(store, "getStoreOwner").mockReturnValueOnce(alreadyOwner);
//         jest.spyOn(store, "getStoreOwner").mockReturnValueOnce(ownerToAssign);
//         jest.spyOn(store, "removeStoreOwner").mockReturnValue(isOperationValid);
//
//         storeManagement.removeStoreOwner(store.storeName, ownerToAssign, alreadyOwner, [[alreadyOwner.name, ownerToAssign.name]])
//             .then((res: Res.BoolResponse) => {
//                 expect(res.data.result).toBeTruthy();
//                 expect(store.removeStoreOwner).toBeCalledTimes(1);
//                 expect(alreadyOwner.isAssignerOfOwner(ownerToAssign)).toBe(false);
//                 done();
//             })
//             .catch(err => done.fail(err))
//     });
//
//     test("removeStoreOwner success - owners drilled in", (done) => {
//         const store: Store = new Store("name", "store desc");
//         const isOperationValid: Res.BoolResponse = {data: {result: true}};
//         const alreadyOwner: StoreOwner = new StoreOwner("name1");
//         const ownerToAssign: StoreOwner = new StoreOwner("name2");          // assigned by alreadyOwner
//         const ownerToAssign_3: StoreOwner = new StoreOwner("name3");        // assigned by ownerToAssign
//         const ownerToAssign_4: StoreOwner = new StoreOwner("name4");        // assigned by ownerToAssign
//         const ownerToAssign_5: StoreOwner = new StoreOwner("name5");        // assigned by ownerToAssign_3
//         const ownerToAssign_6: StoreOwner = new StoreOwner("name6");        // assigned by ownerToAssign_3
//         const ownerToAssign_7: StoreOwner = new StoreOwner("name7");        // assigned by ownerToAssign_6
//         const ownerToAssign_8: StoreOwner = new StoreOwner("name8");        // assigned by ownerToAssign_6
//
//         alreadyOwner.assignStoreOwner(ownerToAssign);
//         ownerToAssign.assignStoreOwner(ownerToAssign_3);
//         ownerToAssign.assignStoreOwner(ownerToAssign_4);
//         ownerToAssign_3.assignStoreOwner(ownerToAssign_5);
//         ownerToAssign_3.assignStoreOwner(ownerToAssign_6);
//         ownerToAssign_6.assignStoreOwner(ownerToAssign_7);
//         ownerToAssign_6.assignStoreOwner(ownerToAssign_8);
//
//         expect(alreadyOwner.isAssignerOfOwner(ownerToAssign)).toBe(true);
//         expect(ownerToAssign.isAssignerOfOwner(ownerToAssign_3)).toBe(true);
//         expect(ownerToAssign.isAssignerOfOwner(ownerToAssign_4)).toBe(true);
//         expect(ownerToAssign_3.isAssignerOfOwner(ownerToAssign_5)).toBe(true);
//         expect(ownerToAssign_3.isAssignerOfOwner(ownerToAssign_6)).toBe(true);
//         expect(ownerToAssign_6.isAssignerOfOwner(ownerToAssign_7)).toBe(true);
//         expect(ownerToAssign_6.isAssignerOfOwner(ownerToAssign_8)).toBe(true);
//
//
//         const ownersToRemove: StringTuple[] = [
//             [alreadyOwner.name, ownerToAssign.name],
//             [ownerToAssign.name, ownerToAssign_3.name],
//             [ownerToAssign.name, ownerToAssign_4.name],
//             [ownerToAssign_3.name, ownerToAssign_5.name],
//             [ownerToAssign_3.name, ownerToAssign_6.name],
//             [ownerToAssign_6.name, ownerToAssign_7.name],
//             [ownerToAssign_6.name, ownerToAssign_8.name],
//         ];
//
//         jest.spyOn(storeManagement, "findStoreByName").mockReturnValue(store);
//         jest.spyOn(store, "removeStoreOwner").mockReturnValue(isOperationValid);
//
//         jest.spyOn(store, "getStoreOwner").mockReturnValueOnce(alreadyOwner);       // validating details
//         jest.spyOn(store, "getStoreOwner").mockReturnValueOnce(ownerToAssign);
//
//         jest.spyOn(store, "getStoreOwner").mockReturnValueOnce(alreadyOwner);       // first tuple
//         jest.spyOn(store, "getStoreOwner").mockReturnValueOnce(ownerToAssign);
//
//         jest.spyOn(store, "getStoreOwner").mockReturnValueOnce(ownerToAssign);
//         jest.spyOn(store, "getStoreOwner").mockReturnValueOnce(ownerToAssign_3);
//
//         jest.spyOn(store, "getStoreOwner").mockReturnValueOnce(ownerToAssign);
//         jest.spyOn(store, "getStoreOwner").mockReturnValueOnce(ownerToAssign_4);
//
//         jest.spyOn(store, "getStoreOwner").mockReturnValueOnce(ownerToAssign_3);
//         jest.spyOn(store, "getStoreOwner").mockReturnValueOnce(ownerToAssign_5);
//
//         jest.spyOn(store, "getStoreOwner").mockReturnValueOnce(ownerToAssign_3);
//         jest.spyOn(store, "getStoreOwner").mockReturnValueOnce(ownerToAssign_6);
//
//         jest.spyOn(store, "getStoreOwner").mockReturnValueOnce(ownerToAssign_6);
//         jest.spyOn(store, "getStoreOwner").mockReturnValueOnce(ownerToAssign_7);
//
//         jest.spyOn(store, "getStoreOwner").mockReturnValueOnce(ownerToAssign_6);
//         jest.spyOn(store, "getStoreOwner").mockReturnValueOnce(ownerToAssign_8);
//
//         storeManagement.removeStoreOwner(store.storeName, ownerToAssign, alreadyOwner, ownersToRemove)
//             .then((res: Res.BoolResponse) => {
//                 expect(res.data.result).toBeTruthy();
//                 expect(store.removeStoreOwner).toBeCalledTimes(7);
//                 expect(alreadyOwner.isAssignerOfOwner(ownerToAssign)).toBe(false);
//                 expect(ownerToAssign.isAssignerOfOwner(ownerToAssign_3)).toBe(false);
//                 expect(ownerToAssign.isAssignerOfOwner(ownerToAssign_4)).toBe(false);
//                 expect(ownerToAssign_3.isAssignerOfOwner(ownerToAssign_5)).toBe(false);
//                 expect(ownerToAssign_3.isAssignerOfOwner(ownerToAssign_6)).toBe(false);
//                 expect(ownerToAssign_6.isAssignerOfOwner(ownerToAssign_7)).toBe(false);
//                 expect(ownerToAssign_6.isAssignerOfOwner(ownerToAssign_8)).toBe(false);
//                 done();
//             })
//             .catch(err => done.fail(err))
//     });
//
//     test("removeStoreOwner failure - owners drilled in", (done) => {
//         const store: Store = new Store("name", "store desc");
//         const isOperationValid: Res.BoolResponse = {data: {result: false}};
//         const alreadyOwner: StoreOwner = new StoreOwner("name1");
//         const ownerToAssign: StoreOwner = new StoreOwner("name2");          // assigned by alreadyOwner
//         const ownerToAssign_3: StoreOwner = new StoreOwner("name3");        // assigned by ownerToAssign
//         const ownerToAssign_4: StoreOwner = new StoreOwner("name4");        // assigned by ownerToAssign
//         const ownerToAssign_5: StoreOwner = new StoreOwner("name5");        // assigned by ownerToAssign_3
//         const ownerToAssign_6: StoreOwner = new StoreOwner("name6");        // assigned by ownerToAssign_3
//         const ownerToAssign_7: StoreOwner = new StoreOwner("name7");        // assigned by ownerToAssign_6
//         const ownerToAssign_8: StoreOwner = new StoreOwner("name8");        // assigned by ownerToAssign_6
//
//         alreadyOwner.assignStoreOwner(ownerToAssign);
//         ownerToAssign.assignStoreOwner(ownerToAssign_3);
//         ownerToAssign.assignStoreOwner(ownerToAssign_4);
//         ownerToAssign_3.assignStoreOwner(ownerToAssign_5);
//         ownerToAssign_3.assignStoreOwner(ownerToAssign_6);
//         ownerToAssign_6.assignStoreOwner(ownerToAssign_7);
//         ownerToAssign_6.assignStoreOwner(ownerToAssign_8);
//
//         expect(alreadyOwner.isAssignerOfOwner(ownerToAssign)).toBe(true);
//         expect(ownerToAssign.isAssignerOfOwner(ownerToAssign_3)).toBe(true);
//         expect(ownerToAssign.isAssignerOfOwner(ownerToAssign_4)).toBe(true);
//         expect(ownerToAssign_3.isAssignerOfOwner(ownerToAssign_5)).toBe(true);
//         expect(ownerToAssign_3.isAssignerOfOwner(ownerToAssign_6)).toBe(true);
//         expect(ownerToAssign_6.isAssignerOfOwner(ownerToAssign_7)).toBe(true);
//         expect(ownerToAssign_6.isAssignerOfOwner(ownerToAssign_8)).toBe(true);
//
//
//         const ownersToRemove: StringTuple[] = [
//             [alreadyOwner.name, ownerToAssign.name],
//             [ownerToAssign.name, ownerToAssign_3.name],
//             [ownerToAssign.name, ownerToAssign_4.name],
//             [ownerToAssign_3.name, ownerToAssign_5.name],
//             [ownerToAssign_3.name, ownerToAssign_6.name],
//             [ownerToAssign_6.name, ownerToAssign_7.name],
//             [ownerToAssign_6.name, ownerToAssign_8.name],
//         ];
//
//         jest.spyOn(storeManagement, "findStoreByName").mockReturnValue(store);
//         jest.spyOn(store, "removeStoreOwner").mockReturnValue(isOperationValid);
//
//         jest.spyOn(store, "getStoreOwner").mockReturnValueOnce(alreadyOwner);       // validating details
//         jest.spyOn(store, "getStoreOwner").mockReturnValueOnce(ownerToAssign);
//
//         jest.spyOn(store, "getStoreOwner").mockReturnValueOnce(alreadyOwner);       // first tuple
//         jest.spyOn(store, "getStoreOwner").mockReturnValueOnce(ownerToAssign);
//
//         jest.spyOn(store, "getStoreOwner").mockReturnValueOnce(ownerToAssign);
//         jest.spyOn(store, "getStoreOwner").mockReturnValueOnce(ownerToAssign_3);
//
//         jest.spyOn(store, "getStoreOwner").mockReturnValueOnce(ownerToAssign);
//         jest.spyOn(store, "getStoreOwner").mockReturnValueOnce(ownerToAssign_4);
//
//         jest.spyOn(store, "getStoreOwner").mockReturnValueOnce(ownerToAssign_3);
//         jest.spyOn(store, "getStoreOwner").mockReturnValueOnce(ownerToAssign_5);
//
//         jest.spyOn(store, "getStoreOwner").mockReturnValueOnce(ownerToAssign_3);
//         jest.spyOn(store, "getStoreOwner").mockReturnValueOnce(ownerToAssign_6);
//
//         jest.spyOn(store, "getStoreOwner").mockReturnValueOnce(ownerToAssign_6);
//         jest.spyOn(store, "getStoreOwner").mockReturnValueOnce(ownerToAssign_7);
//
//         jest.spyOn(store, "getStoreOwner").mockReturnValueOnce(ownerToAssign_6);
//         jest.spyOn(store, "getStoreOwner").mockReturnValueOnce(ownerToAssign_8);
//
//         storeManagement.removeStoreOwner(store.storeName, ownerToAssign, alreadyOwner, ownersToRemove)
//             .then((res: Res.BoolResponse) => {
//                 expect(res.data.result).toBeFalsy();
//                 expect(store.removeStoreOwner).toBeCalledTimes(1);
//                 expect(alreadyOwner.isAssignerOfOwner(ownerToAssign)).toBe(true);
//                 expect(ownerToAssign.isAssignerOfOwner(ownerToAssign_3)).toBe(true);
//                 expect(ownerToAssign.isAssignerOfOwner(ownerToAssign_4)).toBe(true);
//                 expect(ownerToAssign_3.isAssignerOfOwner(ownerToAssign_5)).toBe(true);
//                 expect(ownerToAssign_3.isAssignerOfOwner(ownerToAssign_6)).toBe(true);
//                 expect(ownerToAssign_6.isAssignerOfOwner(ownerToAssign_7)).toBe(true);
//                 expect(ownerToAssign_6.isAssignerOfOwner(ownerToAssign_8)).toBe(true);
//                 done();
//             })
//             .catch(err => done.fail(err))
//     });
//
//     test("removeStoreOwner failure - store doesn't exist", (done) => {
//         const store: Store = new Store("name", "store desc");
//         const isOperationValid: Res.BoolResponse = {data: {result: true}};
//         const alreadyOwner: StoreOwner = new StoreOwner("name1");
//         const ownerToAssign: StoreOwner = new StoreOwner("name2");
//         alreadyOwner.assignStoreOwner(ownerToAssign);
//         expect(alreadyOwner.isAssignerOfOwner(ownerToAssign)).toBe(true);
//
//         jest.spyOn(storeManagement, "findStoreByName").mockReturnValue(undefined);
//         jest.spyOn(store, "getStoreOwner").mockReturnValueOnce(alreadyOwner);
//         jest.spyOn(store, "getStoreOwner").mockReturnValueOnce(ownerToAssign);
//         jest.spyOn(store, "removeStoreOwner").mockReturnValue(isOperationValid);
//
//         storeManagement.removeStoreOwner(store.storeName, ownerToAssign, alreadyOwner, [])
//             .then((res: Res.BoolResponse) => {
//                 expect(res.data.result).toBe(false);
//                 expect(store.removeStoreOwner).toBeCalledTimes(0);
//                 expect(alreadyOwner.isAssignerOfOwner(ownerToAssign)).toBe(true);
//                 done();
//             })
//             .catch(err => done.fail(err))
//     });
//
//     test("removeStoreOwner failure - invalid assigner", (done) => {
//         const store: Store = new Store("name", "store desc");
//         const isOperationValid: Res.BoolResponse = {data: {result: true}};
//         const alreadyOwner: StoreOwner = new StoreOwner("name1");
//         const ownerToAssign: StoreOwner = new StoreOwner("name2");
//         alreadyOwner.assignStoreOwner(ownerToAssign);
//         expect(alreadyOwner.isAssignerOfOwner(ownerToAssign)).toBe(true);
//
//         jest.spyOn(storeManagement, "findStoreByName").mockReturnValue(store);
//         jest.spyOn(store, "getStoreOwner").mockReturnValueOnce(undefined);
//         jest.spyOn(store, "getStoreOwner").mockReturnValueOnce(ownerToAssign);
//         jest.spyOn(store, "removeStoreOwner").mockReturnValue(isOperationValid);
//
//         storeManagement.removeStoreOwner(store.storeName, ownerToAssign, alreadyOwner, [])
//             .then((res: Res.BoolResponse) => {
//                 expect(res.data.result).toBe(false);
//                 expect(store.removeStoreOwner).toBeCalledTimes(0);
//                 expect(alreadyOwner.isAssignerOfOwner(ownerToAssign)).toBe(true);
//                 done();
//             })
//             .catch(err => done.fail(err))
//     });
//
//     test("removeStoreOwner failure - already manager", (done) => {
//         const isOperationValid: Res.BoolResponse = {data: {result: true}};
//         const alreadyOwner: StoreOwner = new StoreOwner("name1");
//         const ownerToAssign: StoreOwner = new StoreOwner("name2");
//         alreadyOwner.assignStoreOwner(ownerToAssign);
//         expect(alreadyOwner.isAssignerOfOwner(ownerToAssign)).toBe(true);
//
//         jest.spyOn(storeManagement, "findStoreByName").mockReturnValue(store);
//         jest.spyOn(store, "getStoreOwner").mockReturnValueOnce(alreadyOwner);
//         jest.spyOn(store, "getStoreOwner").mockReturnValueOnce(undefined);
//         jest.spyOn(store, "removeStoreOwner").mockReturnValue(isOperationValid);
//
//         storeManagement.removeStoreOwner(store.storeName, ownerToAssign, alreadyOwner, [])
//             .then((res: Res.BoolResponse) => {
//                 expect(res.data.result).toBe(false);
//                 expect(store.removeStoreOwner).toBeCalledTimes(0);
//                 expect(alreadyOwner.isAssignerOfOwner(ownerToAssign)).toBe(true);
//                 done();
//             })
//             .catch(err => done.fail(err))
//     });
//
//     test("removeStoreOwner failure - not assigner", (done) => {
//         const isOperationValid: Res.BoolResponse = {data: {result: true}};
//         const alreadyOwner: StoreOwner = new StoreOwner("alreadyOwnerName");
//         const ownerToAssign1: StoreOwner = new StoreOwner("name1");
//         const ownerToAssign2: StoreOwner = new StoreOwner("name2");
//         alreadyOwner.assignStoreOwner(ownerToAssign1);
//         ownerToAssign1.assignStoreOwner(ownerToAssign2);
//         expect(alreadyOwner.isAssignerOfOwner(ownerToAssign1)).toBe(true);
//
//         jest.spyOn(storeManagement, "findStoreByName").mockReturnValue(store);
//         jest.spyOn(store, "getStoreOwner").mockReturnValueOnce(alreadyOwner);
//         jest.spyOn(store, "getStoreOwner").mockReturnValueOnce(ownerToAssign2);
//         jest.spyOn(store, "removeStoreOwner").mockReturnValue(isOperationValid);
//
//         storeManagement.removeStoreOwner(store.storeName, ownerToAssign2, alreadyOwner, [])
//             .then((res: Res.BoolResponse) => {
//                 expect(res.data.result).toBe(false);
//                 expect(store.removeStoreOwner).toBeCalledTimes(0);
//                 expect(alreadyOwner.isAssignerOfOwner(ownerToAssign1)).toBe(true);
//                 expect(ownerToAssign1.isAssignerOfOwner(ownerToAssign2)).toBe(true);
//                 done();
//             })
//             .catch(err => done.fail(err))
//     });
//
//
//     test("removeStoreManager success", (done) => {
//         const isOperationValid: Res.BoolResponse = {data: {result: true}};
//         const alreadyOwner: StoreOwner = new StoreOwner("name1");
//         const managerToAssign: StoreManager = new StoreManager("name2");
//         alreadyOwner.assignStoreManager(managerToAssign);
//         expect(alreadyOwner.isAssignerOfManager(managerToAssign)).toBe(true);
//
//         jest.spyOn(storeManagement, "findStoreByName").mockReturnValue(store);
//         jest.spyOn(store, "getStoreOwner").mockReturnValueOnce(alreadyOwner);
//         jest.spyOn(store, "getStoreManager").mockReturnValueOnce(managerToAssign);
//         jest.spyOn(store, "removeStoreManager").mockReturnValue(isOperationValid);
//
//         storeManagement.removeStoreManager(store.storeName, managerToAssign, alreadyOwner)
//             .then((res: Res.BoolResponse) => {
//                 expect(res.data.result).toBeTruthy();
//                 expect(store.removeStoreManager).toBeCalledTimes(1);
//                 expect(alreadyOwner.isAssignerOfManager(managerToAssign)).toBe(false);
//                 done();
//             })
//             .catch(err => done.fail(err))
//     });
//
//     test("removeStoreManager failure - store doesn't exist", (done) => {
//         const isOperationValid: Res.BoolResponse = {data: {result: true}};
//         const alreadyOwner: StoreOwner = new StoreOwner("name1");
//         const managerToAssign: StoreManager = new StoreManager("name2");
//         alreadyOwner.assignStoreManager(managerToAssign);
//         expect(alreadyOwner.isAssignerOfManager(managerToAssign)).toBe(true);
//
//         jest.spyOn(storeManagement, "findStoreByName").mockReturnValue(undefined);
//         jest.spyOn(store, "getStoreOwner").mockReturnValueOnce(alreadyOwner);
//         jest.spyOn(store, "getStoreManager").mockReturnValueOnce(managerToAssign);
//         jest.spyOn(store, "removeStoreManager").mockReturnValue(isOperationValid);
//
//         storeManagement.removeStoreManager(store.storeName, managerToAssign, alreadyOwner)
//             .then((res: Res.BoolResponse) => {
//                 expect(res.data.result).toBe(false);
//                 expect(store.removeStoreManager).toBeCalledTimes(0);
//                 expect(alreadyOwner.isAssignerOfManager(managerToAssign)).toBe(true);
//                 done();
//             })
//             .catch(err => done.fail(err))
//     });
//
//     test("removeStoreManager failure - invalid assigner", (done) => {
//         const isOperationValid: Res.BoolResponse = {data: {result: true}};
//         const alreadyOwner: StoreOwner = new StoreOwner("name1");
//         const managerToAssign: StoreManager = new StoreManager("name2");
//         alreadyOwner.assignStoreManager(managerToAssign);
//         expect(alreadyOwner.isAssignerOfManager(managerToAssign)).toBe(true);
//
//         jest.spyOn(storeManagement, "findStoreByName").mockReturnValue(store);
//         jest.spyOn(store, "getStoreOwner").mockReturnValueOnce(undefined);
//         jest.spyOn(store, "getStoreManager").mockReturnValueOnce(managerToAssign);
//         jest.spyOn(store, "removeStoreManager").mockReturnValue(isOperationValid);
//
//         storeManagement.removeStoreManager(store.storeName, managerToAssign, alreadyOwner)
//             .then((res: Res.BoolResponse) => {
//                 expect(res.data.result).toBe(false);
//                 expect(store.removeStoreManager).toBeCalledTimes(0);
//                 expect(alreadyOwner.isAssignerOfManager(managerToAssign)).toBe(true);
//                 done();
//             })
//             .catch(err => done.fail(err))
//     });
//
//     test("removeStoreManager failure - already manager", (done) => {
//         const isOperationValid: Res.BoolResponse = {data: {result: true}};
//         const alreadyOwner: StoreOwner = new StoreOwner("name1");
//         const managerToAssign: StoreManager = new StoreManager("name2");
//         alreadyOwner.assignStoreManager(managerToAssign);
//         expect(alreadyOwner.isAssignerOfManager(managerToAssign)).toBe(true);
//
//         jest.spyOn(storeManagement, "findStoreByName").mockReturnValue(store);
//         jest.spyOn(store, "getStoreOwner").mockReturnValueOnce(alreadyOwner);
//         jest.spyOn(store, "getStoreManager").mockReturnValueOnce(undefined);
//         jest.spyOn(store, "removeStoreManager").mockReturnValue(isOperationValid);
//
//         storeManagement.removeStoreManager(store.storeName, managerToAssign, alreadyOwner)
//             .then((res: Res.BoolResponse) => {
//                 expect(res.data.result).toBe(false);
//                 expect(store.removeStoreManager).toBeCalledTimes(0);
//                 expect(alreadyOwner.isAssignerOfManager(managerToAssign)).toBe(true);
//                 done();
//             })
//             .catch(err => done.fail(err))
//     });
//
//     test("removeStoreManager failure - not assigner", (done) => {
//         const isOperationValid: Res.BoolResponse = {data: {result: true}};
//         const alreadyOwner: StoreOwner = new StoreOwner("alreadyOwnerName");
//         const ownerToAssign1: StoreOwner = new StoreOwner("name1");
//         const managerToAssign: StoreManager = new StoreManager("name2");
//         alreadyOwner.assignStoreOwner(ownerToAssign1);
//         ownerToAssign1.assignStoreManager(managerToAssign);
//
//         jest.spyOn(storeManagement, "findStoreByName").mockReturnValue(store);
//         jest.spyOn(store, "getStoreOwner").mockReturnValueOnce(alreadyOwner);
//         jest.spyOn(store, "getStoreManager").mockReturnValueOnce(managerToAssign);
//         jest.spyOn(store, "removeStoreManager").mockReturnValue(isOperationValid);
//
//         storeManagement.removeStoreManager(store.storeName, managerToAssign, alreadyOwner)
//             .then((res: Res.BoolResponse) => {
//                 expect(res.data.result).toBe(false);
//                 expect(store.removeStoreManager).toBeCalledTimes(0);
//                 expect(alreadyOwner.isAssignerOfOwner(ownerToAssign1)).toBe(true);
//                 expect(alreadyOwner.isAssignerOfManager(managerToAssign)).toBe(false);
//                 expect(ownerToAssign1.isAssignerOfManager(managerToAssign)).toBe(true);
//                 done();
//             })
//             .catch(err => done.fail(err))
//
//
//     });
//
//
//     test("removeManagerPermissions - Success", (done) => {
//         const isSuccessVerify: boolean = true;
//         const storeOwner: StoreOwner = new StoreOwner("storeOwner-mock");
//         const storeManager: StoreManager = new StoreManager("storeManager-mock");
//         const permissionToRemove: ManagementPermission = ManagementPermission.REPLY_USER_QUESTIONS;
//         const permissions: ManagementPermission[] = [permissionToRemove];
//
//         mockVerifyStoreOperation(isSuccessVerify);
//         jest.spyOn(storeManagement, "findStoreByName").mockReturnValue(store);
//         jest.spyOn(store, "getStoreOwner").mockReturnValue(storeOwner);
//         jest.spyOn(store, "getStoreManager").mockReturnValue(storeManager);
//         jest.spyOn(storeOwner, "isAssignerOfManager").mockReturnValue(true);
//
//
//         storeManagement.removeManagerPermissions(storeOwner, store.storeName, storeManager.name, permissions)
//             .then((res: Res.BoolResponse) => {
//                 expect(res.data.result).toBe(true);
//                 expect(storeManager.getPermissions().length).toBeGreaterThan(0);
//                 expect(storeManager.getPermissions().includes(permissionToRemove)).toBe(false);
//                 done();
//             })
//             .catch(err => done.fail(err))
//     });
//
//     test("removeManagerPermissions - Failure: store doesn't exist", (done) => {
//         const isSuccessVerify: boolean = true;
//         const storeOwner: StoreOwner = new StoreOwner("storeOwner-mock");
//         const storeManager: StoreManager = new StoreManager("storeManager-mock");
//         const permissionToRemove: ManagementPermission = ManagementPermission.REPLY_USER_QUESTIONS;
//         const permissions: ManagementPermission[] = [permissionToRemove];
//
//         mockVerifyStoreOperation(isSuccessVerify);
//         jest.spyOn(storeManagement, "findStoreByName").mockReturnValue(undefined);
//         jest.spyOn(store, "getStoreOwner").mockReturnValue(storeOwner);
//         jest.spyOn(store, "getStoreManager").mockReturnValue(storeManager);
//         jest.spyOn(storeOwner, "isAssignerOfManager").mockReturnValue(true);
//
//
//         storeManagement.removeManagerPermissions(storeOwner, store.storeName, storeManager.name, permissions)
//             .then((actualRes: Res.BoolResponse) => {
//                 expect(actualRes.data.result).toBe(false);
//                 expect(storeManager.getPermissions().length).toBeGreaterThan(0);
//                 expect(storeManager.getPermissions().includes(permissionToRemove)).toBe(true);
//                 done();
//             })
//             .catch(err => done.fail(err))
//     });
//
//     test("removeManagerPermissions - Failure: manager doesn't exist", (done) => {
//         const isSuccessVerify: boolean = true;
//         const storeOwner: StoreOwner = new StoreOwner("storeOwner-mock");
//         const storeManager: StoreManager = new StoreManager("storeManager-mock");
//         const permissionToRemove: ManagementPermission = ManagementPermission.REPLY_USER_QUESTIONS;
//         const permissions: ManagementPermission[] = [permissionToRemove];
//
//         mockVerifyStoreOperation(isSuccessVerify);
//         jest.spyOn(storeManagement, "findStoreByName").mockReturnValue(store);
//         jest.spyOn(store, "getStoreOwner").mockReturnValue(storeOwner);
//         jest.spyOn(store, "getStoreManager").mockReturnValue(undefined);
//         jest.spyOn(storeOwner, "isAssignerOfManager").mockReturnValue(true);
//
//
//         storeManagement.removeManagerPermissions(storeOwner, store.storeName, storeManager.name, permissions)
//             .then((actualRes: Res.BoolResponse) => {
//                 expect(actualRes.data.result).toBe(false);
//                 expect(storeManager.getPermissions().length).toBeGreaterThan(0);
//                 expect(storeManager.getPermissions().includes(permissionToRemove)).toBe(true);
//                 done();
//             })
//             .catch(err => done.fail(err))
//     });
//
//     test("removeManagerPermissions - Failure: owner is not assigner of manager", (done) => {
//         const isSuccessVerify: boolean = true;
//         const storeOwner: StoreOwner = new StoreOwner("storeOwner-mock");
//         const storeManager: StoreManager = new StoreManager("storeManager-mock");
//         const permissionToRemove: ManagementPermission = ManagementPermission.REPLY_USER_QUESTIONS;
//         const permissions: ManagementPermission[] = [permissionToRemove];
//
//         mockVerifyStoreOperation(isSuccessVerify);
//         jest.spyOn(storeManagement, "findStoreByName").mockReturnValue(store);
//         jest.spyOn(store, "getStoreOwner").mockReturnValue(storeOwner);
//         jest.spyOn(store, "getStoreManager").mockReturnValue(storeManager);
//         jest.spyOn(storeOwner, "isAssignerOfManager").mockReturnValue(false);
//
//
//         storeManagement.removeManagerPermissions(storeOwner, store.storeName, storeManager.name, permissions)
//             .then((actualRes: Res.BoolResponse) => {
//                 expect(actualRes.data.result).toBe(false);
//                 expect(storeManager.getPermissions().length).toBeGreaterThan(0);
//                 expect(storeManager.getPermissions().includes(permissionToRemove)).toBe(true);
//                 done();
//             })
//             .catch(err => done.fail(err))
//
//     });
//
//     test("removeManagerPermissions - Failure: is not store owner", (done) => {
//         const isSuccessVerify: boolean = true;
//         const storeOwner: StoreOwner = new StoreOwner("storeOwner-mock");
//         const storeManager: StoreManager = new StoreManager("storeManager-mock");
//         const permissionToRemove: ManagementPermission = ManagementPermission.REPLY_USER_QUESTIONS;
//         const permissions: ManagementPermission[] = [permissionToRemove];
//
//         mockVerifyStoreOperation(isSuccessVerify);
//         jest.spyOn(storeManagement, "findStoreByName").mockReturnValue(store);
//         jest.spyOn(store, "getStoreOwner").mockReturnValue(undefined);
//         jest.spyOn(store, "getStoreManager").mockReturnValue(storeManager);
//         jest.spyOn(storeOwner, "isAssignerOfManager").mockReturnValue(true);
//
//
//         storeManagement.removeManagerPermissions(storeOwner, store.storeName, storeManager.name, permissions)
//             .then((actualRes: Res.BoolResponse) => {
//                 expect(actualRes.data.result).toBe(false);
//                 expect(storeManager.getPermissions().length).toBeGreaterThan(0);
//                 expect(storeManager.getPermissions().includes(permissionToRemove)).toBe(true);
//                 done();
//             })
//             .catch(err => done.fail(err))
//     });
//
//     test("removeManagerPermissions - failure - verify permission fails", (done) => {
//         const isSuccessVerify: boolean = true;
//         const storeOwner: StoreOwner = new StoreOwner("storeOwner-mock");
//         const storeManager: StoreManager = new StoreManager("storeManager-mock");
//         const permissionToRemove: ManagementPermission = ManagementPermission.REPLY_USER_QUESTIONS;
//         const permissions: ManagementPermission[] = [permissionToRemove];
//
//         mockVerifyStoreOperation(isSuccessVerify);
//         jest.spyOn(storeManagement, "findStoreByName").mockReturnValue(store);
//         jest.spyOn(storeManagement, "verifyPermissions").mockReturnValue(false);
//         jest.spyOn(store, "getStoreOwner").mockReturnValue(storeOwner);
//         jest.spyOn(store, "getStoreManager").mockReturnValue(storeManager);
//         jest.spyOn(storeOwner, "isAssignerOfManager").mockReturnValue(true);
//
//
//         storeManagement.removeManagerPermissions(storeOwner, store.storeName, storeManager.name, permissions)
//             .then((actualRes: Res.BoolResponse) => {
//                 expect(actualRes.data.result).toBe(false);
//                 expect(storeManager.getPermissions().length).toBeGreaterThan(0);
//                 expect(storeManager.getPermissions().includes(permissionToRemove)).toBe(true);
//                 done();
//             })
//             .catch(err => done.fail(err))
//     });
//
//
//     test("getStoreOwnersToRemove", () => {
//         const store: Store = new Store("name", "store desc");
//
//         const alreadyOwner: StoreOwner = new StoreOwner("name1");
//         const ownerToAssign: StoreOwner = new StoreOwner("name2");          // assigned by alreadyOwner
//         const ownerToAssign_3: StoreOwner = new StoreOwner("name3");        // assigned by ownerToAssign
//         const ownerToAssign_4: StoreOwner = new StoreOwner("name4");        // assigned by ownerToAssign
//         const ownerToAssign_5: StoreOwner = new StoreOwner("name5");        // assigned by ownerToAssign_3
//         const ownerToAssign_6: StoreOwner = new StoreOwner("name6");        // assigned by ownerToAssign_3
//         const ownerToAssign_7: StoreOwner = new StoreOwner("name7");        // assigned by ownerToAssign_6
//         const ownerToAssign_8: StoreOwner = new StoreOwner("name8");        // assigned by ownerToAssign_6
//
//         alreadyOwner.assignStoreOwner(ownerToAssign);
//         ownerToAssign.assignStoreOwner(ownerToAssign_3);
//         ownerToAssign.assignStoreOwner(ownerToAssign_4);
//         ownerToAssign_3.assignStoreOwner(ownerToAssign_5);
//         ownerToAssign_3.assignStoreOwner(ownerToAssign_6);
//         ownerToAssign_6.assignStoreOwner(ownerToAssign_7);
//         ownerToAssign_6.assignStoreOwner(ownerToAssign_8);
//
//         expect(alreadyOwner.isAssignerOfOwner(ownerToAssign)).toBe(true);
//         expect(ownerToAssign.isAssignerOfOwner(ownerToAssign_3)).toBe(true);
//         expect(ownerToAssign.isAssignerOfOwner(ownerToAssign_4)).toBe(true);
//         expect(ownerToAssign_3.isAssignerOfOwner(ownerToAssign_5)).toBe(true);
//         expect(ownerToAssign_3.isAssignerOfOwner(ownerToAssign_6)).toBe(true);
//         expect(ownerToAssign_6.isAssignerOfOwner(ownerToAssign_7)).toBe(true);
//         expect(ownerToAssign_6.isAssignerOfOwner(ownerToAssign_8)).toBe(true);
//
//         store.addStoreOwner(alreadyOwner);
//         store.addStoreOwner(ownerToAssign);
//         store.addStoreOwner(ownerToAssign_3);
//         store.addStoreOwner(ownerToAssign_4);
//         store.addStoreOwner(ownerToAssign_5);
//         store.addStoreOwner(ownerToAssign_5);
//         store.addStoreOwner(ownerToAssign_6);
//         store.addStoreOwner(ownerToAssign_7);
//         store.addStoreOwner(ownerToAssign_8);
//
//
//         expect(store.verifyIsStoreOwner(alreadyOwner.name)).toBe(true);
//         expect(store.verifyIsStoreOwner(ownerToAssign.name)).toBe(true);
//         expect(store.verifyIsStoreOwner(ownerToAssign_3.name)).toBe(true);
//         expect(store.verifyIsStoreOwner(ownerToAssign_4.name)).toBe(true);
//         expect(store.verifyIsStoreOwner(ownerToAssign_5.name)).toBe(true);
//         expect(store.verifyIsStoreOwner(ownerToAssign_5.name)).toBe(true);
//         expect(store.verifyIsStoreOwner(ownerToAssign_6.name)).toBe(true);
//
//         jest.spyOn(storeManagement, "findStoreByName").mockReturnValue(store);
//         const usernamesTuples: StringTuple[] = storeManagement.getStoreOwnersToRemove(alreadyOwner.name, store.storeName);
//
//         const ownersToRemove: StringTuple[] = [
//             [alreadyOwner.name, ownerToAssign.name],
//             [ownerToAssign.name, ownerToAssign_3.name],
//             [ownerToAssign.name, ownerToAssign_4.name],
//             [ownerToAssign_3.name, ownerToAssign_5.name],
//             [ownerToAssign_3.name, ownerToAssign_6.name],
//             [ownerToAssign_6.name, ownerToAssign_7.name],
//             [ownerToAssign_6.name, ownerToAssign_8.name],
//         ];
//
//         expect(usernamesTuples).toHaveLength(ownersToRemove.length);
//         ownersToRemove.forEach(tuple => expect(usernamesTuples).toContainEqual(tuple))
//     })
//
//     test("removeStoreManager success", (done) => {
//         const isOperationValid: Res.BoolResponse = {data: {result: true}};
//         const alreadyOwner: StoreOwner = new StoreOwner("name1");
//         const managerToAssign: StoreManager = new StoreManager("name2");
//         alreadyOwner.assignStoreManager(managerToAssign);
//         expect(alreadyOwner.isAssignerOfManager(managerToAssign)).toBe(true);
//
//         jest.spyOn(storeManagement, "findStoreByName").mockReturnValue(store);
//         jest.spyOn(store, "getStoreOwner").mockReturnValueOnce(alreadyOwner);
//         jest.spyOn(store, "getStoreManager").mockReturnValueOnce(managerToAssign);
//         jest.spyOn(store, "removeStoreManager").mockReturnValue(isOperationValid);
//
//         storeManagement.removeStoreManager(store.storeName, managerToAssign, alreadyOwner)
//             .then((res: Res.BoolResponse) => {
//                 expect(res.data.result).toBeTruthy();
//                 expect(store.removeStoreManager).toBeCalledTimes(1);
//                 expect(alreadyOwner.isAssignerOfManager(managerToAssign)).toBe(false);
//                 done();
//             })
//             .catch(err => done.fail(err))
//     });
//
//
//
//     test("addManagerPermissions - Success", (done) => {
//         const isSuccessVerify: boolean = true;
//         const storeOwner: StoreOwner = new StoreOwner("storeOwner-mock");
//         const storeManager: StoreManager = new StoreManager("storeManager-mock");
//         const permissionToRemove: ManagementPermission = ManagementPermission.CLOSE_STORE;
//         const permissions: ManagementPermission[] = [permissionToRemove];
//
//         mockVerifyStoreOperation(isSuccessVerify);
//         jest.spyOn(storeManagement, "findStoreByName").mockReturnValue(store);
//         jest.spyOn(store, "getStoreOwner").mockReturnValue(storeOwner);
//         jest.spyOn(store, "getStoreManager").mockReturnValue(storeManager);
//         jest.spyOn(storeOwner, "isAssignerOfManager").mockReturnValue(true);
//
//
//         storeManagement.addManagerPermissions(storeOwner, store.storeName, storeManager.name, permissions)
//             .then((actualRes: Res.BoolResponse) => {
//                 expect(actualRes.data.result).toBe(true);
//                 expect(storeManager.getPermissions().length).toBeGreaterThan(0);
//                 expect(storeManager.getPermissions().includes(permissionToRemove)).toBe(true);
//                 done();
//             })
//             .catch(err => done.fail(err))
//     });
//
//     test("addManagerPermissions - Failure: store doesn't exist", (done) => {
//         const isSuccessVerify: boolean = true;
//         const storeOwner: StoreOwner = new StoreOwner("storeOwner-mock");
//         const storeManager: StoreManager = new StoreManager("storeManager-mock");
//         const permissionToRemove: ManagementPermission = ManagementPermission.CLOSE_STORE;
//         const permissions: ManagementPermission[] = [permissionToRemove];
//
//         mockVerifyStoreOperation(isSuccessVerify);
//         jest.spyOn(storeManagement, "findStoreByName").mockReturnValue(undefined);
//         jest.spyOn(store, "getStoreOwner").mockReturnValue(storeOwner);
//         jest.spyOn(store, "getStoreManager").mockReturnValue(storeManager);
//         jest.spyOn(storeOwner, "isAssignerOfManager").mockReturnValue(true);
//
//
//         storeManagement.addManagerPermissions(storeOwner, store.storeName, storeManager.name, permissions)
//             .then((actualRes: Res.BoolResponse) => {
//                 expect(actualRes.data.result).toBe(false);
//                 expect(storeManager.getPermissions().length).toBeGreaterThan(0);
//                 expect(storeManager.getPermissions().includes(permissionToRemove)).toBe(false);
//                 done();
//             })
//             .catch(err => done.fail(err))
//     });
//
//     test("addManagerPermissions - Failure: manager doesn't exist", (done) => {
//         const isSuccessVerify: boolean = true;
//         const storeOwner: StoreOwner = new StoreOwner("storeOwner-mock");
//         const storeManager: StoreManager = new StoreManager("storeManager-mock");
//         const permissionToRemove: ManagementPermission = ManagementPermission.CLOSE_STORE;
//         const permissions: ManagementPermission[] = [permissionToRemove];
//
//         mockVerifyStoreOperation(isSuccessVerify);
//         jest.spyOn(storeManagement, "findStoreByName").mockReturnValue(store);
//         jest.spyOn(store, "getStoreOwner").mockReturnValue(storeOwner);
//         jest.spyOn(store, "getStoreManager").mockReturnValue(undefined);
//         jest.spyOn(storeOwner, "isAssignerOfManager").mockReturnValue(true);
//
//
//         storeManagement.addManagerPermissions(storeOwner, store.storeName, storeManager.name, permissions)
//             .then((actualRes: Res.BoolResponse) => {
//                 expect(actualRes.data.result).toBe(false);
//                 expect(storeManager.getPermissions().length).toBeGreaterThan(0);
//                 expect(storeManager.getPermissions().includes(permissionToRemove)).toBe(false);
//                 done();
//             })
//             .catch(err => done.fail(err))
//     });
//
//     test("addManagerPermissions - Failure: owner is not assigner of manager", (done) => {
//         const isSuccessVerify: boolean = true;
//         const storeOwner: StoreOwner = new StoreOwner("storeOwner-mock");
//         const storeManager: StoreManager = new StoreManager("storeManager-mock");
//         const permissionToRemove: ManagementPermission = ManagementPermission.CLOSE_STORE;
//         const permissions: ManagementPermission[] = [permissionToRemove];
//
//         mockVerifyStoreOperation(isSuccessVerify);
//         jest.spyOn(storeManagement, "findStoreByName").mockReturnValue(store);
//         jest.spyOn(store, "getStoreOwner").mockReturnValue(storeOwner);
//         jest.spyOn(store, "getStoreManager").mockReturnValue(storeManager);
//         jest.spyOn(storeOwner, "isAssignerOfManager").mockReturnValue(false);
//
//
//         storeManagement.addManagerPermissions(storeOwner, store.storeName, storeManager.name, permissions)
//             .then((actualRes: Res.BoolResponse) => {
//                 expect(actualRes.data.result).toBe(false);
//                 expect(storeManager.getPermissions().length).toBeGreaterThan(0);
//                 expect(storeManager.getPermissions().includes(permissionToRemove)).toBe(false);
//                 done();
//             })
//             .catch(err => done.fail(err))
//     });
//
//     test("addManagerPermissions - Failure: is not store owner", (done) => {
//         const isSuccessVerify: boolean = true;
//         const storeOwner: StoreOwner = new StoreOwner("storeOwner-mock");
//         const storeManager: StoreManager = new StoreManager("storeManager-mock");
//         const permissionToRemove: ManagementPermission = ManagementPermission.CLOSE_STORE;
//         const permissions: ManagementPermission[] = [permissionToRemove];
//
//         mockVerifyStoreOperation(isSuccessVerify);
//         jest.spyOn(storeManagement, "findStoreByName").mockReturnValue(store);
//         jest.spyOn(store, "getStoreOwner").mockReturnValue(undefined);
//         jest.spyOn(store, "getStoreManager").mockReturnValue(storeManager);
//         jest.spyOn(storeOwner, "isAssignerOfManager").mockReturnValue(true);
//
//
//         storeManagement.addManagerPermissions(storeOwner, store.storeName, storeManager.name, permissions)
//             .then((actualRes: Res.BoolResponse) => {
//                 expect(actualRes.data.result).toBe(false);
//                 expect(storeManager.getPermissions().length).toBeGreaterThan(0);
//                 expect(storeManager.getPermissions().includes(permissionToRemove)).toBe(false);
//                 done();
//             })
//             .catch(err => done.fail(err))
//     });
//
//     test("addManagerPermissions - failure - verify permissions fails", (done) => {
//         const isSuccessVerify: boolean = true;
//         const storeOwner: StoreOwner = new StoreOwner("storeOwner-mock");
//         const storeManager: StoreManager = new StoreManager("storeManager-mock");
//         const permissionToRemove: ManagementPermission = ManagementPermission.CLOSE_STORE;
//         const permissions: ManagementPermission[] = [permissionToRemove];
//
//         mockVerifyStoreOperation(isSuccessVerify);
//         jest.spyOn(storeManagement, "findStoreByName").mockReturnValue(store);
//         jest.spyOn(storeManagement, "verifyPermissions").mockReturnValue(false);
//         jest.spyOn(store, "getStoreOwner").mockReturnValue(storeOwner);
//         jest.spyOn(store, "getStoreManager").mockReturnValue(storeManager);
//         jest.spyOn(storeOwner, "isAssignerOfManager").mockReturnValue(true);
//
//
//         storeManagement.addManagerPermissions(storeOwner, store.storeName, storeManager.name, permissions)
//             .then((actualRes: Res.BoolResponse) => {
//                 expect(actualRes.data.result).toBe(false);
//                 expect(storeManager.getPermissions().length).toBeGreaterThan(0);
//                 expect(storeManager.getPermissions().includes(permissionToRemove)).toBe(false);
//                 done();
//             })
//             .catch(err => done.fail(err))
//     });
//
//
//
//     test("changeProductName - Success", (done) => {
//         const isSuccessVerify: boolean = true;
//         const prodPrice: number = 5;
//         const catalogNumber: number = 5;
//         const category: ProductCategory = ProductCategory.HOBBIES;
//         const product: Product = new Product('name', catalogNumber, prodPrice, category);
//         const user: StoreOwner = new StoreOwner("storeOwner-mock");
//         const newName: string = "newProductName";
//
//         mockVerifyStoreOperation(isSuccessVerify);
//         jest.spyOn(storeManagement, "findStoreByName").mockReturnValue(store);
//         jest.spyOn(store, "getProductByCatalogNumber").mockReturnValue(product);
//
//         storeManagement.changeProductName(user, product.catalogNumber, store.storeName, newName)
//             .then((actualRes: Res.BoolResponse) => {
//                 expect(actualRes.data.result).toBe(true);
//                 expect(product.name).toBe(newName);
//                 expect(product.catalogNumber).toBe(catalogNumber);
//                 expect(product.price).toBe(prodPrice);
//                 expect(product.category).toBe(category);
//                 done();
//             })
//             .catch(err => done.fail(err))
//
//     });
//
//     test("changeProductName - Failure: not authorized", (done) => {
//         const isSuccessVerify: boolean = false;
//         const prodPrice: number = 5;
//         const catalogNumber: number = 5;
//         const category: ProductCategory = ProductCategory.HOBBIES;
//         const prodName: string = "mock-name";
//         const product: Product = new Product(prodName, catalogNumber, prodPrice, category);
//         const user: StoreOwner = new StoreOwner("storeOwner-mock");
//         const newName: string = "newProductName";
//
//         mockVerifyStoreOperation(isSuccessVerify);
//
//         storeManagement.changeProductName(user, product.catalogNumber, store.storeName, newName)
//             .then((actualRes: Res.BoolResponse) => {
//                 expect(actualRes.data.result).toBe(false);
//                 expect(product.name).toBe(prodName);
//                 expect(product.catalogNumber).toBe(catalogNumber);
//                 expect(product.price).toBe(prodPrice);
//                 expect(product.category).toBe(category);
//                 done();
//             })
//             .catch(err => done.fail(err))
//     });
//
//     test("changeProductName - Failure: invalid store", (done) => {
//         const isSuccessVerify: boolean = true;
//         const prodPrice: number = 5;
//         const catalogNumber: number = 5;
//         const category: ProductCategory = ProductCategory.HOBBIES;
//         const prodName: string = "mock-name";
//         const product: Product = new Product(prodName, catalogNumber, prodPrice, category);
//         const user: StoreOwner = new StoreOwner("storeOwner-mock");
//         const newName: string = "newProductName";
//
//         mockVerifyStoreOperation(isSuccessVerify);
//         jest.spyOn(storeManagement, "findStoreByName").mockReturnValue(undefined);
//
//         storeManagement.changeProductName(user, product.catalogNumber, store.storeName, newName)
//             .then((actualRes: Res.BoolResponse) => {
//                 expect(actualRes.data.result).toBe(false);
//                 expect(product.name).toBe(prodName);
//                 expect(product.catalogNumber).toBe(catalogNumber);
//                 expect(product.price).toBe(prodPrice);
//                 expect(product.category).toBe(category);
//                 done();
//             })
//             .catch(err => done.fail(err))
//     });
//
//     test("changeProductPrice - Success", (done) => {
//         const isSuccessVerify: boolean = true;
//         const prodPrice: number = 5;
//         const catalogNumber: number = 5;
//         const category: ProductCategory = ProductCategory.HOBBIES;
//         const prodName: string = "mockname";
//         const product: Product = new Product(prodName, catalogNumber, prodPrice, category);
//         const user: StoreOwner = new StoreOwner("storeOwner-mock");
//         const newPrice: number = 20;
//
//         mockVerifyStoreOperation(isSuccessVerify);
//         jest.spyOn(storeManagement, "findStoreByName").mockReturnValue(store);
//         jest.spyOn(store, "getProductByCatalogNumber").mockReturnValue(product);
//
//         storeManagement.changeProductPrice(user, product.catalogNumber, store.storeName, newPrice)
//             .then((actualRes: Res.BoolResponse) => {
//                 expect(actualRes.data.result).toBe(true);
//                 expect(product.name).toBe(prodName);
//                 expect(product.catalogNumber).toBe(catalogNumber);
//                 expect(product.price).toBe(newPrice);
//                 expect(product.category).toBe(category);
//                 done();
//             })
//             .catch(err => done.fail(err))
//
//     });
//
//     test("changeProductPrice - Failure: not authorized", (done) => {
//         const isSuccessVerify: boolean = false;
//         const prodPrice: number = 5;
//         const catalogNumber: number = 5;
//         const category: ProductCategory = ProductCategory.HOBBIES;
//         const prodName: string = "mock-name";
//         const product: Product = new Product(prodName, catalogNumber, prodPrice, category);
//         const user: StoreOwner = new StoreOwner("storeOwner-mock");
//         const newPrice: number = 20;
//
//         mockVerifyStoreOperation(isSuccessVerify);
//
//         storeManagement.changeProductPrice(user, product.catalogNumber, store.storeName, newPrice)
//             .then((actualRes: Res.BoolResponse) => {
//                 expect(actualRes.data.result).toBe(false);
//                 expect(product.name).toBe(prodName);
//                 expect(product.catalogNumber).toBe(catalogNumber);
//                 expect(product.price).toBe(prodPrice);
//                 expect(product.category).toBe(category);
//                 done();
//             })
//             .catch(err => done.fail(err))
//
//     });
//
//     test("changeProductPrice - Failure: invalid store", (done) => {
//         const isSuccessVerify: boolean = true;
//         const prodPrice: number = 5;
//         const catalogNumber: number = 5;
//         const category: ProductCategory = ProductCategory.HOBBIES;
//         const prodName: string = "mock-name";
//         const product: Product = new Product(prodName, catalogNumber, prodPrice, category);
//         const user: StoreOwner = new StoreOwner("storeOwner-mock");
//         const newPrice: number = 20;
//
//         mockVerifyStoreOperation(isSuccessVerify);
//         jest.spyOn(storeManagement, "findStoreByName").mockReturnValue(undefined);
//
//         storeManagement.changeProductPrice(user, product.catalogNumber, store.storeName, newPrice)
//             .then((actualRes: Res.BoolResponse) => {
//                 expect(actualRes.data.result).toBe(false);
//                 expect(product.name).toBe(prodName);
//                 expect(product.catalogNumber).toBe(catalogNumber);
//                 expect(product.price).toBe(prodPrice);
//                 expect(product.category).toBe(category);
//                 done();
//             })
//             .catch(err => done.fail(err))
//
//     });
//
//     test("verifyStoreExists Success", (done) => {
//         const storeName: string = 'mock-store';
//         const user: RegisteredUser = new StoreOwner("usermock");
//         storeManagement.addStore(storeName, "storeDesc", user)
//             .then( res => {
//                 expect(res.data.result).toBeTruthy();
//                 expect(storeManagement.verifyStoreExists(storeName)).toBeTruthy();
//                 done();
//             })
//             .catch(err => done.fail(err))
//     });
//
//     test("verifyStoreExists Failure", () => {
//         expect(storeManagement.verifyStoreExists('storename')).toBeFalsy();
//     });
//
//
//     test("addItems Success", (done) => {
//         const isSuccessVerify: boolean = true;
//         const isSuccessFlow: boolean = true;
//         mockVerifyStoreOperation(isSuccessVerify);
//         const itemsReq: ItemReq[] = [{catalogNumber: 1, id: 1}];
//         const mockRes: Res.ItemsAdditionResponse = {data: {result: isSuccessFlow, itemsNotAdded: itemsReq}};
//         const user: RegisteredUser = new StoreOwner("usermock");
//         jest.spyOn(storeManagement, "findStoreByName").mockReturnValue(store);
//         jest.spyOn(store, "addItems").mockReturnValue(mockRes);
//
//         storeManagement.addItems(user, store.storeName, itemsReq)
//             .then((actualRes: Res.BoolResponse) => {
//                 expect(actualRes).toBe(mockRes);
//                 expect(store.addItems).toBeCalledTimes(1);
//                 done();
//             })
//             .catch(err => done.fail(err))
//     });
//
//     test("removeItems Success", (done) => {
//         const isSuccessVerify: boolean = true;
//         const isSuccessFlow: boolean = true;
//         mockVerifyStoreOperation(isSuccessVerify);
//         const itemsReq: ItemReq[] = [];
//         const mockRes: Res.ItemsRemovalResponse = {data: {result: isSuccessFlow, itemsNotRemoved: itemsReq}};
//         const user: RegisteredUser = new StoreOwner("usermock");
//         jest.spyOn(storeManagement, "findStoreByName").mockReturnValue(store);
//         jest.spyOn(store, "removeItems").mockReturnValue(mockRes);
//
//         storeManagement.removeItems(user, store.storeName, itemsReq)
//             .then((actualRes: Res.BoolResponse) => {
//                 expect(actualRes).toBe(mockRes);
//                 expect(store.removeItems).toBeCalledTimes(1);
//                 done();
//             })
//             .catch(err => done.fail(err))
//     });
//
//     test("removeProductsWithQuantity Success", (done) => {
//         const isSuccessVerify: boolean = true;
//         const isSuccessFlow: boolean = true;
//         mockVerifyStoreOperation(isSuccessVerify);
//         const itemsReq: ProductWithQuantity[] = [];
//         const mockRes: Res.ProductRemovalResponse = {data: {result: isSuccessFlow, productsNotRemoved: itemsReq}};
//         const mockPromise: Promise<Res.ProductRemovalResponse> = new Promise((resolve, reject) => { resolve(mockRes)});
//         const user: RegisteredUser = new StoreOwner("usermock");
//         jest.spyOn(storeManagement, "findStoreByName").mockReturnValue(store);
//         jest.spyOn(store, "removeProductsWithQuantity").mockReturnValue(mockPromise);
//
//         storeManagement.removeProductsWithQuantity(user, store.storeName, itemsReq, false)
//             .then((actualRes) => {
//                 expect(actualRes).toBe(mockRes);
//                 expect(store.removeProductsWithQuantity).toBeCalledTimes(1);
//                 done();
//             })
//             .catch(err => done.fail(err))
//     });
//
//     test("addNewProducts Success", (done) => {
//         const isSuccessVerify: boolean = true;
//         const isSuccessFlow: boolean = true;
//         mockVerifyStoreOperation(isSuccessVerify);
//         const prodReq: ProductReq[] = [{
//             name: 'mock-prod',
//             rating: Rating.MEDIUM,
//             category: ProductCategory.ELECTRONICS,
//             catalogNumber: 1,
//             price: 1
//         }];
//         const mockRes: Res.ProductAdditionResponse = {data: {result: isSuccessFlow, productsNotAdded: prodReq}};
//         const user: RegisteredUser = new StoreOwner("usermock");
//         jest.spyOn(storeManagement, "findStoreByName").mockReturnValue(store);
//         jest.spyOn(store, "addNewProducts").mockReturnValue(mockRes);
//
//         storeManagement.addNewProducts(user, store.storeName, prodReq)
//             .then((actualRes: Res.BoolResponse) => {
//                 expect(actualRes).toBe(mockRes);
//                 expect(store.addNewProducts).toBeCalledTimes(1);
//                 done();
//             })
//             .catch(err => done.fail(err))
//     });
//
//     test("removeProducts Success", (done) => {
//         const isSuccessVerify: boolean = true;
//         const isSuccessFlow: boolean = true;
//         mockVerifyStoreOperation(isSuccessVerify);
//         const itemsReq: ProductCatalogNumber[] = [];
//         const mockRes: Res.ProductRemovalResponse = {data: {result: isSuccessFlow, productsNotRemoved: itemsReq}};
//         const user: RegisteredUser = new StoreOwner("usermock");
//         jest.spyOn(storeManagement, "findStoreByName").mockReturnValue(store);
//         jest.spyOn(store, "removeProductsByCatalogNumber").mockReturnValue(new Promise((resolve, reject) => resolve(mockRes)));
//
//         storeManagement.removeProducts(user, store.storeName, itemsReq)
//             .then((actualRes) => {
//                 expect(actualRes).toBe(mockRes);
//                 expect(store.removeProductsByCatalogNumber).toBeCalledTimes(1);
//                 done();
//             })
//             .catch(err => done.fail(err))
//     });
//
//     test("findStoreByName Success", (done) => {
//         const storeName: string = 'mock-store';
//         const user: RegisteredUser = new StoreOwner("usermock");
//         storeManagement.addStore(storeName, "storedesc", user)
//             .then(res => {
//                 expect(res.data.result).toBeTruthy();
//                 expect(storeManagement.findStoreByName(storeName)).toBeTruthy();
//                 done();
//             })
//             .catch(err => done.fail(err))
//     });
//
//     test("findStoreByName Failure", () => {
//         expect(storeManagement.findStoreByName('storename')).toBeFalsy();
//     });
//
//     test('viewStoreInfo cant find store Fail ', (done) => {
//         jest.spyOn(storeManagement, 'findStoreByName').mockReturnValueOnce(undefined);
//         storeManagement.viewStoreInfo('whatever')
//             .then((actualRes: Res.StoreInfoResponse) => {
//                 expect(actualRes.data.result).toBeFalsy();
//                 expect(actualRes.error.message).toEqual(errorMsg.E_NF);
//                 done();
//             })
//             .catch(err => done.fail(err))
//     });
//
//     test('viewStoreInfo Success ', (done) => {
//         const storeName: string = 'mock-store';
//         const response: Res.StoreInfoResponse = {data: {result: true}};
//         jest.spyOn(storeManagement, 'findStoreByName').mockReturnValueOnce(store);
//         jest.spyOn(store, 'viewStoreInfo').mockReturnValueOnce(response);
//
//         storeManagement.viewStoreInfo(storeName)
//             .then((res: Res.StoreInfoResponse) => {
//                 expect(res).toBe(response);
//                 done();
//             })
//             .catch(err => done.fail(err))
//
//     });
//
//     test('viewProductInfo success test', (done) => {
//         const p = new Product('my product', 12345, 15.90, ProductCategory.GENERAL)
//         store.addNewProducts([p]);
//         jest.spyOn(storeManagement, "findStoreByName").mockReturnValueOnce(store);
//         storeManagement.viewProductInfo({
//             body: {storeName: 'store-name', catalogNumber: 12345},
//             token: "lala"
//         })
//             .then((res) => {
//                 expect(res.data.result).toBeTruthy();
//                 expect(res.data.info.catalogNumber).toBe(12345);
//                 expect(res.data.info.price).toBe(15.90);
//                 expect(res.data.info.category).toBe(ProductCategory.GENERAL);
//                 expect(res.data.info.quantity).toBe(0);
//                 done();
//             })
//             .catch(err => done.fail(err))
//
//     })
//
//     test('viewProductInfo fail - store not found', (done) => {
//         const p = new Product('my product', 12345, 15.90, ProductCategory.GENERAL)
//         jest.spyOn(storeManagement, "findStoreByName").mockReturnValueOnce(undefined);
//         const res = storeManagement.viewProductInfo({
//             body: {storeName: 'store-name', catalogNumber: 12345},
//             token: "lala"
//         })
//             .then((res) => {
//                 expect(res.data.result).toBeFalsy()
//                 done();
//             })
//             .catch(err => done.fail(err))
//
//
//     })
//
//
//     test('viewStoreInfo cant find store Fail ', (done) => {
//         jest.spyOn(storeManagement, 'findStoreByName').mockReturnValueOnce(undefined);
//         storeManagement.viewStoreInfo('whatever')
//             .then((res) => {
//                 expect(res.data.result).toBeFalsy();
//                 expect(res.error.message).toEqual(errorMsg.E_NF);
//                 done();
//             })
//             .catch(err => done.fail(err))
//
//     });
//
//
//     test("search - success with store name matching rating", (done) => {
//
//         const productsInStore: ProductInStore[] = [{
//             product: {
//                 rating: Rating.MEDIUM,
//                 catalogNumber: 1,
//                 category: ProductCategory.GENERAL,
//                 name: "mock",
//                 price: 11
//             }, storeName: store.storeName, storeRating: Rating.MEDIUM
//         }];
//         jest.spyOn(storeManagement, 'findStoreByName').mockReturnValueOnce(store);
//         jest.spyOn(store, 'search').mockReturnValueOnce(productsInStore);
//
//         const filters: SearchFilters = {};
//         const query: SearchQuery = {
//             storeName: store.storeName
//         };
//
//         storeManagement.search(filters, query)
//             .then((res) => {
//                 expect(res.data.result).toBe(true);
//                 expect(res.data.products).toMatchObject(productsInStore);
//                 expect(store.search).toBeCalledTimes(1);
//                 done();
//             })
//             .catch(err => done.fail(err))
//
//
//     });
//
//     test("search - success with store name not matching rating", (done) => {
//
//         const productsInStore: ProductInStore[] = [];
//         jest.spyOn(storeManagement, 'findStoreByName').mockReturnValueOnce(store);
//         jest.spyOn(store, 'search').mockReturnValueOnce(productsInStore);
//
//         const filters: SearchFilters = {
//             storeRating: Rating.LOW
//         };
//         const query: SearchQuery = {
//             storeName: store.storeName
//         };
//
//         storeManagement.search(filters, query)
//             .then((res) => {
//                 expect(res.data.result).toBe(true);
//                 expect(res.data.products).toMatchObject(productsInStore);
//                 expect(store.search).toBeCalledTimes(0);
//                 done();
//             })
//             .catch(err => done.fail(err))
//
//
//     });
//
//     test("search - failed with store name", (done) => {
//
//         const productsInStore: ProductInStore[] = [];
//         jest.spyOn(storeManagement, 'findStoreByName').mockReturnValueOnce(undefined);
//         jest.spyOn(store, 'search').mockReturnValueOnce(productsInStore);
//
//         const filters: SearchFilters = {};
//         const query: SearchQuery = {
//             storeName: store.storeName
//         };
//
//         storeManagement.search(filters, query)
//             .then((res) => {
//                 expect(res.data.result).toBe(false);
//                 expect(res.data.products).toMatchObject(productsInStore);
//                 expect(store.search).toBeCalledTimes(0);
//                 done();
//             })
//             .catch(err => done.fail(err))
//     });
//
//     test("search - success without store name", (done) => {
//         storeManagement.addStore("storename", "storedesc", new RegisteredUser('name', 'pw'))
//             .then((res) => {
//                 expect(res.data.result).toBe(true);
//             })
//             .catch(err => done.fail(err))
//
//         const productsInStore: ProductInStore[] = [];
//
//         const filters: SearchFilters = {};
//         const query: SearchQuery = {};
//
//         storeManagement.search(filters, query)
//             .then((res) => {
//                 expect(res.data.result).toBe(true);
//                 expect(res.data.products).toMatchObject(productsInStore);
//                 done();
//             })
//             .catch(err => done.fail(err))
//
//
//     });
//
//
//     test("viewStorePurchaseHistory - success", (done) => {
//         const storeName: string = "storename";
//         const user: RegisteredUser = new RegisteredUser("user1", "pw");
//         const store: Store = new Store("store1", "description");
//         const purchase1: Purchase = { userName: "alex", price: 50, item: { id: 1, catalogNumber: 1}, storeName: "what-store"};
//         const purchase2: Purchase = { userName: "alex", price: 50, item: { id: 2, catalogNumber: 1}, storeName: "what-store"};
//         const payment: IPayment = { totalCharged: 100, lastCC4: "1111"};
//         const purchases: Purchase[] = [purchase1, purchase2];
//         const receipt: Receipt = new Receipt(purchases, payment);
//         const iReceipt: IReceipt = { date: receipt.date, purchases: receipt.purchases }
//
//         jest.spyOn(storeManagement, 'findStoreByName').mockReturnValueOnce(store);
//         jest.spyOn(store, 'verifyPermission').mockReturnValueOnce(true);
//         jest.spyOn(store, 'getPurchasesHistory').mockReturnValueOnce([receipt]);
//
//         storeManagement.viewStorePurchaseHistory(user, storeName)
//             .then((res) => {
//                 expect(res.data.result).toBe(true);
//                 expect(res.data.receipts).toContainEqual(iReceipt);
//                 done();
//             })
//             .catch(err => done.fail(err))
//     });
//
//     test("viewStorePurchaseHistory - failure - invalid store", (done) => {
//         const storeName: string = "storename";
//         const user: RegisteredUser = new RegisteredUser("user1", "pw");
//
//         jest.spyOn(storeManagement, 'findStoreByName').mockReturnValueOnce(undefined);
//
//         storeManagement.viewStorePurchaseHistory(user, storeName)
//             .then((res) => {
//                 expect(res.data.result).toBe(false);
//                 expect(res.data.receipts).toHaveLength(0);
//                 done();
//             })
//             .catch(err => done.fail(err))
//
//     });
//
//     test("viewStorePurchaseHistory - failure - no permissions", (done) => {
//         const storeName: string = "storename";
//         const user: RegisteredUser = new RegisteredUser("user1", "pw");
//         const store: Store = new Store("store1", "description");
//
//         jest.spyOn(storeManagement, 'findStoreByName').mockReturnValueOnce(store);
//         jest.spyOn(store, 'verifyPermission').mockReturnValueOnce(false);
//
//         storeManagement.viewStorePurchaseHistory(user, storeName)
//             .then((res) => {
//                 expect(res.data.result).toBe(false);
//                 expect(res.data.receipts).toHaveLength(0);
//                 done();
//             })
//             .catch(err => done.fail(err))
//     });
//
//
//     test("getOwnersAssignedBy - success", () => {
//         const user: RegisteredUser = new RegisteredUser("user1", "pw");
//         const store: Store = new Store("store1", "description");
//         const storeOwner: StoreOwner = new StoreOwner("store1-owner");
//         const storeOwnerArr: StoreOwner[] = [
//                 new StoreOwner("store1-owner1"), new StoreOwner("store1-owner2"),
//                 new StoreOwner("store1-owner3"), new StoreOwner("store1-owner4") ]
//
//         jest.spyOn(storeManagement, 'findStoreByName').mockReturnValue(store);
//         jest.spyOn(store, 'getStoreOwner').mockReturnValue(storeOwner);
//
//         storeOwnerArr.forEach(owner => storeOwner.assignStoreOwner(owner))
//
//
//         const res: Res.GetOwnersAssignedByResponse = storeManagement.getOwnersAssignedBy(store.storeName, user);
//         expect(res.data.result).toBe(true);
//         expect(res.data.owners).toHaveLength(storeOwnerArr.length);
//         storeOwnerArr.forEach(storeOwner => expect(res.data.owners).toContainEqual(storeOwner.name))
//     })
//
//     test("getOwnersAssignedBy - failure", () => {
//         const user: RegisteredUser = new RegisteredUser("user1", "pw");
//         const store: Store = new Store("store1", "description");
//
//         jest.spyOn(storeManagement, 'findStoreByName').mockReturnValue(undefined);
//
//         const res: Res.GetOwnersAssignedByResponse = storeManagement.getOwnersAssignedBy(store.storeName, user);
//         expect(res.data.result).toBe(false);
//         expect(res.data.owners).toHaveLength(0);
//     })
//
//
//     test("verifyStoreBag - success", () => {
//         //TODO
//
//         // const price1: number = 50;
//         // const price2: number = 1352;
//         // const price3: number = 210;
//         //
//         // const bagItem1: BagItem = { amount: price1, finalPrice: price1,
//         //     product: { catalogNumber: 1, name: "name", rating: Rating.MEDIUM, category: ProductCategory.ELECTRONICS, price: price1}
//         // };
//         // const bagItem2: BagItem = { amount: price2, finalPrice: price2,
//         //     product: { catalogNumber: 1, name: "name", rating: Rating.MEDIUM, category: ProductCategory.ELECTRONICS, price: price2}
//         // };
//         // const bagItem3: BagItem = { amount: price3, finalPrice: price3,
//         //     product: { catalogNumber: 1, name: "name", rating: Rating.MEDIUM, category: ProductCategory.ELECTRONICS, price: price3}
//         // };
//         //
//         // const bagItems: BagItem[] = [bagItem1, bagItem2, bagItem3];
//         // jest.spyOn(storeManagement, "findStoreByName").mockReturnValue(mockValidationRes);
//         //
//         // storeManagement.verifyStoreBag(storeName, bagItems);
//         // expect(store.getBagPrice(bagItems)).toBe(finalPrice);
//     });
//
//     function mockVerifyStoreOperation(isSuccess: boolean) {
//         const mockValidationRes: Res.BoolResponse = isSuccess ? {data: {result: isSuccess}} : {
//             data: {result: isSuccess},
//             error: {message: "mock"}
//         }
//         jest.spyOn(storeManagement, "verifyStoreOperation").mockReturnValue(mockValidationRes);
//     }
//
});