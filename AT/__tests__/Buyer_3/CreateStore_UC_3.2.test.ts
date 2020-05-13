import { Bridge, Driver, Store } from "../..";
import * as utils from "../../utils"


describe("Create Store Buyer, UC: 3.2", () => {
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
    _serviceBridge = _driver.getBridge();
    _storeInformation = { name: "mock-name-each" };
  });


  afterEach(async () => {
    await utils.terminateSocket();
 });

  test("Create Store - Happy Path: valid store information - logged in user", () => {
    _storeInformation = { name: "some-store" };
    const { name } = _serviceBridge.createStore(_storeInformation).data;
    expect(name).toBe(_storeInformation.name);
  });
 
  test("Create Store - Sad Path:  - not logged in user", () => {
    _serviceBridge.logout();
    _storeInformation = { name: "mocked-sad-store" };
    const error = _serviceBridge.createStore(_storeInformation);
    expect(error).toBeDefined();
  });

  test("Create Store - Sad Path:  - logged in user empty store info", () => {
    _storeInformation = { name: "" };
    const error = _serviceBridge.createStore(_storeInformation);
    expect(error).toBeDefined();
  });

  test("Create Store - Sad Path:  - logged in user sore name taken", () => {
    _storeInformation = { name: "some-store" };
    const { name } = _serviceBridge.createStore(_storeInformation).data;
    expect(name).toBe(_storeInformation.name);
    _storeInformation = { name: "some-store" };
    const error = _serviceBridge.createStore(_storeInformation);
    expect(error).toBeDefined();
  });

  test("Create Store - Bad Path:  - not logged in user empty store info", () => {
    _serviceBridge.logout();
    _storeInformation = { name: "" };
    const error = _serviceBridge.createStore(_storeInformation);
    expect(error).toBeDefined();
  });
});
