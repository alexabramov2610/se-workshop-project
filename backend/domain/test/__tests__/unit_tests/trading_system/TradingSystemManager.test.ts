import {mocked} from "ts-jest/utils";
import {Req, Res} from 'se-workshop-20-interfaces'
import { BagItem, IProduct as ProductReq, ProductCatalogNumber, ProductCategory,
    Purchase, ProductWithQuantity } from "se-workshop-20-interfaces/dist/src/CommonInterface";
import { Rating, TradingSystemState } from "se-workshop-20-interfaces/dist/src/Enums";
import {Store, StoreManagement} from "../../../../src/store/internal_api";
import {RegisteredUser, StoreOwner} from "../../../../src/user/internal_api";
import {TradingSystemManager} from "../../../../src/trading_system/TradingSystemManager";
import {ContactUsMessage, Item, Product, Receipt} from "../../../../src/trading_system/internal_api";
import {ExternalSystemsManager} from '../../../../src/external_systems/ExternalSystemsManager'
import {UserManager} from '../../../../src/user/UserManager';
import {User} from "../../../../src/user/users/User";
import {PaymentSystem} from "../../../../src/external_systems/payment_system/PaymentSystem";

jest.mock('../../../../src/user/UserManager');
jest.mock('../../../../src/store/StoreManagement');
jest.mock('../../../../src/external_systems/ExternalSystemsManager');
jest.mock('../../../../src/external_systems/payment_system/PaymentSystem')

