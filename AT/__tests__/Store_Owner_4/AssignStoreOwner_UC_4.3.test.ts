import { Bridge, Driver } from "../../";
import { Store, Credentials, User } from "../../src/test_env/types";

describe("Add Remove Edit Products, UC: 3.2", () => {
  let _serviceBridge: Bridge;
  let _storeInformation: Store;
  let _credentials: Credentials;
  let _driver: Driver;
  let _newOwner: User;
  let _newOwnerCreds: Credentials;
  beforeEach(() => {
    _driver = new Driver()
      .resetState()
      .initWithDefaults()
      .startSession()
      .registerWithDefaults()
      .loginWithDefaults();
    _storeInformation = { name: "this-is-the-coolest-store" };
    _serviceBridge = _driver.getBridge();
    _newOwnerCreds = {
      userName: "new-boss",
      password: "owner123",
    };
    _newOwner = { username: _newOwnerCreds.userName };
    _serviceBridge.logout();
    _serviceBridge.register(_newOwnerCreds);
  });

  test("Add Store Owner - Happy Path: valid store ,not already assigned", () => {
    _serviceBridge.login(_driver.getLoginDefaults());
    _serviceBridge.createStore(_storeInformation);
    const { data } = _serviceBridge.assignStoreOwner(
      _storeInformation,
      _newOwner
    );
    const { storeOwnersNames } = _serviceBridge.viewStore(
      _storeInformation
    ).data;
    expect(storeOwnersNames).toContain(_newOwner.username);
  });

  test("Add Owner - Sad Path: store owner not logged in", () => {
    _serviceBridge.logout();
    const { error } = _serviceBridge.assignStoreOwner(
      _storeInformation,
      _newOwner
    );
    expect(error).toBeDefined();
  });

  test("Add Owner - Sad Path: store owner logged in, User with ID is already assigned as store owner by", () => {
    const newOwner2: Credentials = {
      userName: "newOwner2",
      password: "newPass2",
    };
    _serviceBridge.register(newOwner2);

    _serviceBridge.login(_driver.getLoginDefaults());
    _serviceBridge.createStore(_storeInformation);
    _serviceBridge.assignStoreOwner(_storeInformation, _newOwner);
    _serviceBridge.assignStoreOwner(_storeInformation, {
      username: newOwner2.userName,
    });
    _serviceBridge.logout();

    _serviceBridge.login(_newOwnerCreds);
    const { error } = _serviceBridge.assignStoreOwner(_storeInformation, {
      username: newOwner2.userName,
    });
    expect(error).toBeDefined();
  });
});
