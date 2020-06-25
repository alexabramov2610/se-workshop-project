import {Bridge, Driver} from "../../";
import {Store, Credentials} from "../../src/test_env/types";
import * as utils from "../../utils"


describe("Remove Managers, UC: 4.7", () => {
    let _serviceBridge: Partial<Bridge>;
    let _storeInformation: Store;
    let _driver: Driver;
    let _newManagerCreds: Credentials;
    _driver = new Driver();
    beforeEach(async () => {
        _driver.dropDB();
        await _driver.reset();
        await _driver.startSession();
        await _driver.initWithDefaults();
        await _driver.registerWithDefaults();
        await _driver.loginWithDefaults();
        _newManagerCreds = {
            userName: "new-manager",
            password: "newpwd123",
        };
        _storeInformation = {name: "this-is-the-coolest-store"};
        _serviceBridge = _driver.getBridge();
        await _serviceBridge.createStore(_storeInformation);
        await _serviceBridge.logout();
        await _serviceBridge.register(_newManagerCreds)
        await _driver.loginWithDefaults();
        await _serviceBridge.assignManager(_storeInformation, _newManagerCreds)
        await _serviceBridge.logout();
    });


    afterAll(() => {
        _driver.dropDB();
        utils.terminateSocket();
    });

    test("Remove managers - remove store manager options- store owner not logged in", async () => {
        const {data, error} = await _serviceBridge.removeStoreManager({
            body: {
                storeName: _storeInformation.name,
                usernameToRemove: _newManagerCreds.userName,
            },
        });
        expect(data.result).toBe(false);
        expect(error.message).toBeDefined();
    });


    test("Remove managers - id is not a manager id", async () => {
        await _driver.loginWithDefaults();
        const {data, error} = await _serviceBridge.removeStoreManager({
            body: {
                storeName: _storeInformation.name,
                usernameToRemove: 'no-such-user',
            },
        });
        expect(data.result).toBe(false);
        expect(error.message).toBeDefined();
    });

    test("Remove managers -logged in, valid Store manager ID", async () => {
        await _driver.loginWithDefaults();
        const {data, error} = await _serviceBridge.removeStoreManager({
            body: {
                storeName: _storeInformation.name,
                usernameToRemove: _newManagerCreds.userName,
            },
        });
        expect(data.result).toBe(true);
        expect(error).toBeUndefined();
    });

});
