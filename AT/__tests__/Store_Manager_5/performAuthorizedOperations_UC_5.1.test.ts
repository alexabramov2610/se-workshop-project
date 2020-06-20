import {Bridge, Driver, Store, Credentials, Item, PERMISSION, Discount, Product} from "../../";
import {ProductBuilder} from "../../src/test_env/mocks/builders/product-builder";
import {ItemBuilder} from "../../src/test_env/mocks/builders/item-builder";
import {ProductCategory} from "se-workshop-20-interfaces/dist/src/CommonInterface";
import * as utils from "../../utils"

describe("Perform authorized operations, UC: 5.1", () => {
    let _driver = new Driver;
    let _serviceBridge: Partial<Bridge>;
    let _testProduct: Product;
    let _testItem: Item;
    let _testStore: Store;
    let _storeManagerCredentials: Credentials;

    beforeEach(async() => {
        _driver.dropDB()
        await _driver.reset();
        await _driver.startSession()
        await _driver.initWithDefaults()
        await _driver.registerWithDefaults()
        await _driver.loginWithDefaults()
        _serviceBridge = await _driver.getBridge();

        _testProduct = new ProductBuilder()
            .withName("test_name")
            .withPrice(25)
            .withCategory(ProductCategory.CLOTHING)
            .withCatalogNumber(789)
            .getProduct();
        _testItem = new ItemBuilder()
            .withId(123)
            .withCatalogNumber(789)
            .getItem();

        _testStore = {
            name: "some-mock-store",
        };
        _storeManagerCredentials = {userName: "manager-username", password: "manager-password"};

        await  _serviceBridge.createStore(_testStore);
        await  _serviceBridge.logout(); // logging out so that manager can register

        await  _serviceBridge.register(_storeManagerCredentials); // store manager registers

        await  _driver.loginWithDefaults(); // Owner is logging in again
        await  _serviceBridge.assignManager(_testStore, _storeManagerCredentials);
    });


    afterAll(() => {
        utils.terminateSocket();
    });


    test("Act, no permissions", async () => {
        await _serviceBridge.logout() // Owner signs out
        await _serviceBridge.login(_storeManagerCredentials); // Manager is logged in

        const {data, error} = await _serviceBridge.addProductsToStore(_testStore, [_testProduct]);
        expect(data).toBeUndefined();
        expect(error).toBeDefined();
    });

    test("Act, with permissions", async () => {
       await _serviceBridge.grantPermissions(_storeManagerCredentials, _testStore, [PERMISSION.MANAGE_INVENTORY]);
       await _serviceBridge.logout() // Owner signs out
       await _serviceBridge.login(_storeManagerCredentials); // Manager is logged in

        const {data, error} = await _serviceBridge.addProductsToStore(_testStore, [_testProduct]);
        expect(error).toBeUndefined();
        expect(data).toBeDefined();
    });
});
