import {TradingSystemManager} from "../../../src/trading_system/TradingSystemManager";
import {Req, Res} from 'se-workshop-20-interfaces'
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
        token = utils.initSessionRegisterLogin(tradingSystemManager, storeManagerName, storeManagerPassword);
        expect(token).toBeDefined();

        storeManager = new StoreManager(storeManagerName);
    });


    it("dummy test",() => {
        expect(true).toBe(true);
    });


});

