import { ServiceBridge, Driver } from "../../src/test_env/exports";
import { Item, Store } from "../../src/test_env/types";

const ITEM_NOT_FOUND = "Item not found";
const STORE_NOT_FOUND = "Store not found";

describe("Guest - View Information, UC: 2.4", () => {
  let _serviceBridge: ServiceBridge;
  var _testItem: Item;
  var _testStore: Store;

  beforeEach(() => {
    _serviceBridge = Driver.makeBridge();
  });

  test("View valid item", () => {
    _testItem.id = "validItemID";
    _testItem.name = "itemTestName";
    _testItem.description = "itemTestDesc";
    _testItem.price = 33.5;

    _serviceBridge.addItemToStore(_testStore.id, _testItem);

    const { data, error } = _serviceBridge.viewItem(_testItem.id);
    const { name, price, description } = data;
    expect(error).toBeFalsy();
    expect(name).toEqual(_testItem.name);
    expect(price).toEqual(_testItem.price);
    expect(description).toEqual(_testItem.description);
  });

  test("View invalid item", () => {
    _testItem.id = "invalidItemID";
    _testItem.name = "itemTestName";
    _testItem.description = "itemTestDesc";
    _testItem.price = 33.5;

    _serviceBridge.removeItem(_testItem.id);

    const { data, error } = _serviceBridge.viewItem(_testItem.id);
    expect(data).toBeUndefined();
    expect(error).toEqual(ITEM_NOT_FOUND);
  });

  test("View valid store", () => {
    _testStore.id = "validStoreID";
    _testStore.name = "storeTestName";
    _testStore.description = "storeTestDesc";

    _serviceBridge.addStore(
      _testStore.id,
      _testStore.name,
      _testStore.description
    );

    const { success, data , error } = _serviceBridge.viewStore(_testItem.id);
    const { name, description } = data;
    expect(error).toBeFalsy();
    expect(success).toBeTruthy();
    expect(name).toEqual(_testStore.name);
    expect(description).toEqual(_testStore.description);
  });

  test("View invalid store", () => {
    _testStore.id = "invalidStoreID";
    _testStore.name = "storeTestName";
    _testStore.description = "storeTestDesc";

    _serviceBridge.removeStore(_testStore.id);

    const { data, error } = _serviceBridge.viewStore(_testStore.id);
    expect(data).toBeUndefined();
    expect(error).toEqual(STORE_NOT_FOUND);
  });
});
