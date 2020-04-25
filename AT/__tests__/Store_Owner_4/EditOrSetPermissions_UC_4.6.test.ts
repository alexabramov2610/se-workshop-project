import { Bridge, Driver } from "../../";
import { Store, Credentials, User } from "../../src/test_env/types";

describe("Edit or Set Permissions, UC: 4.6", () => {
  let _serviceBridge: Bridge;
  let _storeInformation: Store;
  let _driver: Driver;
  let _newManagerCredentials: Credentials;

  beforeEach(() => {
    _driver = new Driver()
      .resetState()
      .initWithDefaults()
      .startSession()
      .registerWithDefaults()
      .loginWithDefaults();
    _storeInformation = { name: "this-is-the-coolest-store" };
    _serviceBridge = _driver.getBridge();
    _serviceBridge.createStore(_storeInformation);
    _serviceBridge.logout();
    _serviceBridge.register(_newManagerCredentials);
    _serviceBridge.logout();
    _driver.loginWithDefaults();
    _serviceBridge.assignManager(_storeInformation, _newManagerCredentials);
  });

  test("store owner not logged in", () => {
    //TODO - REMOVE PERMISSIONS
    expect(false).toBe(true);
  });

  test("Edit or Set Permissions - store owner not logged in", () => {
    const newUser: Credentials = {
      userName: "new-user",
      password: "newpwd123",
    };
    _serviceBridge.register(newUser);
    //TODO: TRY TO EDIT/SET PERMISSIONS
    expect(false).toBe(true);
  });

  test("Edit or Set Permissions - store owner not logged in", () => {
    const newUser: Credentials = {
      userName: "new-user",
      password: "newpwd123",
    };
    _serviceBridge.register(newUser);
    //TODO: TRY TO EDIT/SET PERMISSIONS
    expect(false).toBe(true);
  });

  test("Edit or Set Permissions - store owner not logged in", () => {
    const newUser: Credentials = {
      userName: "new-user",
      password: "newpwd123",
    };
    _serviceBridge.register(newUser);
    //TODO: TRY TO EDIT/SET PERMISSIONS
    expect(false).toBe(true);
  });
});
