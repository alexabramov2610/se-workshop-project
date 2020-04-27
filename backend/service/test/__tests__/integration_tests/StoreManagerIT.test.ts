import {TradingSystemManager} from "domain_layer/dist/src/trading_system/TradingSystemManager";
import {Req, Res} from 'se-workshop-20-interfaces'
import * as utils from "./utils"
import {StoreManager} from "domain_layer/dist/src/user/internal_api";

describe("Store Manager Integration Tests", () => {
    const storeManagerName: string = "store-manager";
    const storeManagerPassword: string = "store-manager-pw";
    const storeName: string = "store-name";


    let tradingSystemManager: TradingSystemManager;
    let storeManager: StoreManager;
    let token: string;

    beforeAll(() => {
        utils.systemInit();
    });

    beforeEach(() => {
        utils.systemReset();
        token = utils.initSessionRegisterLogin(storeManagerName, storeManagerPassword);
        expect(token).toBeDefined();
    });



    it("dummy test",() => {
        expect(true).toBe(true);
    });


});

