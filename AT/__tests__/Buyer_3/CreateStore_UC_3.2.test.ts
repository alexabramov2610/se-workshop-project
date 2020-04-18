import { Bridge, Driver, Store, Credentials } from "../../src/";

describe("Create Store Buyer, UC: 3.2", () => {
  let _serviceBridge: Bridge;
  let _storeInformation: Store;
  let _credentials: Credentials;
  beforeEach(() => {
    _serviceBridge = Driver.makeBridge();
    _storeInformation = { name: "some-mock-store" };
    _credentials = { userName: "ron", password: "ronpwd" };
    const { token } = _serviceBridge.startSession().data;
    _serviceBridge.setToken(token);
  });

  test("Create Store - Happy Path: valid store information - logged in user", () => {
    _serviceBridge.register(_credentials);
    _serviceBridge.login(_credentials);
    const { name } = _serviceBridge.createStore(_storeInformation).data;
    expect(name).toBe(_storeInformation.name);
  });
});
