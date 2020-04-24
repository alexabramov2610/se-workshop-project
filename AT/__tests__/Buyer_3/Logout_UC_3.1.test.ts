import { Bridge, Driver, Credentials } from "../..";

describe("Guest Buyer, UC: 3.1", () => {
  let _serviceBridge: Bridge;
  var _credentials: Credentials;
  let _driver: Driver;
  beforeEach(() => {
    _driver = new Driver()
      .resetState()
      .startSession()
      .initWithDefaults()
      .registerWithDefaults();
    _serviceBridge = _driver.getBridge();
  });

  test("Logout - Happy Path: after user was logged in ", () => {
    _driver.loginWithDefaults();
    const { error, data } = _serviceBridge.logout();
    expect(data).toBeDefined();
  });

  test("Logout - Sad Path: without login first ", () => {
    const { error, data } = _serviceBridge.logout();
    expect(error).toBeDefined();
  });

  test("Logout - Sad Path: after user was logged out ", () => {
    _driver.loginWithDefaults();
    const { error, data } = _serviceBridge.logout();
    expect(data).toBeDefined();
    const res = _serviceBridge.logout().error;
    expect(res).toBeDefined();
  });
});
