import {Bridge, Driver} from "../../";
import {Store, Credentials, User} from "../../src/test_env/types";
import * as utils from "../../utils"


describe("Assign Store Owner, UC: 4.3", () => {

    let _serviceBridge: Partial<Bridge>;
    let _storeInformation: Store;
    let _driver: Driver = new Driver();
    let _newOwner: User;
    let _newOwnerCreds: Credentials;
    beforeEach(async () => {
        _driver.dropDB();
        await _driver.reset();
        await _driver.startSession()
        await _driver.initWithDefaults()
        await _driver.registerWithDefaults()
        await _driver.loginWithDefaults();
        _storeInformation = {name: "this-is-the-coolest-store"};
        _serviceBridge = _driver.getBridge();
        _newOwnerCreds = {
            userName: "new-boss",
            password: "owner123",
        };
        _newOwner = {username: _newOwnerCreds.userName};
        await _serviceBridge.logout();
        await _serviceBridge.register(_newOwnerCreds);
    });

    afterEach(async () => {
        await _driver.dropDB()
        utils.terminateSocket();
    });

    test("Add Owner - check pending approvals.", async () => {
        const newOwner2: Credentials = {
            userName: "newOwner2",
            password: "newPass2",
        };
        await _serviceBridge.register(newOwner2);

        await _serviceBridge.login(_driver.getLoginDefaults());
        await _serviceBridge.createStore(_storeInformation);
        await _serviceBridge.assignStoreOwner(_storeInformation, _newOwner);
        await _serviceBridge.assignStoreOwner(_storeInformation, {
            username: newOwner2.userName,
        });
        await _serviceBridge.logout();
        await _serviceBridge.login(_newOwnerCreds);
        const res = await _serviceBridge.getOwnersAssignedBy({body: {storeName: _storeInformation.name}})
        const {data, error} = res
        await _serviceBridge.logout();
        expect(data.agreements[0].requiredApprove.filter(ap => ap === _newOwner.username)[0]).toBe("new-boss");

    });

    test("Add Owner - ￿need aproval by 1 manager.", async () => {

        const newOwner2: Credentials = {
            userName: "newOwner2",
            password: "newPass2",
        };
        await _serviceBridge.logout();
        await _serviceBridge.register(newOwner2);
        await _driver.loginWithDefaults();
        await _serviceBridge.createStore(_storeInformation);
        await _serviceBridge.assignStoreOwner(_storeInformation, _newOwner);
        await _serviceBridge.assignStoreOwner(_storeInformation, {
            username: newOwner2.userName,
        });
        await _serviceBridge.logout();
        await _serviceBridge.login(_newOwnerCreds);
        const {data} = await _serviceBridge.approveStoreOwner({
            body: {
                storeName: _storeInformation.name,
                newOwnerName: newOwner2.userName
            }
        })
        expect(data.result).toBe(true);
    });


    test("Add Store Owner - Happy Path: valid store ,not already assigned", async () => {
        await _driver.loginWithDefaults();
        await _serviceBridge.createStore(_storeInformation);
        const {data} = await _serviceBridge.assignStoreOwner(
            _storeInformation,
            _newOwner
        );
        const res = await _serviceBridge.viewStore(
            _storeInformation
        );
        const {storeOwnersNames} = res.data;
        expect(storeOwnersNames).toContain(_newOwner.username);
    });

    test("Add Owner - Sad Path: store owner not logged in", async () => {
        await _serviceBridge.logout();
        const {error} = await _serviceBridge.assignStoreOwner(
            _storeInformation,
            _newOwner
        );
        expect(error).toBeDefined();
    });


    test("Add Owner - try to approve without pending aproval.", async () => {
        const newOwner2: Credentials = {
            userName: "newOwner2",
            password: "newPass2",
        };
        await _serviceBridge.register(newOwner2);

        await _serviceBridge.login(_driver.getLoginDefaults());
        await _serviceBridge.createStore(_storeInformation);
        await _serviceBridge.assignStoreOwner(_storeInformation, _newOwner);
        await _serviceBridge.assignStoreOwner(_storeInformation, {
            username: newOwner2.userName,
        });
        await _serviceBridge.logout();
        await _serviceBridge.login(newOwner2);
        const {data} = await _serviceBridge.approveStoreOwner({
            body: {
                storeName: _storeInformation.name,
                newOwnerName: newOwner2.userName
            }
        })
        expect(data.result).toBe(false);
    });


    test("Add Owner - try to assign from 2 different owners.", async () => {
        const newOwner2: Credentials = {
            userName: "newOwner2",
            password: "newPass2",
        };
        await _serviceBridge.register(newOwner2);
        await _serviceBridge.login(_driver.getLoginDefaults());
        await _serviceBridge.createStore(_storeInformation);
        await _serviceBridge.assignStoreOwner(_storeInformation, _newOwner);
        await _serviceBridge.assignStoreOwner(_storeInformation, {
            username: newOwner2.userName,
        });
        await _serviceBridge.logout();
        await _serviceBridge.login(_newOwnerCreds);
        const {data} = await _serviceBridge.assignStoreOwner(_storeInformation, {
            username: newOwner2.userName,
        });
        expect(data).toBe(undefined);
    });

    test("Add Owner - try to assign from 2 different owners. after approved already.", async () => {
        const newOwner2: Credentials = {
            userName: "newOwner2",
            password: "newPass2",
        };
        await _serviceBridge.register(newOwner2);
        await _serviceBridge.login(_driver.getLoginDefaults());
        await _serviceBridge.createStore(_storeInformation);
        await _serviceBridge.assignStoreOwner(_storeInformation, _newOwner);
        await _serviceBridge.assignStoreOwner(_storeInformation, {
            username: newOwner2.userName,
        });
        await _serviceBridge.logout();
        await _serviceBridge.login(_newOwnerCreds);
        await _serviceBridge.approveStoreOwner({
            body: {
                storeName: _storeInformation.name,
                newOwnerName: newOwner2.userName
            }
        })
        const {data,error} = await _serviceBridge.assignStoreOwner(_storeInformation, {
            username: newOwner2.userName,
        });
        expect(error).toBeDefined();
    });
});
