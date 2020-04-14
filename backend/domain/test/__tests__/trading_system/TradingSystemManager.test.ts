import {Store, StoreManager} from "../../../src/store/internal_api";
import * as Res from "../../../src/api-ext/Response";
import {StoreOwner} from "../../../src/user/internal_api";
import {TradingSystemManager} from "../../../src/trading_system/TradingSystemManager";
import {Item, Product} from "../../../src/trading_system/internal_api";
import {ExternalSystemsManager} from '../../../src/external_systems/ExternalSystemsManager'
import {UserManager} from '../../../src/user/UserManager';
import {mocked} from "ts-jest/utils";
import * as Req from "../../../src/api-ext/Request";
import {Product as ProductReq, ProductCatalogNumber, ProductCategory} from "../../../src/api-ext/external_api";
import {ProductWithQuantity} from "../../../src/api-ext/CommonInterface";

jest.mock('../../../src/user/UserManager');
jest.mock('../../../src/store/StoreManager');
jest.mock('../../../src/external_systems/ExternalSystemsManager');
jest.mock('../../../src/user/UserManager');

describe("Store Management Unit Tests", () => {
    let tradingSystemManager: TradingSystemManager;
    let store: Store;
    let user: StoreOwner;

    beforeEach(() => {
        store = new Store("store");
        user = new StoreOwner("name","123123");
        mocked(UserManager).mockClear();
        mocked(StoreManager).mockClear();
    });

    function prepareAddItemMock(isLoggedIn: boolean, isSuccess: boolean) {
        prepareMocksForInventoryManagement(isLoggedIn);
        const operationResMock: Res.BoolResponse = isSuccess ? {data: {result: true}} : {data: {result: false}, error: {message: 'mock err'}};
        mocked(StoreManager).mockImplementation(() :any => {
            return {
                addItems: () => operationResMock
            }
        });
    }

    test("addItems success", () => {
        const numOfItems: number = 5;
        const items: Item[] = generateItems(numOfItems);
        const isLoggedIn: boolean = true;
        const isSuccess: boolean = true;

        prepareAddItemMock(isLoggedIn, isSuccess);

        tradingSystemManager = new TradingSystemManager();
        const req: Req.ItemsAdditionRequest = { token: user.UUID, body: {storeName: store.storeName, items: items}}
        let res: Res.ItemsAdditionResponse = tradingSystemManager.addItems(req)

        expect(res.data.result).toBeTruthy();
    });

    test("addItems failure - not logged in", () => {
        const numOfItems: number = 5;
        const items: Item[] = generateItems(numOfItems);
        const isLoggedIn: boolean = false;
        const isSuccess: boolean = true;

        prepareAddItemMock(isLoggedIn, isSuccess);
        tradingSystemManager = new TradingSystemManager();
        const req: Req.ItemsAdditionRequest = { token: user.UUID, body: {storeName: store.storeName, items: items}}
        let res: Res.ItemsAdditionResponse = tradingSystemManager.addItems(req)

        expect(res.data.result).toBeFalsy();
    });

    test("addItems failure - inventory operation verification failed", () => {
        const numOfItems: number = 5;
        const items: Item[] = generateItems(numOfItems);
        const isLoggedIn: boolean = true;
        const isSuccess: boolean = false;
        prepareAddItemMock(isLoggedIn, isSuccess);

        const tradingSystemManager: TradingSystemManager = new TradingSystemManager();
        const req: Req.ItemsAdditionRequest = { token: user.UUID, body: {storeName: store.storeName, items: items}}
        let res: Res.ItemsAdditionResponse = tradingSystemManager.addItems(req)

        expect(res.data.result).toBeFalsy();
    });

    function prepareRemoveItemsMock(isLoggedIn: boolean, isSuccess: boolean) {
        prepareMocksForInventoryManagement(isLoggedIn);
        const operationResMock: Res.BoolResponse = isSuccess ? {data: {result: true}} : {data: {result: false}, error: {message: 'mock err'}};
        mocked(StoreManager).mockImplementation(() :any => {
            return {
                removeItems: () => operationResMock
            }
        });
    }

    test("removeItems success", () => {
        const numOfItems: number = 5;
        const items: Item[] = generateItems(numOfItems);
        const isLoggedIn: boolean = true;
        const isSuccess: boolean = true;

        prepareRemoveItemsMock(isLoggedIn, isSuccess);
        tradingSystemManager = new TradingSystemManager();

        const req: Req.ItemsRemovalRequest = { token: user.UUID, body: {storeName: store.storeName, items: items}}
        let res: Res.ItemsRemovalResponse = tradingSystemManager.removeItems(req)

        expect(res.data.result).toBeTruthy();
    });

    test("removeItems failure - not logged in", () => {
        const numOfItems: number = 5;
        const items: Item[] = generateItems(numOfItems);
        const isLoggedIn: boolean = false;
        const isSuccess: boolean = true;
        prepareRemoveItemsMock(isLoggedIn, isSuccess);
        jest.spyOn(store, "removeItems").mockReturnValue(undefined);

        tradingSystemManager = new TradingSystemManager();
        const req: Req.ItemsRemovalRequest = { token: user.UUID, body: {storeName: store.storeName, items: items}}
        let res: Res.ItemsRemovalResponse = tradingSystemManager.removeItems(req)

        expect(res.data.result).toBeFalsy();
        expect(store.removeItems).toBeCalledTimes(0);
    });

    test("removeItems failure - inventory operation verification failed", () => {
        const numOfItems: number = 5;
        const items: Item[] = generateItems(numOfItems);
        const isLoggedIn: boolean = true;
        const isSuccess: boolean = false;

        prepareRemoveItemsMock(isLoggedIn, isSuccess);
        jest.spyOn(store, "removeItems").mockReturnValue(undefined);

        tradingSystemManager = new TradingSystemManager();
        const req: Req.ItemsRemovalRequest = { token: user.UUID, body: {storeName: store.storeName, items: items}};
        let res: Res.ItemsRemovalResponse = tradingSystemManager.removeItems(req)

        expect(res.data.result).toBeFalsy();
        expect(store.removeItems).toBeCalledTimes(0);

    });

    function prepareRemoveProductsWithQuantityMock(isLoggedIn: boolean, isSuccess: boolean) {
        prepareMocksForInventoryManagement(isLoggedIn);
        const operationResMock: Res.BoolResponse = isSuccess ? {data: {result: true}} : {data: {result: false}, error: {message: 'mock err'}};
        mocked(StoreManager).mockImplementation(() :any => {
            return {
                removeProductsWithQuantity: () => operationResMock
            }
        });
    }

    test("removeProductsWithQuantity success", () => {
        const numOfItems: number = 5;
        const products: ProductReq[] = generateProducts(numOfItems);
        const isLoggedIn: boolean = true;
        const isSuccess: boolean = true;
        let productsWithQuantity: ProductWithQuantity[] = [];

        for (let i = 0 ; i< numOfItems ; i++){
            const currProduct: ProductWithQuantity = {catalogNumber: products[i].catalogNumber, quantity: i}
            productsWithQuantity.push(currProduct);
        }

        prepareRemoveProductsWithQuantityMock(isLoggedIn, isSuccess);
        tradingSystemManager = new TradingSystemManager();

        const req: Req.RemoveProductsWithQuantity = { token: user.UUID, body: {storeName: store.storeName, products: productsWithQuantity}};
        let res: Res.ProductRemovalResponse = tradingSystemManager.removeProductsWithQuantity(req);

        expect(res.data.result).toBeTruthy();
    });

    test("removeProductsWithQuantity failure - not logged in", () => {
        const numOfItems: number = 5;
        const products: ProductReq[] = generateProducts(numOfItems);
        const isLoggedIn: boolean = false;
        const isSuccess: boolean = true;
        let productsWithQuantity: ProductWithQuantity[] = [];

        for (let i = 0 ; i< numOfItems ; i++){
            const currProduct: ProductWithQuantity = {catalogNumber: products[i].catalogNumber, quantity: i}
            productsWithQuantity.push(currProduct);
        }

        prepareRemoveProductsWithQuantityMock(isLoggedIn, isSuccess);
        jest.spyOn(store, "removeProductsWithQuantity").mockReturnValue(undefined);

        tradingSystemManager = new TradingSystemManager();
        const req: Req.RemoveProductsWithQuantity = { token: user.UUID, body: {storeName: store.storeName, products: productsWithQuantity}};
        let res: Res.ProductRemovalResponse = tradingSystemManager.removeProductsWithQuantity(req);

        expect(res.data.result).toBeFalsy();
        expect(store.removeProductsWithQuantity).toBeCalledTimes(0);
    });

    test("removeProductsWithQuantity inventory operation verification failed", () => {
        const numOfItems: number = 5;
        const products: ProductReq[] = generateProducts(numOfItems);
        const isLoggedIn: boolean = true;
        const isSuccess: boolean = false;
        let productsWithQuantity: ProductWithQuantity[] = [];

        for (let i = 0 ; i< numOfItems ; i++){
            const currProduct: ProductWithQuantity = {catalogNumber: products[i].catalogNumber, quantity: i}
            productsWithQuantity.push(currProduct);
        }

        prepareRemoveProductsWithQuantityMock(isLoggedIn, isSuccess);
        jest.spyOn(store, "removeProductsWithQuantity").mockReturnValue(undefined);

        tradingSystemManager = new TradingSystemManager();
        const req: Req.RemoveProductsWithQuantity = { token: user.UUID, body: {storeName: store.storeName, products: productsWithQuantity}};
        let res: Res.ProductRemovalResponse = tradingSystemManager.removeProductsWithQuantity(req);

        expect(res.data.result).toBeFalsy();
        expect(store.removeProductsWithQuantity).toBeCalledTimes(0);

    });

    function prepareAddNewProductsMock(isLoggedIn: boolean, isSuccess: boolean) {
        prepareMocksForInventoryManagement(isLoggedIn);
        const operationResMock: Res.BoolResponse = isSuccess ? {data: {result: true}} : {data: {result: false}, error: {message: 'mock err'}};
        mocked(StoreManager).mockImplementation(() :any => {
            return {
                addNewProducts: () => operationResMock
            }
        });
    }

    test("addNewProducts success", () => {
        const numOfItems: number = 5;
        const products: ProductReq[] = generateProducts(numOfItems);
        const isLoggedIn: boolean = true;
        const isSuccess: boolean = true;

        prepareAddNewProductsMock(isLoggedIn, isSuccess);
        tradingSystemManager = new TradingSystemManager();

        const productsReq: ProductReq[] = [];
        for (let prod of products) {
            const prodReq: ProductReq = {catalogNumber: prod.catalogNumber, name: prod.name, price: prod.price, category: ProductCategory.Electronics};
            productsReq.push(prodReq);
        }


        const req: Req.AddProductsRequest = { token: user.UUID, body: {storeName: store.storeName, products: productsReq}};
        let res: Res.ProductAdditionResponse = tradingSystemManager.addNewProducts(req)

        expect(res.data.result).toBeTruthy();
    });

    test("addNewProducts failure - not logged in", () => {
        const numOfItems: number = 5;
        const products: ProductReq[] = generateProducts(numOfItems);
        const isLoggedIn: boolean = false;
        const isSuccess: boolean = true;

        prepareAddNewProductsMock(isLoggedIn, isSuccess);
        jest.spyOn(store, "addNewProducts").mockReturnValue(undefined);

        tradingSystemManager = new TradingSystemManager();
        const productsReq: ProductReq[] = [];
        for (let prod of products) {
            const prodReq: ProductReq = {catalogNumber: prod.catalogNumber, name: prod.name, price: prod.price, category: ProductCategory.Electronics};
            productsReq.push(prodReq);
        }

        const req: Req.AddProductsRequest = { token: user.UUID, body: {storeName: store.storeName, products: productsReq}};
        let res: Res.ProductAdditionResponse = tradingSystemManager.addNewProducts(req)

        expect(res.data.result).toBeFalsy();
        expect(store.addNewProducts).toBeCalledTimes(0);
    });

    test("addNewProducts failure - inventory operation verification failed", () => {
        const numOfItems: number = 5;
        const products: ProductReq[] = generateProducts(numOfItems);
        const isLoggedIn: boolean = true;
        const isSuccess: boolean = false;

        prepareAddNewProductsMock(isLoggedIn, isSuccess);
        jest.spyOn(store, "addNewProducts").mockReturnValue(undefined);

        tradingSystemManager = new TradingSystemManager();
        const productsReq: ProductReq[] = [];
        for (let prod of products) {
            const prodReq: ProductReq = {catalogNumber: prod.catalogNumber, name: prod.name, price: prod.price, category: ProductCategory.Electronics};
            productsReq.push(prodReq);
        }

        const req: Req.AddProductsRequest = { token: user.UUID, body: {storeName: store.storeName, products: productsReq}};
        let res: Res.ProductAdditionResponse = tradingSystemManager.addNewProducts(req)

        expect(res.data.result).toBeFalsy();
        expect(store.addNewProducts).toBeCalledTimes(0);

    });

    function prepareRemoveProductsMock(isLoggedIn: boolean, isSuccess: boolean) {
        prepareMocksForInventoryManagement(isLoggedIn);
        const operationResMock: Res.BoolResponse = isSuccess ? {data: {result: true}} : {data: {result: false}, error: {message: 'mock err'}};
        mocked(StoreManager).mockImplementation(() :any => {
            return {
                removeProducts: () => operationResMock
            }
        });
    }

    test("removeProducts success", () => {
        const numOfItems: number = 5;
        const products: ProductReq[] = generateProducts(numOfItems);
        const isLoggedIn: boolean = true;
        const isSuccess: boolean = true;

        prepareRemoveProductsMock(isLoggedIn, isSuccess);
        tradingSystemManager = new TradingSystemManager();
        const productsReq: ProductCatalogNumber[] = [];
        for (let prod of products) {
            const prodReq: ProductCatalogNumber = {catalogNumber: prod.catalogNumber};
            productsReq.push(prodReq);
        }

        const req: Req.ProductRemovalRequest = { token: user.UUID, body: {storeName: store.storeName, products: productsReq}};
        let res: Res.ProductRemovalResponse = tradingSystemManager.removeProducts(req)

        expect(res.data.result).toBeTruthy();
    });

    test("removeProducts failure - not logged in", () => {
        const numOfItems: number = 5;
        const products: ProductReq[] = generateProducts(numOfItems);
        const isLoggedIn: boolean = false;
        const isSuccess: boolean = true;

        prepareRemoveProductsMock(isLoggedIn, isSuccess);
        jest.spyOn(store, "removeProductsByCatalogNumber").mockReturnValue(undefined);

        tradingSystemManager = new TradingSystemManager();
        const productsReq: ProductCatalogNumber[] = [];
        for (let prod of products) {
            const prodReq: ProductCatalogNumber = {catalogNumber: prod.catalogNumber};
            productsReq.push(prodReq);
        }

        const req: Req.ProductRemovalRequest = { token: user.UUID, body: {storeName: store.storeName, products: productsReq}};
        let res: Res.ProductRemovalResponse = tradingSystemManager.removeProducts(req)

        expect(res.data.result).toBeFalsy();
        expect(store.removeProductsByCatalogNumber).toBeCalledTimes(0);
    });

    test("removeProducts failure - inventory operation verification failed", () => {
        const numOfItems: number = 5;
        let productsMap :Map<Product, number> = new Map();
        const products: ProductReq[] = generateProducts(numOfItems);
        const isLoggedIn: boolean = true;
        const isSuccess: boolean = false;

        prepareRemoveProductsMock(isLoggedIn, isSuccess);
        jest.spyOn(store, "removeProductsByCatalogNumber").mockReturnValue(undefined);

        tradingSystemManager = new TradingSystemManager();
        const productsReq: ProductCatalogNumber[] = [];
        for (let prod of products) {
            const prodReq: ProductCatalogNumber = {catalogNumber: prod.catalogNumber};
            productsReq.push(prodReq);
        }

        const req: Req.ProductRemovalRequest = { token: user.UUID, body: {storeName: store.storeName, products: productsReq}};
        let res: Res.ProductRemovalResponse = tradingSystemManager.removeProducts(req)

        expect(res.data.result).toBeFalsy();
        expect(store.removeProductsByCatalogNumber).toBeCalledTimes(0);

    });

    function prepareAssignStoreOwnerMock(isLoggedIn: boolean, isSuccess: boolean) {
        prepareMocksForInventoryManagement(isLoggedIn);
        const operationResMock: Res.BoolResponse = isSuccess ? {data: {result: true}} : {data: {result: false}, error: {message: 'mock err'}};
        mocked(StoreManager).mockImplementation(() :any => {
            return {
                assignStoreOwner: () => operationResMock
            }
        });
    }

    test("assignStoreOwner success", () => {
        const numOfItems: number = 5;
        const products: ProductReq[] = generateProducts(numOfItems);
        const isLoggedIn: boolean = true;
        const isSuccess: boolean = true;

        prepareAssignStoreOwnerMock(isLoggedIn, isSuccess);
        tradingSystemManager = new TradingSystemManager();
        const productsReq: ProductCatalogNumber[] = [];
        for (let prod of products) {
            const prodReq: ProductCatalogNumber = {catalogNumber: prod.catalogNumber};
            productsReq.push(prodReq);
        }

        const req: Req.AssignStoreOwnerRequest = { token: user.UUID, body: {storeName: store.storeName, usernameToAssign: 'user'}};
        let res: Res.BoolResponse = tradingSystemManager.assignStoreOwner(req)

        expect(res.data.result).toBeTruthy();
    });

    test("assignStoreOwner failure - not logged in", () => {
        const numOfItems: number = 5;
        const products: ProductReq[] = generateProducts(numOfItems);
        const isLoggedIn: boolean = false;
        const isSuccess: boolean = true;

        prepareAssignStoreOwnerMock(isLoggedIn, isSuccess);
        jest.spyOn(store, "removeProductsByCatalogNumber").mockReturnValue(undefined);

        tradingSystemManager = new TradingSystemManager();
        const productsReq: ProductCatalogNumber[] = [];
        for (let prod of products) {
            const prodReq: ProductCatalogNumber = {catalogNumber: prod.catalogNumber};
            productsReq.push(prodReq);
        }

        const req: Req.AssignStoreOwnerRequest = { token: user.UUID, body: {storeName: store.storeName, usernameToAssign: 'user'}};
        let res: Res.BoolResponse = tradingSystemManager.assignStoreOwner(req)

        expect(res.data.result).toBeFalsy();
        expect(store.removeProductsByCatalogNumber).toBeCalledTimes(0);
    });

    test("assignStoreOwner failure - failure", () => {
        const numOfItems: number = 5;
        const products: ProductReq[] = generateProducts(numOfItems);
        const isLoggedIn: boolean = true;
        const isSuccess: boolean = false;

        prepareAssignStoreOwnerMock(isLoggedIn, isSuccess);
        jest.spyOn(store, "removeProductsByCatalogNumber").mockReturnValue(undefined);

        tradingSystemManager = new TradingSystemManager();
        const productsReq: ProductCatalogNumber[] = [];
        for (let prod of products) {
            const prodReq: ProductCatalogNumber = {catalogNumber: prod.catalogNumber};
            productsReq.push(prodReq);
        }

        const req: Req.AssignStoreOwnerRequest = { token: user.UUID, body: {storeName: store.storeName, usernameToAssign: 'user'}};
        let res: Res.BoolResponse = tradingSystemManager.assignStoreOwner(req)

        expect(res.data.result).toBeFalsy();
        expect(store.removeProductsByCatalogNumber).toBeCalledTimes(0);
    });



    test("connectDeliverySys success", () => {
        const connectSystemRes: Res.BoolResponse = {data: {result: true }};
        mocked(ExternalSystemsManager).mockImplementation(() :any => {
            return { connectSystem: () => connectSystemRes }
        });

        tradingSystemManager = new TradingSystemManager();
        const res: Res.BoolResponse = tradingSystemManager.connectDeliverySys();

        expect(res.data.result).toBeTruthy();
    });

    test("connectDeliverySys failure", () => {
        const connectSystemRes: Res.BoolResponse = {data: {result: false }};
        mocked(ExternalSystemsManager).mockImplementation(() :any => {
            return { connectSystem: () => connectSystemRes }
        });

        tradingSystemManager = new TradingSystemManager();
        const res: Res.BoolResponse = tradingSystemManager.connectDeliverySys();

        expect(res.data.result).toBeFalsy();
    });

    test("connectPaymentSys success", () => {
        const connectSystemRes: Res.BoolResponse = {data: {result: true }};
        mocked(ExternalSystemsManager).mockImplementation(() :any => {
            return { connectSystem: () => connectSystemRes }
        });

        tradingSystemManager = new TradingSystemManager();
        const res: Res.BoolResponse = tradingSystemManager.connectPaymentSys();

        expect(res.data.result).toBeTruthy();
    });

    test("connectPaymentSys failure", () => {
        const connectSystemRes: Res.BoolResponse = {data: {result: false }};
        mocked(ExternalSystemsManager).mockImplementation(() :any => {
            return { connectSystem: () => connectSystemRes }
        });

        tradingSystemManager = new TradingSystemManager();
        const res: Res.BoolResponse = tradingSystemManager.connectPaymentSys();

        expect(res.data.result).toBeFalsy();

    });

    test("setAdmin success", () => {
        const setAdminRes: Res.BoolResponse = {data: {result: true }};
        mocked(UserManager).mockImplementation(() :any => {
            return { setAdmin: () => setAdminRes }
        });

        tradingSystemManager = new TradingSystemManager();
        const res: Res.BoolResponse = tradingSystemManager.setAdmin('username');

        expect(res.data.result).toBeTruthy();
    });

    test("setAdmin failure", () => {
        const setAdminRes: Res.BoolResponse = {data: {result: false }};
        mocked(UserManager).mockImplementation(() :any => {
            return { setAdmin: () => setAdminRes }
        });

        tradingSystemManager = new TradingSystemManager();
        const res: Res.BoolResponse = tradingSystemManager.setAdmin('username');

        expect(res.data.result).toBeFalsy();

    });


    function prepareMocksForInventoryManagement(isLoggedIn: boolean) {
        const verifyResMock: Res.BoolResponse = isLoggedIn ? {data: {result: true}} : {data: {result: false}, error: {message: 'mock err'}};

        mocked(UserManager).mockImplementation(() :any => {
            return {
                verifyUser: () => verifyResMock,
                getUserByToken: () => user,
            }
        });
    }

    function generateItems(numOfItems: number): Item[] {
        let items: Item[] = [];
        for (let i = 0; i < numOfItems; i ++)
            items.push(new Item(1, 2));

        return items;
    }

    function generateProducts(numOfItems: number): ProductReq[] {
        let products: ProductReq[] = [];
        for (let i = 0; i < numOfItems; i ++)
            products.push({name: 'name', catalogNumber: 2, price: 5, category: ProductCategory.Electronics});

        return products;
    }


});
