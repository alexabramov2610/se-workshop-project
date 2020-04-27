import {Req, Res} from 'se-workshop-20-interfaces'
import * as utils from "./utils"
import * as ServiceFacade from "../../../src/service_facade/ServiceFacade"

describe("Admin Integration Tests", () => {

    const adminUsername: string = "username";
    const adminPassword: string = "usernamepw123";
    let token: string;

    beforeAll(() => {
        utils.systemInit();
    });

    beforeEach(() => {
        utils.systemReset();
        token = utils.initSessionRegisterLogin(adminUsername, adminPassword);
        expect(token).toBeDefined();
    });

    it("dummy test", () => {
        expect(true).toBe(true);
    })

    it("System init test", () => {
        // const req: Req.InitReq = {body: {firstAdminName: adminUsername, firstAdminPassword: adminPassword}, token}
        // const registerRequest: Req.RegisterRequest = {
        //     body: {
        //         username: req.body.firstAdminName,
        //         password: req.body.firstAdminPassword
        //     }, token: req.token
        // };
        // const registerRes: Res.BoolResponse = tradingSystemManager.register(registerRequest);
        // if (registerRes.error) return registerRes;
        // const loginReq: Req.LoginRequest = {
        //     body: {
        //         username: req.body.firstAdminName,
        //         password: req.body.firstAdminPassword,
        //     }, token: req.token
        // };
        // const loginRes: Res.BoolResponse = tradingSystemManager.login(loginReq);
        // if (!loginRes.data.result) return loginRes;
        // const setAdminReq: Req.SetAdminRequest = {body: {newAdminUserName: req.body.firstAdminName}, token: req.token};
        // const setAdminRes: Res.BoolResponse = ServiceFacade.setAdmin(setAdminReq)
        // if (setAdminRes.error) return setAdminRes;
        // const connectExtReq: Req.Request = {body: {}, token: req.token};
        // const connectDeliveryRes: Res.BoolResponse = tradingSystemManager.connectDeliverySys(connectExtReq);
        // if (connectDeliveryRes.error) return connectDeliveryRes;
        // const connectPaymentRes: Res.BoolResponse = tradingSystemManager.connectPaymentSys(connectExtReq);
        // if (connectPaymentRes.error) return connectPaymentRes;
        // tradingSystemManager.openTradeSystem({body: {}, token: req.token})
        // const logout: Res.BoolResponse = tradingSystemManager.logout({body: {}, token: req.token});
        // if (!logout.data.result) return logout;
        // expect(logout.data.result).toBeTruthy()
        // const isOpenReq: Req.Request = {body: {}, token: req.token};
        // const isOpen = tradingSystemManager.getTradeSystemState(isOpenReq);
        // expect(isOpen.data.state).toEqual(TradingSystemState.OPEN)

});

})


