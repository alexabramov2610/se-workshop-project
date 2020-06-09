import { Bridge, Driver } from "../../";
import { Store, Credentials, User } from "../../src/test_env/types";
import * as utils from "../../utils"


describe("Add Remove Edit Products, UC: 3.2", () => {
  let _serviceBridge:Partial<Bridge>;
  let _storeInformation: Store;
  let _driver: Driver;
  let _newOwner: User;
  let _newOwnerCreds: Credentials;
  beforeEach(async() => {
    _driver = new Driver();

    await _driver.startSession()
      await _driver.initWithDefaults()
      await _driver.registerWithDefaults()
      await _driver.loginWithDefaults();
    _storeInformation = { name: "this-is-the-coolest-store" };
    _serviceBridge = _driver.getBridge();
    _newOwnerCreds = {
      userName: "new-boss",
      password: "owner123",
    };
    _newOwner = { username: _newOwnerCreds.userName };
    await _serviceBridge.logout();
    await _serviceBridge.register(_newOwnerCreds);
  });

  afterAll(() => {
      _driver.dropDB()
    utils.terminateSocket();
 });
  test("Add Store Owner - Happy Path: valid store ,not already assigned", async() => {
    await _driver.loginWithDefaults();
    await _serviceBridge.createStore(_storeInformation);
    const { data } = await _serviceBridge.assignStoreOwner(
      _storeInformation,
      _newOwner
    );
    const res = await _serviceBridge.viewStore(
      _storeInformation
    );
      const { storeOwnersNames } = res.data;
    expect(storeOwnersNames).toContain(_newOwner.username);
  });

  test("Add Owner - Sad Path: store owner not logged in", async() => {
   await _serviceBridge.logout();
    const { error } = await _serviceBridge.assignStoreOwner(
      _storeInformation,
      _newOwner
    );
    expect(error).toBeDefined();
  });

  test("Add Owner - Sad Path: store owner logged in, User with ID is already assigned as store owner by", async() => {
    const newOwner2: Credentials = {
      userName: "newOwner2",
      password: "newPass2",
    };
   await _serviceBridge.register(newOwner2);

    await _serviceBridge.login(_driver.getLoginDefaults());
      await _serviceBridge.createStore(_storeInformation);
      await _serviceBridge.assignStoreOwner(_storeInformation, _newOwner);
      await _serviceBridge.assignStoreOwner(_storeInformation, {
      username: newOwner2.userName,
    });
      await _serviceBridge.logout();

      await _serviceBridge.login(_newOwnerCreds);
    const { error } = await _serviceBridge.assignStoreOwner(_storeInformation, {
      username: newOwner2.userName,
    });
    expect(error).toBeDefined();
  });
});
