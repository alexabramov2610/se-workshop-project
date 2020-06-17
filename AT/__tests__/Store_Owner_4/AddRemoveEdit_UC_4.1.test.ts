import { Bridge, Driver } from "../../";
import { Store, Credentials } from "../../src/test_env/types";
import { ProductBuilder } from "../../src/test_env/mocks/builders/product-builder";
import * as utils from "../../utils"
import { createStore } from "service_layer/dist/src/service_facade/ServiceFacade";



describe("Add Remove Edit Products, UC: 4.1", () => {
    let _serviceBridge: Partial<Bridge>;
  let _storeInformation: Store;
  let _driver: Driver;

  beforeEach(async() => {
    _driver = new Driver()
    _driver.dropDBDor();
    await _driver.reset();
    await _driver.startSession()
    await _driver.initWithDefaults()
    await _driver.registerWithDefaults()
    await _driver.loginWithDefaults();
    _serviceBridge = _driver.getBridge();
    _storeInformation = { name: "some-store" };
  });

  afterAll(() => {
    utils.terminateSocket();
    _driver.dropDBDor();

     });

  test("Add product - Happy Path: add product to new store",async () => {
    const store= await _serviceBridge.createStore(_storeInformation)
    const { name } = store.data;
    expect(name).toBe(_storeInformation.name);
    const productToAdd = new ProductBuilder()
      .withCatalogNumber(789)
      .getProduct();
    const addProdsResponse=await _serviceBridge.addProductsToStore(_storeInformation, [
        productToAdd,
      ])
    const resProduct = addProdsResponse.data;

    expect(resProduct.result).toBe(true);
    const addItemsResponse=await _serviceBridge.addItemsToStore(_storeInformation, [
        { id: 123, catalogNumber: productToAdd.catalogNumber },
      ])
    const res = addItemsResponse.data.result;
    
    expect(res).toBe(true);
  });

  test("Add product - add product to new store user logged out", async() => {
    const createStoreRes=await  _serviceBridge.createStore(_storeInformation)
    const { name } =createStoreRes.data;
    expect(name).toBe(_storeInformation.name);
    await _serviceBridge.logout();
    const productToAdd = new ProductBuilder().getProduct();
    const addProductsToStoreRes=await _serviceBridge.addProductsToStore(_storeInformation,[productToAdd])
    const resErrorProduct = addProductsToStoreRes.error;
    expect(resErrorProduct).toBeDefined();
  });

  test("Add product - add product to new store user doesnt have permissions",async () => {
    const createStoreRes=await _serviceBridge.createStore(_storeInformation)
    const { name } =createStoreRes.data;
    expect(name).toBe(_storeInformation.name);
    _serviceBridge.logout();
    const newUser: Credentials = {
      userName: "fakeUser",
      password: "fakePwd123",
    };
    await _serviceBridge.register(newUser);
    await _serviceBridge.login(newUser);
    const productToAdd = new ProductBuilder().getProduct();
    const addProductsToStoreRes=await _serviceBridge.addProductsToStore(_storeInformation,[productToAdd])
    const resErrorProduct = addProductsToStoreRes.error;
    expect(resErrorProduct).toBeDefined();
  });

  test("Remove product - remove existing product", async () => {
    const createStoreRes=await _serviceBridge.createStore(_storeInformation)
    const { name } =  createStoreRes.data;
    expect(name).toBe(_storeInformation.name);
    const productToAdd = new ProductBuilder()
      .withCatalogNumber(789)
      .getProduct();
    const addProductsToStoreRes=await _serviceBridge.addProductsToStore(_storeInformation, [productToAdd,])
    const resProduct = addProductsToStoreRes.data;
    expect(resProduct.result).toBe(true);
    const addItemsToStoreRes=await _serviceBridge.addItemsToStore(_storeInformation, [
        { id: 123, catalogNumber: productToAdd.catalogNumber },
      ])
    const resItem = addItemsToStoreRes.data.result;
    expect(resItem).toBe(true);

    const removeProductsFromStoreRes=await _serviceBridge.removeProductsFromStore(
        _storeInformation,
        [productToAdd]
      )
    const { result } =removeProductsFromStoreRes.data;
    expect(result).toBe(true);
  });

  test("Remove product - remove existing product user logged out", async () => {
    const createStoreRes=await _serviceBridge.createStore(_storeInformation)
    const { name } = createStoreRes.data;
    expect(name).toBe(_storeInformation.name);
    const productToAdd = new ProductBuilder()
      .withCatalogNumber(789)
      .getProduct();
    const addProductsToStoreRes=await _serviceBridge.addProductsToStore(_storeInformation, [productToAdd,])
    const resProduct = addProductsToStoreRes.data;
    expect(resProduct.result).toBe(true);
    const addItemsToStoreRes=await _serviceBridge.addItemsToStore(_storeInformation, [
        { id: 123, catalogNumber: productToAdd.catalogNumber },
      ])
    const resItem = addItemsToStoreRes.data.result;
    expect(resItem).toBe(true);
    const res = await _serviceBridge.logout();
    expect(res.data).toBeDefined();
    const { error } =await _serviceBridge.removeProductsFromStore(
      _storeInformation,
      [productToAdd]
    );
    expect(error).toBeDefined();
  });

  test("Remove product - Happy Path: remove non-existing product user logged in", async () => {
    const createStoreRes=await _serviceBridge.createStore(_storeInformation)
    const { name } =createStoreRes.data;
    expect(name).toBe(_storeInformation.name);
    const productToAdd = new ProductBuilder()
      .withCatalogNumber(789)
      .getProduct();
    const {data,error,} =await _serviceBridge.removeProductsFromStore(_storeInformation, [
      productToAdd,
    ]);

    expect(data[0]).toBeUndefined();
    expect(error).toBeDefined();
  });

  test("Edit product - change product name and price - Product exsits user logged in with permission", async () => {
    const createStoreRes=await  _serviceBridge.createStore(_storeInformation)
    const { name } =createStoreRes.data;
    expect(name).toBe(_storeInformation.name);
    const productToAdd = new ProductBuilder()
      .withCatalogNumber(789)
      .getProduct();
    const addProductsToStoreRes=await _serviceBridge.addProductsToStore(_storeInformation, [
        productToAdd,
      ])
    const resProduct = addProductsToStoreRes.data;
    expect(resProduct.result).toBe(true);
    const addItemsToStoreRes=await _serviceBridge.addItemsToStore(_storeInformation, [
        { id: 123, catalogNumber: productToAdd.catalogNumber },
      ])
    const resItem = addItemsToStoreRes.data.result;
    expect(resItem).toBe(true);

    const resName = await _serviceBridge.changeProductName({
      body: {
        storeName: _storeInformation.name,
        catalogNumber: 789,
        newName: "new Name!",
      },
    });
    const resPrice = await _serviceBridge.changeProductPrice({
      body: {
        storeName: _storeInformation.name,
        catalogNumber: 789,
        newPrice: 555,
      },
    });
    expect(resName.data.result).toBe(true);
    expect(resPrice.data.result).toBe(true);
  });

  test("Edit product - Product exsits user logged out with permission",async () => {
    const createStoreRes=await _serviceBridge.createStore(_storeInformation)
    const { name } = createStoreRes.data;
    expect(name).toBe(_storeInformation.name);
    const productToAdd = new ProductBuilder()
      .withCatalogNumber(789)
      .getProduct();
    const addProductsToStoreRes=await _serviceBridge.addProductsToStore(_storeInformation, [
        productToAdd,
      ])
    const resProduct = addProductsToStoreRes.data;
    expect(resProduct.result).toBe(true);
    const addItemsToStoreRes=await _serviceBridge.addItemsToStore(_storeInformation, [
        { id: 123, catalogNumber: productToAdd.catalogNumber },
      ])
    const resItem = addItemsToStoreRes.data.result;
    expect(resItem).toBe(true);
    await _serviceBridge.logout();
    const resName = await _serviceBridge.changeProductName({
      body: {
        storeName: _storeInformation.name,
        catalogNumber: 789,
        newName: "new Name!",
      },
    });
    const resPrice = await _serviceBridge.changeProductPrice({
      body: {
        storeName: _storeInformation.name,
        catalogNumber: 789,
        newPrice: 555,
      },
    });
    expect(resName.error.message).toBeDefined();
    expect(resPrice.error.message).toBeDefined();
  });

  test("Edit product - change product name and price - Product not exsits user logged in with permission", async () => {
    const createStoreRes=await _serviceBridge.createStore(_storeInformation)
    const { name } = createStoreRes.data;
    expect(name).toBe(_storeInformation.name);
    const resName = await _serviceBridge.changeProductName({
      body: {
        storeName: _storeInformation.name,
        catalogNumber: 789,
        newName: "new Name!",
      },
    });
    const resPrice = await _serviceBridge.changeProductPrice({
      body: {
        storeName: _storeInformation.name,
        catalogNumber: 789,
        newPrice: 555,
      },
    });
    expect(resName.error.message).toBeDefined();
    expect(resPrice.error.message).toBeDefined();
  });
 });
