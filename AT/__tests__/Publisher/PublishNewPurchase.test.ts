import {Bridge, Credentials, Driver, Product, Store, User,} from "../../";
import {PayRequest} from "se-workshop-20-interfaces/dist/src/Request";
import {EventCode} from "se-workshop-20-interfaces/dist/src/Enums";
import * as utils from "../../utils"
import {PublisherBuilder, PublisherMock} from "../../src/test_env/mocks/builders/publisher-builder";
import {ProductBuilder} from "../../src/test_env/mocks/builders/product-builder";
//Tests TBD:
//

//New Purchase
//Agreement Policy


describe("Publisher Notification, UC: 10 - New Puchase", () => {
    let _driver = new Driver();
    let _serviceBridge: Partial<Bridge>;
    let _testPaymentInfo: PayRequest;
    let _publisher: PublisherMock;
    // let publiser: IPublisher = {}
    beforeEach(async () => {

        let _driver = new Driver();
        _driver.dropDBDor();
        await _driver.reset();
        _publisher = new PublisherBuilder()._publisher;
        await _driver.startSession()
        await _driver.initWithDefaults()
        _driver.getBridge().setPublisher(_publisher)
        await _driver.registerWithDefaults()
        await _driver.loginWithDefaults()
        _serviceBridge = await _driver.getBridge();
        _testPaymentInfo = {
            token: "123", body: {
                payment: _driver.getPaymentInfo().payment,
                price: 100
            }
        }
    });


    afterAll(() => {
        utils.terminateSocket();
        _driver.dropDBDor();
    });


    test("Publisher Notification - New Purchase Store Owner Logged in", async () => {
        //Constants
        const _shopoholic: Credentials = {userName: "shopoholic", password: "ibuyALL123"};
        const _storeInformation: Store = {name: "this-is-the-coolest-store"};
        const _prodct: Product = new ProductBuilder().getProduct();
        const _item = {id: 123, catalogNumber: _prodct.catalogNumber};
        //Test flow
        await _serviceBridge.createStore(_storeInformation);
        await _serviceBridge.addProductsToStore(_storeInformation, [_prodct]);
        await _serviceBridge.addItemsToStore(_storeInformation, [_item]);
        await _serviceBridge.logout();
        await _serviceBridge.register(_shopoholic);
        await _serviceBridge.login(_shopoholic);
        const res = await _driver.given.store(_storeInformation).products([_prodct]).makeABuy();
        await _serviceBridge.logout();
        await _driver.loginWithDefaults();
        expect(_publisher.notified.get(EventCode.NEW_PURCHASE).get(_driver.getLoginDefaults().userName)).toBe(1);
        expect(_publisher.notified.get(EventCode.NEW_PURCHASE).size).toBe(1)
    });


    test("Publisher Notification - New Purchase Store Owner Logged out", async () => {
        //Constants
        const _shopoholic: Credentials = {userName: "shopoholic", password: "ibuyALL123"};
        const _storeInformation: Store = {name: "this-is-the-coolest-store"};
        const _prodct: Product = new ProductBuilder().getProduct();
        const _item = {id: 123, catalogNumber: _prodct.catalogNumber};
        //Test flow
        await _serviceBridge.createStore(_storeInformation);
        await _serviceBridge.addProductsToStore(_storeInformation, [_prodct]);
        await _serviceBridge.addItemsToStore(_storeInformation, [_item]);
        await _serviceBridge.logout();
        await _serviceBridge.register(_shopoholic);
        await _serviceBridge.login(_shopoholic);
        const res = await _driver.given.store(_storeInformation).products([_prodct]).makeABuy();
        await _serviceBridge.logout();
        expect(_publisher.notified.get(EventCode.NEW_PURCHASE).get(_driver.getLoginDefaults().userName)).toBe(1);
        expect(_publisher.notified.get(EventCode.NEW_PURCHASE).size).toBe(1)
    });

    //add Policy Agreement Test
});