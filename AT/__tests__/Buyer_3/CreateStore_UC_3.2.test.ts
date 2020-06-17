import {Bridge, Driver, Store} from "../..";
import * as utils from "../../utils"


describe("Create Store Buyer, UC: 3.2", () => {
    let _serviceBridge: Partial<Bridge>;
    let _storeInformation: Store;
    let _driver: Driver;
    beforeEach(async () => {
        _driver = new Driver()
        _driver.dropDB();
        await _driver.reset();
        await _driver.startSession()
        await _driver.initWithDefaults()
        await _driver.registerWithDefaults()
        await _driver.loginWithDefaults();
        _serviceBridge = _driver.getBridge();
        _storeInformation = {name: "mock-name-each"};
    });

    //
    // afterAll((done) => {
    //     _driver.dropDB();
    //     utils.terminateSocket();
    //     done();
    // });

    test("Create Store - Happy Path: valid store information - logged in user", async (done) => {
        _storeInformation = {name: "some-store"};
        // const {name} = await await _serviceBridge.createStore(_storeInformation).data;
        const {data} = await  _serviceBridge.createStore(_storeInformation);
        expect(data.name).toBe(_storeInformation.name);
        done();
    });

    test("Create Store - Sad Path:  - not logged in user",async (done) => {
       await _serviceBridge.logout();
        _storeInformation = {name: "mocked-sad-store"};
        const error = await _serviceBridge.createStore(_storeInformation);
        expect(error).toBeDefined();
        done();
    });

    test("Create Store - Sad Path:  - logged in user empty store info",async (done) => {
        _storeInformation = {name: ""};
        const error = await _serviceBridge.createStore(_storeInformation);
        expect(error).toBeDefined();
        done();
    });

    test("Create Store - Sad Path:  - logged in user sore name taken",async (done) => {
        _storeInformation = {name: "some-store"};
        const res = await _serviceBridge.createStore(_storeInformation);
        const x=3;
        expect(res.data.name).toBe(_storeInformation.name);
        _storeInformation = {name: "some-store"};
        const error = await _serviceBridge.createStore(_storeInformation);
        expect(error).toBeDefined();
        done();
    });

    test("Create Store - Bad Path:  - not logged in user empty store info",async (done) => {
        await _serviceBridge.logout();
        _storeInformation = {name: ""};
        const error = await _serviceBridge.createStore(_storeInformation);
        expect(error).toBeDefined();
        done();
    });
});
