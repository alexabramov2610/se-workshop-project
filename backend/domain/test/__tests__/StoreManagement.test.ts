import {Store, StoreManagement} from "../../src/store/internal_api";
import * as Responses from "../../src/common/Response";
import {StoreOwner} from "../../src/user/internal_api";

describe("Store Management Unit Tests", () => {
    let storeManagement: StoreManagement;
    beforeEach(() => {
        storeManagement = new StoreManagement();
    });

    test("addStore success", () => {
        const store: Store = new Store("name", 5);
        const res : Responses.StoreAdditionResponse = storeManagement.addStore(store);
        expect(res.data.result).toBeTruthy();

    });

    test("addStore failure", () => {
        let store: Store = new Store("", 5);
        let res : Responses.StoreAdditionResponse = storeManagement.addStore(store);
        expect(res.data.result).toBeFalsy();

        store = new Store("name", -5);
        res = storeManagement.addStore(store);
        expect(res.data.result).toBeFalsy();
        expect(res.error).toBeDefined()
    });

    test("verifyStore success", () => {
        const store: Store = new Store("name", 5);
        storeManagement.addStore(store);
        expect(storeManagement.verifyStore(store)).toBeTruthy();
    });

    test("verifyStore failure", () => {
        const store: Store = new Store("name", 5);
        expect(storeManagement.verifyStore(store)).toBeFalsy();
    });

    test("verifyStoreOwner success", () => {
        const store: Store = new Store("name", 5);
        jest.spyOn(store, "verifyStoreOwner").mockReturnValue(true);
        const user: StoreOwner = new StoreOwner("name","123123");
        expect(storeManagement.verifyStoreOwner(store, user)).toBeTruthy();
    });

    test("verifyStoreOwner failure", () => {
        const store: Store = new Store("name", 5);
        jest.spyOn(store, "verifyStoreOwner").mockReturnValue(false);
        const user: StoreOwner = new StoreOwner("name","123123");
        expect(storeManagement.verifyStoreOwner(store, user)).toBeFalsy();
    });

    test("verifyStoreManager success", () => {
        const store: Store = new Store("name", 5);
        jest.spyOn(store, "verifyStoreManager").mockReturnValue(true);
        const user: StoreOwner = new StoreOwner("name","123123");
        expect(storeManagement.verifyStoreManager(store, user)).toBeTruthy();
    });


    test("verifyStoreManager failure", () => {
        const store: Store = new Store("name", 5);
        jest.spyOn(store, "verifyStoreManager").mockReturnValue(false);
        const user: StoreOwner = new StoreOwner("name","123123");
        expect(storeManagement.verifyStoreManager(store, user)).toBeFalsy();
    });


});
