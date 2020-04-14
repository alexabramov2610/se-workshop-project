import {Bridge, CATEGORY, Driver, Store, Credentials, Item} from "../../src";

describe("Watch Purchases History, UC: 3.7", () => {
  let _serviceBridge: Bridge;
  let _storeInformation: Store;
  let _credentials: Credentials;
  let _item: Item;

  beforeEach(() => {
    _serviceBridge = Driver.makeBridge();
    _storeInformation = {
      name: "some-mock-store",
      description: "selling cool items",
      id: "id.stores.boom",
    };
    _credentials = { userName: "ron", password: "ronpwd" };
    _item = {
      id: "some-id",
      name: "some-name",
      category: CATEGORY.ELECTRONICS,
      description: "some-desc",
      price: 999,
    };
  });

  test("Happy Path: logged in user with history", () => {
    _serviceBridge.register(_credentials);
    _serviceBridge.login(_credentials);
    const { recieptId } = _serviceBridge.buyItem({
      item: _item,
      store: _storeInformation,
    }).data;
    const latestBuy = _serviceBridge
      .getPurchaseHistory()
      .data.puchases.filter((p) => p.recieptId === recieptId)[0];
    expect(latestBuy.recieptId).toBe(recieptId);
  });

  test("Happy Path: logged in user no history", () => {
    _serviceBridge.register(_credentials);
    _serviceBridge.login(_credentials);
    const { puchases } = _serviceBridge.getPurchaseHistory().data;
    expect(puchases.length).toBe(0);
  });

  test("Sad Path: not-logged in user", () => {
    const error = _serviceBridge.getPurchaseHistory().error;
    expect(error).toBeDefined();
  });
});
