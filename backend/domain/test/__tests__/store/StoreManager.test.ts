import {Store, StoreManager} from "../../../src/store/internal_api";
import * as Responses from "../../../src/api-ext/Response";
import {StoreOwner, RegisteredUser, Buyer} from "../../../src/user/internal_api";
import * as Res from "../../../src/api-ext/Response";

describe("Store Management Unit Tests", () => {
    let storeManagement: StoreManager;
    beforeEach(() => {
        storeManagement = new StoreManager();
            //logger.transports.forEach((t) => (t.silent = true));
    });

    test("addStore success", () => {
         const user: RegisteredUser = new Buyer("tal","tal12345");
        const res : Responses.BoolResponse = storeManagement.addStore("new store name",user);
        expect(res.data.result).toBeTruthy();

    });

    test("addStore failure", () => {
        const user: RegisteredUser = new Buyer("tal","tal12345");
        const res : Responses.BoolResponse = storeManagement.addStore("",user);
        expect(res.data.result).toBeFalsy();
    });

    test("verifyStoreOwner success", () => {
        const store: Store = new Store("name");
        const user: StoreOwner = new StoreOwner("name","123123");
        jest.spyOn(store, "verifyIsStoreOwner").mockReturnValue(true);
        jest.spyOn(storeManagement, "findStoreByName").mockReturnValue(store);
        expect(storeManagement.verifyStoreOwner(store.storeName, user)).toBeTruthy();
    });

    test("verifyStoreOwner failure", () => {
        const store: Store = new Store("name");
        jest.spyOn(store, "verifyIsStoreOwner").mockReturnValue(false);
        const user: StoreOwner = new StoreOwner("name","123123");
        expect(storeManagement.verifyStoreOwner(store.storeName, user)).toBeFalsy();
    });

    test("verifyStoreManager success", () => {
        const store: Store = new Store("name");
        const user: StoreOwner = new StoreOwner("name","123123");
        jest.spyOn(store, "verifyIsStoreManager").mockReturnValue(true);
        jest.spyOn(storeManagement, "findStoreByName").mockReturnValue(store);
        expect(storeManagement.verifyStoreManager(store.storeName, user)).toBeTruthy();
    });


    test("verifyStoreManager failure", () => {
        const store: Store = new Store("name");
        const user: StoreOwner = new StoreOwner("name","123123");
        jest.spyOn(store, "verifyIsStoreManager").mockReturnValue(false);
        expect(storeManagement.verifyStoreManager(store.storeName, user)).toBeFalsy();
    });

    test("verifyStoreOperation success", () => {
        const store: Store = new Store("name");
        jest.spyOn(store, "verifyIsStoreManager").mockReturnValue(true);
        jest.spyOn(storeManagement, "verifyStoreExists").mockReturnValue(true);
        jest.spyOn(storeManagement, "verifyStoreOwner").mockReturnValue(true);

        const user: StoreOwner = new StoreOwner("name","123123");
        expect(storeManagement.verifyStoreOperation(store.storeName, user)).toBeTruthy();
    });

    test("verifyStoreOperation failure - store doesn't exist", () => {
        const store: Store = new Store("name");
        jest.spyOn(storeManagement, "verifyStoreExists").mockReturnValue(false);
        jest.spyOn(storeManagement, "verifyStoreOwner").mockReturnValue(true);

        const user: StoreOwner = new StoreOwner("name","123123");
        const res: Res.BoolResponse = storeManagement.verifyStoreOperation(store.storeName, user);
        expect(res.data.result).toBeFalsy();
        expect(res.error).toBeDefined();

    });

    test("verifyStoreOperation failure - not owner or manager", () => {
        const store: Store = new Store("name");
        jest.spyOn(storeManagement, "verifyStoreExists").mockReturnValue(true);
        jest.spyOn(storeManagement, "verifyStoreOwner").mockReturnValue(false);
        jest.spyOn(storeManagement, "verifyStoreManager").mockReturnValue(false);

        const user: StoreOwner = new StoreOwner("name","123123");
        const res: Res.BoolResponse = storeManagement.verifyStoreOperation(store.storeName, user);
        expect(res.data.result).toBeFalsy();
        expect(res.error).toBeDefined();
    });

    test("assignStoreOwner success", () => {
        const store: Store = new Store("name");
        const isOperationValid: Res.BoolResponse = {data: {result:true}};
        jest.spyOn(storeManagement, "verifyStoreOperation").mockReturnValue(isOperationValid);
        jest.spyOn(store, "verifyIsStoreOwner").mockReturnValue(false);
        jest.spyOn(store, "addStoreOwner").mockReturnValue(isOperationValid);
        jest.spyOn(storeManagement, "findStoreByName").mockReturnValue(store);

        const alreadyOwner: StoreOwner = new StoreOwner("name1","123123");
        const ownerToAssign: StoreOwner = new StoreOwner("name2","123123");

        const res: Res.BoolResponse = storeManagement.assignStoreOwner(store.storeName, ownerToAssign, alreadyOwner);

        expect(res.data.result).toBeTruthy();
    });

    test("assignStoreOwner failure - store doesn't exist or invalid store owner", () => {
        const store: Store = new Store("name");
        const isOperationValid: Res.BoolResponse = {data: {result:false}};
        jest.spyOn(storeManagement, "verifyStoreOperation").mockReturnValue(isOperationValid);
        jest.spyOn(store, "verifyIsStoreOwner").mockReturnValue(true);
        jest.spyOn(store, "addStoreOwner").mockReturnValue(isOperationValid);
        jest.spyOn(storeManagement, "findStoreByName").mockReturnValue(store);

        const alreadyOwner: StoreOwner = new StoreOwner("name1","123123");
        const ownerToAssign: StoreOwner = new StoreOwner("name2","123123");

        const res: Res.BoolResponse = storeManagement.assignStoreOwner(store.storeName, ownerToAssign, alreadyOwner);

        expect(res.data.result).toBeFalsy();
        expect(res.error).toBeDefined();
    });

    test("assignStoreOwner failure - already owner", () => {
        const store: Store = new Store("name");
        const isOperationValid: Res.BoolResponse = {data: {result:true}};
        jest.spyOn(storeManagement, "verifyStoreOperation").mockReturnValue(isOperationValid);
        jest.spyOn(store, "verifyIsStoreOwner").mockReturnValue(true);
        jest.spyOn(store, "addStoreOwner").mockReturnValue(isOperationValid);
        jest.spyOn(storeManagement, "findStoreByName").mockReturnValue(store);

        const alreadyOwner: StoreOwner = new StoreOwner("name1","123123");
        const ownerToAssign: StoreOwner = new StoreOwner("name2","123123");

        const res: Res.BoolResponse = storeManagement.assignStoreOwner(store.storeName, ownerToAssign, alreadyOwner);

        expect(res.data.result).toBeFalsy();
        expect(res.error).toBeDefined();
    });

});
