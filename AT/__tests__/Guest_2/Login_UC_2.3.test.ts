import {Bridge, Driver, Credentials} from "../..";
import * as utils from "../../utils"


describe("Guest Login, UC: 2.3", () => {
    let _serviceBridge: Partial<Bridge>;
    let _credentials: Credentials;
    let _driver: Driver;

    beforeEach(async() => {
        _driver = new Driver();
        await _driver.reset();
        _driver.dropDBDor();
        await _driver.reset();
         await _driver.startSession()
         await _driver.initWithDefaults()
         _serviceBridge=await _driver.getBridge()
        _credentials = {userName: "test-username", password: "test-Password132"};
    });

    afterAll(() => {
        _driver.dropDBDor();
        utils.terminateSocket();


    });

    test("Valid details and registered", async() => {
        _credentials.userName = "validUsername";
        _credentials.password = "validPassword123";
        await _serviceBridge.register(_credentials);

        const {data, error} =await _serviceBridge.login(_credentials);
        expect(error).toBeUndefined();
        expect(data).toBeDefined();
    });

    test("Wrong password and registered", async() => {
        const passwordDefect = "234jERFAs$%^hb5@#$@#4bjh";
        _credentials.userName = "validUsername";
        _credentials.password = "wrongPassword123";
        await _serviceBridge.register(_credentials);

        _credentials.password += passwordDefect;
        const {data, error} = await _serviceBridge.login(_credentials);
        expect(data).toBeUndefined();
        expect(error).toBeDefined();
    });

    test("Valid details and not registered", async() => {
        _credentials.userName = "unregisteredUsername";
        _credentials.password = "validPassword123";

        const {data, error} =await _serviceBridge.login(_credentials);
        expect(data).toBeUndefined();
        expect(error).toBeDefined();
    });

    test("Valid details and registered and logged in", async() => {
        _credentials.userName = "alreadyLoggedInUsername";
        _credentials.password = "validPassword123";

        await _serviceBridge.register(_credentials);
        const res =await _serviceBridge.login(_credentials);
        expect(res.data).toBeDefined();
        expect(res.error).toBeUndefined();

        const {data, error} =await _serviceBridge.login(_credentials);
        expect(error).toBeDefined();
        expect(data).toBeUndefined();
    });
 });
