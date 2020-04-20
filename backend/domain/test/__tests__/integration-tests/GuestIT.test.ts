import {TradingSystemManager} from "../../../src/trading_system/TradingSystemManager";
import * as Req from "../../../src/api-ext/Request";
import * as Res from "../../../src/api-ext/Response";
import utils from "./utils"

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


    it("dummy test",() => {
        expect(true).toBe(true);
    });

});

