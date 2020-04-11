import {Store, StoreManager} from "../../../src/store/internal_api";
import * as Responses from "../../../src/common/Response";
import {StoreOwner} from "../../../src/user/internal_api";
import * as Res from "../../../src/common/Response";

describe("Store Management Unit Tests", () => {
    let storeManagement: StoreManager;
    beforeEach(() => {
        storeManagement = new StoreManager();
    });

    test("addStore success", () => {
        const store: Store = new Store("name");
        const res : Responses.BoolResponse = storeManagement.addStore(store);
        expect(res.data.result).toBeTruthy();

    });

    test("addStore failure", () => {
        let store: Store = new Store("");
        let res : Responses.BoolResponse = storeManagement.addStore(store);
        expect(res.data.result).toBeFalsy();
    });

    test("verifyStore success", () => {
        const store: Store = new Store("name");
        storeManagement.addStore(store);
        expect(storeManagement.verifyStoreExists(store)).toBeTruthy();
    });

    test("verifyStore failure", () => {
        const store: Store = new Store("name");
        expect(storeManagement.verifyStoreExists(store)).toBeFalsy();
    });

    test("verifyStoreOwner success", () => {
        const store: Store = new Store("name");
        jest.spyOn(store, "verifyIsStoreOwner").mockReturnValue(true);
        const user: StoreOwner = new StoreOwner("name","123123");
        expect(storeManagement.verifyStoreOwner(store, user)).toBeTruthy();
    });

    test("verifyStoreOwner failure", () => {
        const store: Store = new Store("name");
        jest.spyOn(store, "verifyIsStoreOwner").mockReturnValue(false);
        const user: StoreOwner = new StoreOwner("name","123123");
        expect(storeManagement.verifyStoreOwner(store, user)).toBeFalsy();
    });

    test("verifyStoreManager success", () => {
        const store: Store = new Store("name");
        jest.spyOn(store, "verifyStoreManager").mockReturnValue(true);
        const user: StoreOwner = new StoreOwner("name","123123");
        expect(storeManagement.verifyStoreManager(store, user)).toBeTruthy();
    });


    test("verifyStoreManager failure", () => {
        const store: Store = new Store("name");
        jest.spyOn(store, "verifyStoreManager").mockReturnValue(false);
        const user: StoreOwner = new StoreOwner("name","123123");
        expect(storeManagement.verifyStoreManager(store, user)).toBeFalsy();
    });

    test("verifyStoreOperation success", () => {
        const store: Store = new Store("name");
        jest.spyOn(store, "verifyStoreManager").mockReturnValue(true);
        jest.spyOn(storeManagement, "verifyStoreExists").mockReturnValue(true);
        jest.spyOn(storeManagement, "verifyStoreOwner").mockReturnValue(true);

        const user: StoreOwner = new StoreOwner("name","123123");
        expect(storeManagement.verifyStoreOperation(store, user)).toBeTruthy();
    });

    test("verifyStoreOperation failure - store doesn't exist", () => {
        const store: Store = new Store("name");
        jest.spyOn(storeManagement, "verifyStoreExists").mockReturnValue(false);
        jest.spyOn(storeManagement, "verifyStoreOwner").mockReturnValue(true);

        const user: StoreOwner = new StoreOwner("name","123123");
        const res: Res.BoolResponse = storeManagement.verifyStoreOperation(store, user);
        expect(res.data.result).toBeFalsy();
        expect(res.error).toBeDefined();

    });

    test("verifyStoreOperation failure - not owner or manager", () => {
        const store: Store = new Store("name");
        jest.spyOn(storeManagement, "verifyStoreExists").mockReturnValue(true);
        jest.spyOn(storeManagement, "verifyStoreOwner").mockReturnValue(false);
        jest.spyOn(storeManagement, "verifyStoreManager").mockReturnValue(false);

        const user: StoreOwner = new StoreOwner("name","123123");
        const res: Res.BoolResponse = storeManagement.verifyStoreOperation(store, user);
        expect(res.data.result).toBeFalsy();
        expect(res.error).toBeDefined();
    });

    test("assignStoreOwner success", () => {
        const store: Store = new Store("name");
        const isOperationValid: Res.BoolResponse = {data: {result:true}};
        jest.spyOn(storeManagement, "verifyStoreOperation").mockReturnValue(isOperationValid);
        jest.spyOn(store, "verifyIsStoreOwner").mockReturnValue(false);
        jest.spyOn(store, "addStoreOwner").mockReturnValue(isOperationValid);

        const alreadyOwner: StoreOwner = new StoreOwner("name1","123123");
        const ownerToAssign: StoreOwner = new StoreOwner("name2","123123");

        const res: Res.BoolResponse = storeManagement.assignStoreOwner(store, ownerToAssign, alreadyOwner);

        expect(res.data.result).toBeTruthy();
    });

    test("assignStoreOwner failure - store doesn't exist or invalid store owner", () => {
        const store: Store = new Store("name");
        const isOperationValid: Res.BoolResponse = {data: {result:false}};
        jest.spyOn(storeManagement, "verifyStoreOperation").mockReturnValue(isOperationValid);
        jest.spyOn(store, "verifyIsStoreOwner").mockReturnValue(true);
        jest.spyOn(store, "addStoreOwner").mockReturnValue(isOperationValid);

        const alreadyOwner: StoreOwner = new StoreOwner("name1","123123");
        const ownerToAssign: StoreOwner = new StoreOwner("name2","123123");

        const res: Res.BoolResponse = storeManagement.assignStoreOwner(store, ownerToAssign, alreadyOwner);

        expect(res.data.result).toBeFalsy();
        expect(res.error).toBeDefined();
    });

    test("assignStoreOwner failure - already owner", () => {
        const store: Store = new Store("name");
        const isOperationValid: Res.BoolResponse = {data: {result:true}};
        jest.spyOn(storeManagement, "verifyStoreOperation").mockReturnValue(isOperationValid);
        jest.spyOn(store, "verifyIsStoreOwner").mockReturnValue(true);
        jest.spyOn(store, "addStoreOwner").mockReturnValue(isOperationValid);

        const alreadyOwner: StoreOwner = new StoreOwner("name1","123123");
        const ownerToAssign: StoreOwner = new StoreOwner("name2","123123");

        const res: Res.BoolResponse = storeManagement.assignStoreOwner(store, ownerToAssign, alreadyOwner);

        expect(res.data.result).toBeFalsy();
        expect(res.error).toBeDefined();
    });


});
