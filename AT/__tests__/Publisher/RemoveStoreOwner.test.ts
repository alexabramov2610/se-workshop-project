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


describe("Publisher Notification, UC: 10 - Remove Store Owner", () => {
    let _driver = new Driver();
    let _serviceBridge: Partial<Bridge>;
    let _testPaymentInfo: PayRequest;
    let _publisher: PublisherMock;
    // let publiser: IPublisher = {}
    beforeEach(async () => {

        let _driver = new Driver();
        _driver.dropDBDor();
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

    test("Publisher Notification - Remove Store Owner", async () => {
        const _newOwnerCreds: Credentials = {
            userName: "new-boss",
            password: "owner123",
        };
        const _newOwner: User = {username: _newOwnerCreds.userName};
        const _storeInformation: Store = {name: "this-is-the-coolest-store"};
        await _serviceBridge.logout();
        await _serviceBridge.register(_newOwnerCreds);
        await _driver.loginWithDefaults();
        await _serviceBridge.createStore(_storeInformation);
        const {data} = await _serviceBridge.assignStoreOwner(
            _storeInformation,
            _newOwner
        );
        const req =
            {
                body: {
                    storeName: _storeInformation.name,
                    usernameToRemove: _newOwner.username,
                },
            }
        await _serviceBridge.removeStoreOwner(req);
        expect(_publisher.notified.get(EventCode.REMOVED_AS_STORE_OWNER).get(_newOwnerCreds.userName)).toBe(1);
        expect(_publisher.notified.get(EventCode.REMOVED_AS_STORE_OWNER).size).toBe(1)
    });


    test("Publisher Notification - Remove Store Owner: Remover is Logged Out", async () => {
        const _newOwnerCreds: Credentials = {
            userName: "new-boss",
            password: "owner123",
        };
        const _newOwner: User = {username: _newOwnerCreds.userName};
        const _storeInformation: Store = {name: "this-is-the-coolest-store"};
        await _serviceBridge.logout();
        await _serviceBridge.register(_newOwnerCreds);
        await _driver.loginWithDefaults();
        await _serviceBridge.createStore(_storeInformation);
        const {data} = await _serviceBridge.assignStoreOwner(
            _storeInformation,
            _newOwner
        );
        const req =
            {
                body: {
                    storeName: _storeInformation.name,
                    usernameToRemove: _newOwner.username,
                },
            }
        await _serviceBridge.logout();
        await _serviceBridge.removeStoreOwner(req);
        expect(_publisher.notified.get(EventCode.REMOVED_AS_STORE_OWNER)).toBeUndefined();

    });
});