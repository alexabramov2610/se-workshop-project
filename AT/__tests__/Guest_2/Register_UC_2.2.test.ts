import {Driver, Bridge, Credentials} from "../..";
import * as utils from "../../utils";
import {exec} from "child_process";
import mongoose from "mongoose";


describe("Guest Registration, UC: 2.2", () => {
    let _serviceBridge: Partial<Bridge>;
    let _credentials: Credentials;
    let _driver = new Driver();


    beforeEach(async () => {
        // _serviceBridge = _driver.resetState().startSession().initWithDefaults().getBridge();
        _driver.dropDB();
        await _driver.reset();
        await _driver.startSession();
        await _driver.initWithDefaults();
        _serviceBridge = await _driver.getBridge();
        await _serviceBridge.logout();
        _credentials = {userName: "test-username", password: "test-password"};
    });
    afterAll(async () => {
        _driver.dropDB();
    })

    test("Valid Details", async () => {
        _credentials.userName = "validUsername";
        _credentials.password = "validPassword123";
        const {data, error} = await _serviceBridge.register(_credentials);
        expect(error).toBeUndefined();
        expect(data).toBeDefined();
    });

    test("Valid Details2", async () => {
        _credentials.userName = "validUsername";
        _credentials.password = "validPassword123";
        const {data, error} = await _serviceBridge.register(_credentials);
        expect(error).toBeUndefined();
        expect(data).toBeDefined();
    });

    test("Invalid Password - Short", async () => {
        _credentials.userName = "validUsername";
        _credentials.password = "sP1"; // Short password
        const {data, error} = await _serviceBridge.register(_credentials);
        expect(error).toBeDefined();
        expect(data).toBeUndefined();
    });

    test("Invalid Username - Already Taken", async () => {
        _credentials.userName = "validUsername";
        _credentials.password = "nonDigitsPass";

        const response = await _serviceBridge.register(_credentials);
        expect(response.error).toBeUndefined();
        expect(response.data).toBeDefined();

        const {data, error} = await _serviceBridge.register(_credentials);
        expect(error).toBeDefined();
        expect(data).toBeUndefined();
    });

    // test("Invalid Password - Non Capital", async() => {
    //     _credentials.userName = "validUsername";
    //     _credentials.password = "noncapitalpass123"; // Short password
    //
    //     const {data, error} = await _serviceBridge.register(_credentials);
    //     expect(error).toBeDefined();
    //     expect(data).toBeUndefined();
    // });
    //
    // test("Invalid Password - Non Digit", async() => {
    //     _credentials.userName = "validUsername";
    //     _credentials.password = "nonDigitsPass"; // Short password
    //
    //     const {data, error} = await _serviceBridge.register(_credentials);
    //   const err = data
    //     expect(error).toBeDefined();
    //     expect(data).toBeUndefined();
    // });

    test("Invalid Username - Empty Username", async () => {
        _credentials.userName = "";
        _credentials.password = "nonDigitsPass"; // Short password

        const {data, error} = await _serviceBridge.register(_credentials);
        expect(error).toBeDefined();
        expect(data).toBeUndefined();
    });
});
