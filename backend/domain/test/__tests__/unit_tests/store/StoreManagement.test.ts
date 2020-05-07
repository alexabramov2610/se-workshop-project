import {Store, StoreManagement} from "../../../../src/store/internal_api";
import {RegisteredUser, StoreManager, StoreOwner} from "../../../../src/user/internal_api";
import {
    IItem as ItemReq,
    IProduct as ProductReq,
    ProductCatalogNumber,
    ProductInStore,
    ProductWithQuantity,
    SearchFilters,
    SearchQuery
} from "se-workshop-20-interfaces/dist/src/CommonInterface";
import {errorMsg} from "../../../../src/api-int/Error";
import {ManagementPermission, ProductCategory, Rating} from "se-workshop-20-interfaces/dist/src/Enums";
import {Product} from "../../../../src/trading_system/internal_api";
import {ExternalSystemsManager} from "../../../../src/external_systems/internal_api";
import {Req, Res} from 'se-workshop-20-interfaces'

const storeReq = {storeName: "mock-store", description: "storeDescription"}
let store: Store = new Store("name", "storeDesc");
describe("Store Management Unit Tests", () => {
    let storeManagement: StoreManagement;
    beforeEach(() => {
        storeManagement = new StoreManagement(new ExternalSystemsManager());
        store = new Store("store-name", "storeDesc");
    });


    test("verifyStore success", () => {
        const storeToCheck: Store = new Store("mock-store", "storeDescription");
        expect(storeManagement.isStoreLegal(storeToCheck)).toBe(true);
    });

    test("verifyStore failure", () => {
        const storeToCheck: Store = new Store("", "storeDescription");
        expect(storeManagement.isStoreLegal(storeToCheck)).toBe(false);
    });


    test("addStore success", () => {
        const user: RegisteredUser = new RegisteredUser("tal", "tal12345");
        const res: Res.BoolResponse = storeManagement.addStore("new store name", "storeDescription", user);
        expect(res.data.result).toBeTruthy();

    });

    test("verifyStoreOwner success", () => {
        const store: Store = new Store("name", "storeDescription");
        const user: StoreOwner = new StoreOwner("name");
        jest.spyOn(store, "verifyIsStoreOwner").mockReturnValue(true);
        jest.spyOn(storeManagement, "findStoreByName").mockReturnValue(store);
        expect(storeManagement.verifyStoreOwner(store.storeName, user)).toBeTruthy();
    });

    test("verifyStoreOwner failure", () => {
        const store: Store = new Store("name", "storeDescription");
        jest.spyOn(store, "verifyIsStoreOwner").mockReturnValue(false);
        const user: StoreOwner = new StoreOwner("name");
        expect(storeManagement.verifyStoreOwner(store.storeName, user)).toBeFalsy();
    });


    test("verifyStoreManager success", () => {
        const store: Store = new Store("name", "storeDescription");
        const user: StoreOwner = new StoreOwner("name");
        jest.spyOn(store, "verifyIsStoreManager").mockReturnValue(true);
        jest.spyOn(storeManagement, "findStoreByName").mockReturnValue(store);
        expect(storeManagement.verifyStoreManager(store.storeName, user)).toBeTruthy();
    });

    test("verifyStoreManager failure", () => {
        const store: Store = new Store("name", "storeDescription");
        const user: StoreOwner = new StoreOwner("name");
        jest.spyOn(store, "verifyIsStoreManager").mockReturnValue(false);
        expect(storeManagement.verifyStoreManager(store.storeName, user)).toBeFalsy();
    });


    test("verifyStoreOperation success", () => {
        const store: Store = new Store("name", "storeDescription");
        jest.spyOn(store, "verifyIsStoreManager").mockReturnValue(true);
        jest.spyOn(storeManagement, "verifyStoreExists").mockReturnValue(true);
        jest.spyOn(storeManagement, "verifyStoreOwner").mockReturnValue(true);

        const user: StoreOwner = new StoreOwner("name");
        expect(storeManagement.verifyStoreOperation(store.storeName, user, ManagementPermission.MANAGE_INVENTORY)).toBeTruthy();
    });

    test("verifyStoreOperation failure - store doesn't exist", () => {
        const store: Store = new Store("name", "storeDescription");
        jest.spyOn(storeManagement, "verifyStoreExists").mockReturnValue(false);
        jest.spyOn(storeManagement, "verifyStoreOwner").mockReturnValue(true);

        const user: StoreOwner = new StoreOwner("name");
        const res: Res.BoolResponse = storeManagement.verifyStoreOperation(store.storeName, user, ManagementPermission.MANAGE_INVENTORY);
        expect(res.data.result).toBeFalsy();
        expect(res.error).toBeDefined();

    });

    test("verifyStoreOperation failure - not owner or manager", () => {
        jest.spyOn(storeManagement, "verifyStoreExists").mockReturnValue(true);
        jest.spyOn(storeManagement, "verifyStoreOwner").mockReturnValue(false);
        jest.spyOn(storeManagement, "verifyStoreManager").mockReturnValue(false);

        const user: StoreOwner = new StoreOwner("name");
        const res: Res.BoolResponse = storeManagement.verifyStoreOperation(store.storeName, user, ManagementPermission.MANAGE_INVENTORY);
        expect(res.data.result).toBeFalsy();
        expect(res.error).toBeDefined();
    });


    test("assignStoreOwner success", () => {
        const store: Store = new Store("name", "store desc");
        const isOperationValid: Res.BoolResponse = {data: {result: true}};
        const alreadyOwner: StoreOwner = new StoreOwner("name1");
        const ownerToAssign: StoreOwner = new StoreOwner("name2");

        jest.spyOn(storeManagement, "findStoreByName").mockReturnValue(store);
        jest.spyOn(store, "getStoreOwner").mockReturnValue(alreadyOwner);
        jest.spyOn(store, "verifyIsStoreOwner").mockReturnValue(false);
        jest.spyOn(store, "addStoreOwner").mockReturnValue(isOperationValid);

        const res: Res.BoolResponse = storeManagement.assignStoreOwner(store.storeName, ownerToAssign, alreadyOwner);

        expect(res.data.result).toBeTruthy();
        expect(store.addStoreOwner).toBeCalledTimes(1);
        expect(alreadyOwner.isAssignerOfOwner(ownerToAssign)).toBe(true);
    });

    test("assignStoreOwner failure - store doesn't exist", () => {
        const store: Store = new Store("name", "store desc");
        const isOperationValid: Res.BoolResponse = {data: {result: true}};
        const alreadyOwner: StoreOwner = new StoreOwner("name1");
        const ownerToAssign: StoreOwner = new StoreOwner("name2");

        jest.spyOn(storeManagement, "findStoreByName").mockReturnValue(undefined);
        jest.spyOn(store, "getStoreOwner").mockReturnValue(alreadyOwner);
        jest.spyOn(store, "verifyIsStoreOwner").mockReturnValue(false);
        jest.spyOn(store, "addStoreOwner").mockReturnValue(isOperationValid);

        const res: Res.BoolResponse = storeManagement.assignStoreOwner(store.storeName, ownerToAssign, alreadyOwner);

        expect(res.data.result).toBe(false);
        expect(store.addStoreOwner).toBeCalledTimes(0);
        expect(alreadyOwner.isAssignerOfOwner(ownerToAssign)).toBe(false);
    });

    test("assignStoreOwner failure - invalid assigner", () => {
        const isOperationValid: Res.BoolResponse = {data: {result: true}};
        const alreadyOwner: StoreOwner = new StoreOwner("name1");
        const ownerToAssign: StoreOwner = new StoreOwner("name2");

        jest.spyOn(storeManagement, "findStoreByName").mockReturnValue(store);
        jest.spyOn(store, "getStoreOwner").mockReturnValue(undefined);
        jest.spyOn(store, "verifyIsStoreOwner").mockReturnValue(false);
        jest.spyOn(store, "addStoreOwner").mockReturnValue(isOperationValid);

        const res: Res.BoolResponse = storeManagement.assignStoreOwner(store.storeName, ownerToAssign, alreadyOwner);

        expect(res.data.result).toBe(false);
        expect(store.addStoreOwner).toBeCalledTimes(0);
        expect(alreadyOwner.isAssignerOfOwner(ownerToAssign)).toBe(false);
    });

    test("assignStoreOwner failure - already owner", () => {
        const store: Store = new Store("name", "store desc");
        const isOperationValid: Res.BoolResponse = {data: {result: true}};
        const alreadyOwner: StoreOwner = new StoreOwner("name1");
        const ownerToAssign: StoreOwner = new StoreOwner("name2");

        jest.spyOn(storeManagement, "findStoreByName").mockReturnValue(store);
        jest.spyOn(store, "getStoreOwner").mockReturnValue(alreadyOwner);
        jest.spyOn(store, "verifyIsStoreOwner").mockReturnValue(true);
        jest.spyOn(store, "addStoreOwner").mockReturnValue(isOperationValid);

        const res: Res.BoolResponse = storeManagement.assignStoreOwner(store.storeName, ownerToAssign, alreadyOwner);

        expect(res.data.result).toBe(false);
        expect(store.addStoreOwner).toBeCalledTimes(0);
        expect(alreadyOwner.isAssignerOfOwner(ownerToAssign)).toBe(false);
    });


    test("assignStoreManager success", () => {
        const store: Store = new Store("name", "store desc");
        const isOperationValid: Res.BoolResponse = {data: {result: true}};
        const alreadyOwner: StoreOwner = new StoreOwner("name1");
        const managerToAssign: StoreManager = new StoreManager("name2");

        jest.spyOn(storeManagement, "findStoreByName").mockReturnValue(store);
        jest.spyOn(store, "getStoreOwner").mockReturnValue(alreadyOwner);
        jest.spyOn(store, "verifyIsStoreManager").mockReturnValue(false);
        jest.spyOn(store, "addStoreManager").mockReturnValue(isOperationValid);

        const res: Res.BoolResponse = storeManagement.assignStoreManager(store.storeName, managerToAssign, alreadyOwner);

        expect(res.data.result).toBeTruthy();
        expect(store.addStoreManager).toBeCalledTimes(1);
        expect(alreadyOwner.isAssignerOfManager(managerToAssign)).toBe(true);
    });

    test("assignStoreManager failure - store doesn't exist", () => {
        const store: Store = new Store("name", "store desc");
        const isOperationValid: Res.BoolResponse = {data: {result: true}};
        const alreadyOwner: StoreOwner = new StoreOwner("name1");
        const managerToAssign: StoreManager = new StoreManager("name2");

        jest.spyOn(storeManagement, "findStoreByName").mockReturnValue(undefined);
        jest.spyOn(store, "getStoreOwner").mockReturnValue(alreadyOwner);
        jest.spyOn(store, "verifyIsStoreManager").mockReturnValue(false);
        jest.spyOn(store, "addStoreManager").mockReturnValue(isOperationValid);

        const res: Res.BoolResponse = storeManagement.assignStoreManager(store.storeName, managerToAssign, alreadyOwner);

        expect(res.data.result).toBe(false);
        expect(store.addStoreManager).toBeCalledTimes(0);
        expect(alreadyOwner.isAssignerOfManager(managerToAssign)).toBe(false);
    });

    test("assignStoreManager failure - invalid assigner", () => {
        const store: Store = new Store("name", "store desc");
        const isOperationValid: Res.BoolResponse = {data: {result: true}};
        const alreadyOwner: StoreOwner = new StoreOwner("name1");
        const managerToAssign: StoreManager = new StoreManager("name2");

        jest.spyOn(storeManagement, "findStoreByName").mockReturnValue(store);
        jest.spyOn(store, "getStoreOwner").mockReturnValue(undefined);
        jest.spyOn(store, "verifyIsStoreManager").mockReturnValue(false);
        jest.spyOn(store, "addStoreManager").mockReturnValue(isOperationValid);

        const res: Res.BoolResponse = storeManagement.assignStoreManager(store.storeName, managerToAssign, alreadyOwner);

        expect(res.data.result).toBe(false);
        expect(store.addStoreManager).toBeCalledTimes(0);
        expect(alreadyOwner.isAssignerOfManager(managerToAssign)).toBe(false);
    });

    test("assignStoreManager failure - already manager", () => {
        const store: Store = new Store("name", "store desc");
        const isOperationValid: Res.BoolResponse = {data: {result: true}};
        const alreadyOwner: StoreOwner = new StoreOwner("name1");
        const managerToAssign: StoreManager = new StoreManager("name2");

        jest.spyOn(storeManagement, "findStoreByName").mockReturnValue(store);
        jest.spyOn(store, "getStoreOwner").mockReturnValue(alreadyOwner);
        jest.spyOn(store, "verifyIsStoreManager").mockReturnValue(true);
        jest.spyOn(store, "addStoreManager").mockReturnValue(isOperationValid);

        const res: Res.BoolResponse = storeManagement.assignStoreManager(store.storeName, managerToAssign, alreadyOwner);

        expect(res.data.result).toBe(false);
        expect(store.addStoreManager).toBeCalledTimes(0);
        expect(alreadyOwner.isAssignerOfManager(managerToAssign)).toBe(false);
    });


    test("removeStoreOwner success", () => {
        const store: Store = new Store("name", "store desc");
        const isOperationValid: Res.BoolResponse = {data: {result: true}};
        const alreadyOwner: StoreOwner = new StoreOwner("name1");
        const ownerToAssign: StoreOwner = new StoreOwner("name2");
        alreadyOwner.assignStoreOwner(ownerToAssign);
        expect(alreadyOwner.isAssignerOfOwner(ownerToAssign)).toBe(true);

        jest.spyOn(storeManagement, "findStoreByName").mockReturnValue(store);
        jest.spyOn(store, "getStoreOwner").mockReturnValueOnce(alreadyOwner);
        jest.spyOn(store, "getStoreOwner").mockReturnValueOnce(ownerToAssign);
        jest.spyOn(store, "removeStoreOwner").mockReturnValue(isOperationValid);

        const res: Res.BoolResponse = storeManagement.removeStoreOwner(store.storeName, ownerToAssign, alreadyOwner);

        expect(res.data.result).toBeTruthy();
        expect(store.removeStoreOwner).toBeCalledTimes(1);
        expect(alreadyOwner.isAssignerOfOwner(ownerToAssign)).toBe(false);
    });

    test("removeStoreOwner failure - store doesn't exist", () => {
        const store: Store = new Store("name", "store desc");
        const isOperationValid: Res.BoolResponse = {data: {result: true}};
        const alreadyOwner: StoreOwner = new StoreOwner("name1");
        const ownerToAssign: StoreOwner = new StoreOwner("name2");
        alreadyOwner.assignStoreOwner(ownerToAssign);
        expect(alreadyOwner.isAssignerOfOwner(ownerToAssign)).toBe(true);

        jest.spyOn(storeManagement, "findStoreByName").mockReturnValue(undefined);
        jest.spyOn(store, "getStoreOwner").mockReturnValueOnce(alreadyOwner);
        jest.spyOn(store, "getStoreOwner").mockReturnValueOnce(ownerToAssign);
        jest.spyOn(store, "removeStoreOwner").mockReturnValue(isOperationValid);

        const res: Res.BoolResponse = storeManagement.removeStoreOwner(store.storeName, ownerToAssign, alreadyOwner);

        expect(res.data.result).toBe(false);
        expect(store.removeStoreOwner).toBeCalledTimes(0);
        expect(alreadyOwner.isAssignerOfOwner(ownerToAssign)).toBe(true);
    });

    test("removeStoreOwner failure - invalid assigner", () => {
        const store: Store = new Store("name", "store desc");
        const isOperationValid: Res.BoolResponse = {data: {result: true}};
        const alreadyOwner: StoreOwner = new StoreOwner("name1");
        const ownerToAssign: StoreOwner = new StoreOwner("name2");
        alreadyOwner.assignStoreOwner(ownerToAssign);
        expect(alreadyOwner.isAssignerOfOwner(ownerToAssign)).toBe(true);

        jest.spyOn(storeManagement, "findStoreByName").mockReturnValue(store);
        jest.spyOn(store, "getStoreOwner").mockReturnValueOnce(undefined);
        jest.spyOn(store, "getStoreOwner").mockReturnValueOnce(ownerToAssign);
        jest.spyOn(store, "removeStoreOwner").mockReturnValue(isOperationValid);

        const res: Res.BoolResponse = storeManagement.removeStoreOwner(store.storeName, ownerToAssign, alreadyOwner);

        expect(res.data.result).toBe(false);
        expect(store.removeStoreOwner).toBeCalledTimes(0);
        expect(alreadyOwner.isAssignerOfOwner(ownerToAssign)).toBe(true);
    });

    test("removeStoreOwner failure - already manager", () => {
        const isOperationValid: Res.BoolResponse = {data: {result: true}};
        const alreadyOwner: StoreOwner = new StoreOwner("name1");
        const ownerToAssign: StoreOwner = new StoreOwner("name2");
        alreadyOwner.assignStoreOwner(ownerToAssign);
        expect(alreadyOwner.isAssignerOfOwner(ownerToAssign)).toBe(true);

        jest.spyOn(storeManagement, "findStoreByName").mockReturnValue(store);
        jest.spyOn(store, "getStoreOwner").mockReturnValueOnce(alreadyOwner);
        jest.spyOn(store, "getStoreOwner").mockReturnValueOnce(undefined);
        jest.spyOn(store, "removeStoreOwner").mockReturnValue(isOperationValid);

        const res: Res.BoolResponse = storeManagement.removeStoreOwner(store.storeName, ownerToAssign, alreadyOwner);

        expect(res.data.result).toBe(false);
        expect(store.removeStoreOwner).toBeCalledTimes(0);
        expect(alreadyOwner.isAssignerOfOwner(ownerToAssign)).toBe(true);
    });

    test("removeStoreOwner failure - not assigner", () => {
        const isOperationValid: Res.BoolResponse = {data: {result: true}};
        const alreadyOwner: StoreOwner = new StoreOwner("alreadyOwnerName");
        const ownerToAssign1: StoreOwner = new StoreOwner("name1");
        const ownerToAssign2: StoreOwner = new StoreOwner("name2");
        alreadyOwner.assignStoreOwner(ownerToAssign1);
        ownerToAssign1.assignStoreOwner(ownerToAssign2);
        expect(alreadyOwner.isAssignerOfOwner(ownerToAssign1)).toBe(true);

        jest.spyOn(storeManagement, "findStoreByName").mockReturnValue(store);
        jest.spyOn(store, "getStoreOwner").mockReturnValueOnce(alreadyOwner);
        jest.spyOn(store, "getStoreOwner").mockReturnValueOnce(ownerToAssign2);
        jest.spyOn(store, "removeStoreOwner").mockReturnValue(isOperationValid);

        const res: Res.BoolResponse = storeManagement.removeStoreOwner(store.storeName, ownerToAssign2, alreadyOwner);

        expect(res.data.result).toBe(false);
        expect(store.removeStoreOwner).toBeCalledTimes(0);
        expect(alreadyOwner.isAssignerOfOwner(ownerToAssign1)).toBe(true);
        expect(ownerToAssign1.isAssignerOfOwner(ownerToAssign2)).toBe(true);
    });


    test("removeStoreManager success", () => {
        const isOperationValid: Res.BoolResponse = {data: {result: true}};
        const alreadyOwner: StoreOwner = new StoreOwner("name1");
        const managerToAssign: StoreManager = new StoreManager("name2");
        alreadyOwner.assignStoreManager(managerToAssign);
        expect(alreadyOwner.isAssignerOfManager(managerToAssign)).toBe(true);

        jest.spyOn(storeManagement, "findStoreByName").mockReturnValue(store);
        jest.spyOn(store, "getStoreOwner").mockReturnValueOnce(alreadyOwner);
        jest.spyOn(store, "getStoreManager").mockReturnValueOnce(managerToAssign);
        jest.spyOn(store, "removeStoreManager").mockReturnValue(isOperationValid);

        const res: Res.BoolResponse = storeManagement.removeStoreManager(store.storeName, managerToAssign, alreadyOwner);

        expect(res.data.result).toBeTruthy();
        expect(store.removeStoreManager).toBeCalledTimes(1);
        expect(alreadyOwner.isAssignerOfManager(managerToAssign)).toBe(false);
    });

    test("removeStoreManager failure - store doesn't exist", () => {
        const isOperationValid: Res.BoolResponse = {data: {result: true}};
        const alreadyOwner: StoreOwner = new StoreOwner("name1");
        const managerToAssign: StoreManager = new StoreManager("name2");
        alreadyOwner.assignStoreManager(managerToAssign);
        expect(alreadyOwner.isAssignerOfManager(managerToAssign)).toBe(true);

        jest.spyOn(storeManagement, "findStoreByName").mockReturnValue(undefined);
        jest.spyOn(store, "getStoreOwner").mockReturnValueOnce(alreadyOwner);
        jest.spyOn(store, "getStoreManager").mockReturnValueOnce(managerToAssign);
        jest.spyOn(store, "removeStoreManager").mockReturnValue(isOperationValid);

        const res: Res.BoolResponse = storeManagement.removeStoreManager(store.storeName, managerToAssign, alreadyOwner);

        expect(res.data.result).toBe(false);
        expect(store.removeStoreManager).toBeCalledTimes(0);
        expect(alreadyOwner.isAssignerOfManager(managerToAssign)).toBe(true);
    });

    test("removeStoreManager failure - invalid assigner", () => {
        const isOperationValid: Res.BoolResponse = {data: {result: true}};
        const alreadyOwner: StoreOwner = new StoreOwner("name1");
        const managerToAssign: StoreManager = new StoreManager("name2");
        alreadyOwner.assignStoreManager(managerToAssign);
        expect(alreadyOwner.isAssignerOfManager(managerToAssign)).toBe(true);

        jest.spyOn(storeManagement, "findStoreByName").mockReturnValue(store);
        jest.spyOn(store, "getStoreOwner").mockReturnValueOnce(undefined);
        jest.spyOn(store, "getStoreManager").mockReturnValueOnce(managerToAssign);
        jest.spyOn(store, "removeStoreManager").mockReturnValue(isOperationValid);

        const res: Res.BoolResponse = storeManagement.removeStoreManager(store.storeName, managerToAssign, alreadyOwner);

        expect(res.data.result).toBe(false);
        expect(store.removeStoreManager).toBeCalledTimes(0);
        expect(alreadyOwner.isAssignerOfManager(managerToAssign)).toBe(true);
    });

    test("removeStoreManager failure - already manager", () => {
        const isOperationValid: Res.BoolResponse = {data: {result: true}};
        const alreadyOwner: StoreOwner = new StoreOwner("name1");
        const managerToAssign: StoreManager = new StoreManager("name2");
        alreadyOwner.assignStoreManager(managerToAssign);
        expect(alreadyOwner.isAssignerOfManager(managerToAssign)).toBe(true);

        jest.spyOn(storeManagement, "findStoreByName").mockReturnValue(store);
        jest.spyOn(store, "getStoreOwner").mockReturnValueOnce(alreadyOwner);
        jest.spyOn(store, "getStoreManager").mockReturnValueOnce(undefined);
        jest.spyOn(store, "removeStoreManager").mockReturnValue(isOperationValid);

        const res: Res.BoolResponse = storeManagement.removeStoreManager(store.storeName, managerToAssign, alreadyOwner);

        expect(res.data.result).toBe(false);
        expect(store.removeStoreManager).toBeCalledTimes(0);
        expect(alreadyOwner.isAssignerOfManager(managerToAssign)).toBe(true);
    });

    test("removeStoreManager failure - not assigner", () => {
        const isOperationValid: Res.BoolResponse = {data: {result: true}};
        const alreadyOwner: StoreOwner = new StoreOwner("alreadyOwnerName");
        const ownerToAssign1: StoreOwner = new StoreOwner("name1");
        const managerToAssign: StoreManager = new StoreManager("name2");
        alreadyOwner.assignStoreOwner(ownerToAssign1);
        ownerToAssign1.assignStoreManager(managerToAssign);

        jest.spyOn(storeManagement, "findStoreByName").mockReturnValue(store);
        jest.spyOn(store, "getStoreOwner").mockReturnValueOnce(alreadyOwner);
        jest.spyOn(store, "getStoreManager").mockReturnValueOnce(managerToAssign);
        jest.spyOn(store, "removeStoreManager").mockReturnValue(isOperationValid);

        const res: Res.BoolResponse = storeManagement.removeStoreManager(store.storeName, managerToAssign, alreadyOwner);

        expect(res.data.result).toBe(false);
        expect(store.removeStoreManager).toBeCalledTimes(0);
        expect(alreadyOwner.isAssignerOfOwner(ownerToAssign1)).toBe(true);
        expect(alreadyOwner.isAssignerOfManager(managerToAssign)).toBe(false);
        expect(ownerToAssign1.isAssignerOfManager(managerToAssign)).toBe(true);
    });


    test("removeManagerPermissions - Success", () => {
        const isSuccessVerify: boolean = true;
        const storeOwner: StoreOwner = new StoreOwner("storeOwner-mock");
        const storeManager: StoreManager = new StoreManager("storeManager-mock");
        const permissionToRemove: ManagementPermission = ManagementPermission.REPLY_USER_QUESTIONS;
        const permissions: ManagementPermission[] = [permissionToRemove];

        mockVerifyStoreOperation(isSuccessVerify);
        jest.spyOn(storeManagement, "findStoreByName").mockReturnValue(store);
        jest.spyOn(store, "getStoreOwner").mockReturnValue(storeOwner);
        jest.spyOn(store, "getStoreManager").mockReturnValue(storeManager);
        jest.spyOn(storeOwner, "isAssignerOfManager").mockReturnValue(true);


        const actualRes: Res.BoolResponse = storeManagement.removeManagerPermissions(storeOwner, store.storeName, storeManager.name, permissions);
        expect(actualRes.data.result).toBe(true);
        expect(storeManager.getPermissions().length).toBeGreaterThan(0);
        expect(storeManager.getPermissions().includes(permissionToRemove)).toBe(false);
    });

    test("removeManagerPermissions - Failure: store doesn't exist", () => {
        const isSuccessVerify: boolean = true;
        const storeOwner: StoreOwner = new StoreOwner("storeOwner-mock");
        const storeManager: StoreManager = new StoreManager("storeManager-mock");
        const permissionToRemove: ManagementPermission = ManagementPermission.REPLY_USER_QUESTIONS;
        const permissions: ManagementPermission[] = [permissionToRemove];

        mockVerifyStoreOperation(isSuccessVerify);
        jest.spyOn(storeManagement, "findStoreByName").mockReturnValue(undefined);
        jest.spyOn(store, "getStoreOwner").mockReturnValue(storeOwner);
        jest.spyOn(store, "getStoreManager").mockReturnValue(storeManager);
        jest.spyOn(storeOwner, "isAssignerOfManager").mockReturnValue(true);


        const actualRes: Res.BoolResponse = storeManagement.removeManagerPermissions(storeOwner, store.storeName, storeManager.name, permissions);
        expect(actualRes.data.result).toBe(false);
        expect(storeManager.getPermissions().length).toBeGreaterThan(0);
        expect(storeManager.getPermissions().includes(permissionToRemove)).toBe(true);
    });

    test("removeManagerPermissions - Failure: manager doesn't exist", () => {
        const isSuccessVerify: boolean = true;
        const storeOwner: StoreOwner = new StoreOwner("storeOwner-mock");
        const storeManager: StoreManager = new StoreManager("storeManager-mock");
        const permissionToRemove: ManagementPermission = ManagementPermission.REPLY_USER_QUESTIONS;
        const permissions: ManagementPermission[] = [permissionToRemove];

        mockVerifyStoreOperation(isSuccessVerify);
        jest.spyOn(storeManagement, "findStoreByName").mockReturnValue(store);
        jest.spyOn(store, "getStoreOwner").mockReturnValue(storeOwner);
        jest.spyOn(store, "getStoreManager").mockReturnValue(undefined);
        jest.spyOn(storeOwner, "isAssignerOfManager").mockReturnValue(true);


        const actualRes: Res.BoolResponse = storeManagement.removeManagerPermissions(storeOwner, store.storeName, storeManager.name, permissions);
        expect(actualRes.data.result).toBe(false);
        expect(storeManager.getPermissions().length).toBeGreaterThan(0);
        expect(storeManager.getPermissions().includes(permissionToRemove)).toBe(true);
    });

    test("removeManagerPermissions - Failure: owner is not assigner of manager", () => {
        const isSuccessVerify: boolean = true;
        const storeOwner: StoreOwner = new StoreOwner("storeOwner-mock");
        const storeManager: StoreManager = new StoreManager("storeManager-mock");
        const permissionToRemove: ManagementPermission = ManagementPermission.REPLY_USER_QUESTIONS;
        const permissions: ManagementPermission[] = [permissionToRemove];

        mockVerifyStoreOperation(isSuccessVerify);
        jest.spyOn(storeManagement, "findStoreByName").mockReturnValue(store);
        jest.spyOn(store, "getStoreOwner").mockReturnValue(storeOwner);
        jest.spyOn(store, "getStoreManager").mockReturnValue(storeManager);
        jest.spyOn(storeOwner, "isAssignerOfManager").mockReturnValue(false);


        const actualRes: Res.BoolResponse = storeManagement.removeManagerPermissions(storeOwner, store.storeName, storeManager.name, permissions);
        expect(actualRes.data.result).toBe(false);
        expect(storeManager.getPermissions().length).toBeGreaterThan(0);
        expect(storeManager.getPermissions().includes(permissionToRemove)).toBe(true);
    });

    test("removeManagerPermissions - Failure: is not store owner", () => {
        const isSuccessVerify: boolean = true;
        const storeOwner: StoreOwner = new StoreOwner("storeOwner-mock");
        const storeManager: StoreManager = new StoreManager("storeManager-mock");
        const permissionToRemove: ManagementPermission = ManagementPermission.REPLY_USER_QUESTIONS;
        const permissions: ManagementPermission[] = [permissionToRemove];

        mockVerifyStoreOperation(isSuccessVerify);
        jest.spyOn(storeManagement, "findStoreByName").mockReturnValue(store);
        jest.spyOn(store, "getStoreOwner").mockReturnValue(undefined);
        jest.spyOn(store, "getStoreManager").mockReturnValue(storeManager);
        jest.spyOn(storeOwner, "isAssignerOfManager").mockReturnValue(true);


        const actualRes: Res.BoolResponse = storeManagement.removeManagerPermissions(storeOwner, store.storeName, storeManager.name, permissions);
        expect(actualRes.data.result).toBe(false);
        expect(storeManager.getPermissions().length).toBeGreaterThan(0);
        expect(storeManager.getPermissions().includes(permissionToRemove)).toBe(true);
    });

    test("removeManagerPermissions - Failure: invalid permission", () => {
        const isSuccessVerify: boolean = true;
        const storeOwner: StoreOwner = new StoreOwner("storeOwner-mock");
        const storeManager: StoreManager = new StoreManager("storeManager-mock");
        const permissionToRemove: ManagementPermission = -2;
        const permissions: ManagementPermission[] = [permissionToRemove];

        mockVerifyStoreOperation(isSuccessVerify);
        jest.spyOn(storeManagement, "findStoreByName").mockReturnValue(store);
        jest.spyOn(store, "getStoreOwner").mockReturnValue(storeOwner);
        jest.spyOn(store, "getStoreManager").mockReturnValue(storeManager);
        jest.spyOn(storeOwner, "isAssignerOfManager").mockReturnValue(true);


        const actualRes: Res.BoolResponse = storeManagement.removeManagerPermissions(storeOwner, store.storeName, storeManager.name, permissions);
        expect(actualRes.data.result).toBe(false);
        expect(storeManager.getPermissions().length).toBeGreaterThan(0);
        expect(storeManager.getPermissions().includes(permissionToRemove)).toBe(false);
    });


    test("addManagerPermissions - Success", () => {
        const isSuccessVerify: boolean = true;
        const storeOwner: StoreOwner = new StoreOwner("storeOwner-mock");
        const storeManager: StoreManager = new StoreManager("storeManager-mock");
        const permissionToRemove: ManagementPermission = ManagementPermission.CLOSE_STORE;
        const permissions: ManagementPermission[] = [permissionToRemove];

        mockVerifyStoreOperation(isSuccessVerify);
        jest.spyOn(storeManagement, "findStoreByName").mockReturnValue(store);
        jest.spyOn(store, "getStoreOwner").mockReturnValue(storeOwner);
        jest.spyOn(store, "getStoreManager").mockReturnValue(storeManager);
        jest.spyOn(storeOwner, "isAssignerOfManager").mockReturnValue(true);


        const actualRes: Res.BoolResponse = storeManagement.addManagerPermissions(storeOwner, store.storeName, storeManager.name, permissions);
        expect(actualRes.data.result).toBe(true);
        expect(storeManager.getPermissions().length).toBeGreaterThan(0);
        expect(storeManager.getPermissions().includes(permissionToRemove)).toBe(true);
    });

    test("addManagerPermissions - Failure: store doesn't exist", () => {
        const isSuccessVerify: boolean = true;
        const storeOwner: StoreOwner = new StoreOwner("storeOwner-mock");
        const storeManager: StoreManager = new StoreManager("storeManager-mock");
        const permissionToRemove: ManagementPermission = ManagementPermission.CLOSE_STORE;
        const permissions: ManagementPermission[] = [permissionToRemove];

        mockVerifyStoreOperation(isSuccessVerify);
        jest.spyOn(storeManagement, "findStoreByName").mockReturnValue(undefined);
        jest.spyOn(store, "getStoreOwner").mockReturnValue(storeOwner);
        jest.spyOn(store, "getStoreManager").mockReturnValue(storeManager);
        jest.spyOn(storeOwner, "isAssignerOfManager").mockReturnValue(true);


        const actualRes: Res.BoolResponse = storeManagement.addManagerPermissions(storeOwner, store.storeName, storeManager.name, permissions);
        expect(actualRes.data.result).toBe(false);
        expect(storeManager.getPermissions().length).toBeGreaterThan(0);
        expect(storeManager.getPermissions().includes(permissionToRemove)).toBe(false);
    });

    test("addManagerPermissions - Failure: manager doesn't exist", () => {
        const isSuccessVerify: boolean = true;
        const storeOwner: StoreOwner = new StoreOwner("storeOwner-mock");
        const storeManager: StoreManager = new StoreManager("storeManager-mock");
        const permissionToRemove: ManagementPermission = ManagementPermission.CLOSE_STORE;
        const permissions: ManagementPermission[] = [permissionToRemove];

        mockVerifyStoreOperation(isSuccessVerify);
        jest.spyOn(storeManagement, "findStoreByName").mockReturnValue(store);
        jest.spyOn(store, "getStoreOwner").mockReturnValue(storeOwner);
        jest.spyOn(store, "getStoreManager").mockReturnValue(undefined);
        jest.spyOn(storeOwner, "isAssignerOfManager").mockReturnValue(true);


        const actualRes: Res.BoolResponse = storeManagement.addManagerPermissions(storeOwner, store.storeName, storeManager.name, permissions);
        expect(actualRes.data.result).toBe(false);
        expect(storeManager.getPermissions().length).toBeGreaterThan(0);
        expect(storeManager.getPermissions().includes(permissionToRemove)).toBe(false);
    });

    test("addManagerPermissions - Failure: owner is not assigner of manager", () => {
        const isSuccessVerify: boolean = true;
        const storeOwner: StoreOwner = new StoreOwner("storeOwner-mock");
        const storeManager: StoreManager = new StoreManager("storeManager-mock");
        const permissionToRemove: ManagementPermission = ManagementPermission.CLOSE_STORE;
        const permissions: ManagementPermission[] = [permissionToRemove];

        mockVerifyStoreOperation(isSuccessVerify);
        jest.spyOn(storeManagement, "findStoreByName").mockReturnValue(store);
        jest.spyOn(store, "getStoreOwner").mockReturnValue(storeOwner);
        jest.spyOn(store, "getStoreManager").mockReturnValue(storeManager);
        jest.spyOn(storeOwner, "isAssignerOfManager").mockReturnValue(false);


        const actualRes: Res.BoolResponse = storeManagement.addManagerPermissions(storeOwner, store.storeName, storeManager.name, permissions);
        expect(actualRes.data.result).toBe(false);
        expect(storeManager.getPermissions().length).toBeGreaterThan(0);
        expect(storeManager.getPermissions().includes(permissionToRemove)).toBe(false);
    });

    test("addManagerPermissions - Failure: is not store owner", () => {
        const isSuccessVerify: boolean = true;
        const storeOwner: StoreOwner = new StoreOwner("storeOwner-mock");
        const storeManager: StoreManager = new StoreManager("storeManager-mock");
        const permissionToRemove: ManagementPermission = ManagementPermission.CLOSE_STORE;
        const permissions: ManagementPermission[] = [permissionToRemove];

        mockVerifyStoreOperation(isSuccessVerify);
        jest.spyOn(storeManagement, "findStoreByName").mockReturnValue(store);
        jest.spyOn(store, "getStoreOwner").mockReturnValue(undefined);
        jest.spyOn(store, "getStoreManager").mockReturnValue(storeManager);
        jest.spyOn(storeOwner, "isAssignerOfManager").mockReturnValue(true);


        const actualRes: Res.BoolResponse = storeManagement.addManagerPermissions(storeOwner, store.storeName, storeManager.name, permissions);
        expect(actualRes.data.result).toBe(false);
        expect(storeManager.getPermissions().length).toBeGreaterThan(0);
        expect(storeManager.getPermissions().includes(permissionToRemove)).toBe(false);
    });

    test("addManagerPermissions - Failure: invalid permission", () => {
        const isSuccessVerify: boolean = true;
        const storeOwner: StoreOwner = new StoreOwner("storeOwner-mock");
        const storeManager: StoreManager = new StoreManager("storeManager-mock");
        const permissionToRemove: ManagementPermission = -2;
        const permissions: ManagementPermission[] = [permissionToRemove];

        mockVerifyStoreOperation(isSuccessVerify);
        jest.spyOn(storeManagement, "findStoreByName").mockReturnValue(store);
        jest.spyOn(store, "getStoreOwner").mockReturnValue(storeOwner);
        jest.spyOn(store, "getStoreManager").mockReturnValue(storeManager);
        jest.spyOn(storeOwner, "isAssignerOfManager").mockReturnValue(true);


        const actualRes: Res.BoolResponse = storeManagement.addManagerPermissions(storeOwner, store.storeName, storeManager.name, permissions);
        expect(actualRes.data.result).toBe(false);
        expect(storeManager.getPermissions().length).toBeGreaterThan(0);
        expect(storeManager.getPermissions().includes(permissionToRemove)).toBe(false);
    });


    test("changeProductName - Success", () => {
        const isSuccessVerify: boolean = true;
        const prodPrice: number = 5;
        const catalogNumber: number = 5;
        const category: number = 5;
        const product: Product = new Product('name', catalogNumber, prodPrice, category);
        const user: StoreOwner = new StoreOwner("storeOwner-mock");
        const newName: string = "newProductName";

        mockVerifyStoreOperation(isSuccessVerify);
        jest.spyOn(storeManagement, "findStoreByName").mockReturnValue(store);
        jest.spyOn(store, "getProductByCatalogNumber").mockReturnValue(product);

        const actualRes: Res.BoolResponse = storeManagement.changeProductName(user, product.catalogNumber, store.storeName, newName);
        expect(actualRes.data.result).toBe(true);
        expect(product.name).toBe(newName);
        expect(product.catalogNumber).toBe(catalogNumber);
        expect(product.price).toBe(prodPrice);
        expect(product.category).toBe(category);
    });

    test("changeProductName - Failure: not authorized", () => {
        const isSuccessVerify: boolean = false;
        const prodPrice: number = 5;
        const catalogNumber: number = 5;
        const category: number = 5;
        const prodName: string = "mock-name";
        const product: Product = new Product(prodName, catalogNumber, prodPrice, category);
        const user: StoreOwner = new StoreOwner("storeOwner-mock");
        const newName: string = "newProductName";

        mockVerifyStoreOperation(isSuccessVerify);

        const actualRes: Res.BoolResponse = storeManagement.changeProductName(user, product.catalogNumber, store.storeName, newName);
        expect(actualRes.data.result).toBe(false);
        expect(product.name).toBe(prodName);
        expect(product.catalogNumber).toBe(catalogNumber);
        expect(product.price).toBe(prodPrice);
        expect(product.category).toBe(category);
    });

    test("changeProductName - Failure: invalid store", () => {
        const isSuccessVerify: boolean = true;
        const prodPrice: number = 5;
        const catalogNumber: number = 5;
        const category: number = 5;
        const prodName: string = "mock-name";
        const product: Product = new Product(prodName, catalogNumber, prodPrice, category);
        const user: StoreOwner = new StoreOwner("storeOwner-mock");
        const newName: string = "newProductName";

        mockVerifyStoreOperation(isSuccessVerify);
        jest.spyOn(storeManagement, "findStoreByName").mockReturnValue(undefined);

        const actualRes: Res.BoolResponse = storeManagement.changeProductName(user, product.catalogNumber, store.storeName, newName);
        expect(actualRes.data.result).toBe(false);
        expect(product.name).toBe(prodName);
        expect(product.catalogNumber).toBe(catalogNumber);
        expect(product.price).toBe(prodPrice);
        expect(product.category).toBe(category);
    });

    test("changeProductPrice - Success", () => {
        const isSuccessVerify: boolean = true;
        const prodPrice: number = 5;
        const catalogNumber: number = 5;
        const category: number = 5;
        const prodName: string = "mockname";
        const product: Product = new Product(prodName, catalogNumber, prodPrice, category);
        const user: StoreOwner = new StoreOwner("storeOwner-mock");
        const newPrice: number = 20;

        mockVerifyStoreOperation(isSuccessVerify);
        jest.spyOn(storeManagement, "findStoreByName").mockReturnValue(store);
        jest.spyOn(store, "getProductByCatalogNumber").mockReturnValue(product);

        const actualRes: Res.BoolResponse = storeManagement.changeProductPrice(user, product.catalogNumber, store.storeName, newPrice);
        expect(actualRes.data.result).toBe(true);
        expect(product.name).toBe(prodName);
        expect(product.catalogNumber).toBe(catalogNumber);
        expect(product.price).toBe(newPrice);
        expect(product.category).toBe(category);
    });

    test("changeProductPrice - Failure: not authorized", () => {
        const isSuccessVerify: boolean = false;
        const prodPrice: number = 5;
        const catalogNumber: number = 5;
        const category: number = 5;
        const prodName: string = "mock-name";
        const product: Product = new Product(prodName, catalogNumber, prodPrice, category);
        const user: StoreOwner = new StoreOwner("storeOwner-mock");
        const newPrice: number = 20;

        mockVerifyStoreOperation(isSuccessVerify);

        const actualRes: Res.BoolResponse = storeManagement.changeProductPrice(user, product.catalogNumber, store.storeName, newPrice);
        expect(actualRes.data.result).toBe(false);
        expect(product.name).toBe(prodName);
        expect(product.catalogNumber).toBe(catalogNumber);
        expect(product.price).toBe(prodPrice);
        expect(product.category).toBe(category);
    });

    test("changeProductPrice - Failure: invalid store", () => {
        const isSuccessVerify: boolean = true;
        const prodPrice: number = 5;
        const catalogNumber: number = 5;
        const category: number = 5;
        const prodName: string = "mock-name";
        const product: Product = new Product(prodName, catalogNumber, prodPrice, category);
        const user: StoreOwner = new StoreOwner("storeOwner-mock");
        const newPrice: number = 20;

        mockVerifyStoreOperation(isSuccessVerify);
        jest.spyOn(storeManagement, "findStoreByName").mockReturnValue(undefined);

        const actualRes: Res.BoolResponse = storeManagement.changeProductPrice(user, product.catalogNumber, store.storeName, newPrice);
        expect(actualRes.data.result).toBe(false);
        expect(product.name).toBe(prodName);
        expect(product.catalogNumber).toBe(catalogNumber);
        expect(product.price).toBe(prodPrice);
        expect(product.category).toBe(category);
    });

    test("verifyStoreExists Success", () => {
        const storeName: string = 'mock-store';
        const user: RegisteredUser = new StoreOwner("usermock");
        expect(storeManagement.addStore(storeName, "storeDesc", user).data.result).toBeTruthy();

        expect(storeManagement.verifyStoreExists(storeName)).toBeTruthy();
    });

    test("verifyStoreExists Failure", () => {
        expect(storeManagement.verifyStoreExists('storename')).toBeFalsy();
    });


    test("addItems Success", () => {
        const isSuccessVerify: boolean = true;
        const isSuccessFlow: boolean = true;
        mockVerifyStoreOperation(isSuccessVerify);
        const itemsReq: ItemReq[] = [{catalogNumber: 1, id: 1}];
        const mockRes: Res.ItemsAdditionResponse = {data: {result: isSuccessFlow, itemsNotAdded: itemsReq}};
        const user: RegisteredUser = new StoreOwner("usermock");
        jest.spyOn(storeManagement, "findStoreByName").mockReturnValue(store);
        jest.spyOn(store, "addItems").mockReturnValue(mockRes);

        const actualRes: Res.ItemsAdditionResponse = storeManagement.addItems(user, store.storeName, itemsReq);
        expect(actualRes).toBe(mockRes);
        expect(store.addItems).toBeCalledTimes(1);
    });

    test("removeItems Success", () => {
        const isSuccessVerify: boolean = true;
        const isSuccessFlow: boolean = true;
        mockVerifyStoreOperation(isSuccessVerify);
        const itemsReq: ItemReq[] = [];
        const mockRes: Res.ItemsRemovalResponse = {data: {result: isSuccessFlow, itemsNotRemoved: itemsReq}};
        const user: RegisteredUser = new StoreOwner("usermock");
        jest.spyOn(storeManagement, "findStoreByName").mockReturnValue(store);
        jest.spyOn(store, "removeItems").mockReturnValue(mockRes);

        const actualRes: Res.ItemsRemovalResponse = storeManagement.removeItems(user, store.storeName, itemsReq);
        expect(actualRes).toBe(mockRes);
        expect(store.removeItems).toBeCalledTimes(1);
    });

    test("removeProductsWithQuantity Success", () => {
        const isSuccessVerify: boolean = true;
        const isSuccessFlow: boolean = true;
        mockVerifyStoreOperation(isSuccessVerify);
        const itemsReq: ProductWithQuantity[] = [];
        const mockRes: Res.ProductRemovalResponse = {data: {result: isSuccessFlow, productsNotRemoved: itemsReq}};
        const user: RegisteredUser = new StoreOwner("usermock");
        jest.spyOn(storeManagement, "findStoreByName").mockReturnValue(store);
        jest.spyOn(store, "removeProductsWithQuantity").mockReturnValue(mockRes);

        const actualRes: Res.ProductRemovalResponse = storeManagement.removeProductsWithQuantity(user, store.storeName, itemsReq, false);
        expect(actualRes).toBe(mockRes);
        expect(store.removeProductsWithQuantity).toBeCalledTimes(1);
    });

    test("addNewProducts Success", () => {
        const isSuccessVerify: boolean = true;
        const isSuccessFlow: boolean = true;
        mockVerifyStoreOperation(isSuccessVerify);
        const prodReq: ProductReq[] = [{
            name: 'mock-prod',
            category: ProductCategory.ELECTRONICS,
            catalogNumber: 1,
            price: 1
        }];
        const mockRes: Res.ProductAdditionResponse = {data: {result: isSuccessFlow, productsNotAdded: prodReq}};
        const user: RegisteredUser = new StoreOwner("usermock");
        jest.spyOn(storeManagement, "findStoreByName").mockReturnValue(store);
        jest.spyOn(store, "addNewProducts").mockReturnValue(mockRes);

        const actualRes: Res.ProductAdditionResponse = storeManagement.addNewProducts(user, store.storeName, prodReq);
        expect(actualRes).toBe(mockRes);
        expect(store.addNewProducts).toBeCalledTimes(1);
    });

    test("removeProducts Success", () => {
        const isSuccessVerify: boolean = true;
        const isSuccessFlow: boolean = true;
        mockVerifyStoreOperation(isSuccessVerify);
        const itemsReq: ProductCatalogNumber[] = [];
        const mockRes: Res.ProductRemovalResponse = {data: {result: isSuccessFlow, productsNotRemoved: itemsReq}};
        const user: RegisteredUser = new StoreOwner("usermock");
        jest.spyOn(storeManagement, "findStoreByName").mockReturnValue(store);
        jest.spyOn(store, "removeProductsByCatalogNumber").mockReturnValue(mockRes);

        const actualRes: Res.ProductRemovalResponse = storeManagement.removeProducts(user, store.storeName, itemsReq);
        expect(actualRes).toBe(mockRes);
        expect(store.removeProductsByCatalogNumber).toBeCalledTimes(1);
    });

    test("findStoreByName Success", () => {
        const storeName: string = 'mock-store';
        const user: RegisteredUser = new StoreOwner("usermock");
        expect(storeManagement.addStore(storeName, "storedesc", user).data.result).toBeTruthy();

        expect(storeManagement.findStoreByName(storeName)).toBeTruthy();
    });

    test("findStoreByName Failure", () => {
        expect(storeManagement.findStoreByName('storename')).toBeFalsy();
    });

    test('viewStoreInfo cant find store Fail ', () => {
        jest.spyOn(storeManagement, 'findStoreByName').mockReturnValueOnce(undefined);
        const res: Res.StoreInfoResponse = storeManagement.viewStoreInfo('whatever');
        expect(res.data.result).toBeFalsy();
        expect(res.error.message).toEqual(errorMsg.E_NF);
    });

    test('viewStoreInfo Success ', () => {
        const storeName: string = 'mock-store';
        const response: Res.StoreInfoResponse = {data: {result: true}};
        jest.spyOn(storeManagement, 'findStoreByName').mockReturnValueOnce(store);
        jest.spyOn(store, 'viewStoreInfo').mockReturnValueOnce(response);

        const res: Res.StoreInfoResponse = storeManagement.viewStoreInfo(storeName);
        expect(res).toBe(response);
    });

    test('viewProductInfo success test', () => {
        const p = new Product('my product', 12345, 15.90, ProductCategory.GENERAL)
        store.addNewProducts([p]);
        jest.spyOn(storeManagement, "findStoreByName").mockReturnValueOnce(store);
        const res = storeManagement.viewProductInfo({
            body: {storeName: 'store-name', catalogNumber: 12345},
            token: "lala"
        })
        expect(res.data.result).toBeTruthy();
        expect(res.data.info.catalogNumber).toBe(12345);
        expect(res.data.info.price).toBe(15.90);
        expect(res.data.info.category).toBe(ProductCategory.GENERAL);
        expect(res.data.info.quantity).toBe(0);
    })

    test('viewProductInfo fail - store not found', () => {
        const p = new Product('my product', 12345, 15.90, ProductCategory.GENERAL)
        jest.spyOn(storeManagement, "findStoreByName").mockReturnValueOnce(undefined);
        const res = storeManagement.viewProductInfo({
            body: {storeName: 'store-name', catalogNumber: 12345},
            token: "lala"
        })
        expect(res.data.result).toBeFalsy()

    })


    test('viewStoreInfo cant find store Fail ', () => {
        jest.spyOn(storeManagement, 'findStoreByName').mockReturnValueOnce(undefined);
        const res: Res.StoreInfoResponse = storeManagement.viewStoreInfo('whatever');
        expect(res.data.result).toBeFalsy();
        expect(res.error.message).toEqual(errorMsg.E_NF);
    });


    test("search - success with store name matching rating", () => {

        const productsInStore: ProductInStore[] = [{
            product: {
                catalogNumber: 1,
                category: ProductCategory.GENERAL,
                name: "mock",
                price: 11
            }, storeName: store.storeName
        }];
        jest.spyOn(storeManagement, 'findStoreByName').mockReturnValueOnce(store);
        jest.spyOn(store, 'search').mockReturnValueOnce(productsInStore);

        const filters: SearchFilters = {};
        const query: SearchQuery = {
            storeName: store.storeName
        };

        const res: Res.SearchResponse = storeManagement.search(filters, query);

        expect(res.data.result).toBe(true);
        expect(res.data.products).toMatchObject(productsInStore);
        expect(store.search).toBeCalledTimes(1);
    });

    test("search - success with store name not matching rating", () => {

        const productsInStore: ProductInStore[] = [];
        jest.spyOn(storeManagement, 'findStoreByName').mockReturnValueOnce(store);
        jest.spyOn(store, 'search').mockReturnValueOnce(productsInStore);

        const filters: SearchFilters = {
            storeRating: Rating.LOW
        };
        const query: SearchQuery = {
            storeName: store.storeName
        };

        const res: Res.SearchResponse = storeManagement.search(filters, query);

        expect(res.data.result).toBe(true);
        expect(res.data.products).toMatchObject(productsInStore);
        expect(store.search).toBeCalledTimes(0);
    });

    test("search - failed with store name", () => {

        const productsInStore: ProductInStore[] = [];
        jest.spyOn(storeManagement, 'findStoreByName').mockReturnValueOnce(undefined);
        jest.spyOn(store, 'search').mockReturnValueOnce(productsInStore);

        const filters: SearchFilters = {};
        const query: SearchQuery = {
            storeName: store.storeName
        };

        const res: Res.SearchResponse = storeManagement.search(filters, query);

        expect(res.data.result).toBe(false);
        expect(res.data.products).toMatchObject(productsInStore);
        expect(store.search).toBeCalledTimes(0);
    });

    test("search - success without store name", () => {
        expect(storeManagement.addStore("storename", "storedesc", new RegisteredUser('name', 'pw')).data.result).toBe(true);
        const productsInStore: ProductInStore[] = [];

        const filters: SearchFilters = {};
        const query: SearchQuery = {};

        const res: Res.SearchResponse = storeManagement.search(filters, query);

        expect(res.data.result).toBe(true);
        expect(res.data.products).toMatchObject(productsInStore);
    });


    function mockVerifyStoreOperation(isSuccess: boolean) {
        const mockValidationRes: Res.BoolResponse = isSuccess ? {data: {result: isSuccess}} : {
            data: {result: isSuccess},
            error: {message: "mock"}
        }
        jest.spyOn(storeManagement, "verifyStoreOperation").mockReturnValue(mockValidationRes);
    }

});