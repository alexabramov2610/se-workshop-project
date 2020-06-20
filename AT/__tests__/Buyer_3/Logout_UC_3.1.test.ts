import {Bridge, Driver, Credentials} from "../..";
import * as utils from "../../utils"



describe("Guest Buyer, UC: 3.1", () => {
    let _serviceBridge: Partial<Bridge>;
    var _credentials: Credentials;
    let _driver: Driver;

    beforeEach(async () => {
        _driver = new Driver()
        _driver.dropDB();
        await _driver.reset();
        await _driver.startSession()
        await _driver.initWithDefaults()
        await _driver.registerWithDefaults()
        _serviceBridge = _driver.getBridge();

    });


    afterAll(() => {
        utils.terminateSocket();
        _driver.dropDB();

    });

    test("Logout - Happy Path: after user was logged in ", async() => {
       await _driver.loginWithDefaults();
        const {error, data} = await _serviceBridge.logout();
        expect(data).toBeDefined();
    });

    test("Logout - Sad Path: without login first ",async () => {
        await _serviceBridge.logout();
        const {error, data} = await _serviceBridge.logout();
        expect(error).toBeDefined();
    });

    test("Logout - Sad Path: after user was logged out ",async () => {
        await _driver.loginWithDefaults();
        const {error, data} = await _serviceBridge.logout();
        expect(data).toBeDefined();
        const res = await _serviceBridge.logout();
        expect(res.error).toBeDefined();
    });
});
