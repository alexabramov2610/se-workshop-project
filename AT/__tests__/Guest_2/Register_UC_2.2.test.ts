import {Driver, Bridge, Credentials} from '../..';

describe("Guest Registration, UC: 2.2", () => {
    let _serviceBridge: Bridge;
    let _credentials: Credentials;
    let _driver = new Driver();

    beforeEach(() => {
        _serviceBridge = _driver.resetState().initWithDefaults().startSession().getBridge();
        _credentials = {userName: "test-username", password: "test-password"};
    });

    test("Valid Details", () => {
        _credentials.userName = "validUsername";
        _credentials.password = "validPassword123";

        const {data, error} = _serviceBridge.register(_credentials);
        expect(error).toBeUndefined();
        expect(data).toBeDefined();
    });

    test("Invalid Password - Short", () => {
        _credentials.userName = "validUsername";
        _credentials.password = "sP1"; // Short password

        const {data, error} = _serviceBridge.register(_credentials);
        expect(error).toBeDefined();
        expect(data).toBeUndefined();
    });

    test("Invalid Username - Already Taken", () => {
        _credentials.userName = "validUsername";
        _credentials.password = "nonDigitsPass";

        const response = _serviceBridge.register(_credentials);
        expect(response.error).toBeUndefined();
        expect(response.data).toBeDefined();

        const {data, error} = _serviceBridge.register(_credentials);
        expect(error).toBeDefined();
        expect(data).toBeUndefined();
    });

    // test("Invalid Password - Non Capital", () => {
    //     _credentials.userName = "validUsername";
    //     _credentials.password = "noncapitalpass123"; // Short password
    //
    //     const {data, error} = _serviceBridge.register(_credentials);
    //     expect(error).toBeDefined();
    //     expect(data).toBeUndefined();
    // });

    // test("Invalid Password - Non Digit", () => {
    //     _credentials.userName = "validUsername";
    //     _credentials.password = "nonDigitsPass"; // Short password
    //
    //     const {data, error} = _serviceBridge.register(_credentials);
    //     expect(error).toBeDefined();
    //     expect(data).toBeUndefined();
    // });

    // test("Invalid Username - Empty Username", () => {
    //     _credentials.userName = "";
    //     _credentials.password = "nonDigitsPass"; // Short password
    //
    //     const {data, error} = _serviceBridge.register(_credentials);
    //     expect(error).toBeDefined();
    //     expect(data).toBeUndefined();
    // });
});
