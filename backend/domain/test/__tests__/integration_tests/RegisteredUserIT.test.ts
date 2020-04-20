import {TradingSystemManager} from "../../../src/trading_system/TradingSystemManager";
import * as Req from "../../../src/api-ext/Request";
import * as Res from "../../../src/api-ext/Response";
import utils from "./utils"

describe("Registered User Integration Tests", () => {
    const username: string = "username";
    const password: string = "usernamepw123";

    let tradingSystemManager: TradingSystemManager;
    let token: string;


    beforeEach(() => {
        tradingSystemManager = new TradingSystemManager();
        token = utils.registeredUserLogin(tradingSystemManager, username, password);
        expect(token).toBeDefined();
    });


    it("logout",() => {
        const logoutReq : Req.LogoutRequest = {token, body: {}};
        const logoutRes: Res.BoolResponse = tradingSystemManager.logout(logoutReq);
        expect(logoutRes.data.result).toBe(true);
    });

});

