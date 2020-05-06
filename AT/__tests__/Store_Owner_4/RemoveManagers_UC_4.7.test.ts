import { Bridge, Driver } from "../../";
import { Store, Credentials } from "../../src/test_env/types";

describe("Add Remove Edit Products, UC: 3.2", () => {
  let _serviceBridge: Bridge;
  let _storeInformation: Store;
  let _driver: Driver;
  let _newManagerCreds: Credentials;
  beforeEach(() => {
    _driver = new Driver()
      .resetState()
      .startSession()
      .initWithDefaults()
      .registerWithDefaults()
      .loginWithDefaults();
    _newManagerCreds = {
      userName: "new-manager",
      password: "newpwd123",
    };
    _storeInformation = { name: "this-is-the-coolest-store" };
    _serviceBridge = _driver.getBridge();
    _serviceBridge.createStore(_storeInformation);
    _serviceBridge.logout();
    _serviceBridge.register(_newManagerCreds)
    _driver.loginWithDefaults();
    _serviceBridge.assignManager(_storeInformation,_newManagerCreds)
    _serviceBridge.logout();
  });

  test("Remove managers - remove store manager options- store owner not logged in", () => {
    const { data, error } = _serviceBridge.removeStoreManager({
      body: {
        storeName: _storeInformation.name,
        usernameToRemove: _newManagerCreds.userName,
      },
    });
    expect(data.result).toBe(false);
    expect(error.message).toBeDefined();
  });


  test("Remove managers - id is not a manager id", () => {
    _driver.loginWithDefaults();
    const { data, error } = _serviceBridge.removeStoreManager({
      body: {
        storeName: _storeInformation.name,
        usernameToRemove: 'no-such-user',
      },
    });
    expect(data.result).toBe(false);
    expect(error.message).toBeDefined();
  });

  test("Remove managers -logged in, valid Store manager ID", () => {
    _driver.loginWithDefaults();
    const { data, error } = _serviceBridge.removeStoreManager({
      body: {
        storeName: _storeInformation.name,
        usernameToRemove: _newManagerCreds.userName,
      },
    });
    expect(data.result).toBe(true);
    expect(error).toBeUndefined();
  });

});
