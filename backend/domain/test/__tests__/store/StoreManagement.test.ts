import {Store, StoreManager} from "../../../src/store/internal_api";
import * as Responses from "../../../src/common/Response";
import {StoreOwner} from "../../../src/user/internal_api";

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


});
