import {Bridge, Driver} from "../../";
import {Store, Credentials, User} from "../../src/test_env/types";
import * as utils from "../../utils"


describe("Give Manager Permissions, UC: 4.5", () => {
    let _serviceBridge: Partial<Bridge>;
    let _storeInformation: Store;
    let _driver: Driver;

    beforeEach(async () => {
        _driver = new Driver()
        _driver.dropDBDor();
        await _driver.reset();
        await _driver.startSession()
        await _driver.initWithDefaults()
        await _driver.registerWithDefaults()
        await _driver.loginWithDefaults();
        _serviceBridge = _driver.getBridge();

        _storeInformation = {name: "this-is-the-coolest-store"};
        await _serviceBridge.createStore(_storeInformation);
        await _serviceBridge.logout();
    });


    afterAll(() => {
        utils.terminateSocket();
        _driver.dropDBDor();
    });

    test("Give Manager Permissions - store owner logged in, new manager", async () => {
        const newManager: Credentials = {
            userName: "new-manager",
            password: "newpwd123",
        };

        await _serviceBridge.register(newManager);
        await _serviceBridge.login(_driver.getLoginDefaults());

        const {data} = await _serviceBridge.assignManager(
            _storeInformation,
            newManager
        );
        expect(data.result).toBe(true);
    });

    test("Give Manager Permissions - valid store, store owner not logged in", async () => {
        const newManager: Credentials = {
            userName: "new-manager",
            password: "newpwd123",
        };

        await _serviceBridge.register(newManager);

        const {data, error} = await _serviceBridge.assignManager(
            _storeInformation,
            newManager
        );
        expect(data).toBeUndefined();
        expect(error).toBeDefined();
    });

    test("Give Manager Permissions - logged in, User with ID is already store manager", async () => {
        const newManager: Credentials = {
            userName: "new-manager",
            password: "newpwd123",
        };

        await _serviceBridge.register(newManager);
        await _serviceBridge.login(_driver.getLoginDefaults());

        const res = await _serviceBridge.assignManager(_storeInformation, newManager);
        expect(res.data.result).toBe(true);
        const {data} = await _serviceBridge.assignManager(
            _storeInformation,
            newManager
        );

        expect(data).toBeUndefined();
    });

    test("Give Manager Permissions - logged in, user id is not in the System", async () => {
        const newManager: Credentials = {
            userName: "new-manager",
            password: "newpwd123",
        };
        await _serviceBridge.login(_driver.getLoginDefaults());
        const {data, error} = await _serviceBridge.assignManager(
            _storeInformation,
            newManager
        );
        expect(error).toBeDefined()
        expect(data).toBeUndefined();
    });
});
