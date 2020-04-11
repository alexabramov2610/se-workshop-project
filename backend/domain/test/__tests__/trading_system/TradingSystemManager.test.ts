import { Store, StoreManager } from "../../../src/store/internal_api";
import * as Res from "../../../src/common/Response";
import {StoreOwner, RegisteredUser} from "../../../src/user/internal_api";
import { TradingSystemManager } from "../../../src/trading_system/TradingSystemManager";
import {Item, Product} from "../../../src/trading_system/internal_api";
import { ExternalSystemsManager } from '../../../src/external_systems/ExternalSystemsManager'
import { UserManager } from '../../../src/user/UserManager';
import {mocked} from "ts-jest/utils";
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

    test("addItems success", () => {
        const numOfItems: number = 5;
        const items: Item[] = generateItems(numOfItems);
        const isLoggedIn: boolean = true;
        const storeRes: Res.StoreItemsAdditionResponse = {data: {result: true, itemsNotAdded: []} };
        const boolResponse: Res.BoolResponse = { data: {result: true} }

        prepareMocksForInventoryManagement(isLoggedIn, boolResponse);
        jest.spyOn(store, "addItems").mockReturnValue(storeRes);

        tradingSystemManager = new TradingSystemManager();
        let res: Res.StoreItemsAdditionResponse = tradingSystemManager.addItems(items, user, store)

        expect(res.data.result).toBeTruthy();
        expect(store.addItems).toBeCalledTimes(1);
    });

    test("addItems failure - not logged in", () => {
        const numOfItems: number = 5;
        const items: Item[] = generateItems(numOfItems);
        const isLoggedIn: boolean = false;
        const boolResponse: Res.BoolResponse = { data: {result: true} }

        prepareMocksForInventoryManagement(isLoggedIn, boolResponse);
        jest.spyOn(store, "addItems").mockReturnValue(undefined);

        tradingSystemManager = new TradingSystemManager();
        let res: Res.StoreItemsAdditionResponse = tradingSystemManager.addItems(items, user, store)

        expect(res.data.result).toBeFalsy();
        expect(store.addItems).toBeCalledTimes(0);
    });

    test("addItems failure - inventory operation verification failed", () => {
        const numOfItems: number = 5;
        const items: Item[] = generateItems(numOfItems);
        const isLoggedIn: boolean = true;
        const boolResponse: Res.BoolResponse = { data: {result: false}, error: {message: "mock error"} }

        prepareMocksForInventoryManagement(isLoggedIn, boolResponse);
        jest.spyOn(store, "addItems").mockReturnValue(undefined);

        tradingSystemManager = new TradingSystemManager();
        let res: Res.StoreItemsAdditionResponse = tradingSystemManager.addItems(items, user, store)

        expect(res.data.result).toBeFalsy();
        expect(store.addItems).toBeCalledTimes(0);

    });

    test("removeItems success", () => {
        const numOfItems: number = 5;
        const items: Item[] = generateItems(numOfItems);
        const isLoggedIn: boolean = true;
        const storeRes: Res.StoreItemsRemovalResponse = {data: {result: true, itemsNotRemoved: []} };
        const boolResponse: Res.BoolResponse = { data: {result: true} }

        prepareMocksForInventoryManagement(isLoggedIn, boolResponse);
        jest.spyOn(store, "removeItems").mockReturnValue(storeRes);

        tradingSystemManager = new TradingSystemManager();
        let res: Res.StoreItemsRemovalResponse = tradingSystemManager.removeItems(items, user, store)

        expect(res.data.result).toBeTruthy();
        expect(store.removeItems).toBeCalledTimes(1);
    });

    test("removeItems failure - not logged in", () => {
        const numOfItems: number = 5;
        const items: Item[] = generateItems(numOfItems);
        const isLoggedIn: boolean = false;
        const boolResponse: Res.BoolResponse = { data: {result: true} }

        prepareMocksForInventoryManagement(isLoggedIn, boolResponse);
        jest.spyOn(store, "removeItems").mockReturnValue(undefined);

        tradingSystemManager = new TradingSystemManager();
        let res: Res.StoreItemsRemovalResponse = tradingSystemManager.removeItems(items, user, store)

        expect(res.data.result).toBeFalsy();
        expect(store.removeItems).toBeCalledTimes(0);
    });

    test("removeItems failure - inventory operation verification failed", () => {
        const numOfItems: number = 5;
        const items: Item[] = generateItems(numOfItems);
        const isLoggedIn: boolean = true;
        const boolResponse: Res.BoolResponse = { data: {result: false}, error: {message: "mock error"} }

        prepareMocksForInventoryManagement(isLoggedIn, boolResponse);
        jest.spyOn(store, "removeItems").mockReturnValue(undefined);

        tradingSystemManager = new TradingSystemManager();
        let res: Res.StoreItemsRemovalResponse = tradingSystemManager.removeItems(items, user, store)

        expect(res.data.result).toBeFalsy();
        expect(store.removeItems).toBeCalledTimes(0);

    });

    test("removeProductsWithQuantity success", () => {
        const numOfItems: number = 5;
        const products: Product[] = generateProducts(numOfItems);
        let productsMap :Map<Product, number> = new Map();
        const isLoggedIn: boolean = true;
        const boolResponse: Res.BoolResponse = { data: {result: true} }

        for (let i = 0 ; i< numOfItems ; i++){
            productsMap.set(products[i], i);
        }

        const verifyBool: boolean = true;
        const storeRes: Res.StoreProductRemovalResponse = {data: {result: true, productsNotRemoved: [] } };

        prepareMocksForInventoryManagement(isLoggedIn, boolResponse);
        jest.spyOn(store, "removeProductsWithQuantity").mockReturnValue(storeRes);

        tradingSystemManager = new TradingSystemManager();
        let res: Res.StoreProductRemovalResponse = tradingSystemManager.removeProductsWithQuantity(productsMap, user, store)

        expect(res.data.result).toBeTruthy();
        expect(store.removeProductsWithQuantity).toBeCalledTimes(1);
    });

    test("removeProductsWithQuantity failure - not logged in", () => {
        const numOfItems: number = 5;
        const products: Product[] = generateProducts(numOfItems);
        let productsMap :Map<Product, number> = new Map();
        const isLoggedIn: boolean = false;
        const boolResponse: Res.BoolResponse = { data: {result: true} }

        for (let i = 0 ; i< numOfItems ; i++){
            productsMap.set(products[i], i);
        }
        const verifyRes: boolean = false;

        prepareMocksForInventoryManagement(isLoggedIn, boolResponse);
        jest.spyOn(store, "removeProductsWithQuantity").mockReturnValue(undefined);

        tradingSystemManager = new TradingSystemManager();
        let res: Res.StoreProductRemovalResponse = tradingSystemManager.removeProductsWithQuantity(productsMap, user, store)

        expect(res.data.result).toBeFalsy();
        expect(store.removeProductsWithQuantity).toBeCalledTimes(0);
    });

    test("removeProductsWithQuantity inventory operation verification failed", () => {
        const numOfItems: number = 5;
        let productsMap :Map<Product, number> = new Map();
        const products: Product[] = generateProducts(numOfItems);
        const isLoggedIn: boolean = false;
        const boolResponse: Res.BoolResponse = { data: {result: false} }

        for (let i = 0 ; i< numOfItems ; i++){
            productsMap.set(products[i], i);
        }

        prepareMocksForInventoryManagement(isLoggedIn, boolResponse);
        jest.spyOn(store, "removeProductsWithQuantity").mockReturnValue(undefined);

        tradingSystemManager = new TradingSystemManager();
        let res: Res.StoreProductRemovalResponse = tradingSystemManager.removeProductsWithQuantity(productsMap, user, store)

        expect(res.data.result).toBeFalsy();
        expect(store.removeProductsWithQuantity).toBeCalledTimes(0);

    });

    test("addNewProducts success", () => {
        const numOfItems: number = 5;
        const products: Product[] = generateProducts(numOfItems);
        const storeRes: Res.StoreProductAdditionResponse = {data: {result: true, productsNotAdded: [] } };
        const isLoggedIn: boolean = true;
        const boolResponse: Res.BoolResponse = { data: {result: true} }

        prepareMocksForInventoryManagement(isLoggedIn, boolResponse);
        jest.spyOn(store, "addNewProducts").mockReturnValue(storeRes);

        tradingSystemManager = new TradingSystemManager();
        let res: Res.StoreProductAdditionResponse = tradingSystemManager.addNewProducts(products, user, store)

        expect(res.data.result).toBeTruthy();
        expect(store.addNewProducts).toBeCalledTimes(1);
    });

    test("addNewProducts failure - not logged in", () => {
        const numOfItems: number = 5;
        const products: Product[] = generateProducts(numOfItems);
        const isLoggedIn: boolean = false;
        const boolResponse: Res.BoolResponse = { data: {result: true} }

        prepareMocksForInventoryManagement(isLoggedIn, boolResponse);
        jest.spyOn(store, "addNewProducts").mockReturnValue(undefined);

        tradingSystemManager = new TradingSystemManager();
        let res: Res.StoreProductAdditionResponse = tradingSystemManager.addNewProducts(products, user, store)

        expect(res.data.result).toBeFalsy();
        expect(store.addNewProducts).toBeCalledTimes(0);
    });

    test("addNewProducts failure - inventory operation verification failed", () => {
        const numOfItems: number = 5;
        const products: Product[] = generateProducts(numOfItems);
        const isLoggedIn: boolean = true;
        const boolResponse: Res.BoolResponse = { data: {result: false}, error: {message: "mock error"} }

        prepareMocksForInventoryManagement(isLoggedIn, boolResponse);
        jest.spyOn(store, "addNewProducts").mockReturnValue(undefined);

        tradingSystemManager = new TradingSystemManager();
        let res: Res.StoreProductAdditionResponse = tradingSystemManager.addNewProducts(products, user, store)

        expect(res.data.result).toBeFalsy();
        expect(store.addNewProducts).toBeCalledTimes(0);

    });

    test("removeProducts success", () => {
        const numOfItems: number = 5;
        const products: Product[] = generateProducts(numOfItems);
        const storeRes: Res.StoreProductRemovalResponse = {data: {result: true, productsNotRemoved: [] } };
        const isLoggedIn: boolean = true;
        const boolResponse: Res.BoolResponse = { data: {result: true} }

        prepareMocksForInventoryManagement(isLoggedIn, boolResponse);
        jest.spyOn(store, "removeProducts").mockReturnValue(storeRes);

        tradingSystemManager = new TradingSystemManager();
        let res: Res.StoreProductRemovalResponse = tradingSystemManager.removeProducts(products, user, store)

        expect(res.data.result).toBeTruthy();
        expect(store.removeProducts).toBeCalledTimes(1);
    });

    test("removeProducts failure - not logged in", () => {
        const numOfItems: number = 5;
        const products: Product[] = generateProducts(numOfItems);
        const isLoggedIn: boolean = false;
        const boolResponse: Res.BoolResponse = { data: {result: true} }

        prepareMocksForInventoryManagement(isLoggedIn, boolResponse);
        jest.spyOn(store, "removeProducts").mockReturnValue(undefined);

        tradingSystemManager = new TradingSystemManager();
        let res: Res.StoreProductRemovalResponse = tradingSystemManager.removeProducts(products, user, store)

        expect(res.data.result).toBeFalsy();
        expect(store.removeProducts).toBeCalledTimes(0);
    });

    test("removeProducts failure - inventory operation verification failed", () => {
        const numOfItems: number = 5;
        let productsMap :Map<Product, number> = new Map();
        const products: Product[] = generateProducts(numOfItems);
        const isLoggedIn: boolean = true;
        const boolResponse: Res.BoolResponse = { data: {result: false}, error: {message: "mock error"} }

        prepareMocksForInventoryManagement(isLoggedIn, boolResponse);
        jest.spyOn(store, "removeProducts").mockReturnValue(undefined);

        tradingSystemManager = new TradingSystemManager();
        let res: Res.StoreProductRemovalResponse = tradingSystemManager.removeProducts(products, user, store)

        expect(res.data.result).toBeFalsy();
        expect(store.removeProducts).toBeCalledTimes(0);

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


    function prepareMocksForInventoryManagement(isLoggedIn: boolean, verifyStoreInventoryOperationMock: Res.BoolResponse) {

        mocked(UserManager).mockImplementation(() :any => {
            return { isLoggedIn: () => isLoggedIn }
        });

        mocked(StoreManager).mockImplementation(() :any => {
            return {
                verifyStoreOperation: () => verifyStoreInventoryOperationMock
            }
        });
    }

    function generateItems(numOfItems: number): Item[] {
        let items: Item[] = [];
        for (let i = 0; i < numOfItems; i ++)
            items.push(new Item(1, 2));

        return items;
    }

    function generateProducts(numOfItems: number): Product[] {
        let products: Product[] = [];
        for (let i = 0; i < numOfItems; i ++)
            products.push(new Product('name', 2));

        return products;
    }


});
