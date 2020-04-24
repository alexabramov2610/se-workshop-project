import {TradingSystemManager} from "../../../src/trading_system/TradingSystemManager";
import * as Req from "../../../src/api-ext/Request";
import * as Res from "../../../src/api-ext/Response";
import utils from "./utils"
import {TradingSystemState} from "../../../src/api-ext/Enums";

describe("Admin Integration Tests", () => {

    const adminUsername: string = "username";
    const adminPassword: string = "usernamepw123";

    let tradingSystemManager: TradingSystemManager;
    let token: string;


    beforeEach(() => {
        tradingSystemManager = new TradingSystemManager();
        token = utils.guestLogin(tradingSystemManager);
        expect(token).toBeDefined();
    });

    it("System init test", () => {
        const req: Req.InitReq = {body: {firstAdminName: adminUsername, firstAdminPassword: adminPassword}, token}
        const registerRequest: Req.RegisterRequest = {
            body: {
                username: req.body.firstAdminName,
                password: req.body.firstAdminPassword
            }, token: req.token
        };
        const registerRes: Res.BoolResponse = tradingSystemManager.register(registerRequest);
        if (registerRes.error) return registerRes;
        const loginReq: Req.LoginRequest = {
            body: {
                username: req.body.firstAdminName,
                password: req.body.firstAdminPassword,
            }, token: req.token
        };
        const loginRes: Res.BoolResponse = tradingSystemManager.login(loginReq);
        if (!loginRes.data.result) return loginRes;
        const setAdminReq: Req.SetAdminRequest = {body: {newAdminUserName: req.body.firstAdminName}, token: req.token};
        const setAdminRes: Res.BoolResponse = tradingSystemManager.setAdmin(setAdminReq)
        if (setAdminRes.error) return setAdminRes;
        const connectExtReq: Req.Request = {body: {}, token: req.token};
        const connectDeliveryRes: Res.BoolResponse = tradingSystemManager.connectDeliverySys(connectExtReq);
        if (connectDeliveryRes.error) return connectDeliveryRes;
        const connectPaymentRes: Res.BoolResponse = tradingSystemManager.connectPaymentSys(connectExtReq);
        if (connectPaymentRes.error) return connectPaymentRes;
        tradingSystemManager.OpenTradeSystem({body: {}, token: req.token})
        const logout: Res.BoolResponse = tradingSystemManager.logout({body: {}, token: req.token});
        if (!logout.data.result) return logout;
        expect(logout.data.result).toBeTruthy()
        const isOpenReq: Req.Request = {body: {}, token: req.token};
        const isOpen = tradingSystemManager.GetTradeSystemState(isOpenReq);
        expect(isOpen.data.state).toEqual(TradingSystemState.OPEN)

});

})
;

