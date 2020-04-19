import { Bridge, Driver, Item, CreditCard, Product } from "../..";
import { ProductBuilder } from "../mocks/builders/product-builder";

describe("Watch Purchases History, UC: 3.7", () => {
  let _serviceBridge: Bridge;
  let _testCreditCard: CreditCard;
  let _driver: Driver;
  let _item: Item;
  let _prodct: Product;

  beforeEach(() => {
    _driver = new Driver()
      .resetState()
      .initWithDefaults()
      .startSession()
      .registerWithDefaults()
      .loginWithDefaults();
    _serviceBridge = _driver.getBridge();
    _prodct = new ProductBuilder().getProduct();
    _item = { id: 123, catalogNumber: _prodct.catalogNumber };
  });

  // test("Happy Path: logged in user with history", () => {
  //   _serviceBridge.addToCart(_item);
  //   const { data } = _serviceBridge.checkout(_testCreditCard);
  //   expect(data).toBeDefined();
  //   const latestBuy = _serviceBridge
  //     .getPurchaseHistory()
  //     .data.purchases.filter((p) => p.productName === _prodct.name)[0];
  //   expect(latestBuy.productName).toBe(_prodct.name);
  // });

  test("Happy Path: logged in user no history", () => {
    const { purchases: purchases } = _serviceBridge.getPurchaseHistory().data;
    expect(purchases.length).toBe(0);
  });

  test("Sad Path: not-logged in user", () => {
    const error = _serviceBridge.getPurchaseHistory().error;
    expect(error).toBeDefined();
  });
});
