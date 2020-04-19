import { Bridge, Driver } from "../../";
import { Store, Credentials, User } from "../../src/test_env/types";

describe("Add Remove Edit Products, UC: 3.2", () => {
  let _serviceBridge: Bridge;
  let _storeInformation: Store;
  let _credentials: Credentials;
  let _driver: Driver;

  beforeEach(() => {
    _driver = new Driver()
      .resetState()
      .initWithDefaults()
      .startSession()
      .registerWithDefaults();
    _storeInformation = { name: "this-is-the-coolest-store" };
    _serviceBridge = _driver.getBridge();
    _storeInformation = { name: "some-store" };
  });

  test("Add Store Owner - Happy Path: new user new store", () => {
    const newBossCred: Credentials = {
      userName: "new-boss",
      password: "owner123",
    };
    const newBoss: User = { username: newBossCred.userName };
    _serviceBridge.register(newBossCred);

    _serviceBridge.login(_driver.getLoginDefaults());
    const { data } = _serviceBridge.assignStoreOwner(
      _storeInformation,
      newBoss
    );
    const { storeOwnersNames } = _serviceBridge.viewStore(
      _storeInformation
    ).data;
    expect(storeOwnersNames).toContain(newBoss.username);
  });

  // test("Add Owner - Sad Path: not logged in user", () => {
  //   _serviceBridge.register(_credentials);
  //   _serviceBridge.logout();
  //   const { error } = _serviceBridge.addStoreOwner({
  //     username: _credentials.userName,
  //   });
  //   expect(error).toBeDefined();
  // });
});
