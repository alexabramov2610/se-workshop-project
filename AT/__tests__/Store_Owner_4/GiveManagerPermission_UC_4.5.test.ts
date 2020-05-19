import { Bridge, Driver } from "../../";
import { Store, Credentials, User } from "../../src/test_env/types";
import * as utils from "../../utils"


describe("Add Remove Edit Products, UC: 3.2", () => {
  let _serviceBridge: Bridge;
  let _storeInformation: Store;
  let _driver: Driver;
  
  beforeEach(() => {
    _driver = new Driver()
      .resetState()
      .startSession()
      .initWithDefaults()
      .registerWithDefaults()
      .loginWithDefaults();

    _storeInformation = { name: "this-is-the-coolest-store" };
    _serviceBridge = _driver.getBridge();
    _serviceBridge.createStore(_storeInformation);
    _serviceBridge.logout();
  });


  afterAll(() => {
    utils.terminateSocket();
 });

  test("Give Manager Permissions - store owner logged in, new manager", () => {
    const newManager: Credentials = {
      userName: "new-manager",
      password: "newpwd123",
    };

    _serviceBridge.register(newManager);
    _serviceBridge.login(_driver.getLoginDefaults());

    const { data } = _serviceBridge.assignManager(
      _storeInformation,
      newManager
    );
    expect(data.result).toBe(true);
  });

  test("Give Manager Permissions - valid store, store owner not logged in", () => {
    const newManager: Credentials = {
      userName: "new-manager",
      password: "newpwd123",
    };

    _serviceBridge.register(newManager);

    const { data, error } = _serviceBridge.assignManager(
      _storeInformation,
      newManager
    );
    expect(data).toBeUndefined();
    expect(error).toBeDefined();
  });

  test("Give Manager Permissions - logged in, User with ID is already store manager", () => {
    const newManager: Credentials = {
      userName: "new-manager",
      password: "newpwd123",
    };

    _serviceBridge.register(newManager);
    _serviceBridge.login(_driver.getLoginDefaults());

    const res = _serviceBridge.assignManager(_storeInformation, newManager);
    expect(res.data.result).toBe(true);
    const { data } = _serviceBridge.assignManager(
      _storeInformation,
      newManager
    );

    expect(data).toBeUndefined();
  });

  test("Give Manager Permissions - logged in, user id is not in the System", () => {
    const newManager: Credentials = {
      userName: "new-manager",
      password: "newpwd123",
    };
    _serviceBridge.login(_driver.getLoginDefaults());
    const { data,error } = _serviceBridge.assignManager(
      _storeInformation,
      newManager
    );
    expect(error).toBeDefined()
    expect(data).toBeUndefined();
  });
});
