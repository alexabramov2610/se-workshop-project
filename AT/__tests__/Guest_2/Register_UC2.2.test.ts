import { ServiceBridge, Driver } from "../../src/test_env/exports";

const SHORT_PASS = "Password must contains at least 5 characters";
const NON_CAPITAL_PASS = "Password must contains at least one capital letter";
const NON_DIGIT_PASS = "Password must contains at least one digit";
const USERNAME_EXISTS = "Username is taken";
const EMPTY_USERNAME = "Username can not be empty";

describe("Guset Registration, UC: 2.2", () => {
  let _serviceBridge: ServiceBridge;
  var _username: string;
  var _password: string;

  beforeEach(() => {
    _serviceBridge = Driver.makeBridge();
  });

  test("Valid Details", () => {
    _username = "validUsername";
    _password = "validPassword123";

    _serviceBridge.removeUser(_username);

    const { success } = _serviceBridge.register(_username, _password);
    expect(success).toBeTruthy();

    const { data } = _serviceBridge.getUserByName(_username);
    const { username } = data;
    expect(username).toBe(_username);
  });

  test("Invalid Password - Short", () => {
    _username = "validUsername";
    _password = "sP1"; // Short password

    _serviceBridge.removeUser(_username);

    const { success, error } = _serviceBridge.register(_username, _password);
    expect(success).toBeFalsy();
    expect(error).toBe(SHORT_PASS);

    const { data } = _serviceBridge.getUserByName(_username);
    const { username } = data;
    expect(username).not.toBe(_username);
  });

  test("Invalid Password - Non Capital", () => {
    _username = "validUsername";
    _password = "noncapitalpass123"; // Short password

    _serviceBridge.removeUser(_username);

    const { success, error } = _serviceBridge.register(_username, _password);
    expect(success).toBeFalsy();
    expect(error).toBe(NON_CAPITAL_PASS);

    const { data } = _serviceBridge.getUserByName(_username);
    const { username } = data;
    expect(username).not.toBe(_username);
  });

  test("Invalid Password - Non Digit", () => {
    _username = "validUsername";
    _password = "nonDigitsPass"; // Short password

    _serviceBridge.removeUser(_username);

    const { success, error } = _serviceBridge.register(_username, _password);
    expect(success).toBeFalsy();
    expect(error).toBe(NON_DIGIT_PASS);

    const { data } = _serviceBridge.getUserByName(_username);
    const { username } = data;
    expect(username).not.toBe(_username);
  });

  test("Invalid Username - Already Taken", () => {
    _username = "validUsername";
    _password = "nonDigitsPass"; // Short password

    _serviceBridge.removeUser(_username);
    const response = _serviceBridge.register(_username, _password);
    expect(response.success).toBeTruthy();

    const { success, error } = _serviceBridge.register(_username, _password);
    expect(success).toBeFalsy();
    expect(error).toBe(USERNAME_EXISTS);
  });

  test("Invalid Username - Empty Username", () => {
    _username = "";
    _password = "nonDigitsPass"; // Short password

    _serviceBridge.removeUser(_username);

    const { success, error } = _serviceBridge.register(_username, _password);
    expect(success).toBeFalsy();
    expect(error).toBe(EMPTY_USERNAME);
  });
});
