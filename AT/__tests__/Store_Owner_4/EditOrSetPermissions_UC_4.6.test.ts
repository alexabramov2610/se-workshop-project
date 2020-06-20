import {Bridge, Driver} from "../../";
import {Store, Credentials, User, PERMISSION} from "../../src/test_env/types";
import * as utils from "../../utils"


describe("Edit or Set Permissions, UC: 4.6", () => {
    let _serviceBridge: Partial<Bridge>;
    let _storeInformation: Store;
    let _driver: Driver;
    let _newManagerCredentials: Credentials;

    beforeEach(async () => {
        _driver = new Driver()
        _driver.dropDB()
        await _driver.reset();
        await _driver.startSession()
        await _driver.initWithDefaults()
        await _driver.registerWithDefaults()
        await _driver.loginWithDefaults();
        _storeInformation = {name: "this-is-the-coolest-store"};
        _newManagerCredentials = {userName: "new-manager", password: "boss1234"};
        _serviceBridge = _driver.getBridge();
        await _serviceBridge.createStore(_storeInformation);
        await _serviceBridge.logout();
        await _serviceBridge.register(_newManagerCredentials);
        await _serviceBridge.logout();
        await _driver.loginWithDefaults();
        await _serviceBridge.assignManager(_storeInformation, _newManagerCredentials);
    });

    afterAll(() => {
        _driver.dropDB()
        utils.terminateSocket();
    });

    test("store owner logged in valid manager", async () => {
        const res = await _serviceBridge.grantPermissions(
            _newManagerCredentials,
            _storeInformation,
            [PERMISSION.MODIFY_BUYING_METHODS, PERMISSION.CLOSE_STORE]
        );

        expect(res.data).toBeDefined()

        const {data, error} = await _serviceBridge.viewManagerPermissions({
            body: {
                managerToView: _newManagerCredentials.userName,
                storeName: _storeInformation.name,
            },
        });

        expect(data.permissions).toContainEqual(PERMISSION.MODIFY_BUYING_METHODS)
        expect(data.permissions).toContainEqual(PERMISSION.CLOSE_STORE)
    });

    test("store owner logged in valid manager grant permissions and grant again", async () => {
        const res = await _serviceBridge.grantPermissions(
            _newManagerCredentials,
            _storeInformation,
            [PERMISSION.MODIFY_BUYING_METHODS, PERMISSION.CLOSE_STORE]
        );
        expect(res.data).toBeDefined()

        await _serviceBridge.grantPermissions(_newManagerCredentials, _storeInformation, [
            PERMISSION.MODIFY_BUYING_METHODS,
            PERMISSION.CLOSE_STORE,
        ]);
        const {data, error} = await _serviceBridge.viewManagerPermissions({
            body: {
                managerToView: _newManagerCredentials.userName,
                storeName: _storeInformation.name,
            },
        });


        expect(data.permissions).toContainEqual(PERMISSION.MODIFY_BUYING_METHODS)
        expect(data.permissions).toContainEqual(PERMISSION.CLOSE_STORE)
    });
    test("store owner logged out valid manager details", async () => {
        await _serviceBridge.logout();
        const res = await _serviceBridge.grantPermissions(
            await _newManagerCredentials,
            await _storeInformation,
            [PERMISSION.MODIFY_BUYING_METHODS, PERMISSION.CLOSE_STORE]
        );
        expect(res.data).toBeUndefined();
        expect(res.error).toBeDefined();
    });
    test("store owner logged in invalid manager details", async () => {
        const res = await _serviceBridge.grantPermissions(
            {userName: "nosuchuser", password: "password123"},
            _storeInformation,
            [PERMISSION.MODIFY_BUYING_METHODS, PERMISSION.CLOSE_STORE]
        );
        expect(res.data).toBeUndefined();
        expect(res.error).toBeDefined();
    });
});
