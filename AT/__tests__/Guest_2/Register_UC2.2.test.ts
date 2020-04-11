import { ServiceBridge, Driver } from "../../src/test_env/exports";
import { AuthDetails } from "../../src/test_env/types";

const SHORT_PASS = "Password must contains at least 5 characters";
const NON_CAPITAL_PASS = "Password must contains at least one capital letter";
const NON_DIGIT_PASS = "Password must contains at least one digit";
const USERNAME_EXISTS = "Username is taken";
const EMPTY_USERNAME = "Username can not be empty";

describe("Guset Registration, UC: 2.2", () => {
  let _serviceBridge: ServiceBridge;
  var _authDetails: AuthDetails;

  beforeEach(() => {
    _serviceBridge = Driver.makeBridge();
  });

  test("Valid Details", () => {
    _authDetails.identifier = "validUsername";
    _authDetails.password = "validPassword123";

    const { error } = _serviceBridge.register(_authDetails);
    expect(error).toBeUndefined();

    const { data } = _serviceBridge.getUserByName({
      username: _authDetails.identifier,
    });
    const { username } = data;
    expect(username).toBe(_authDetails.identifier);
  });

  test("Invalid Password - Short", () => {
    _authDetails.identifier = "validUsername";
    _authDetails.password = "sP1"; // Short password

    const { error } = _serviceBridge.register(_authDetails);
    expect(error).toBeDefined();

    const { data } = _serviceBridge.getUserByName({
      username: _authDetails.identifier,
    });
    const { username } = data;
    expect(username).not.toBe(_authDetails.identifier);
  });

  test("Invalid Password - Non Capital", () => {
    _authDetails.identifier = "validUsername";
    _authDetails.password = "noncapitalpass123"; // Short password

    const { error } = _serviceBridge.register(_authDetails);
    expect(error).toBeDefined();

    const { data } = _serviceBridge.getUserByName({
      username: _authDetails.identifier,
    });
    const { username } = data;
    expect(username).not.toBe(_authDetails.identifier);
  });

  test("Invalid Password - Non Digit", () => {
    _authDetails.identifier = "validUsername";
    _authDetails.password = "nonDigitsPass"; // Short password

    const { error } = _serviceBridge.register(_authDetails);
    expect(error).toBeDefined();

    const { data } = _serviceBridge.getUserByName({
      username: _authDetails.identifier,
    });
    const { username } = data;
    expect(username).not.toBe(_authDetails.identifier);
  });

  test("Invalid Username - Already Taken", () => {
    _authDetails.identifier = "validUsername";
    _authDetails.password = "nonDigitsPass"; // Short password

    const response = _serviceBridge.register(_authDetails);
    expect(response.error).toBeUndefined();

    const { error } = _serviceBridge.register(_authDetails);
    expect(error).toBeDefined();
  });

  test("Invalid Username - Empty Username", () => {
    _authDetails.identifier = "";
    _authDetails.password = "nonDigitsPass"; // Short password

    const { error } = _serviceBridge.register(_authDetails);
    expect(error).toBeDefined();
  });
});
