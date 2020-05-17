import { Bridge, Driver } from "../../";
import { Store, Credentials, User, PERMISSION } from "../../src/test_env/types";
import * as utils from "../../utils"


describe("Edit or Set Permissions, UC: 4.6", () => {
  let _serviceBridge: Bridge;
  let _storeInformation: Store;
  let _driver: Driver;
  let _newManagerCredentials: Credentials;

  beforeEach(() => {
    _driver = new Driver()
      .resetState()
      .startSession()
      .initWithDefaults()
      .registerWithDefaults()
      .loginWithDefaults();
    _storeInformation = { name: "this-is-the-coolest-store" };
    _newManagerCredentials = { userName: "new-manager", password: "boss1234" };
    _serviceBridge = _driver.getBridge();
    _serviceBridge.createStore(_storeInformation);
    _serviceBridge.logout();
    _serviceBridge.register(_newManagerCredentials);
    _serviceBridge.logout();
    _driver.loginWithDefaults();
    _serviceBridge.assignManager(_storeInformation, _newManagerCredentials);
  });

  afterAll(() => {
    utils.terminateSocket();
 });

  test("store owner logged in valid manager", () => {
    const res = _serviceBridge.grantPermissions(
      _newManagerCredentials,
      _storeInformation,
      [PERMISSION.MODIFY_BUYING_METHODS, PERMISSION.CLOSE_STORE]
    );

    expect(res.data).toBeDefined()

    const { data, error } = _serviceBridge.viewManagerPermissions({
      body: {
        managerToView: _newManagerCredentials.userName,
        storeName: _storeInformation.name,
      },
    });
    // const filtered = data.permissions.filter(
    //   (perm) =>
    //     perm.valueOf() === PERMISSION.CLOSE_STORE ||
    //     perm.valueOf() === PERMISSION.MODIFY_BUYING_METHODS
    // );

  //  expect(filtered.length).toBe(2);
  expect(data.permissions).toContainEqual(PERMISSION.MODIFY_BUYING_METHODS)
  expect(data.permissions).toContainEqual(PERMISSION.CLOSE_STORE)
  });

  test("store owner logged in valid manager grant permissions and grant again", () => {
    const res = _serviceBridge.grantPermissions(
      _newManagerCredentials,
      _storeInformation,
      [PERMISSION.MODIFY_BUYING_METHODS, PERMISSION.CLOSE_STORE]
    );
    expect(res.data).toBeDefined()

    _serviceBridge.grantPermissions(_newManagerCredentials, _storeInformation, [
      PERMISSION.MODIFY_BUYING_METHODS,
      PERMISSION.CLOSE_STORE,
    ]);
    const { data, error } = _serviceBridge.viewManagerPermissions({
      body: {
        managerToView: _newManagerCredentials.userName,
        storeName: _storeInformation.name,
      },
    });
    // const filtered = data.permissions.filter(
    //   (perm) =>
    //     perm.valueOf() === PERMISSION.CLOSE_STORE ||
    //     perm.valueOf() === PERMISSION.MODIFY_BUYING_METHODS
    // );

    // expect(filtered.length).toBe(2);

    expect(data.permissions).toContainEqual(PERMISSION.MODIFY_BUYING_METHODS)
    expect(data.permissions).toContainEqual(PERMISSION.CLOSE_STORE)
  });
  test("store owner logged out valid manager details", () => {
    _serviceBridge.logout();
    const res = _serviceBridge.grantPermissions(
      _newManagerCredentials,
      _storeInformation,
      [PERMISSION.MODIFY_BUYING_METHODS, PERMISSION.CLOSE_STORE]
    );
    expect(res.data).toBeUndefined();
    expect(res.error).toBeDefined();
  });
  test("store owner logged in invalid manager details", () => {
    const res = _serviceBridge.grantPermissions(
      { userName: "nosuchuser", password: "password123" },
      _storeInformation,
      [PERMISSION.MODIFY_BUYING_METHODS, PERMISSION.CLOSE_STORE]
    );
    expect(res.data).toBeUndefined();
    expect(res.error).toBeDefined();
  });
});
