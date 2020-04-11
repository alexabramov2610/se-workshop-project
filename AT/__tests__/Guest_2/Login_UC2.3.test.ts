import { ServiceBridge, Driver } from "../../src/test_env/exports";
import { AuthDetails } from "../../src/test_env/types";

// const UNREGISTERED_USER = "RegisteredUser is not registered";
// const INCORRECT_PASSWORD = "Password is incorrect";
// const ALREADY_LOGGED_IN = "RegisteredUser is already logged in";

describe("Guest Login, UC: 2.3", () => {
  let _serviceBridge: ServiceBridge;
  var _authDetails: AuthDetails;

  beforeEach(() => {
    _serviceBridge = Driver.makeBridge();
  });

  test("Valid details and registered", () => {
    _authDetails.identifier = "validUsername";
    _authDetails.password = "validPassword123";
    _serviceBridge.register(_authDetails);

    const { error } = _serviceBridge.login(_authDetails);
    expect(error).toBeUndefined();

    const { data } = _serviceBridge.getLoggedInUsers();
    const { users } = data;
    expect(users.includes(_authDetails.identifier)).toBeTruthy();
  });

  test("Wrong password and registered", () => {
    const passwordDefect = "234jERFAshb5@#$@#4bjh";
    _authDetails.identifier = "validUsername";
    _authDetails.password = "wrongPassword123";
    _serviceBridge.register(_authDetails);

    _authDetails.password += "23423bhj@#$f";
    const { error } = _serviceBridge.login(_authDetails);
    // expect(error).toBe(INCORRECT_PASSWORD);
    expect(error).toBeDefined();

    const { data } = _serviceBridge.getLoggedInUsers();
    const { users } = data;
    expect(users.includes(_authDetails.identifier)).toBeFalsy();
  });

  test("Valid details and not registered", () => {
    _authDetails.identifier = "unregisterdUsername";
    _authDetails.password = "validPassword123";

    const { error } = _serviceBridge.login(_authDetails);
    // expect(error).toBe(UNREGISTERED_USER);
    expect(error).toBeDefined();

    const { data } = _serviceBridge.getLoggedInUsers();
    const { users } = data;
    expect(users.includes(_authDetails.identifier)).toBeFalsy();
  });

  test("Valid details and registered and logged in", () => {
    _authDetails.identifier = "alreadyLoggedInUsername";
    _authDetails.password = "validPassword123";

    _serviceBridge.register(_authDetails);
    _serviceBridge.login(_authDetails);

    const { error } = _serviceBridge.login(_authDetails);
    // expect(error).toBe(ALREADY_LOGGED_IN);
    expect(error).toBeDefined();

    const { data } = _serviceBridge.getLoggedInUsers();
    const { users } = data;
    expect(users.includes(_authDetails.identifier)).toBeFalsy();
  });
});
