import { Bridge, Driver, Credentials } from "../..";
import * as utils from "../utils"


describe("Guest Login, UC: 2.3", () => {
  let _serviceBridge: Bridge;
  let _credentials: Credentials;
  let _driver: Driver;

  beforeEach(() => {
    _driver = new Driver();
    _serviceBridge = _driver.resetState().startSession().initWithDefaults().getBridge();
    _credentials = { userName: "test-username", password: "test-Password132" };
  });

  afterAll(() => {
    utils.terminateSocket();
 });

  test("Valid details and registered", () => {
    _credentials.userName = "validUsername";
    _credentials.password = "validPassword123";
    _serviceBridge.register(_credentials);

    const { data, error } = _serviceBridge.login(_credentials);
    expect(error).toBeUndefined();
    expect(data).toBeDefined();
  });

  test("Wrong password and registered", () => {
    const passwordDefect = "234jERFAs$%^hb5@#$@#4bjh";
    _credentials.userName = "validUsername";
    _credentials.password = "wrongPassword123";
    _serviceBridge.register(_credentials);

    _credentials.password += passwordDefect;
    const { data, error } = _serviceBridge.login(_credentials);
    expect(data).toBeUndefined();
    expect(error).toBeDefined();
  });

  test("Valid details and not registered", () => {
    _credentials.userName = "unregisteredUsername";
    _credentials.password = "validPassword123";

    const { data, error } = _serviceBridge.login(_credentials);
    expect(data).toBeUndefined();
    expect(error).toBeDefined();
  });

  test("Valid details and registered and logged in", () => {
    _credentials.userName = "alreadyLoggedInUsername";
    _credentials.password = "validPassword123";

    _serviceBridge.register(_credentials);
    const res = _serviceBridge.login(_credentials);
    expect(res.data).toBeDefined();
    expect(res.error).toBeUndefined();

    const { data, error } = _serviceBridge.login(_credentials);
    expect(error).toBeDefined();
    expect(data).toBeUndefined();
  });
});
