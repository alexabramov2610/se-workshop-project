import {Bridge, Driver, Item, Store, Product} from "../../";
import {ItemBuilder} from "../../src/test_env/mocks/builders/item-builder";
import {ProductBuilder} from "../../src/test_env/mocks/builders/product-builder";
import * as utils from "../../utils"


const ITEM_NOT_FOUND = "Item not found";
const STORE_NOT_FOUND = "Store not found";

describe("Guest - View Information, UC: 2.4", () => {
    let _driver = new Driver();
    let _serviceBridge: Partial<Bridge>;
    let _testProduct: Product;
    let _testItem: Item;
    let _testStore: Store;

    beforeEach(async () => {
        _driver.dropDBDor();
        await _driver.reset();
        _serviceBridge = await _driver.getBridge()
        await _driver.startSession()
        await _driver.initWithDefaults()
        await _driver.registerWithDefaults()
        await _driver.loginWithDefaults()

        _testStore = {name: "some-mock-store"};
        _testProduct = new ProductBuilder().withCatalogNumber(123).getProduct();
        _testItem = new ItemBuilder().withId(1).withCatalogNumber(123).getItem();

    });

    afterAll(() => {

        utils.terminateSocket();
        _driver.dropDB();

    });

    test("View valid product", async () => {
        await _serviceBridge.createStore(_testStore);
        await _serviceBridge.addProductsToStore(_testStore, [_testProduct]);
        await _serviceBridge.addItemsToStore(_testStore, [_testItem]);

        await _serviceBridge.logout();

        const {data, error} = await _serviceBridge.viewProduct(_testStore, _testProduct);
        const product = data.info;
        expect(error).toBeUndefined();
        expect(product.name).toEqual(_testProduct.name);
        expect(product.price).toEqual(_testProduct.price);
        expect(product.catalogNumber).toEqual(_testProduct.catalogNumber);
    });

    test("View invalid product", async () => {
        await _serviceBridge.createStore(_testStore);
        await _serviceBridge.logout();

        const {data, error} = await _serviceBridge.viewProduct(_testStore, _testProduct);
        expect(data).toBeUndefined();
        expect(error).toBeDefined();
    });

    test("View valid store", async () => {
        await _serviceBridge.createStore(_testStore);
        await _serviceBridge.addProductsToStore(_testStore, [_testProduct]);
        await _serviceBridge.logout();

        const {data, error} = await _serviceBridge.viewStore(_testStore);
        const {storeName, storeOwnersNames, productsNames} = data;
        expect(error).toBeUndefined();
        expect(storeName).toEqual(_testStore.name);
        expect(productsNames[0]).toEqual(_testProduct.name);
        expect(storeOwnersNames[0]).toEqual(_driver.getLoginDefaults().userName);
    });

    test("View invalid store", async () => {
        await _serviceBridge.logout();

        const {data, error} = await _serviceBridge.viewStore(_testStore);
        expect(data).toBeUndefined();
        expect(error).toBeDefined();
    });
});




