import { Store, StoreManager } from "../../../src/store/internal_api";
import * as Responses from "../../../src/common/Response";
import {StoreOwner, User} from "../../../src/user/internal_api";
import { TradingSystemManager } from "../../../src/trading_system/TradingSystemManager";
import {Item, Product} from "../../../src/trading_system/internal_api";
import { ExternalSystemsManager } from '../../../src/external_systems/ExternalSystemsManager'
import { UserManager } from '../../../src/user/user_manager/UserManager';
import {mocked} from "ts-jest/utils";
jest.mock('../../../src/user/user_manager/UserManager');
jest.mock('../../../src/store/StoreManager');
jest.mock('../../../src/external_systems/ExternalSystemsManager');
jest.mock('../../../src/user/user_manager/UserManager');

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
        const verifyBool: boolean = true;
        const storeRes: Responses.StoreItemsAdditionResponse = {data: {result: true, itemsNotAdded: []} };

        prepareMocksForInventoryManagement(verifyBool, verifyBool, verifyBool, verifyBool);
        jest.spyOn(store, "addItems").mockReturnValue(storeRes);

        tradingSystemManager = new TradingSystemManager();
        let res: Responses.StoreItemsAdditionResponse = tradingSystemManager.addItems(items, user, store)

        expect(res.data.result).toBeTruthy();
        expect(store.addItems).toBeCalledTimes(1);
    });

    test("addItems failure - not logged in", () => {
        const numOfItems: number = 5;
        const items: Item[] = generateItems(numOfItems);
        const verifyRes: boolean = false;

        prepareMocksForInventoryManagement(verifyRes, verifyRes, verifyRes, verifyRes);
        jest.spyOn(store, "addItems").mockReturnValue(undefined);

        tradingSystemManager = new TradingSystemManager();
        let res: Responses.StoreItemsAdditionResponse = tradingSystemManager.addItems(items, user, store)

        expect(res.data.result).toBeFalsy();
        expect(store.addItems).toBeCalledTimes(0);
    });

    test("addItems failure - not owner or manger", () => {
        const numOfItems: number = 5;
        const items: Item[] = generateItems(numOfItems);
        const isOwnerOrManager: boolean = false;
        const isStore: boolean = true;
        const isLoggedIn: boolean = true;

        prepareMocksForInventoryManagement(isLoggedIn, isStore, isOwnerOrManager, isOwnerOrManager);
        jest.spyOn(store, "addItems").mockReturnValue(undefined);

        tradingSystemManager = new TradingSystemManager();
        let res: Responses.StoreItemsAdditionResponse = tradingSystemManager.addItems(items, user, store)

        expect(res.data.result).toBeFalsy();
        expect(store.addItems).toBeCalledTimes(0);

    });

    test("addItems failure - not store", () => {
        const numOfItems: number = 5;
        const items: Item[] = generateItems(numOfItems);
        const isOwnerOrManager: boolean = true;
        const isStore: boolean = false;
        const isLoggedIn: boolean = true;

        prepareMocksForInventoryManagement(isLoggedIn, isStore, isOwnerOrManager, isOwnerOrManager);
        jest.spyOn(store, "addItems").mockReturnValue(undefined);

        tradingSystemManager = new TradingSystemManager();
        let res: Responses.StoreItemsAdditionResponse = tradingSystemManager.addItems(items, user, store)

        expect(res.data.result).toBeFalsy();
        expect(store.addItems).toBeCalledTimes(0);
    });

    test("removeItems success", () => {
        const numOfItems: number = 5;
        const items: Item[] = generateItems(numOfItems);
        const verifyBool: boolean = true;
        const storeRes: Responses.StoreItemsRemovalResponse = {data: {result: true, itemsNotRemoved: []} };

        prepareMocksForInventoryManagement(verifyBool, verifyBool, verifyBool, verifyBool);
        jest.spyOn(store, "removeItems").mockReturnValue(storeRes);

        tradingSystemManager = new TradingSystemManager();
        let res: Responses.StoreItemsRemovalResponse = tradingSystemManager.removeItems(items, user, store)

        expect(res.data.result).toBeTruthy();
        expect(store.removeItems).toBeCalledTimes(1);
    });

    test("removeItems failure - not logged in", () => {
        const numOfItems: number = 5;
        const items: Item[] = generateItems(numOfItems);
        const verifyRes: boolean = false;

        prepareMocksForInventoryManagement(verifyRes, verifyRes, verifyRes, verifyRes);
        jest.spyOn(store, "removeItems").mockReturnValue(undefined);

        tradingSystemManager = new TradingSystemManager();
        let res: Responses.StoreItemsRemovalResponse = tradingSystemManager.removeItems(items, user, store)

        expect(res.data.result).toBeFalsy();
        expect(store.removeItems).toBeCalledTimes(0);
    });

    test("removeItems failure - not owner or manger", () => {
        const numOfItems: number = 5;
        const items: Item[] = generateItems(numOfItems);
        const isOwnerOrManager: boolean = false;
        const isStore: boolean = true;
        const isLoggedIn: boolean = true;

        prepareMocksForInventoryManagement(isLoggedIn, isStore, isOwnerOrManager, isOwnerOrManager);
        jest.spyOn(store, "removeItems").mockReturnValue(undefined);

        tradingSystemManager = new TradingSystemManager();
        let res: Responses.StoreItemsRemovalResponse = tradingSystemManager.removeItems(items, user, store)

        expect(res.data.result).toBeFalsy();
        expect(store.removeItems).toBeCalledTimes(0);

    });

    test("removeItems failure - not store", () => {
        const numOfItems: number = 5;
        const items: Item[] = generateItems(numOfItems);
        const isOwnerOrManager: boolean = true;
        const isStore: boolean = false;
        const isLoggedIn: boolean = true;

        prepareMocksForInventoryManagement(isLoggedIn, isStore, isOwnerOrManager, isOwnerOrManager);
        jest.spyOn(store, "removeItems").mockReturnValue(undefined);

        tradingSystemManager = new TradingSystemManager();
        let res: Responses.StoreItemsRemovalResponse = tradingSystemManager.removeItems(items, user, store)

        expect(res.data.result).toBeFalsy();
        expect(store.removeItems).toBeCalledTimes(0);
    });

    test("removeProductsWithQuantity success", () => {
        const numOfItems: number = 5;
        const products: Product[] = generateProducts(numOfItems);
        let productsMap :Map<Product, number> = new Map();

        for (let i = 0 ; i< numOfItems ; i++){
            productsMap.set(products[i], i);
        }

        const verifyBool: boolean = true;
        const storeRes: Responses.StoreProductRemovalResponse = {data: {result: true, productsNotRemoved: [] } };

        prepareMocksForInventoryManagement(verifyBool, verifyBool, verifyBool, verifyBool);
        jest.spyOn(store, "removeProductsWithQuantity").mockReturnValue(storeRes);

        tradingSystemManager = new TradingSystemManager();
        let res: Responses.StoreProductRemovalResponse = tradingSystemManager.removeProductsWithQuantity(productsMap, user, store)

        expect(res.data.result).toBeTruthy();
        expect(store.removeProductsWithQuantity).toBeCalledTimes(1);
    });

    test("removeProductsWithQuantity failure - not logged in", () => {
        const numOfItems: number = 5;
        const products: Product[] = generateProducts(numOfItems);
        let productsMap :Map<Product, number> = new Map();

        for (let i = 0 ; i< numOfItems ; i++){
            productsMap.set(products[i], i);
        }
        const verifyRes: boolean = false;

        prepareMocksForInventoryManagement(verifyRes, verifyRes, verifyRes, verifyRes);
        jest.spyOn(store, "removeProductsWithQuantity").mockReturnValue(undefined);

        tradingSystemManager = new TradingSystemManager();
        let res: Responses.StoreProductRemovalResponse = tradingSystemManager.removeProductsWithQuantity(productsMap, user, store)

        expect(res.data.result).toBeFalsy();
        expect(store.removeProductsWithQuantity).toBeCalledTimes(0);
    });

    test("removeProductsWithQuantity failure - not owner or manger", () => {
        const numOfItems: number = 5;
        let productsMap :Map<Product, number> = new Map();
        const products: Product[] = generateProducts(numOfItems);

        for (let i = 0 ; i< numOfItems ; i++){
            productsMap.set(products[i], i);
        }
        const isOwnerOrManager: boolean = false;
        const isStore: boolean = true;
        const isLoggedIn: boolean = true;

        prepareMocksForInventoryManagement(isLoggedIn, isStore, isOwnerOrManager, isOwnerOrManager);
        jest.spyOn(store, "removeProductsWithQuantity").mockReturnValue(undefined);

        tradingSystemManager = new TradingSystemManager();
        let res: Responses.StoreProductRemovalResponse = tradingSystemManager.removeProductsWithQuantity(productsMap, user, store)

        expect(res.data.result).toBeFalsy();
        expect(store.removeProductsWithQuantity).toBeCalledTimes(0);

    });

    test("removeProductsWithQuantity failure - not store", () => {
        const numOfItems: number = 5;
        let productsMap :Map<Product, number> = new Map();
        const products: Product[] = generateProducts(numOfItems);

        for (let i = 0 ; i< numOfItems ; i++){
            productsMap.set(products[i], i);
        }
        const isOwnerOrManager: boolean = true;
        const isStore: boolean = false;
        const isLoggedIn: boolean = true;

        prepareMocksForInventoryManagement(isLoggedIn, isStore, isOwnerOrManager, isOwnerOrManager);
        jest.spyOn(store, "removeProductsWithQuantity").mockReturnValue(undefined);

        tradingSystemManager = new TradingSystemManager();
        let res: Responses.StoreProductRemovalResponse = tradingSystemManager.removeProductsWithQuantity(productsMap, user, store)

        expect(res.data.result).toBeFalsy();
        expect(store.removeProductsWithQuantity).toBeCalledTimes(0);
    });

    test("addNewProducts success", () => {
        const numOfItems: number = 5;
        const products: Product[] = generateProducts(numOfItems);
        const verifyBool: boolean = true;
        const storeRes: Responses.StoreProductAdditionResponse = {data: {result: true, productsNotAdded: [] } };

        prepareMocksForInventoryManagement(verifyBool, verifyBool, verifyBool, verifyBool);
        jest.spyOn(store, "addNewProducts").mockReturnValue(storeRes);

        tradingSystemManager = new TradingSystemManager();
        let res: Responses.StoreProductAdditionResponse = tradingSystemManager.addNewProducts(products, user, store)

        expect(res.data.result).toBeTruthy();
        expect(store.addNewProducts).toBeCalledTimes(1);
    });

    test("addNewProducts failure - not logged in", () => {
        const numOfItems: number = 5;
        const products: Product[] = generateProducts(numOfItems);
        const verifyRes: boolean = false;

        prepareMocksForInventoryManagement(verifyRes, verifyRes, verifyRes, verifyRes);
        jest.spyOn(store, "addNewProducts").mockReturnValue(undefined);

        tradingSystemManager = new TradingSystemManager();
        let res: Responses.StoreProductAdditionResponse = tradingSystemManager.addNewProducts(products, user, store)

        expect(res.data.result).toBeFalsy();
        expect(store.addNewProducts).toBeCalledTimes(0);
    });

    test("addNewProducts failure - not owner or manger", () => {
        const numOfItems: number = 5;
        let productsMap :Map<Product, number> = new Map();
        const products: Product[] = generateProducts(numOfItems);
        const isStore: boolean = true;
        const isLoggedIn: boolean = true;
        const isOwnerOrManager: boolean = false;

        prepareMocksForInventoryManagement(isLoggedIn, isStore, isOwnerOrManager, isOwnerOrManager);
        jest.spyOn(store, "addNewProducts").mockReturnValue(undefined);

        tradingSystemManager = new TradingSystemManager();
        let res: Responses.StoreProductAdditionResponse = tradingSystemManager.addNewProducts(products, user, store)

        expect(res.data.result).toBeFalsy();
        expect(store.addNewProducts).toBeCalledTimes(0);

    });

    test("addNewProducts failure - not store", () => {
        const numOfItems: number = 5;
        let productsMap :Map<Product, number> = new Map();
        const products: Product[] = generateProducts(numOfItems);
        const isStore: boolean = false;
        const isLoggedIn: boolean = true;
        const isOwnerOrManager: boolean = true;

        prepareMocksForInventoryManagement(isLoggedIn, isStore, isOwnerOrManager, isOwnerOrManager);
        jest.spyOn(store, "addNewProducts").mockReturnValue(undefined);

        tradingSystemManager = new TradingSystemManager();
        let res: Responses.StoreProductAdditionResponse = tradingSystemManager.addNewProducts(products, user, store)

        expect(res.data.result).toBeFalsy();
        expect(store.addNewProducts).toBeCalledTimes(0);
    });

    test("removeProducts success", () => {
        const numOfItems: number = 5;
        const products: Product[] = generateProducts(numOfItems);
        const verifyBool: boolean = true;
        const storeRes: Responses.StoreProductRemovalResponse = {data: {result: true, productsNotRemoved: [] } };

        prepareMocksForInventoryManagement(verifyBool, verifyBool, verifyBool, verifyBool);
        jest.spyOn(store, "removeProducts").mockReturnValue(storeRes);

        tradingSystemManager = new TradingSystemManager();
        let res: Responses.StoreProductRemovalResponse = tradingSystemManager.removeProducts(products, user, store)

        expect(res.data.result).toBeTruthy();
        expect(store.removeProducts).toBeCalledTimes(1);
    });

    test("removeProducts failure - not logged in", () => {
        const numOfItems: number = 5;
        const products: Product[] = generateProducts(numOfItems);
        const verifyRes: boolean = false;

        prepareMocksForInventoryManagement(verifyRes, verifyRes, verifyRes, verifyRes);
        jest.spyOn(store, "removeProducts").mockReturnValue(undefined);

        tradingSystemManager = new TradingSystemManager();
        let res: Responses.StoreProductRemovalResponse = tradingSystemManager.removeProducts(products, user, store)

        expect(res.data.result).toBeFalsy();
        expect(store.removeProducts).toBeCalledTimes(0);
    });

    test("removeProducts failure - not owner or manger", () => {
        const numOfItems: number = 5;
        let productsMap :Map<Product, number> = new Map();
        const products: Product[] = generateProducts(numOfItems);
        const isStore: boolean = true;
        const isLoggedIn: boolean = true;
        const isOwnerOrManager: boolean = false;

        prepareMocksForInventoryManagement(isLoggedIn, isStore, isOwnerOrManager, isOwnerOrManager);
        jest.spyOn(store, "removeProducts").mockReturnValue(undefined);

        tradingSystemManager = new TradingSystemManager();
        let res: Responses.StoreProductRemovalResponse = tradingSystemManager.removeProducts(products, user, store)

        expect(res.data.result).toBeFalsy();
        expect(store.removeProducts).toBeCalledTimes(0);

    });

    test("removeProducts failure - not store", () => {
        const numOfItems: number = 5;
        let productsMap :Map<Product, number> = new Map();
        const products: Product[] = generateProducts(numOfItems);
        const isStore: boolean = false;
        const isLoggedIn: boolean = true;
        const isOwnerOrManager: boolean = true;

        prepareMocksForInventoryManagement(isLoggedIn, isStore, isOwnerOrManager, isOwnerOrManager);
        jest.spyOn(store, "removeProducts").mockReturnValue(undefined);

        tradingSystemManager = new TradingSystemManager();
        let res: Responses.StoreProductRemovalResponse = tradingSystemManager.removeProducts(products, user, store)

        expect(res.data.result).toBeFalsy();
        expect(store.removeProducts).toBeCalledTimes(0);
    });

    test("connectDeliverySys success", () => {
        const connectSystemRes: Responses.BoolResponse = {data: {result: true }};
        mocked(ExternalSystemsManager).mockImplementation(() :any => {
            return { connectSystem: () => connectSystemRes }
        });

        tradingSystemManager = new TradingSystemManager();
        const res: Responses.BoolResponse = tradingSystemManager.connectDeliverySys();

        expect(res.data.result).toBeTruthy();
    });

    test("connectDeliverySys failure", () => {
        const connectSystemRes: Responses.BoolResponse = {data: {result: false }};
        mocked(ExternalSystemsManager).mockImplementation(() :any => {
            return { connectSystem: () => connectSystemRes }
        });

        tradingSystemManager = new TradingSystemManager();
        const res: Responses.BoolResponse = tradingSystemManager.connectDeliverySys();

        expect(res.data.result).toBeFalsy();
    });

    test("connectPaymentSys success", () => {
        const connectSystemRes: Responses.BoolResponse = {data: {result: true }};
        mocked(ExternalSystemsManager).mockImplementation(() :any => {
            return { connectSystem: () => connectSystemRes }
        });

        tradingSystemManager = new TradingSystemManager();
        const res: Responses.BoolResponse = tradingSystemManager.connectPaymentSys();

        expect(res.data.result).toBeTruthy();
    });

    test("connectPaymentSys failure", () => {
        const connectSystemRes: Responses.BoolResponse = {data: {result: false }};
        mocked(ExternalSystemsManager).mockImplementation(() :any => {
            return { connectSystem: () => connectSystemRes }
        });

        tradingSystemManager = new TradingSystemManager();
        const res: Responses.BoolResponse = tradingSystemManager.connectPaymentSys();

        expect(res.data.result).toBeFalsy();

    });

    test("setAdmin success", () => {
        const setAdminRes: Responses.BoolResponse = {data: {result: true }};
        mocked(UserManager).mockImplementation(() :any => {
            return { setAdmin: () => setAdminRes }
        });

        tradingSystemManager = new TradingSystemManager();
        const res: Responses.BoolResponse = tradingSystemManager.setAdmin('username');

        expect(res.data.result).toBeTruthy();
    });

    test("setAdmin failure", () => {
        const setAdminRes: Responses.BoolResponse = {data: {result: false }};
        mocked(UserManager).mockImplementation(() :any => {
            return { setAdmin: () => setAdminRes }
        });

        tradingSystemManager = new TradingSystemManager();
        const res: Responses.BoolResponse = tradingSystemManager.setAdmin('username');

        expect(res.data.result).toBeFalsy();

    });


    function prepareMocksForInventoryManagement(isLoggedIn: boolean, verifyStoreResMock: boolean,
                                                verifyStoreOwnerResMock: boolean, verifyStoreManagerResMock: boolean) {

        mocked(UserManager).mockImplementation(() :any => {
            return { isLoggedIn: () => isLoggedIn }
        });

        mocked(StoreManager).mockImplementation(() :any => {
            return {
                verifyStoreExists: () => verifyStoreResMock,
                verifyStoreOwner: () => verifyStoreOwnerResMock,
                verifyStoreManager: () => verifyStoreManagerResMock
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
