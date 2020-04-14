import {Store, StoreManager} from "../../../src/store/internal_api";
import * as Responses from "../../../src/api-ext/Response";
import {StoreOwner, RegisteredUser, Buyer} from "../../../src/user/internal_api";
import * as Res from "../../../src/api-ext/Response";
import exp from "constants";
import {BoolResponse} from "../../../src/api-ext/Response";
import {Item} from "../../../src/trading_system/data/Item";
import {Product as ProductReq, ProductCatalogNumber, ProductWithQuantity, Item as ItemReq} from "../../../src/api-ext/CommonInterface";

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
        const isOperationValid: Res.BoolResponse = {data: {result:false}, error: {message: "mock-err"}};
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

    test("assignStoreManager success", () => {
        const store: Store = new Store("name");
        const isOperationValid: Res.BoolResponse = {data: {result:true}};
        jest.spyOn(storeManagement, "verifyStoreOperation").mockReturnValue(isOperationValid);
        jest.spyOn(store, "verifyIsStoreManager").mockReturnValue(false);
        jest.spyOn(store, "addStoreOwner").mockReturnValue(isOperationValid);
        jest.spyOn(storeManagement, "findStoreByName").mockReturnValue(store);

        const alreadyOwner: StoreOwner = new StoreOwner("name1","123123");
        const ownerToAssign: StoreOwner = new StoreOwner("name2","123123");

        const res: Res.BoolResponse = storeManagement.assignStoreManager(store.storeName, ownerToAssign, alreadyOwner);

        expect(res.data.result).toBeTruthy();
    });

    test("assignStoreManager failure - store doesn't exist or invalid store owner", () => {
        const store: Store = new Store("name");
        const isOperationValid: Res.BoolResponse = {data: {result:false}, error: {message: "mock-err"}};
        jest.spyOn(storeManagement, "verifyStoreOperation").mockReturnValue(isOperationValid);
        jest.spyOn(store, "verifyIsStoreManager").mockReturnValue(true);
        jest.spyOn(store, "addStoreOwner").mockReturnValue(isOperationValid);
        jest.spyOn(storeManagement, "findStoreByName").mockReturnValue(store);

        const alreadyOwner: StoreOwner = new StoreOwner("name1","123123");
        const ownerToAssign: StoreOwner = new StoreOwner("name2","123123");

        const res: Res.BoolResponse = storeManagement.assignStoreManager(store.storeName, ownerToAssign, alreadyOwner);

        expect(res.data.result).toBeFalsy();
        expect(res.error).toBeDefined();
    });

    test("assignStoreManager failure - already owner", () => {
        const store: Store = new Store("name");
        const isOperationValid: Res.BoolResponse = {data: {result:true}};
        jest.spyOn(storeManagement, "verifyStoreOperation").mockReturnValue(isOperationValid);
        jest.spyOn(store, "verifyIsStoreManager").mockReturnValue(true);
        jest.spyOn(store, "addStoreOwner").mockReturnValue(isOperationValid);
        jest.spyOn(storeManagement, "findStoreByName").mockReturnValue(store);

        const alreadyOwner: StoreOwner = new StoreOwner("name1","123123");
        const ownerToAssign: StoreOwner = new StoreOwner("name2","123123");

        const res: Res.BoolResponse = storeManagement.assignStoreManager(store.storeName, ownerToAssign, alreadyOwner);

        expect(res.data.result).toBeFalsy();
        expect(res.error).toBeDefined();
    });


    test("removeStoreOwner success", () => {
        const store: Store = new Store("name");
        const isOperationValid: Res.BoolResponse = {data: {result:true}};
        jest.spyOn(storeManagement, "verifyStoreOperation").mockReturnValue(isOperationValid);
        jest.spyOn(store, "verifyIsStoreOwner").mockReturnValue(false);
        jest.spyOn(store, "removeStoreOwner").mockReturnValue(isOperationValid);
        jest.spyOn(storeManagement, "findStoreByName").mockReturnValue(store);

        const alreadyOwner: StoreOwner = new StoreOwner("name1","123123");
        const ownerToRemove: StoreOwner = new StoreOwner("name2","123123");

        let res: Res.BoolResponse = storeManagement.assignStoreOwner(store.storeName, ownerToRemove, alreadyOwner);
        expect(res.data.result).toBeTruthy();

        res = storeManagement.removeStoreOwner(store.storeName, ownerToRemove, alreadyOwner);
        expect(res.data.result).toBeTruthy();
    });

    test("removeStoreOwner failure - store doesn't exist or invalid store owner", () => {
        const store: Store = new Store("name");
        const isOperationValid: Res.BoolResponse = {data: {result:false}, error: {message: "mockerror"}};
        jest.spyOn(storeManagement, "verifyStoreOperation").mockReturnValue(isOperationValid);
        jest.spyOn(store, "verifyIsStoreOwner").mockReturnValue(false);
        jest.spyOn(store, "removeStoreOwner").mockReturnValue(isOperationValid);
        jest.spyOn(storeManagement, "findStoreByName").mockReturnValue(store);

        const alreadyOwner: StoreOwner = new StoreOwner("name1","123123");
        const ownerToRemove: StoreOwner = new StoreOwner("name2","123123");

        let res: Res.BoolResponse = storeManagement.removeStoreOwner(store.storeName, ownerToRemove, alreadyOwner);
        expect(res.data.result).toBeFalsy();
    });

    test("removeStoreOwner failure - not assigner of owner", () => {
        const store: Store = new Store("name");
        const isOperationValid: Res.BoolResponse = {data: {result:true}};
        jest.spyOn(storeManagement, "verifyStoreOperation").mockReturnValue(isOperationValid);
        jest.spyOn(store, "verifyIsStoreOwner").mockReturnValue(false);
        jest.spyOn(store, "removeStoreOwner").mockReturnValue(isOperationValid);
        jest.spyOn(storeManagement, "findStoreByName").mockReturnValue(store);

        const alreadyOwner: StoreOwner = new StoreOwner("name1","123123");
        const ownerToRemove: StoreOwner = new StoreOwner("name2","123123");

        let res: Res.BoolResponse = storeManagement.assignStoreOwner(store.storeName, ownerToRemove, alreadyOwner);
        expect(res.data.result).toBeTruthy();

        res = storeManagement.removeStoreOwner(store.storeName, alreadyOwner, ownerToRemove);
        expect(res.data.result).toBeFalsy();
    });


    test("verifyStoreExists Success", () => {
        const storeName: string = 'mock-store';
        const user: RegisteredUser = new StoreOwner("usermock", "pwmock");
        expect(storeManagement.addStore(storeName, user).data.result).toBeTruthy();

        expect(storeManagement.verifyStoreExists(storeName)).toBeTruthy();
    });

    test("verifyStoreExists Failure", () => {
        expect(storeManagement.verifyStoreExists('storename')).toBeFalsy();
    });

    test("addItems Success", () => {
        const isSuccessVerify: boolean = true;
        const isSuccessFlow: boolean = true;
        mockVerifyStoreOperation(isSuccessVerify);
        const itemsReq: ItemReq[] = [{ catalogNumber: 1, id : 1}];
        const mockRes: Res.ItemsAdditionResponse = {data: {result: isSuccessFlow, itemsNotAdded: itemsReq}};
        const user: RegisteredUser = new StoreOwner("usermock", "pwmock");
        const store: Store = new Store("store-mock");
        jest.spyOn(storeManagement,"findStoreByName").mockReturnValue(store);
        jest.spyOn(store,"addItems").mockReturnValue(mockRes);

        const actualRes: Res.ItemsAdditionResponse = storeManagement.addItems(user, store.storeName, itemsReq);
        expect(actualRes).toBe(mockRes);
        expect(store.addItems).toBeCalledTimes(1);
    });

    test("addItems Failure", () => {
        const isSuccessVerify: boolean = false;
        const isSuccessFlow: boolean = true;
        mockVerifyStoreOperation(isSuccessVerify);
        const itemsReq: ItemReq[] = [];
        const mockRes: Res.ItemsAdditionResponse = {data: {result: isSuccessFlow, itemsNotAdded: itemsReq}};
        const user: RegisteredUser = new StoreOwner("usermock", "pwmock");
        const store: Store = new Store("store-mock");
        jest.spyOn(storeManagement,"findStoreByName").mockReturnValue(store);
        jest.spyOn(store,"addItems").mockReturnValue(mockRes);

        const actualRes: Res.ItemsAdditionResponse = storeManagement.addItems(user, store.storeName, itemsReq);
        expect(actualRes.data.result).toBeFalsy();
        expect(store.addItems).toBeCalledTimes(0);
    });

    test("removeItems Success", () => {
        const isSuccessVerify: boolean = true;
        const isSuccessFlow: boolean = true;
        mockVerifyStoreOperation(isSuccessVerify);
        const itemsReq: ItemReq[] = [];
        const mockRes: Res.ItemsRemovalResponse = {data: {result: isSuccessFlow, itemsNotRemoved: itemsReq}};
        const user: RegisteredUser = new StoreOwner("usermock", "pwmock");
        const store: Store = new Store("store-mock");
        jest.spyOn(storeManagement,"findStoreByName").mockReturnValue(store);
        jest.spyOn(store,"removeItems").mockReturnValue(mockRes);

        const actualRes: Res.ItemsRemovalResponse = storeManagement.removeItems(user, store.storeName, itemsReq);
        expect(actualRes).toBe(mockRes);
        expect(store.removeItems).toBeCalledTimes(1);
    });

    test("removeItems Failure", () => {
        const isSuccessVerify: boolean = false;
        const isSuccessFlow: boolean = true;
        mockVerifyStoreOperation(isSuccessVerify);
        const itemsReq: ItemReq[] = [];
        const mockRes: Res.ItemsRemovalResponse = {data: {result: isSuccessFlow, itemsNotRemoved: itemsReq}};
        const user: RegisteredUser = new StoreOwner("usermock", "pwmock");
        const store: Store = new Store("store-mock");
        jest.spyOn(storeManagement,"findStoreByName").mockReturnValue(store);
        jest.spyOn(store,"removeItems").mockReturnValue(mockRes);

        const actualRes: Res.ItemsRemovalResponse = storeManagement.removeItems(user, store.storeName, itemsReq);
        expect(actualRes.data.result).toBeFalsy();
        expect(store.removeItems).toBeCalledTimes(0);
    });

    test("removeProductsWithQuantity Success", () => {
        const isSuccessVerify: boolean = true;
        const isSuccessFlow: boolean = true;
        mockVerifyStoreOperation(isSuccessVerify);
        const itemsReq: ProductWithQuantity[] = [];
        const mockRes: Res.ProductRemovalResponse = {data: {result: isSuccessFlow, productsNotRemoved: itemsReq}};
        const user: RegisteredUser = new StoreOwner("usermock", "pwmock");
        const store: Store = new Store("store-mock");
        jest.spyOn(storeManagement,"findStoreByName").mockReturnValue(store);
        jest.spyOn(store,"removeProductsWithQuantity").mockReturnValue(mockRes);

        const actualRes: Res.ProductRemovalResponse = storeManagement.removeProductsWithQuantity(user, store.storeName, itemsReq);
        expect(actualRes).toBe(mockRes);
        expect(store.removeProductsWithQuantity).toBeCalledTimes(1);
    });

    test("removeProductsWithQuantity Failure", () => {
        const isSuccessVerify: boolean = false;
        const isSuccessFlow: boolean = true;
        mockVerifyStoreOperation(isSuccessVerify);
        const itemsReq: ProductWithQuantity[] = [];
        const mockRes: Res.ProductRemovalResponse = {data: {result: isSuccessFlow, productsNotRemoved: itemsReq}};
        const user: RegisteredUser = new StoreOwner("usermock", "pwmock");
        const store: Store = new Store("store-mock");
        jest.spyOn(storeManagement,"findStoreByName").mockReturnValue(store);
        jest.spyOn(store,"removeProductsWithQuantity").mockReturnValue(mockRes);

        const actualRes: Res.ProductRemovalResponse = storeManagement.removeProductsWithQuantity(user, store.storeName, itemsReq);
        expect(actualRes.data.result).toBeFalsy();
        expect(store.removeProductsWithQuantity).toBeCalledTimes(0);
    });

    test("addNewProducts Success", () => {
        const isSuccessVerify: boolean = true;
        const isSuccessFlow: boolean = true;
        mockVerifyStoreOperation(isSuccessVerify);
        const itemsReq: ProductReq[] = [];
        const mockRes: Res.ProductAdditionResponse = {data: {result: isSuccessFlow, productsNotAdded: itemsReq}};
        const user: RegisteredUser = new StoreOwner("usermock", "pwmock");
        const store: Store = new Store("store-mock");
        jest.spyOn(storeManagement,"findStoreByName").mockReturnValue(store);
        jest.spyOn(store,"addNewProducts").mockReturnValue(mockRes);

        const actualRes: Res.ProductAdditionResponse = storeManagement.addNewProducts(user, store.storeName, itemsReq);
        expect(actualRes).toBe(mockRes);
        expect(store.addNewProducts).toBeCalledTimes(1);
    });

    test("addNewProducts Failure", () => {
        const isSuccessVerify: boolean = false;
        const isSuccessFlow: boolean = true;
        mockVerifyStoreOperation(isSuccessVerify);
        const itemsReq: ProductReq[] = [];
        const mockRes: Res.ProductAdditionResponse = {data: {result: isSuccessFlow, productsNotAdded: itemsReq}};
        const user: RegisteredUser = new StoreOwner("usermock", "pwmock");
        const store: Store = new Store("store-mock");
        jest.spyOn(storeManagement,"findStoreByName").mockReturnValue(store);
        jest.spyOn(store,"addNewProducts").mockReturnValue(mockRes);

        const actualRes: Res.ProductAdditionResponse = storeManagement.addNewProducts(user, store.storeName, itemsReq);
        expect(actualRes.data.result).toBeFalsy();
        expect(store.addNewProducts).toBeCalledTimes(0);
    });

    test("removeProducts Success", () => {
        const isSuccessVerify: boolean = true;
        const isSuccessFlow: boolean = true;
        mockVerifyStoreOperation(isSuccessVerify);
        const itemsReq: ProductCatalogNumber[] = [];
        const mockRes: Res.ProductRemovalResponse = {data: {result: isSuccessFlow, productsNotRemoved: itemsReq}};
        const user: RegisteredUser = new StoreOwner("usermock", "pwmock");
        const store: Store = new Store("store-mock");
        jest.spyOn(storeManagement,"findStoreByName").mockReturnValue(store);
        jest.spyOn(store,"removeProductsByCatalogNumber").mockReturnValue(mockRes);

        const actualRes: Res.ProductRemovalResponse = storeManagement.removeProducts(user, store.storeName, itemsReq);
        expect(actualRes).toBe(mockRes);
        expect(store.removeProductsByCatalogNumber).toBeCalledTimes(1);
    });

    test("removeProducts Failure", () => {
        const isSuccessVerify: boolean = false;
        const isSuccessFlow: boolean = true;
        mockVerifyStoreOperation(isSuccessVerify);
        const itemsReq: ProductCatalogNumber[] = [];
        const mockRes: Res.ProductRemovalResponse = {data: {result: isSuccessFlow, productsNotRemoved: itemsReq}};
        const user: RegisteredUser = new StoreOwner("usermock", "pwmock");
        const store: Store = new Store("store-mock");
        jest.spyOn(storeManagement,"findStoreByName").mockReturnValue(store);
        jest.spyOn(store,"removeProductsByCatalogNumber").mockReturnValue(mockRes);

        const actualRes: Res.ProductRemovalResponse = storeManagement.removeProducts(user, store.storeName, itemsReq);
        expect(actualRes.data.result).toBeFalsy();
        expect(store.removeProductsByCatalogNumber).toBeCalledTimes(0);
    });

    test("findStoreByName Success", () => {
        const storeName: string = 'mock-store';
        const user: RegisteredUser = new StoreOwner("usermock", "pwmock");
        expect(storeManagement.addStore(storeName, user).data.result).toBeTruthy();

        expect(storeManagement.findStoreByName(storeName)).toBeTruthy();
    });

    test("findStoreByName Failure", () => {
        expect(storeManagement.findStoreByName('storename')).toBeFalsy();
    });


    function mockVerifyStoreOperation(isSuccess: boolean) {
        const mockValidationRes: BoolResponse = isSuccess ? {data:{result:isSuccess}} : {data:{result:isSuccess}, error : {message: "mock"}}
        jest.spyOn(storeManagement,"verifyStoreOperation").mockReturnValue(mockValidationRes);
    }

});
