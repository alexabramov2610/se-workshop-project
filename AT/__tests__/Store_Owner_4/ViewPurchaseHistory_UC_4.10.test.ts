import {Bridge, Driver, Item, CreditCard, Product, Store} from "../..";
import {ProductBuilder} from "../../src/test_env/mocks/builders/product-builder";
import {Credentials} from "../../src/test_env/types";
import * as utils from "../../utils"

describe("Watch Purchases History, UC: 3.7", async () => {
    let _serviceBridge: Partial<Bridge>;
    let _driver: Driver;
    let _item: Item;
    let _prodct: Product;
    let _store: Store;
    let _shopoholic: Credentials;
    beforeEach(async () => {
        _driver = new Driver()
        _driver.dropDB()
        await _driver.reset();
        await _driver.startSession()
        await _driver.initWithDefaults()
        await _driver.registerWithDefaults()
        await _driver.loginWithDefaults();
        _store = {name: "stor-e-tell"};
        _serviceBridge = _driver.getBridge();
        _prodct = new ProductBuilder().getProduct();
        _shopoholic = {userName: "shopoholic", password: "ibuyALL123"};
        _item = {id: 123, catalogNumber: _prodct.catalogNumber};
        await _serviceBridge.createStore(_store);
        await _serviceBridge.addProductsToStore(_store, [_prodct]);
        await _serviceBridge.addItemsToStore(_store, [_item]);
        await _serviceBridge.logout();
        await _serviceBridge.register(_shopoholic);
    });


    afterAll(() => {
        _driver.dropDB()
        utils.terminateSocket();
    });


    test("logged in user without permissions, with history", async () => {
        await _serviceBridge.login(_shopoholic);
        _driver.given.store(_store).products([_prodct]).makeABuy();
        const res = await _serviceBridge.viewStorePurchasesHistory({
            body: {storeName: _store.name},
        });
        expect(res.data.result).toBe(false);
    });
    test("logged out, with history", async () => {
        await _serviceBridge.login(_shopoholic);
        await _driver.given.store(_store).products([_prodct]).makeABuy();
        await _serviceBridge.logout();
        const res = await _serviceBridge.viewStorePurchasesHistory({
            body: {storeName: _store.name},
        });
        expect(res.error.message).toBeDefined();
    });
    test("logged in, with history", async () => {
        await _serviceBridge.login(_shopoholic);
        await _driver.given.store(_store).products([_prodct]).makeABuy();
        await _serviceBridge.logout();
        await _driver.loginWithDefaults();
        const res = await _serviceBridge.viewStorePurchasesHistory({
            body: {storeName: _store.name},
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
    test("logged in, no history", async () => {
        await _driver.loginWithDefaults();
        const res = await _serviceBridge.viewStorePurchasesHistory({
            body: {storeName: _store.name},
        });
        const itemCatalogNumber: any[] = [].concat
            .apply(
                [],
                res.data.receipts.map((r) => r.purchases)
            )
            .map((e) => e.item.catalogNumber)
            .filter((cn) => cn === _item.catalogNumber);

        expect(itemCatalogNumber.length).toBe(0);
    });

    test("logged out, no history", async () => {
        await _serviceBridge.logout();
        const {error, data} = await _serviceBridge.viewStorePurchasesHistory({
            body: {storeName: _store.name},
        });
        expect(error.message).toBeDefined();
    });
});
