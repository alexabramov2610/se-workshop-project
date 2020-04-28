import { Bridge, Driver, Item, CreditCard, Product, Store } from "../..";
import { ProductBuilder } from "../../src/test_env/mocks/builders/product-builder";
import { Credentials } from "../../src/test_env/types";

describe("Watch Purchases History, UC: 3.7", () => {
  let _serviceBridge: Bridge;
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

  test("logged in, with history, without admin flag", () => {
    _serviceBridge.login(_shopoholic);
    _driver.given.store(_store).products([_prodct]).makeABuy();
    _serviceBridge.logout();
    _serviceBridge.login(_driver.getInitDefaults());
    const res = _serviceBridge.viewUserPurchasesHistory({
      body: { userName: _shopoholic.userName },
    });
    expect(res.data.result).toBe(false);
    expect(res.error.message).toBeDefined();
  });

  test("logged in, with history, with admin flag", () => {
    _serviceBridge.login(_shopoholic);
    _driver.given.store(_store).products([_prodct]).makeABuy();
    _serviceBridge.logout();
    const asAdmin=true;
    _serviceBridge.login(_driver.getInitDefaults(),asAdmin);
    const res = 
    _serviceBridge.viewUserPurchasesHistory({
      body: { userName: _shopoholic.userName },
    });
    const itemCatalogNumber: any[] = [].concat
      .apply(
        [],
        res.data.receipts.map((r) => r.purchases)
      )
      .map((e) => e.item.catalogNumber)
      .filter((cn) => cn === _item.catalogNumber);
    expect(itemCatalogNumber[0]).toBe(_prodct.catalogNumber);
    
  });

  test("logged in, no history, with admin flag", () => {
    const asAdmin=true;
    _serviceBridge.login(_driver.getInitDefaults(),asAdmin);
    const {error,data} = 
    _serviceBridge.viewUserPurchasesHistory({
      body: { userName: _shopoholic.userName },
    });
    expect(data.result).toBe(true);
    expect(data.receipts.length).toBe(0);
    expect(error).toBeUndefined();
  });

  test("logged in, with history, with admin flag, buyer history is shop manager", () => {
    _serviceBridge.login(_driver.getLoginDefaults());
    _serviceBridge.assignManager(_store,_shopoholic);
    _serviceBridge.logout()
    _serviceBridge.login(_shopoholic);
    _driver.given.store(_store).products([_prodct]).makeABuy();
    _serviceBridge.logout();
    const asAdmin=true;
    _serviceBridge.login(_driver.getInitDefaults(),asAdmin);
    const res = 
    _serviceBridge.viewUserPurchasesHistory({
      body: { userName: _shopoholic.userName },
    });
    const itemCatalogNumber: any[] = [].concat
      .apply(
        [],
        res.data.receipts.map((r) => r.purchases)
      )
      .map((e) => e.item.catalogNumber)
      .filter((cn) => cn === _item.catalogNumber);
    expect(itemCatalogNumber[0]).toBe(_prodct.catalogNumber);
  });
});
