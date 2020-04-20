import {TradingSystemManager} from "../../../src/trading_system/TradingSystemManager";
import * as Req from "../../../src/api-ext/Request";
import * as Res from "../../../src/api-ext/Response";
import utils from "./utils"
import {StoreManager} from "../../../src/user/internal_api";

describe("Store Manager Integration Tests", () => {
    const storeManagerName: string = "store-manager";
    const storeManagerPassword: string = "store-manager-pw";
    const storeName: string = "store-name";


    let tradingSystemManager: TradingSystemManager;
    let storeManager: StoreManager;
    let token: string;


    beforeEach(() => {
        tradingSystemManager = new TradingSystemManager();
        token = utils.registeredUserLogin(tradingSystemManager, storeManagerName, storeManagerPassword);
        expect(token).toBeDefined();

        storeManager = new StoreManager(storeManagerName);
    });


    it("dummy test",() => {
        expect(true).toBe(true);
    });


});

