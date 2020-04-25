import { Bridge, Driver, Item, CreditCard, Product, Store } from "../..";
import { ProductBuilder } from "../mocks/builders/product-builder";
import { Credentials } from "../../src/test_env/types";

describe("Watch Purchases History, UC: 3.7", () => {
  let _serviceBridge: Bridge;
  let _testCreditCard: CreditCard;
  let _driver: Driver;
  let _item: Item;
  let _prodct: Product;
  let _store: Store;
  let _shopoholic: Credentials;
  beforeEach(() => {
    _driver = new Driver()
      .resetState()
      .startSession()
      .initWithDefaults()
      .registerWithDefaults()
      .loginWithDefaults();
    _store = { name: "stor-e-tell" };
    _serviceBridge = _driver.getBridge();
    _prodct = new ProductBuilder().getProduct();
    _shopoholic = { userName: "shopoholic", password: "ibuyALL123" };
    _item = { id: 123, catalogNumber: _prodct.catalogNumber };
    _serviceBridge.createStore(_store);
    _serviceBridge.addProductsToStore(_store, [_prodct]);
    _serviceBridge.addItemsToStore(_store, [_item]);
    _serviceBridge.logout();
    _serviceBridge.register(_shopoholic);
  });

  test("Happy Path: logged in user with history", () => {
    _serviceBridge.login(_shopoholic);
    _driver.given.store(_store).products([_prodct]).makeABuy();
    expect(true).toBe(false);
  })
  test("Happy Path: logged in user with history", () => {
    _serviceBridge.login(_shopoholic);
    _driver.given.store(_store).products([_prodct]).makeABuy();
    expect(true).toBe(false);
  });
  test("Happy Path: logged in user with history", () => {
    _serviceBridge.login(_shopoholic);
    _driver.given.store(_store).products([_prodct]).makeABuy();
    expect(true).toBe(false);
  });
});
