import {TradingSystemManager} from "../../../src/trading_system/TradingSystemManager";
import {Req, Res} from 'se-workshop-20-interfaces'
import utils from "./utils"
import {Product} from "../../../src/trading_system/data/Product";
import {ProductCategory} from "se-workshop-20-interfaces/dist/src/Enums";

describe("Registered User Integration Tests", () => {
    const username: string = "username";
    const password: string = "usernamepw123";
    const usernameOwner: string = "owner";
    const passwordOwner: string = "ownerpw123";

    let tradingSystemManager: TradingSystemManager;
    let token: string;


    beforeEach(() => {
        tradingSystemManager = new TradingSystemManager();
        token = utils.initSessionRegisterLogin(tradingSystemManager, username, password);
        expect(token).toBeDefined();
    });


    it("View store information test", () => {
        const ownerToken: string = utils.initSessionRegisterLogin(tradingSystemManager, usernameOwner, passwordOwner)
        const storeName: string = "store name";
        utils.createStore(tradingSystemManager, storeName, ownerToken);
        utils.addNewProducts(tradingSystemManager, storeName, [new Product("p", 1, 2, ProductCategory.HOME)], ownerToken, true);
        const req: Req.StoreInfoRequest = {body: {storeName}, token};
        let res: Res.StoreInfoResponse = tradingSystemManager.viewStoreInfo(req);
        expect(res.data.result).toBe(true);
        expect(res.data.info.storeName).toEqual(storeName);
        expect(res.data.info.productsNames).toEqual(["p"]);
        utils.removeProducts(tradingSystemManager, storeName, [new Product("p", 1, 2, ProductCategory.HOME)], ownerToken)
        res = tradingSystemManager.viewStoreInfo(req);
        expect(res.data.result).toBe(true);
        expect(res.data.info.storeName).toEqual(storeName);
        expect(res.data.info.productsNames).toEqual([]);
        utils.addNewProducts(tradingSystemManager, storeName, [new Product("p", 1, 2, ProductCategory.HOME)], ownerToken, true);
        utils.addNewProducts(tradingSystemManager, storeName, [new Product("p", 1, 2, ProductCategory.HOME)], ownerToken, false);
        res = tradingSystemManager.viewStoreInfo(req);
        expect(res.data.result).toBe(true);
        expect(res.data.info.storeName).toEqual(storeName);
        expect(res.data.info.productsNames).toEqual(["p"]);
    });

    it("logout IT test", () => {
        const logoutReq: Req.LogoutRequest = {token, body: {}};
        const logoutRes: Res.BoolResponse = tradingSystemManager.logout(logoutReq);
        expect(logoutRes.data.result).toBe(true);
    });

    it("create store IT test", () => {
        const storeName: string = "store name";
        const req: Req.OpenStoreRequest = {body: {storeName}, token};
        let res: Res.BoolResponse = tradingSystemManager.createStore(req)
        expect(res.data.result).toBe(true);
        res = tradingSystemManager.createStore(req)
        expect(res.data.result).toBe(false);
    });

    it("view purchases history IT test", () => {
        const storeName: string = "store name";
        const ownerToken: string = utils.initSessionRegisterLogin(tradingSystemManager, usernameOwner, passwordOwner);
        utils.createStore(tradingSystemManager, storeName, token);
        let req: Req.ViewRUserPurchasesHistoryReq = {body: {}, token}
        let res: Res.ViewRUserPurchasesHistoryRes = tradingSystemManager.viewRegisteredUserPurchasesHistory(req)
        expect(res.data.result).toBe(true);
        expect(res.data.receipts).toEqual([]);
        // TODO view history after buying
        req = {body: {userName: "moshe"}, token}
        res = tradingSystemManager.viewRegisteredUserPurchasesHistory(req)
        expect(res.data.result).toBe(false);
    });
});

