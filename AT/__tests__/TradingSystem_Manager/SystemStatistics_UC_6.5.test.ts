import { Bridge, Driver, Item, CreditCard, Product, Store } from "../..";
import { ProductBuilder } from "../../src/test_env/mocks/builders/product-builder";
import { Credentials } from "../../src/test_env/types";
import * as utils from "../../utils"


describe("Watch Purchases History, UC: 3.7",  () => {
    jest.setTimeout(50000);
    async function sleep(ms: number) {
        // login is using then&catch instead of await to reduce time needed for login, so sleep is needed to get the UPDATED stats
        await new Promise(resolve => setTimeout(resolve, ms));
    }

    let _serviceBridge: Partial<Bridge>;
    let _driver: Driver;
    let _item: Item;
    let _prodct: Product;
    let _store: Store;
    let _shopoholic: Credentials;
    beforeEach(async () => {
        _driver = await new Driver()
        await _driver.dropDB();
        await _driver.reset();
        await _driver.startSession()
        await _driver.initWithDefaults()
        _serviceBridge = await _driver.getBridge();
        await _serviceBridge.logout()
    });


    afterEach(async () => {
        await _driver.dropDB()
        await utils.terminateSocket();
    });


    test("Register Count", async () => {
        const start = new Date(2018, 11, 24)
        const end = new Date(2020, 11)
        await _driver.registerWithDefaults();
        await  _driver.loginWithDefaults();
        await  _serviceBridge.logout();
        await _serviceBridge.login(_driver.getInitDefaults(),true);
        await sleep(500)
        const {data} = await  _serviceBridge.getVisitorsInfo({body: { from: start, to: end }})
        expect(data.result).toBe(true);
        expect(data.statistics[0].statistics.registeredUsers).toBe(2);
    });


    test("Owners Count - logged in twice with same owner", async () => {
        const start = new Date(2018, 11, 24)
        const end = new Date(2020, 11)
        await _driver.registerWithDefaults();
        await  _driver.loginWithDefaults();
        await _serviceBridge.createStore(         {name: "mock-name-each"});
        await  _serviceBridge.logout();
        await  _driver.loginWithDefaults();
        await _serviceBridge.logout();
        await _serviceBridge.login(_driver.getInitDefaults(),true);
        await sleep(500)
        const {data} = await  _serviceBridge.getVisitorsInfo({body: { from: start, to: end }})
        expect(data.result).toBe(true);
        expect(data.statistics[0].statistics.owners).toBe(1);
        expect(data.statistics[0].statistics.registeredUsers).toBe(2);
    });


    test("Managers Count", async () => {
        const start = new Date(2018, 11, 24)
        const end = new Date(2020, 11)
        const newManager: Credentials = {
            userName: "new-manager",
            password: "newpwd123",
        }
        await _driver.registerWithDefaults();
        await _serviceBridge.register(newManager);
        await  _driver.loginWithDefaults();
        await _serviceBridge.createStore(         {name: "mock-name-each"});
        await _serviceBridge.assignManager(
            {name: "mock-name-each"},
            newManager
        );
        await  _serviceBridge.logout();
        await  _driver.loginWithDefaults();
        await  _serviceBridge.logout();
        await _serviceBridge.login(_driver.getInitDefaults(),true);
        await sleep(500)
        const {data} = await  _serviceBridge.getVisitorsInfo({body: { from: start, to: end }})
        console.log(JSON.stringify(data))
        expect(data.result).toBe(true);
        expect(data.statistics[0].statistics.owners).toBe(1);
        expect(data.statistics[0].statistics.admins).toBe(1);
    });

});
