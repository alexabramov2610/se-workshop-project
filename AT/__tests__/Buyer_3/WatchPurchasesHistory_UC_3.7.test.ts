import {Bridge, Driver, Item, CreditCard, Product, Store} from "../..";
import {ProductBuilder} from "../../src/test_env/mocks/builders/product-builder";
import {Credentials} from "../../src/test_env/types";
import * as utils from "../../utils";

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
        await _driver.registerWithDefaults()
        await _driver.loginWithDefaults();
        _serviceBridge = _driver.getBridge();
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

    afterAll(() => {
        _driver.dropDB();
    });

    test("logged in, with history",async () => {
        await _serviceBridge.login(_shopoholic);
         _driver.given.store(_store).products([_prodct]);
        await _driver.makeABuy()
        const res = await _serviceBridge.viewUserPurchasesHistory({
            body: {userName: _shopoholic.userName},
        });

        const itemCatalogNumber: any[] = [].concat
            .apply(
                [],
                res.data.receipts.map((r) => r.purchases)
            ).map(e => e.item.catalogNumber).filter(cn => cn === _item.catalogNumber)


        expect(itemCatalogNumber[0]).toBe(_prodct.catalogNumber);
    });

    test("logged in, no history",async () => {
        await _serviceBridge.login(_shopoholic);
        const res =await _serviceBridge.viewUserPurchasesHistory({
            body: {userName: _shopoholic.userName},
        });
        const itemCatalogNumber: any[] = [].concat
            .apply(
                [],
                res.data.receipts.map((r) => r.purchases)
            )
            .filter((i) => i.catalogNumber === _prodct.catalogNumber);

        expect(itemCatalogNumber[0]).toBeUndefined();
    });

    test("logged out, with history",async () => {
       await _serviceBridge.login(_shopoholic);
      await  _driver.given.store(_store).products([_prodct]).makeABuy();
        await  _serviceBridge.logout();
        const {error, data} = await _serviceBridge.viewUserPurchasesHistory({
            body: {userName: _shopoholic.userName},
        });

        expect(error.message).toBeDefined();
    });

    test("logged out, no history",async () => {
        _serviceBridge.logout();
        const {error, data} = await _serviceBridge.viewUserPurchasesHistory({
            body: {userName: _shopoholic.userName},
        });

        expect(error.message).toBeDefined();
    });


});
