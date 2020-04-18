import { Bridge, Driver, Credentials } from "../../src";

describe("Guest Buyer, UC: 3.1", () => {
  let _serviceBridge: Bridge;
  var _credentials: Credentials;
  let _driver: Driver;
  beforeEach(() => {
    _driver = new Driver()
      .resetState()
      .initWithDefaults()
      .startSession()
      .registerWithDefaults();
    _serviceBridge = _driver.getBridge();
  });

  test("Logout - Happy Path: after user was logged in ", () => {
    _driver.loginWithDefaults();
    const { error, data } = _serviceBridge.logout(
      _driver.getLoginDefaults().userName
    );
    expect(data).toBeDefined();
  });

  test("Logout - Sad Path: without login first ", () => {
    const { error, data } = _serviceBridge.logout(
      _driver.getLoginDefaults().userName
    );
    expect(error).toBeDefined();
  });

  test("Logout - Sad Path: after user was logged out ", () => {
    _driver.loginWithDefaults();
    const { error, data } = _serviceBridge.logout(
      _driver.getLoginDefaults().userName
    );
    expect(data).toBeDefined();
    const res = _serviceBridge.logout(_driver.getLoginDefaults().userName)
      .error;
    expect(res).toBeDefined();
  });
});
