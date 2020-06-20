import {Bridge, Driver, Item, CreditCard, Product, Store} from "../..";
import {ProductBuilder} from "../../src/test_env/mocks/builders/product-builder";
import {Credentials} from "../../src/test_env/types";
import * as utils from "../../utils"


describe("Watch Purchases History, UC: 3.7", () => {
    let _serviceBridge: Partial<Bridge>;
    let _driver: Driver;
    let _item: Item;
    let _prodct: Product;
    let _store: Store;
    let _shopoholic: Credentials;
    beforeEach(async () => {
        _driver = new Driver()
        _driver.dropDB();
        await _driver.reset();
        await _driver.startSession()
        await _driver.initWithDefaults()
        _serviceBridge = _driver.getBridge();
        await _serviceBridge.logout()
        await _driver.registerWithDefaults()
        await _driver.loginWithDefaults();
        _store = {name: "stor-e-tell"};
        _prodct = new ProductBuilder().getProduct();
        _shopoholic = {userName: "shopoholic", password: "ibuyALL123"};
        _item = {id: 123, catalogNumber: _prodct.catalogNumber};
        await _serviceBridge.createStore(_store);
        await _serviceBridge.addProductsToStore(_store, [_prodct]);
        await _serviceBridge.addItemsToStore(_store, [_item]);
        await _serviceBridge.logout();
        await _serviceBridge.register(_shopoholic);
    });


    afterEach(async () => {
        _driver.dropDB()
        await utils.terminateSocket();
    });


    test("logged in, with history, without admin flag", async () => {
        await _serviceBridge.login(_shopoholic);
        await _driver.given.store(_store).products([_prodct]).makeABuy();
        await _serviceBridge.logout();
        await _serviceBridge.login(_driver.getInitDefaults());
        const res = await _serviceBridge.viewUserPurchasesHistory({
            body: {userName: _shopoholic.userName},
        });
        expect(res.data.result).toBe(false);
        expect(res.error.message).toBeDefined();
    });

    test("logged in, with history, with admin flag", async () => {
        await _serviceBridge.login(_shopoholic);
        await _driver.given.store(_store).products([_prodct]).makeABuy();
        await _serviceBridge.logout();
        const asAdmin = true;
        await _serviceBridge.login(_driver.getInitDefaults(), asAdmin);
        const res =
            await _serviceBridge.viewUserPurchasesHistory({
                body: {userName: _shopoholic.userName},
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

    test("logged in, no history, with admin flag", async () => {
        const asAdmin = true;
        await _serviceBridge.login(_driver.getInitDefaults(), asAdmin);
        const {error, data} =
            await _serviceBridge.viewUserPurchasesHistory({
                body: {userName: _shopoholic.userName},
            });
        expect(data.result).toBe(true);
        expect(data.receipts.length).toBe(0);
        expect(error).toBeUndefined();
    });

    test("logged in, with history, with admin flag, buyer history is shop manager", async () => {
        await _serviceBridge.login(_driver.getLoginDefaults());
        await _serviceBridge.assignManager(_store, _shopoholic);
        await _serviceBridge.logout()
        await _serviceBridge.login(_shopoholic);
        await _driver.given.store(_store).products([_prodct]).makeABuy();
        await _serviceBridge.logout();
        const asAdmin = true;
        await _serviceBridge.login(_driver.getInitDefaults(), asAdmin);
        const res =
            await _serviceBridge.viewUserPurchasesHistory({
                body: {userName: _shopoholic.userName},
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
