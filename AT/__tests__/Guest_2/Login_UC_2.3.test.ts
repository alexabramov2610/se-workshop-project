import {Bridge, Driver, Credentials} from "../../src/";

// const UNREGISTERED_USER = "RegisteredUser is not registered";
// const INCORRECT_PASSWORD = "Password is incorrect";
// const ALREADY_LOGGED_IN = "RegisteredUser is already logged in";

describe("Guest Login, UC: 2.3", () => {
    let _serviceBridge: Bridge;
    let _credentials: Credentials;

    beforeEach(() => {
        _serviceBridge = Driver.makeBridge();
        _credentials = {userName: "test-username", password: "test-password"};
    });

    test("Valid details and registered", () => {
        _credentials.userName = "validUsername";
        _credentials.password = "validPassword123";
        _serviceBridge.register(_credentials);

        const {error} = _serviceBridge.login(_credentials);
        expect(error).toBeUndefined();

        const {data} = _serviceBridge.getLoggedInUsers();
        const {users} = data;
        expect(users.includes(_credentials.userName)).toBeTruthy();
    });

    test("Wrong password and registered", () => {
        const passwordDefect = "234jERFAshb5@#$@#4bjh";
        _credentials.userName = "validUsername";
        _credentials.password = "wrongPassword123";
        _serviceBridge.register(_credentials);

        _credentials.password += "23423bhj@#$f";
        const {error} = _serviceBridge.login(_credentials);
        // expect(error).toBe(INCORRECT_PASSWORD);
        expect(error).toBeDefined();

        const {data} = _serviceBridge.getLoggedInUsers();
        const {users} = data;
        expect(users.includes(_credentials.userName)).toBeFalsy();
    });

    test("Valid details and not registered", () => {
        _credentials.userName = "unregisterdUsername";
        _credentials.password = "validPassword123";

        const {error} = _serviceBridge.login(_credentials);
        // expect(error).toBe(UNREGISTERED_USER);
        expect(error).toBeDefined();

        const {data} = _serviceBridge.getLoggedInUsers();
        const {users} = data;
        expect(users.includes(_credentials.userName)).toBeFalsy();
    });

    test("Valid details and registered and logged in", () => {
        _credentials.userName = "alreadyLoggedInUsername";
        _credentials.password = "validPassword123";

        _serviceBridge.register(_credentials);
        _serviceBridge.login(_credentials);

        const {error} = _serviceBridge.login(_credentials);
        // expect(error).toBe(ALREADY_LOGGED_IN);
        expect(error).toBeDefined();

        const {data} = _serviceBridge.getLoggedInUsers();
        const {users} = data;
        expect(users.includes(_credentials.userName)).toBeTruthy();
    });
});
