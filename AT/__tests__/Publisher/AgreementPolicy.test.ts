import {Bridge, Credentials, Driver, Product, Store, User,} from "../../";
import {PayRequest} from "se-workshop-20-interfaces/dist/src/Request";
import {EventCode} from "se-workshop-20-interfaces/dist/src/Enums";
import * as utils from "../../utils"
import {PublisherBuilder, PublisherMock} from "../../src/test_env/mocks/builders/publisher-builder";
import {ProductBuilder} from "../../src/test_env/mocks/builders/product-builder";


describe("Publisher Notification, UC: 10 - Approve Store Owner", () => {
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

    test("Publisher Notification - Approve Store Owner", async () => {

        const _newOwnerCreds: Credentials = {
            userName: "new-boss2",
            password: "owner123",
        };
        const _newOwnerCreds2: Credentials = {
            userName: "new-boss",
            password: "owner123",
        };
        const _newOwner: User = {username: _newOwnerCreds.userName};
        const _storeInformation: Store = {name: "this-is-the-coolest-store"};
        await _serviceBridge.logout();
        await _serviceBridge.register(_newOwnerCreds);
        await _serviceBridge.register(_newOwnerCreds2);
        await _driver.loginWithDefaults();
        await _serviceBridge.createStore(_storeInformation);
        const {data} = await _serviceBridge.assignStoreOwner(
            _storeInformation,
            _newOwner
        );
        const res = await _serviceBridge.assignStoreOwner(
            _storeInformation,
            {username: _newOwnerCreds2.userName}
        );
        await _serviceBridge.logout();
        await _serviceBridge.login(_newOwnerCreds2);
        expect(_publisher.notified.get(EventCode.APPROVE_NEW_STORE_OWNER_REQUIRED).get(_newOwnerCreds.userName)).toBe(1);
        expect(_publisher.notified.get(EventCode.APPROVE_NEW_STORE_OWNER_REQUIRED).size).toBe(1)

    });


    test("Publisher Notification - Approve Store Owner - two managers", async () => {
        const _newOwnerCreds1: Credentials = {
            userName: "new-boss1",
            password: "owner123",
        };
        const _newOwnerCreds2: Credentials = {
            userName: "new-boss2",
            password: "owner123",
        };
        const _newOwnerCreds3: Credentials = {
            userName: "new-boss3",
            password: "owner123",
        };
        const _storeInformation: Store = {name: "this-is-the-coolest-store"};
        await _serviceBridge.logout();
        await _serviceBridge.register(_newOwnerCreds1);
        await _serviceBridge.register(_newOwnerCreds2);
        await _serviceBridge.register(_newOwnerCreds3);
        await _driver.loginWithDefaults();
        await _serviceBridge.createStore(_storeInformation);
        await _serviceBridge.assignStoreOwner(
            _storeInformation,
            {username: _newOwnerCreds1.userName}
        );
        await _serviceBridge.assignStoreOwner(
            _storeInformation,
            {username: _newOwnerCreds2.userName}
        );
        await _serviceBridge.logout();
        await _serviceBridge.login(_newOwnerCreds1);
        await _serviceBridge.approveStoreOwner({
            body: {
                storeName: _storeInformation.name,
                newOwnerName: _newOwnerCreds2.userName
            }
        })
        await _serviceBridge.assignStoreOwner(
            _storeInformation,
            {username: _newOwnerCreds3.userName}
        );
        expect(_publisher.notified.get(EventCode.APPROVE_NEW_STORE_OWNER_REQUIRED).get(_newOwnerCreds2.userName)).toBe(1);
        expect(_publisher.notified.get(EventCode.APPROVE_NEW_STORE_OWNER_REQUIRED).size).toBe(1);
    });

    test("Publisher Notification - Approve Store Owner shouldnt notify to the assigner", async () => {

        const _newOwnerCreds: Credentials = {
            userName: "new-boss2",
            password: "owner123",
        };
        const _newOwnerCreds2: Credentials = {
            userName: "new-boss",
            password: "owner123",
        };
        const _newOwner: User = {username: _newOwnerCreds.userName};
        const _storeInformation: Store = {name: "this-is-the-coolest-store"};
        await _serviceBridge.logout();
        await _serviceBridge.register(_newOwnerCreds);
        await _serviceBridge.register(_newOwnerCreds2);
        await _driver.loginWithDefaults();
        await _serviceBridge.createStore(_storeInformation);
        const {data} = await _serviceBridge.assignStoreOwner(
            _storeInformation,
            _newOwner
        );
        const res = await _serviceBridge.assignStoreOwner(
            _storeInformation,
            {username: _newOwnerCreds2.userName}
        );
        await _serviceBridge.logout();
        await _serviceBridge.login(_newOwnerCreds2);
        expect(_publisher.notified.get(EventCode.APPROVE_NEW_STORE_OWNER_REQUIRED).get(_driver.getLoginDefaults().userName)).toBe(undefined);

    });

});