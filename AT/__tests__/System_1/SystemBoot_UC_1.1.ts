import {Bridge, Driver, Store, Credentials, Item, PERMISSION} from "../../";

describe("System Boot - UC 1", () => {
    let _serviceBridge: Bridge;
    let _driver = new Driver();
    let _credentials: Credentials;

    beforeEach(() => {
        _serviceBridge = _driver.resetState().getBridge();
        _credentials = {userName: "Admin", password: "Admin"};
    });

    test("SystemBoot, valid", () => {
        try {
            _driver.initWithDefaults();
        }
        catch {
            fail();
        }
    });

    //TODO:: Create Real Test
});
