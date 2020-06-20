import {Bridge, Driver, Store, Credentials, Item, PERMISSION} from "../../";
import * as utils from "../../utils";

describe("System Boot - UC 1", () => {
    let _serviceBridge: Partial<Bridge>;
    let _driver = new Driver();
    let _credentials: Credentials;

    beforeEach(async () => {
        _driver.dropDB();
        await _driver.reset();
        await _driver.startSession();
        await _driver.getBridge();
        _serviceBridge = _driver.getBridge();
        _credentials = {userName: "Admin", password: "Admin"};
    });

    afterAll(() => {
        utils.terminateSocket();
    });

    test("SystemBoot, valid admin details", async () => {
        const {data, error} = await _serviceBridge.init({
            userName: "admin",
            password: "adas123",
        });
        expect(error).toBeUndefined();
        expect(data).toBeDefined();
    });

    test("SystemBoot, valid admin details - init and init again", async () => {
        const {data, error} = await _serviceBridge.init({
            userName: "admin",
            password: "adas123",
        });
        expect(error).toBeUndefined();
        expect(data).toBeDefined();
        const res2 = await _serviceBridge.init({
            userName: "admin",
            password: "adas123",
        });
        expect(res2.data).toBeUndefined();
        expect(res2.error).toBeDefined();
    });

    test("SystemBoot, try to register user without init", async () => {
        const {data, error} = await _serviceBridge.register({
            userName: "validuser",
            password: "validpwd123",
        });
        expect(data).toBeUndefined();
        expect(error).toBeDefined();
    });

    test("SystemBoot, invalid admin details - password too short", async () => {
        const {data, error} = await _serviceBridge.init({
            userName: "admin",
            password: "a",
        });
        expect(data).toBeUndefined();
        expect(error).toBeDefined();
    });
    test("SystemBoot, invalid admin details - empty string as name", async () => {
        const {data, error} = await _serviceBridge.init({
            userName: "",
            password: "adas",
        });
        expect(data).toBeUndefined();
        expect(error).toBeDefined();
    });


    test("SystemBoot, init from file valid path", async () => {
        const {data, error} = await _serviceBridge.initFromFile({
            body: {path: '../../states/state.yml'}
        });
        expect(data.result).toBe(true);
    });

    test("SystemBoot, init from file invalid path", async () => {
        const {data, error} = await _serviceBridge.initFromFile({
            body: {path: 'junk/junk.yaml'}
        });
        expect(data.result).toBe(false);
    });

    test("SystemBoot, init from file empty path", async () => {
        const {data, error} = await _serviceBridge.initFromFile({
            body: {}
        });
        expect(data.result).toBe(true);
    });
});
