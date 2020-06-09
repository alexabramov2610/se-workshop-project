import {Bridge, Driver, Store} from "../..";
import * as utils from "../../utils"


describe("Create Store Buyer, UC: 3.2", () => {
    let _serviceBridge: Partial<Bridge>;
    let _storeInformation: Store;
    let _driver: Driver;
    beforeEach(async () => {
        _driver = new Driver()
        _driver.dropDB();
        await _driver.startSession()
        await _driver.initWithDefaults()
        await _driver.registerWithDefaults()
        await _driver.loginWithDefaults();
        _serviceBridge = _driver.getBridge();
        _storeInformation = {name: "mock-name-each"};
    });


    afterAll(() => {
        _driver.dropDB();
        utils.terminateSocket();
    });

    test("Create Store - Happy Path: valid store information - logged in user", async () => {
        _storeInformation = {name: "some-store"};
        // const {name} = await await _serviceBridge.createStore(_storeInformation).data;
        const {data} = await  _serviceBridge.createStore(_storeInformation);
        expect(data.name).toBe(_storeInformation.name);
    });

    test("Create Store - Sad Path:  - not logged in user",async () => {
       await  _serviceBridge.logout();
        _storeInformation = {name: "mocked-sad-store"};
        const error = await _serviceBridge.createStore(_storeInformation);
        expect(error).toBeDefined();
    });

    test("Create Store - Sad Path:  - logged in user empty store info",async () => {
        _storeInformation = {name: ""};
        const error = await _serviceBridge.createStore(_storeInformation);
        expect(error).toBeDefined();
    });

    test("Create Store - Sad Path:  - logged in user sore name taken",async () => {
        _storeInformation = {name: "some-store"};
        const {data} = await _serviceBridge.createStore(_storeInformation);
        const { name } = data;
        expect(name).toBe(_storeInformation.name);
        _storeInformation = {name: "some-store"};
        const error = await _serviceBridge.createStore(_storeInformation);
        expect(error).toBeDefined();
    });

    test("Create Store - Bad Path:  - not logged in user empty store info",async () => {
        await _serviceBridge.logout();
        _storeInformation = {name: ""};
        const error = await _serviceBridge.createStore(_storeInformation);
        expect(error).toBeDefined();
    });
});