describe("Store Management Unit Tests", () => {
    let tradingSystemManager: TradingSystemManager;
    let store: Store;
    let user: StoreOwner;
    const mockToken: string = "mock-token";
    const cart: Map<string, BagItem[]> = new Map<string, BagItem[]>();
    cart.set("storeName", [{
        product: {catalogNumber: 5, name: "bamba", category: ProductCategory.HOME, price: 20},
        amount: 2
    }])

    beforeEach(() => {
        store = new Store("store");
        user = new StoreOwner("name");
        mocked(UserManager).mockClear();
        mocked(StoreManagement).mockClear();
        mocked(PaymentSystem).mockClear();
        mocked(ExternalSystemsManager).mockReset();

    });


    test("startNewSession success", () => {
        tradingSystemManager = new TradingSystemManager();
        const token: string = tradingSystemManager.startNewSession();
        expect(token).toBeDefined();
        expect(token.length > 10).toBe(true);
    });


    function prepareOpenTradeSystemMock(isLoggedIn: boolean, isAdmin: boolean) {
        mocked(UserManager).mockImplementation((): any => {
            return {
                getLoggedInUserByToken: () => isLoggedIn ? user : undefined,
                isAdmin: () => isAdmin
            }
        });
    }

    test("OpenTradeSystem - Success", () => {
        const isLoggedIn: boolean = true;
        const isAdmin: boolean = true;
        prepareOpenTradeSystemMock(isLoggedIn, isAdmin);

        tradingSystemManager = new TradingSystemManager();
        const req: Req.Request = {body: {}, token: mockToken};
        const res: Res.BoolResponse = tradingSystemManager.openTradeSystem(req);

        expect(res.data.result).toBe(true);
        expect(tradingSystemManager.getTradeSystemState(req).data.state).toBe(TradingSystemState.OPEN);
    });

    test("OpenTradeSystem - Fail, no session", () => {
        const isLoggedIn: boolean = false;
        const isAdmin: boolean = true;
        prepareOpenTradeSystemMock(isLoggedIn, isAdmin);

        tradingSystemManager = new TradingSystemManager();
        const req: Req.Request = {body: {}, token: mockToken};
        const res: Res.BoolResponse = tradingSystemManager.openTradeSystem(req);

        expect(res.data.result).toBe(false);
        expect(tradingSystemManager.getTradeSystemState(req).data.state).toBe(TradingSystemState.CLOSED);
    });

    test("OpenTradeSystem - Fail, not admin", () => {
        const isLoggedIn: boolean = true;
        const isAdmin: boolean = false;
        prepareOpenTradeSystemMock(isLoggedIn, isAdmin);

        tradingSystemManager = new TradingSystemManager();
        const req: Req.Request = {body: {}, token: mockToken};
        const res: Res.BoolResponse = tradingSystemManager.openTradeSystem(req);

        expect(res.data.result).toBe(false);
        expect(tradingSystemManager.getTradeSystemState(req).data.state).toBe(TradingSystemState.CLOSED);
    });


    function prepareRegisterMock(isLoggedIn: boolean, isHasSession: boolean) {
        const mockRes: Res.BoolResponse = {data: {result: !isLoggedIn && isHasSession}};
        mocked(UserManager).mockImplementation((): any => {
            return {
                getUserByToken: () => isHasSession ? user : undefined,
                getLoggedInUserByToken: () => isLoggedIn ? user : undefined,
                register: () => mockRes
            }
        });
    }

    test("register - Success", () => {
        const user: RegisteredUser = new RegisteredUser("name", "pw");
        const isLoggedIn: boolean = false;
        const isHasSession: boolean = true;
        prepareRegisterMock(isLoggedIn, isHasSession);

        tradingSystemManager = new TradingSystemManager();
        const req: Req.RegisterRequest = {body: {username: user.name, password: user.password}, token: mockToken};
        const res: Res.BoolResponse = tradingSystemManager.register(req);

        expect(res.data.result).toBe(true);
    });

    test("register - failure - logged in", () => {
        const user: RegisteredUser = new RegisteredUser("name", "pw");
        const isLoggedIn: boolean = true;
        const isHasSession: boolean = true;
        prepareRegisterMock(isLoggedIn, isHasSession);

        tradingSystemManager = new TradingSystemManager();
        const req: Req.RegisterRequest = {body: {username: user.name, password: user.password}, token: mockToken};
        const res: Res.BoolResponse = tradingSystemManager.register(req);

        expect(res.data.result).toBe(false);
    });

    test("register - failure - no session", () => {
        const user: RegisteredUser = new RegisteredUser("name", "pw");
        const isLoggedIn: boolean = false;
        const isHasSession: boolean = false;
        prepareRegisterMock(isLoggedIn, isHasSession);

        tradingSystemManager = new TradingSystemManager();
        const req: Req.RegisterRequest = {body: {username: user.name, password: user.password}, token: mockToken};
        const res: Res.BoolResponse = tradingSystemManager.register(req);

        expect(res.data.result).toBe(false);
    });


    function prepareLoginMock(isSuccess: boolean) {
        const mockRes: Res.BoolResponse = {data: {result: isSuccess}};
        mocked(UserManager).mockImplementation((): any => {
            return {
                login: () => mockRes,
                removeGuest: () => true
            }
        });
    }

    test("login - success", () => {
        const user: RegisteredUser = new RegisteredUser("name", "pw");
        const isSuccess: boolean = true;
        prepareLoginMock(isSuccess);

        tradingSystemManager = new TradingSystemManager();
        const req: Req.LoginRequest = {body: {username: user.name, password: user.password}, token: mockToken};
        const res: Res.BoolResponse = tradingSystemManager.login(req);
        expect(res.data.result).toBe(isSuccess);
    });

    test("login - failure", () => {
        const user: RegisteredUser = new RegisteredUser("name", "pw");
        const isSuccess: boolean = false;
        prepareLoginMock(isSuccess);

        tradingSystemManager = new TradingSystemManager();
        const req: Req.LoginRequest = {body: {username: user.name, password: user.password}, token: mockToken};
        const res: Res.BoolResponse = tradingSystemManager.login(req);
        expect(res.data.result).toBe(isSuccess);
    });


    function prepareLogoutMock(isSuccess: boolean) {
        const mockRes: Res.BoolResponse = {data: {result: isSuccess}};
        const user: RegisteredUser = new RegisteredUser("name", "pw");
        mocked(UserManager).mockImplementation((): any => {
            return {
                getLoggedInUserByToken: () => isSuccess ? user : undefined,
                logout: () => mockRes,
                addGuestToken: () => true
            }
        });
    }

    test("logout - success", () => {
        const isSuccess: boolean = true;
        prepareLogoutMock(isSuccess);

        tradingSystemManager = new TradingSystemManager();
        const req: Req.LogoutRequest = {body: {}, token: mockToken};
        const res: Res.BoolResponse = tradingSystemManager.logout(req);
        expect(res.data.result).toBe(isSuccess);
    });

    test("logout - failure", () => {
        const isSuccess: boolean = false;
        prepareLogoutMock(isSuccess);

        tradingSystemManager = new TradingSystemManager();
        const req: Req.LogoutRequest = {body: {}, token: mockToken};
        const res: Res.BoolResponse = tradingSystemManager.logout(req);
        expect(res.data.result).toBe(isSuccess);
    });


    function prepareAddItemMock(isLoggedIn: boolean, isSuccess: boolean) {
        prepareMocksForInventoryManagement(isLoggedIn, true);
        const operationResMock: Res.BoolResponse = isSuccess ? {data: {result: true}} : {
            data: {result: false},
            error: {message: 'mock err'}
        };
        mocked(StoreManagement).mockImplementation((): any => {
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
        const req: Req.ItemsAdditionRequest = {token: mockToken, body: {storeName: store.storeName, items}}
        const res: Res.ItemsAdditionResponse = tradingSystemManager.addItems(req)

        expect(res.data.result).toBeTruthy();
    });

    test("addItems failure - not logged in", () => {
        const numOfItems: number = 5;
        const items: Item[] = generateItems(numOfItems);
        const isLoggedIn: boolean = false;
        const isSuccess: boolean = true;

        prepareAddItemMock(isLoggedIn, isSuccess);
        tradingSystemManager = new TradingSystemManager();
        const req: Req.ItemsAdditionRequest = {token: mockToken, body: {storeName: store.storeName, items}}
        const res: Res.ItemsAdditionResponse = tradingSystemManager.addItems(req)

        expect(res.data.result).toBeFalsy();
    });


    function prepareRemoveItemsMock(isLoggedIn: boolean, isSuccess: boolean) {
        prepareMocksForInventoryManagement(isLoggedIn, true);
        const operationResMock: Res.BoolResponse = isSuccess ? {data: {result: true}} : {
            data: {result: false},
            error: {message: 'mock err'}
        };
        mocked(StoreManagement).mockImplementation((): any => {
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

        const req: Req.ItemsRemovalRequest = {token: mockToken, body: {storeName: store.storeName, items}}
        const res: Res.ItemsRemovalResponse = tradingSystemManager.removeItems(req)

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
        const req: Req.ItemsRemovalRequest = {token: mockToken, body: {storeName: store.storeName, items}}
        const res: Res.ItemsRemovalResponse = tradingSystemManager.removeItems(req)

        expect(res.data.result).toBeFalsy();
        expect(store.removeItems).toBeCalledTimes(0);
    });


    function prepareRemoveProductsWithQuantityMock(isLoggedIn: boolean, isSuccess: boolean) {
        prepareMocksForInventoryManagement(isLoggedIn, true);
        const operationResMock: Res.BoolResponse = isSuccess ? {data: {result: true}} : {
            data: {result: false},
            error: {message: 'mock err'}
        };
        mocked(StoreManagement).mockImplementation((): any => {
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
        const productsWithQuantity: ProductWithQuantity[] = [];

        for (let i = 0; i < numOfItems; i++) {
            const currProduct: ProductWithQuantity = {catalogNumber: products[i].catalogNumber, quantity: i}
            productsWithQuantity.push(currProduct);
        }

        prepareRemoveProductsWithQuantityMock(isLoggedIn, isSuccess);
        tradingSystemManager = new TradingSystemManager();

        const req: Req.RemoveProductsWithQuantity = {
            token: mockToken,
            body: {storeName: store.storeName, products: productsWithQuantity}
        };
        const res: Res.ProductRemovalResponse = tradingSystemManager.removeProductsWithQuantity(req);

        expect(res.data.result).toBeTruthy();
    });

    test("removeProductsWithQuantity failure - not logged in", () => {
        const numOfItems: number = 5;
        const products: ProductReq[] = generateProducts(numOfItems);
        const isLoggedIn: boolean = false;
        const isSuccess: boolean = true;
        const productsWithQuantity: ProductWithQuantity[] = [];

        for (let i = 0; i < numOfItems; i++) {
            const currProduct: ProductWithQuantity = {catalogNumber: products[i].catalogNumber, quantity: i}
            productsWithQuantity.push(currProduct);
        }

        prepareRemoveProductsWithQuantityMock(isLoggedIn, isSuccess);
        jest.spyOn(store, "removeProductsWithQuantity").mockReturnValue(undefined);

        tradingSystemManager = new TradingSystemManager();
        const req: Req.RemoveProductsWithQuantity = {
            token: mockToken,
            body: {storeName: store.storeName, products: productsWithQuantity}
        };
        const res: Res.ProductRemovalResponse = tradingSystemManager.removeProductsWithQuantity(req);

        expect(res.data.result).toBeFalsy();
        expect(store.removeProductsWithQuantity).toBeCalledTimes(0);
    });


    function prepareAddNewProductsMock(isLoggedIn: boolean, isSuccess: boolean) {
        prepareMocksForInventoryManagement(isLoggedIn, true);
        const operationResMock: Res.BoolResponse = isSuccess ? {data: {result: true}} : {
            data: {result: false},
            error: {message: 'mock err'}
        };
        mocked(StoreManagement).mockImplementation((): any => {
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
        for (const prod of products) {
            const prodReq: ProductReq = {
                catalogNumber: prod.catalogNumber,
                name: prod.name,
                price: prod.price,
                category: ProductCategory.ELECTRONICS
            };
            productsReq.push(prodReq);
        }


        const req: Req.AddProductsRequest = {
            token: mockToken,
            body: {storeName: store.storeName, products: productsReq}
        };
        const res: Res.ProductAdditionResponse = tradingSystemManager.addNewProducts(req)

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
        for (const prod of products) {
            const prodReq: ProductReq = {
                catalogNumber: prod.catalogNumber,
                name: prod.name,
                price: prod.price,
                category: ProductCategory.ELECTRONICS
            };
            productsReq.push(prodReq);
        }

        const req: Req.AddProductsRequest = {
            token: mockToken,
            body: {storeName: store.storeName, products: productsReq}
        };
        const res: Res.ProductAdditionResponse = tradingSystemManager.addNewProducts(req)

        expect(res.data.result).toBeFalsy();
        expect(store.addNewProducts).toBeCalledTimes(0);
    });


    function prepareRemoveProductsMock(isLoggedIn: boolean, isSuccess: boolean) {
        prepareMocksForInventoryManagement(isLoggedIn, true);
        const operationResMock: Res.BoolResponse = isSuccess ? {data: {result: true}} : {
            data: {result: false},
            error: {message: 'mock err'}
        };
        mocked(StoreManagement).mockImplementation((): any => {
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
        for (const prod of products) {
            const prodReq: ProductCatalogNumber = {catalogNumber: prod.catalogNumber};
            productsReq.push(prodReq);
        }

        const req: Req.ProductRemovalRequest = {
            token: mockToken,
            body: {storeName: store.storeName, products: productsReq}
        };
        const res: Res.ProductRemovalResponse = tradingSystemManager.removeProducts(req)

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
        for (const prod of products) {
            const prodReq: ProductCatalogNumber = {catalogNumber: prod.catalogNumber};
            productsReq.push(prodReq);
        }

        const req: Req.ProductRemovalRequest = {
            token: mockToken,
            body: {storeName: store.storeName, products: productsReq}
        };
        const res: Res.ProductRemovalResponse = tradingSystemManager.removeProducts(req)

        expect(res.data.result).toBeFalsy();
        expect(store.removeProductsByCatalogNumber).toBeCalledTimes(0);
    });


    function prepareAssignStoreOwnerMock(isLoggedIn: boolean, isSuccess: boolean) {
        prepareMocksForInventoryManagement(isLoggedIn, isSuccess);
        const operationResMock: Res.BoolResponse = isSuccess ? {data: {result: true}} : {
            data: {result: false},
            error: {message: 'mock err'}
        };
        mocked(StoreManagement).mockImplementation((): any => {
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
        for (const prod of products) {
            const prodReq: ProductCatalogNumber = {catalogNumber: prod.catalogNumber};
            productsReq.push(prodReq);
        }

        const req: Req.AssignStoreOwnerRequest = {
            token: mockToken,
            body: {storeName: store.storeName, usernameToAssign: 'user'}
        };
        const res: Res.BoolResponse = tradingSystemManager.assignStoreOwner(req)

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
        for (const prod of products) {
            const prodReq: ProductCatalogNumber = {catalogNumber: prod.catalogNumber};
            productsReq.push(prodReq);
        }

        const req: Req.AssignStoreOwnerRequest = {
            token: mockToken,
            body: {storeName: store.storeName, usernameToAssign: 'user'}
        };
        const res: Res.BoolResponse = tradingSystemManager.assignStoreOwner(req)

        expect(res.data.result).toBeFalsy();
        expect(store.removeProductsByCatalogNumber).toBeCalledTimes(0);
    });

    test("assignStoreOwner failure - not valid user", () => {
        const numOfItems: number = 5;
        const products: ProductReq[] = generateProducts(numOfItems);
        const isLoggedIn: boolean = true;
        const isSuccess: boolean = false;

        prepareAssignStoreOwnerMock(isLoggedIn, isSuccess);
        jest.spyOn(store, "removeProductsByCatalogNumber").mockReturnValue(undefined);

        tradingSystemManager = new TradingSystemManager();
        const productsReq: ProductCatalogNumber[] = [];
        for (const prod of products) {
            const prodReq: ProductCatalogNumber = {catalogNumber: prod.catalogNumber};
            productsReq.push(prodReq);
        }

        const req: Req.AssignStoreOwnerRequest = {
            token: mockToken,
            body: {storeName: store.storeName, usernameToAssign: 'user'}
        };
        const res: Res.BoolResponse = tradingSystemManager.assignStoreOwner(req)

        expect(res.data.result).toBeFalsy();
        expect(store.removeProductsByCatalogNumber).toBeCalledTimes(0);
    });


    function prepareAssignStoreManagerMock(isLoggedIn: boolean, isSuccess: boolean) {
        prepareMocksForInventoryManagement(isLoggedIn, isSuccess);
        const operationResMock: Res.BoolResponse = isSuccess ? {data: {result: true}} : {
            data: {result: false},
            error: {message: 'mock err'}
        };
        mocked(StoreManagement).mockImplementation((): any => {
            return {
                assignStoreManager: () => operationResMock
            }
        });
    }

    test("assignStoreManager success", () => {
        const numOfItems: number = 5;
        const products: ProductReq[] = generateProducts(numOfItems);
        const isLoggedIn: boolean = true;
        const isSuccess: boolean = true;

        prepareAssignStoreManagerMock(isLoggedIn, isSuccess);
        tradingSystemManager = new TradingSystemManager();
        const productsReq: ProductCatalogNumber[] = [];
        for (const prod of products) {
            const prodReq: ProductCatalogNumber = {catalogNumber: prod.catalogNumber};
            productsReq.push(prodReq);
        }

        const req: Req.AssignStoreOwnerRequest = {
            token: mockToken,
            body: {storeName: store.storeName, usernameToAssign: 'user'}
        };
        const res: Res.BoolResponse = tradingSystemManager.assignStoreManager(req)

        expect(res.data.result).toBeTruthy();
    });

    test("assignStoreManager failure - not logged in", () => {
        const numOfItems: number = 5;
        const products: ProductReq[] = generateProducts(numOfItems);
        const isLoggedIn: boolean = false;
        const isSuccess: boolean = true;

        prepareAssignStoreManagerMock(isLoggedIn, isSuccess);
        jest.spyOn(store, "removeProductsByCatalogNumber").mockReturnValue(undefined);

        tradingSystemManager = new TradingSystemManager();
        const productsReq: ProductCatalogNumber[] = [];
        for (const prod of products) {
            const prodReq: ProductCatalogNumber = {catalogNumber: prod.catalogNumber};
            productsReq.push(prodReq);
        }

        const req: Req.AssignStoreOwnerRequest = {
            token: mockToken,
            body: {storeName: store.storeName, usernameToAssign: 'user'}
        };
        const res: Res.BoolResponse = tradingSystemManager.assignStoreManager(req)

        expect(res.data.result).toBeFalsy();
        expect(store.removeProductsByCatalogNumber).toBeCalledTimes(0);
    });

    test("assignStoreManager failure - not valid user", () => {
        const numOfItems: number = 5;
        const products: ProductReq[] = generateProducts(numOfItems);
        const isLoggedIn: boolean = true;
        const isSuccess: boolean = false;

        prepareAssignStoreManagerMock(isLoggedIn, isSuccess);
        jest.spyOn(store, "removeProductsByCatalogNumber").mockReturnValue(undefined);

        tradingSystemManager = new TradingSystemManager();
        const productsReq: ProductCatalogNumber[] = [];
        for (const prod of products) {
            const prodReq: ProductCatalogNumber = {catalogNumber: prod.catalogNumber};
            productsReq.push(prodReq);
        }

        const req: Req.AssignStoreOwnerRequest = {
            token: mockToken,
            body: {storeName: store.storeName, usernameToAssign: 'user'}
        };
        const res: Res.BoolResponse = tradingSystemManager.assignStoreManager(req)

        expect(res.data.result).toBeFalsy();
        expect(store.removeProductsByCatalogNumber).toBeCalledTimes(0);
    });


    function prepareRemoveStoreOwnerMock(isLoggedIn: boolean, isSuccess: boolean) {
        prepareMocksForInventoryManagement(isLoggedIn, isSuccess);
        const operationResMock: Res.BoolResponse = isSuccess ? {data: {result: true}} : {
            data: {result: false},
            error: {message: 'mock err'}
        };
        mocked(StoreManagement).mockImplementation((): any => {
            return {
                removeStoreOwner: () => operationResMock
            }
        });
    }

    test("removeStoreOwner success", () => {
        const isLoggedIn: boolean = true;
        const isSuccess: boolean = true;

        prepareRemoveStoreOwnerMock(isLoggedIn, isSuccess);
        tradingSystemManager = new TradingSystemManager();

        const req: Req.RemoveStoreOwnerRequest = {
            token: mockToken,
            body: {storeName: store.storeName, usernameToRemove: 'user'}
        };
        const res: Res.BoolResponse = tradingSystemManager.removeStoreOwner(req)

        expect(res.data.result).toBeTruthy();
    });

    test("removeStoreOwner failure - not logged in", () => {
        const isLoggedIn: boolean = false;
        const isSuccess: boolean = true;

        prepareRemoveStoreOwnerMock(isLoggedIn, isSuccess);
        tradingSystemManager = new TradingSystemManager();

        const req: Req.RemoveStoreOwnerRequest = {
            token: mockToken,
            body: {storeName: store.storeName, usernameToRemove: 'user'}
        };
        const res: Res.BoolResponse = tradingSystemManager.removeStoreOwner(req)

        expect(res.data.result).toBeFalsy();
    });

    test("removeStoreOwner failure - not valid user", () => {
        const isLoggedIn: boolean = true;
        const isSuccess: boolean = false;

        prepareRemoveStoreOwnerMock(isLoggedIn, isSuccess);
        tradingSystemManager = new TradingSystemManager();

        const req: Req.RemoveStoreOwnerRequest = {
            token: mockToken,
            body: {storeName: store.storeName, usernameToRemove: 'user'}
        };
        const res: Res.BoolResponse = tradingSystemManager.removeStoreOwner(req)

        expect(res.data.result).toBeFalsy();
    });


    function prepareRemoveStoreManagerMock(isLoggedIn: boolean, isSuccess: boolean) {
        prepareMocksForInventoryManagement(isLoggedIn, isSuccess);
        const operationResMock: Res.BoolResponse = isSuccess ? {data: {result: true}} : {
            data: {result: false},
            error: {message: 'mock err'}
        };
        mocked(StoreManagement).mockImplementation((): any => {
            return {
                removeStoreManager: () => operationResMock
            }
        });
    }

    test("removeStoreManager success", () => {
        const isLoggedIn: boolean = true;
        const isSuccess: boolean = true;

        prepareRemoveStoreManagerMock(isLoggedIn, isSuccess);
        tradingSystemManager = new TradingSystemManager();

        const req: Req.RemoveStoreManagerRequest = {
            token: mockToken,
            body: {storeName: store.storeName, usernameToRemove: 'user'}
        };
        const res: Res.BoolResponse = tradingSystemManager.removeStoreManager(req)

        expect(res.data.result).toBeTruthy();
    });

    test("removeStoreManager failure - not logged in", () => {
        const isLoggedIn: boolean = false;
        const isSuccess: boolean = true;

        prepareRemoveStoreManagerMock(isLoggedIn, isSuccess);
        tradingSystemManager = new TradingSystemManager();

        const req: Req.RemoveStoreManagerRequest = {
            token: mockToken,
            body: {storeName: store.storeName, usernameToRemove: 'user'}
        };
        const res: Res.BoolResponse = tradingSystemManager.removeStoreManager(req)

        expect(res.data.result).toBeFalsy();
    });

    test("removeStoreManager failure", () => {
        const isLoggedIn: boolean = true;
        const isSuccess: boolean = false;

        prepareRemoveStoreManagerMock(isLoggedIn, isSuccess);
        tradingSystemManager = new TradingSystemManager();

        const req: Req.RemoveStoreManagerRequest = {
            token: mockToken,
            body: {storeName: store.storeName, usernameToRemove: 'user'}
        };
        const res: Res.BoolResponse = tradingSystemManager.removeStoreManager(req)

        expect(res.data.result).toBeFalsy();
    });


    function prepareChangeProductPriceMock(isLoggedIn: boolean, isSuccess: boolean) {
        prepareMocksForInventoryManagement(isLoggedIn, true);
        const operationResMock: Res.BoolResponse = isSuccess ? {data: {result: true}} : {
            data: {result: false},
            error: {message: 'mock err'}
        };
        mocked(StoreManagement).mockImplementation((): any => {
            return {
                changeProductPrice: () => operationResMock
            }
        });
    }

    test("changeProductPrice success", () => {
        const isLoggedIn: boolean = true;
        const isSuccess: boolean = true;

        prepareChangeProductPriceMock(isLoggedIn, isSuccess);
        tradingSystemManager = new TradingSystemManager();

        const req: Req.ChangeProductPriceRequest = {
            token: mockToken,
            body: {storeName: store.storeName, catalogNumber: 5, newPrice: 5}
        };
        const res: Res.BoolResponse = tradingSystemManager.changeProductPrice(req)

        expect(res.data.result).toBeTruthy();
    });

    test("changeProductPrice failure", () => {
        const isLoggedIn: boolean = false;
        const isSuccess: boolean = false;

        prepareChangeProductPriceMock(isLoggedIn, isSuccess);
        tradingSystemManager = new TradingSystemManager();

        const req: Req.ChangeProductPriceRequest = {
            token: mockToken,
            body: {storeName: store.storeName, catalogNumber: 5, newPrice: 5}
        };
        const res: Res.BoolResponse = tradingSystemManager.changeProductPrice(req)

        expect(res.data.result).toBeFalsy();
    });

    function prepareChangeProductNameMock(isLoggedIn: boolean, isSuccess: boolean) {
        prepareMocksForInventoryManagement(isLoggedIn, true);
        const operationResMock: Res.BoolResponse = isSuccess ? {data: {result: true}} : {
            data: {result: false},
            error: {message: 'mock err'}
        };
        mocked(StoreManagement).mockImplementation((): any => {
            return {
                changeProductName: () => operationResMock
            }
        });
    }

    test("changeProductName success", () => {
        const isLoggedIn: boolean = true;
        const isSuccess: boolean = true;

        prepareChangeProductNameMock(isLoggedIn, isSuccess);
        tradingSystemManager = new TradingSystemManager();

        const req: Req.ChangeProductNameRequest = {
            token: mockToken,
            body: {storeName: store.storeName, catalogNumber: 5, newName: 'string'}
        };
        const res: Res.BoolResponse = tradingSystemManager.changeProductName(req)

        expect(res.data.result).toBeTruthy();
    });

    test("changeProductName failure", () => {
        const isLoggedIn: boolean = false;
        const isSuccess: boolean = false;

        prepareChangeProductNameMock(isLoggedIn, isSuccess);
        tradingSystemManager = new TradingSystemManager();

        const req: Req.ChangeProductNameRequest = {
            token: mockToken,
            body: {storeName: store.storeName, catalogNumber: 5, newName: 'string'}
        };
        const res: Res.BoolResponse = tradingSystemManager.changeProductName(req)

        expect(res.data.result).toBeFalsy();
    });

    function prepareAddManagerPermissionsPriceMock(isLoggedIn: boolean, isSuccess: boolean) {
        prepareMocksForInventoryManagement(isLoggedIn, true);
        const operationResMock: Res.BoolResponse = isSuccess ? {data: {result: true}} : {
            data: {result: false},
            error: {message: 'mock err'}
        };
        mocked(StoreManagement).mockImplementation((): any => {
            return {
                addManagerPermissions: () => operationResMock
            }
        });
    }

    test("changeProductPrice success", () => {
        const isLoggedIn: boolean = true;
        const isSuccess: boolean = true;

        prepareAddManagerPermissionsPriceMock(isLoggedIn, isSuccess);
        tradingSystemManager = new TradingSystemManager();

        const req: Req.ChangeManagerPermissionRequest = {
            token: mockToken,
            body: {storeName: store.storeName, managerToChange: 'mockname', permissions: []}
        };
        const res: Res.BoolResponse = tradingSystemManager.addManagerPermissions(req)

        expect(res.data.result).toBeTruthy();
    });

    test("changeProductPrice failure", () => {
        const isLoggedIn: boolean = false;
        const isSuccess: boolean = false;

        prepareAddManagerPermissionsPriceMock(isLoggedIn, isSuccess);
        tradingSystemManager = new TradingSystemManager();

        const req: Req.ChangeManagerPermissionRequest = {
            token: mockToken,
            body: {storeName: store.storeName, managerToChange: 'mockname', permissions: []}
        };
        const res: Res.BoolResponse = tradingSystemManager.addManagerPermissions(req)

        expect(res.data.result).toBeFalsy();
    });


    function prepareRemoveManagerPermissionsPriceMock(isLoggedIn: boolean, isSuccess: boolean) {
        prepareMocksForInventoryManagement(isLoggedIn, true);
        const operationResMock: Res.BoolResponse = isSuccess ? {data: {result: true}} : {
            data: {result: false},
            error: {message: 'mock err'}
        };
        mocked(StoreManagement).mockImplementation((): any => {
            return {
                removeManagerPermissions: () => operationResMock
            }
        });
    }

    test("changeProductPrice success", () => {
        const isLoggedIn: boolean = true;
        const isSuccess: boolean = true;

        prepareRemoveManagerPermissionsPriceMock(isLoggedIn, isSuccess);
        tradingSystemManager = new TradingSystemManager();

        const req: Req.ChangeManagerPermissionRequest = {
            token: mockToken,
            body: {storeName: store.storeName, managerToChange: 'mockname', permissions: []}
        };
        const res: Res.BoolResponse = tradingSystemManager.removeManagerPermissions(req)

        expect(res.data.result).toBeTruthy();
    });

    test("changeProductPrice failure", () => {
        const isLoggedIn: boolean = false;
        const isSuccess: boolean = false;

        prepareRemoveManagerPermissionsPriceMock(isLoggedIn, isSuccess);
        tradingSystemManager = new TradingSystemManager();

        const req: Req.ChangeManagerPermissionRequest = {
            token: mockToken,
            body: {storeName: store.storeName, managerToChange: 'mockname', permissions: []}
        };
        const res: Res.BoolResponse = tradingSystemManager.removeManagerPermissions(req)

        expect(res.data.result).toBeFalsy();
    });


    test("connectDeliverySys success", () => {
        const connectSystemRes: Res.BoolResponse = {data: {result: true}};
        mocked(ExternalSystemsManager).mockImplementation((): any => {
            return {connectSystem: () => connectSystemRes}
        });

        tradingSystemManager = new TradingSystemManager();
        const req: Req.Request = {body: {}, token: "1"};
        const res: Res.BoolResponse = tradingSystemManager.connectDeliverySys(req);

        expect(res.data.result).toBeTruthy();
    });

    test("connectDeliverySys failure", () => {
        const connectSystemRes: Res.BoolResponse = {data: {result: false}};
        mocked(ExternalSystemsManager).mockImplementation((): any => {
            return {connectSystem: () => connectSystemRes}
        });

        tradingSystemManager = new TradingSystemManager();
        const req: Req.Request = {body: {}, token: "1"};
        const res: Res.BoolResponse = tradingSystemManager.connectDeliverySys(req);

        expect(res.data.result).toBeFalsy();
    });


    test("connectPaymentSys success", () => {
        const connectSystemRes: Res.BoolResponse = {data: {result: true}};
        mocked(ExternalSystemsManager).mockImplementation((): any => {
            return {connectSystem: () => connectSystemRes}
        });

        tradingSystemManager = new TradingSystemManager();
        const req: Req.Request = {body: {}, token: "1"};
        const res: Res.BoolResponse = tradingSystemManager.connectPaymentSys(req);

        expect(res.data.result).toBeTruthy();
    });

    test("connectPaymentSys failure", () => {
        const connectSystemRes: Res.BoolResponse = {data: {result: false}};
        mocked(ExternalSystemsManager).mockImplementation((): any => {
            return {connectSystem: () => connectSystemRes}
        });

        tradingSystemManager = new TradingSystemManager();
        const req: Req.Request = {body: {}, token: "1"};
        const res: Res.BoolResponse = tradingSystemManager.connectPaymentSys(req);

        expect(res.data.result).toBeFalsy();

    });


    test("setAdmin success", () => {
        const setAdminRes: Res.BoolResponse = {data: {result: true}};
        mocked(UserManager).mockImplementation((): any => {
            return {setAdmin: () => setAdminRes}
        });
        const setAdminRequest: Req.SetAdminRequest = {body: {newAdminUserName: "mock-admin"}, token: "1"};

        tradingSystemManager = new TradingSystemManager();
        const res: Res.BoolResponse = tradingSystemManager.setAdmin(setAdminRequest);

        expect(res.data.result).toBeTruthy();
    });

    test("setAdmin failure", () => {
        const setAdminRes: Res.BoolResponse = {data: {result: false}};
        mocked(UserManager).mockImplementation((): any => {
            return {setAdmin: () => setAdminRes}
        });
        const setAdminRequest: Req.SetAdminRequest = {body: {newAdminUserName: "mock-admin"}, token: "1"};
        tradingSystemManager = new TradingSystemManager();
        const res: Res.BoolResponse = tradingSystemManager.setAdmin(setAdminRequest);
        expect(res.data.result).toBeFalsy();

    });


    test("createStore success", () => {
        prepareMocksForStoreManagement(true, true);
        const createStoreRequest: Req.OpenStoreRequest = {body: {storeName: "new store"}, token: "1"};
        tradingSystemManager = new TradingSystemManager();
        const res: Res.BoolResponse = tradingSystemManager.createStore(createStoreRequest);
        expect(res.data.result).toBeTruthy();
    });

    test("createStore failure", () => {
        prepareMocksForStoreManagement(false, true);
        const createStoreRequest: Req.OpenStoreRequest = {body: {storeName: "new store"}, token: "1"};
        tradingSystemManager = new TradingSystemManager();
        const res: Res.BoolResponse = tradingSystemManager.createStore(createStoreRequest);
        expect(res.data.result).toBeFalsy();
    });

    test("createStore failure - invalid user", () => {
        prepareMocksForStoreManagement(false, false);
        const createStoreRequest: Req.OpenStoreRequest = {body: {storeName: "new store"}, token: "1"};
        tradingSystemManager = new TradingSystemManager();
        const res: Res.BoolResponse = tradingSystemManager.createStore(createStoreRequest);
        expect(res.data.result).toBeFalsy();
    });


    test("viewStoreInfo success", () => {
        const mockReq: Req.StoreInfoRequest = {body: {storeName: "store-name"}, token: mockToken};
        const mockRes: Res.StoreInfoResponse = {
            data: {
                result: true, info: {
                    productsNames: ["aa"], storeManagersNames: ["aa"],
                    storeName: "store-name", storeOwnersNames: ["aa"], storeRating: Rating.LOW
                }
            }
        };
        mocked(StoreManagement).mockImplementation((): any => {
            return {
                viewStoreInfo: () => mockRes
            }
        });

        tradingSystemManager = new TradingSystemManager();
        expect(tradingSystemManager.viewStoreInfo(mockReq)).toMatchObject(mockRes);

    });


    test("viewStorePurchasesHistory success", () => {
        prepareMocksForStoreManagement(true, true);
        const req: Req.ViewShopPurchasesHistoryRequest = {body: {storeName: "mock shop"}, token: "1"};
        tradingSystemManager = new TradingSystemManager();
        const res: Res.ViewShopPurchasesHistoryResponse = tradingSystemManager.viewStorePurchasesHistory(req);
        expect(res.data.receipts).toHaveLength(1);

    });

    test("viewStorePurchasesHistory failure", () => {
        prepareMocksForStoreManagement(false, true);
        const req: Req.ViewShopPurchasesHistoryRequest = {body: {storeName: "mock shop"}, token: "1"};
        tradingSystemManager = new TradingSystemManager();
        const res: Res.ViewShopPurchasesHistoryResponse = tradingSystemManager.viewStorePurchasesHistory(req);
        expect(res.data.receipts).toHaveLength(0)
    });


    test("viewRegisteredUserPurchasesHistory success", () => {
        prepareMocksForStoreManagement(true, true);
        const req: Req.ViewRUserPurchasesHistoryReq = {body: {}, token: "1"};
        tradingSystemManager = new TradingSystemManager();
        const res: Res.ViewRUserPurchasesHistoryRes = tradingSystemManager.viewRegisteredUserPurchasesHistory(req);
        expect(res.data.receipts).toHaveLength(1);

    });

    test("viewRegisteredUserPurchasesHistory failure", () => {
        prepareMocksForStoreManagement(false, true);
        const req: Req.ViewRUserPurchasesHistoryReq = {body: {}, token: "1"};
        tradingSystemManager = new TradingSystemManager();
        const res: Res.ViewRUserPurchasesHistoryRes = tradingSystemManager.viewRegisteredUserPurchasesHistory(req);
        expect(res.data.receipts).toHaveLength(0)
    });

    test("viewRegisteredUserPurchasesHistory failure - invalid logged in user", () => {
        prepareMocksForStoreManagement(false, false);
        const req: Req.ViewRUserPurchasesHistoryReq = {body: {}, token: "1"};
        tradingSystemManager = new TradingSystemManager();
        const res: Res.ViewRUserPurchasesHistoryRes = tradingSystemManager.viewRegisteredUserPurchasesHistory(req);
        expect(res.data.receipts).toHaveLength(0)
    });

    test("viewRegisteredUserPurchasesHistory failure - invalid user to view", () => {
        mocked(UserManager).mockImplementation((): any => {
            return {
                getLoggedInUserByToken: () => new RegisteredUser("name1", "pw1"),
                getUserByName: () => undefined,
            }
        });
        const req: Req.ViewRUserPurchasesHistoryReq = {body: {userName: "username-to-watch"}, token: "1"};
        tradingSystemManager = new TradingSystemManager();
        const res: Res.ViewRUserPurchasesHistoryRes = tradingSystemManager.viewRegisteredUserPurchasesHistory(req);
        expect(res.data.receipts).toHaveLength(0)
        expect(res.data.result).toBe(false)
    });

    test("viewRegisteredUserPurchasesHistory failure - not admin", () => {
        mocked(UserManager).mockImplementation((): any => {
            return {
                getLoggedInUserByToken: () => new RegisteredUser("name1", "pw1"),
                getUserByName: () => new RegisteredUser("name2", "pw1")
            }
        });
        const req: Req.ViewRUserPurchasesHistoryReq = {body: {userName: "username-to-watch"}, token: "1"};
        tradingSystemManager = new TradingSystemManager();
        const res: Res.ViewRUserPurchasesHistoryRes = tradingSystemManager.viewRegisteredUserPurchasesHistory(req);
        expect(res.data.receipts).toHaveLength(0)
        expect(res.data.result).toBe(false)
    });


    test("viewUsersContactUsMessages success", () => {
        prepareMocksForStoreManagement(true, true);
        const req: Req.ViewUsersContactUsMessagesRequest = {body: {storeName: "mock shop"}, token: "1"};
        tradingSystemManager = new TradingSystemManager();
        const res: Res.ViewUsersContactUsMessagesResponse = tradingSystemManager.viewUsersContactUsMessages(req);
        expect(res.data.messages).toHaveLength(1);
    });

    test("viewUsersContactUsMessages failure", () => {
        prepareMocksForStoreManagement(false, true);
        const req: Req.ViewUsersContactUsMessagesRequest = {body: {storeName: "mock shop"}, token: "1"};
        tradingSystemManager = new TradingSystemManager();
        const res: Res.ViewUsersContactUsMessagesResponse = tradingSystemManager.viewUsersContactUsMessages(req);
        expect(res.data.messages).toHaveLength(0);
    });

    test("viewUsersContactUsMessages failure - invalid user", () => {
        prepareMocksForStoreManagement(true, false);
        const req: Req.ViewUsersContactUsMessagesRequest = {body: {storeName: "mock shop"}, token: "1"};
        tradingSystemManager = new TradingSystemManager();
        const res: Res.ViewUsersContactUsMessagesResponse = tradingSystemManager.viewUsersContactUsMessages(req);
        expect(res.data.messages).toHaveLength(0);
    });


    function prepereMocksForLoggedinUser(succ: boolean, isLoggedIn: boolean) {
        const getUserByToken: RegisteredUser = new RegisteredUser("tal", "tal123");
        const item: Item = new Item(5, 10);
        const viewRUserPurchasesHistoryRes: Res.ViewRUserPurchasesHistoryRes = {
            data: {
                result: succ,
                receipts: succ ? [new Receipt([{
                    storeName: store.storeName,
                    userName: user.name,
                    item,
                    price: 30
                }], {lastCC4: "5555", totalCharged: 30})] : []
            }
        };
        mocked(UserManager).mockImplementation((): any => {
            return {
                getLoggedInUserByToken: () => isLoggedIn ? getUserByToken : undefined,
                isLoggedIn: () => succ,
                addProductToCart: (u: User, product: Product) => {
                    return 5 + 5
                },
                viewRegisteredUserPurchasesHistory: () => {
                    return viewRUserPurchasesHistoryRes
                }
            }
        });
    }

    function prepareMockToSaveProduct() {
        mocked(UserManager).mockImplementation((): any => {
            return {
                getUserByToken: () => user,
                saveProductToCart: (user1: User, storeName: string, product: Product, amount: number) =>
                    user1.saveProductToCart(storeName, product, amount)
            }
        });


        mocked(StoreManagement).mockImplementation((): any => {
            return {findStoreByName: () => store}
        });


    }

    test("saveProductToCart success test", () => {
        prepareMockToSaveProduct()
        tradingSystemManager = new TradingSystemManager();
        const p: Product = new Product('prod', 12, 5, ProductCategory.HOME)
        jest.spyOn(store, 'isProductAmountInStock').mockReturnValueOnce(true);
        jest.spyOn(store, 'getProductByCatalogNumber').mockReturnValueOnce(p)

        const req: Req.SaveToCartRequest = {
            body: {storeName: store.storeName, catalogNumber: 12, amount: 3},
            token: 'whatever'
        }
        const res = tradingSystemManager.saveProductToCart(req);

        expect(user.cart.get(store.storeName)).toEqual([{product: p, amount: req.body.amount}]);
        expect(res.data.result).toBeTruthy()

    })

    function prepareMockToVerifyCart(isSuccess: boolean): void {
        const operationResMock: Res.BoolResponse = isSuccess ? {data: {result: true}} : {
            data: {result: false},
            error: {message: 'mock err'}
        };

        mocked(StoreManagement).mockImplementation((): any => {
            return {
                verifyStoreBag: () => isSuccess ? {data: {result: true}} : {
                    data: {result: false},
                    error: {message: "error", options: 1}
                },
            }
        });
        mocked(UserManager).mockImplementation((): any => {
            return {
                getUserByToken: () => user,
                saveProductToCart: (user1: User, storeName: string, product: Product, amount: number) =>
                    user1.saveProductToCart(storeName, product, amount),
                getUserCart: () => cart
            }
        });

    }

    test("verifyCart success test", () => {
        prepareMockToVerifyCart(true)
        tradingSystemManager = new TradingSystemManager();
        const req: Req.VerifyCartRequest = {
            body: {},
            token: mockToken
        }
        const res = tradingSystemManager.verifyCart(req);

        expect(res.data.result).toBeTruthy();

    })

    test("verifyCart failure test", () => {
        prepareMockToVerifyCart(false)
        tradingSystemManager = new TradingSystemManager();
        const req: Req.VerifyCartRequest = {
            body: {},
            token: mockToken
        }
        const res = tradingSystemManager.verifyCart(req);

        expect(res.data.result).toBeFalsy();

    })

    /*
        function prepareMockToPay(isSuccess: boolean): void {
            mocked(PaymentSystem).mockImplementation((): any => {
                return {
                    constructor:() => new PaymentSystem(),
                    pay: () => isSuccess,
                }
            });
            mocked(UserManager).mockImplementation((): any => {
                return {
                    getUserByToken: () => user,
                }
            });
            mocked(ExternalSystemsManager).mockReset()

        }
        test("pay success test", () => {
            prepareMockToPay(true)
            tradingSystemManager = new TradingSystemManager();
            const req: Req.PayRequest = {
                body: {cardDetails:{holderName: "tal",number: 152, expYear:2021, expMonth:5,cvv:40},address:"batyam",city:"batya",country:"israel",price: 30 },
                token: mockToken
            }
            const res = tradingSystemManager.pay(req)

            expect(res.data.result).toBeTruthy();

        })

        test("pay failure test", () => {
            prepareMockToPay(false)
            tradingSystemManager = new TradingSystemManager();
            const req: Req.PayRequest = {
                body: {cardDetails:{holderName: "tal",number: 152, expYear:2021, expMonth:5,cvv:40},address:"batyam",city:"batya",country:"israel",price: 30 },
                token: mockToken
            }
            const res = tradingSystemManager.pay(req)

            expect(res.data.result).toBeFalsy();

        })
    */

    function preparePurchaseMock(isSuccess: boolean): Res.PurchaseResponse {
        const operationResMock: Res.BoolResponse = isSuccess ? {data: {result: true}} : {
            data: {result: false},
            error: {message: 'mock err'}
        };
        mocked(UserManager).mockImplementation((): any => {
            return {
                getUserByToken: () => user,
                getLoggedInUserByToken: () => user,
                getUserCart: () => cart
            }
        });
        const purchase: Purchase = {
            item: {catalogNumber: 5, id: 2},
            price: 20,
            storeName: store.storeName,
            userName: user.name
        }
        mocked(StoreManagement).mockImplementation((): any => {
            return {
                purchaseFromStore: () => [purchase]
            }
        });
        const res: Res.PurchaseResponse = isSuccess ? {
            data: {
                result: true,
                receipt: {date: new Date(), purchases: [purchase]}
            }
        } : {
            data: {result: false},
            error: {message: 'mock err'}
        };
        return res;
    }

    test("purchase success", () => {

        const req: Req.UpdateStockRequest = {
            body: {payment: {totalCharged: 30, lastCC4: "5555"}}, token: mockToken
        }
        const mockRes: Res.PurchaseResponse = preparePurchaseMock(true);
        tradingSystemManager = new TradingSystemManager();
        const res: Res.PurchaseResponse = tradingSystemManager.purchase(req);
        expect(res.data.result).toBeTruthy()
        expect(res.data.receipt.purchases).toEqual(mockRes.data.receipt.purchases)

    })


    function prepareSearchMock(isSuccess: boolean): Res.BoolResponse {
        const operationResMock: Res.BoolResponse = isSuccess ? {data: {result: true}} : {
            data: {result: false},
            error: {message: 'mock err'}
        };
        mocked(StoreManagement).mockImplementation((): any => {
            return {
                search: () => operationResMock
            }
        });
        return operationResMock;
    }

    test("search", () => {
        const isSuccess: boolean = true;
        const req: Req.SearchRequest = {body: {filters: {}, searchQuery: {}}, token: 'mock-token'};
        const res: Res.BoolResponse = prepareSearchMock(isSuccess);

        tradingSystemManager = new TradingSystemManager();
        expect(tradingSystemManager.search(req)).toMatchObject(res);
    })


    function prepareVerifyNewStoreMock(isStoreExists: boolean, isUserValid: boolean) {
        mocked(StoreManagement).mockImplementation((): any => {
            return {
                verifyStoreExists: () => isStoreExists ? new Store("new-store-mock") : undefined,
            }
        });

        mocked(UserManager).mockImplementation((): any => {
            return {
                getUserByToken: () => isUserValid ? new RegisteredUser("username-mock", "username-pw") : undefined
            }
        });

    }

    test("verifyNewStore success", () => {
        const isStoreExists: boolean = false;
        const isUserValid: boolean = true;
        prepareVerifyNewStoreMock(isStoreExists, isUserValid);
        tradingSystemManager = new TradingSystemManager();

        const verifyStoreReq: Req.VerifyStoreName = {body: {storeName: "name1"}, token: "token-mock"};
        const verifyStoreRes: Res.BoolResponse = tradingSystemManager.verifyNewStore(verifyStoreReq);
        expect(verifyStoreRes.data.result).toBe(!isStoreExists && isUserValid);
    });

    test("verifyNewStore failure - store exists", () => {
        const isStoreExists: boolean = true;
        const isUserValid: boolean = true;
        prepareVerifyNewStoreMock(isStoreExists, isUserValid);
        tradingSystemManager = new TradingSystemManager();

        const verifyStoreReq: Req.VerifyStoreName = {body: {storeName: "name1"}, token: "token-mock"};
        const verifyStoreRes: Res.BoolResponse = tradingSystemManager.verifyNewStore(verifyStoreReq);
        expect(verifyStoreRes.data.result).toBe(!isStoreExists && isUserValid);
    });

    test("verifyNewStore failure - invalid user", () => {
        const isStoreExists: boolean = false;
        const isUserValid: boolean = false;
        prepareVerifyNewStoreMock(isStoreExists, isUserValid);
        tradingSystemManager = new TradingSystemManager();

        const verifyStoreReq: Req.VerifyStoreName = {body: {storeName: "name1"}, token: "token-mock"};
        const verifyStoreRes: Res.BoolResponse = tradingSystemManager.verifyNewStore(verifyStoreReq);
        expect(verifyStoreRes.data.result).toBe(!isStoreExists && isUserValid);
    });


    function prepareMocksForStoreManagement(succ: boolean, isLoggedIn: boolean) {
        const createStoreRes: Res.BoolResponse = {data: {result: succ}};
        const item: Item = new Item(5, 10);
        const viewShopPurchasesHistoryResponse: Res.ViewShopPurchasesHistoryResponse = {
            data: {
                result: succ,
                receipts: succ ? [new Receipt([{
                    storeName: store.storeName,
                    userName: user.name,
                    item,
                    price: 30
                }], {lastCC4: "5555", totalCharged: 30})] : []
            }
        };
        const viewUsersContactUsMessagesResponse: Res.ViewUsersContactUsMessagesResponse = {
            data: {
                result:succ,
                messages: succ ? [new ContactUsMessage("hey its me")] : []
            }
        };

        prepereMocksForLoggedinUser(succ, isLoggedIn);
        mocked(StoreManagement).mockImplementation((): any => {
            return {
                addStore: () => createStoreRes,
                viewStorePurchaseHistory: () => viewShopPurchasesHistoryResponse,
                viewUsersContactUsMessages: () => viewUsersContactUsMessagesResponse,
            }
        });
    }

    function prepareMocksForInventoryManagement(isLoggedIn: boolean, isGetUserByName) {
        const verifyResMock: Res.BoolResponse = isLoggedIn ? {data: {result: true}} : {
            data: {result: false},
            error: {message: 'mock err'}
        };

        mocked(UserManager).mockImplementation((): any => {
            return {
                verifyUser: () => verifyResMock,
                getUserByToken: () => user,
                assignStoreManagerBasicPermissions: () => true,
                getLoggedInUserByToken: () => isLoggedIn ? user : undefined,
                getUserByName: () => isGetUserByName ? user : undefined
            }
        });
    }

    function generateItems(numOfItems: number): Item[] {
        const items: Item[] = [];
        for (let i = 0; i < numOfItems; i++)
            items.push(new Item(1, 2));

        return items;
    }

    function generateProducts(numOfItems: number): ProductReq[] {
        const products: ProductReq[] = [];
        for (let i = 0; i < numOfItems; i++)
            products.push({name: 'name', catalogNumber: 2, price: 5, category: ProductCategory.ELECTRONICS});

        return products;
    }


});
