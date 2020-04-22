import {TradingSystemManager} from "../../../src/trading_system/TradingSystemManager";
import * as Req from "../../../src/api-ext/Request";
import * as Res from "../../../src/api-ext/Response";
import utils from "./utils"
import {Product} from "../../../src/trading_system/data/Product";
import {ProductCategory} from "../../../src/api-ext/Enums";

describe("Guest Integration Tests", () => {
    const username: string = "username";
    const password: string = "usernamepw123";

    let tradingSystemManager: TradingSystemManager;
    let token: string;


    beforeEach(() => {
        tradingSystemManager = new TradingSystemManager();
        token = utils.guestLogin(tradingSystemManager);
        expect(token).toBeDefined();
    });


    it("Register IT test", () => {
        const req: Req.RegisterRequest = {body: {username, password}, token};
        let res: Res.BoolResponse = tradingSystemManager.register(req);
        expect(res.data.result).toBe(true);
        expect(res.error).toBeUndefined();
        res = tradingSystemManager.register(req);
        expect(res.data.result).toBe(false);
        expect(res.data.result).toBeDefined();
    });

    it("Register && Login IT test", () => {
        const regReq: Req.RegisterRequest = {body: {username, password}, token};
        tradingSystemManager.register(regReq)
        const req: Req.LoginRequest = {body: {username, password}, token};
        let res: Res.BoolResponse = tradingSystemManager.login(req);
        expect(res.data.result).toBe(true);
        expect(res.error).toBeUndefined();
        res = tradingSystemManager.login(req);
        expect(res.data.result).toBe(false);
        expect(res.data.result).toBeDefined();
    });

    it("View store information IT test", () => {
        const ownerToken: string = utils.initSessionRegisterLogin(tradingSystemManager, username, password)
        const storeName: string = "store name";
        utils.createStore(tradingSystemManager, storeName, ownerToken);
        utils.addNewProducts(tradingSystemManager, storeName, [new Product("p", 1, 2, ProductCategory.Home)], ownerToken, true);
        const req: Req.StoreInfoRequest = {body: {storeName}, token};
        let res: Res.StoreInfoResponse = tradingSystemManager.viewStoreInfo(req);
        expect(res.data.result).toBe(true);
        expect(res.data.info.storeName).toEqual(storeName);
        expect(res.data.info.productNames).toEqual(["p"]);
        utils.removeProducts(tradingSystemManager, storeName, [new Product("p", 1, 2, ProductCategory.Home)], ownerToken)
        res = tradingSystemManager.viewStoreInfo(req);
        expect(res.data.result).toBe(true);
        expect(res.data.info.storeName).toEqual(storeName);
        expect(res.data.info.productNames).toEqual([]);
        utils.addNewProducts(tradingSystemManager, storeName, [new Product("p", 1, 2, ProductCategory.Home)], ownerToken, true);
        utils.addNewProducts(tradingSystemManager, storeName, [new Product("p", 1, 2, ProductCategory.Home)], ownerToken, false);
        res = tradingSystemManager.viewStoreInfo(req);
        expect(res.data.result).toBe(true);
        expect(res.data.info.storeName).toEqual(storeName);
        expect(res.data.info.productNames).toEqual(["p"]);
    });

    // TODO
    it("View product information IT test", () => {
        expect(true)
    });

    // TODO
    it("Search IT test", () => {
        expect(true)
    });

    // TODO
    it("Save items in cart IT test", () => {
        expect(true)
    });

    // TODO
    it("Watch cart IT test", () => {
        expect(true)
    });

    // TODO
    it("Buy items IT test", () => {
        expect(true)
    });


});

