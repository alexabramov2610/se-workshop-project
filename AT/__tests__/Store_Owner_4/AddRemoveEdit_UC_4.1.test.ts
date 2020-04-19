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

  test("Add product - Happy Path: add product to new store", () => {
    console.log("printed from test!@#!@#!@#");
    const { name } = _serviceBridge.createStore(_storeInformation).data;
    expect(name).toBe(_storeInformation.name);
    const productToAdd = new ProductBuilder()
      .withCatalogNumber(789)
      .getProduct();
    const resProduct = _serviceBridge.addProductsToStore(_storeInformation, [
      productToAdd,
    ]).data;

    expect(resProduct.result).toBe(true);

    const res = _serviceBridge.addItemsToStore(_storeInformation, [
      { id: 123, catalogNumber: productToAdd.catalogNumber },
    ]).data.result;
    console.log("this is the result", res);
    expect(res).toBe(true);
  });

  test("Add product - Sad Path: add product to new store user logged out", () => {
    const { name } = _serviceBridge.createStore(_storeInformation).data;
    expect(name).toBe(_storeInformation.name);
    _serviceBridge.logout(_driver.getLoginDefaults().userName);
    const productToAdd = new ProductBuilder().getProduct();
    const resErrorProduct = _serviceBridge.addProductsToStore(
      _storeInformation,
      [productToAdd]
    ).error;
    expect(resErrorProduct).toBeDefined();
  });

  test("Add product - Sad Path: add product to new store user doesnt have permissions", () => {
    const { name } = _serviceBridge.createStore(_storeInformation).data;
    expect(name).toBe(_storeInformation.name);
    _serviceBridge.logout(_driver.getLoginDefaults().userName);
    const newUser: Credentials = {
      userName: "fakeUser",
      password: "fakePwd123",
    };
    _serviceBridge.register(newUser);
    _serviceBridge.login(newUser);
    const productToAdd = new ProductBuilder().getProduct();
    const resErrorProduct = _serviceBridge.addProductsToStore(
      _storeInformation,
      [productToAdd]
    ).error;
    expect(resErrorProduct).toBeDefined();
  });

  test("Remove product - Happy Path: remove existing product", () => {
    console.log("printed from test!@#!@#!@#");
    const { name } = _serviceBridge.createStore(_storeInformation).data;
    expect(name).toBe(_storeInformation.name);
    const productToAdd = new ProductBuilder()
      .withCatalogNumber(789)
      .getProduct();
    const resProduct = _serviceBridge.addProductsToStore(_storeInformation, [
      productToAdd,
    ]).data;
    expect(resProduct.result).toBe(true);
    const resItem = _serviceBridge.addItemsToStore(_storeInformation, [
      { id: 123, catalogNumber: productToAdd.catalogNumber },
    ]).data.result;
    expect(resItem).toBe(true);

    const removeResult = _serviceBridge.removeProductsFromStore(
      _storeInformation,
      [productToAdd]
    ).data;
    expect(removeResult).toBe(true);

  });

  xtest("Remove product - Happy Path: remove existing product user logged out", () => {
    expect(true).toBe(false);
  });

  xtest("Remove product - Happy Path: remove non-existing product user logged in", () => {
    expect(true).toBe(false);
  });

  xtest("Edit product - Happy Path: remove existing product", () => {
    expect(true).toBe(false);
  });

  xtest("Edit product - Happy Path: remove existing product user logged out", () => {
    expect(true).toBe(false);
  });

  xtest("Edit product - Happy Path: remove non-existing product user logged in", () => {
    expect(true).toBe(false);
  });
});
