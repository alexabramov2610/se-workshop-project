import { Bridge, Driver } from "../../";
import { Store, Credentials } from "../../src/test_env/types";
import { ProductBuilder } from "../mocks/builders/product-builder";

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
      .registerWithDefaults()
      .loginWithDefaults();
    _serviceBridge = _driver.getBridge();
    _storeInformation = { name: "some-store" };
  });

  test("Create Store - Happy Path: add product to new store", () => {
    const { name } = _serviceBridge.createStore(_storeInformation).data;
    expect(name).toBe(_storeInformation.name);
    const productToAdd = new ProductBuilder().getProduct();
    const resProduct = _serviceBridge.addProductsToStore(_storeInformation, [
      productToAdd,
    ]).data.result;
    expect(resProduct).toBe(true);
    const resItem = _serviceBridge.addItemsToStore(_storeInformation, [
      { id: 123, catalogNumber: productToAdd.catalogNumber },
    ]).data.result;
    expect(resItem).toBe(true);
  });

  test("Create Store - Sad Path: add product to new store user logged out", () => {
    const { name } = _serviceBridge.createStore(_storeInformation).data;
    expect(name).toBe(_storeInformation.name);
    const productToAdd = new ProductBuilder().getProduct();
    const resErrorProduct = _serviceBridge.addProductsToStore(
      _storeInformation,
      [productToAdd]
    ).error;
    expect(resErrorProduct).toBe(true);
    const resErrorItem = _serviceBridge.addItemsToStore(_storeInformation, [
      { id: 123, catalogNumber: productToAdd.catalogNumber },
    ]).data.result;
    expect(resErrorItem).toBe(true);
  });

});
