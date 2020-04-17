import {Driver, Bridge, Credentials} from '../../src/';

const SHORT_PASS = "Password must contains at least 5 characters";
const NON_CAPITAL_PASS = "Password must contains at least one capital letter";
const NON_DIGIT_PASS = "Password must contains at least one digit";
const USERNAME_EXISTS = "Username is taken";
const EMPTY_USERNAME = "Username can not be empty";

describe("Guest Registration, UC: 2.2", () => {
  let _serviceBridge: Bridge;
  let _credentials: Credentials;

  beforeEach(() => {
    _serviceBridge = Driver.makeBridge();
    _credentials = {userName: "test-username", password: "test-password"};
  });

  test("Valid Details", () => {
    _credentials.userName = "validUsername";
    _credentials.password = "validPassword123";

    const { error } = _serviceBridge.register(_credentials);
    expect(error).toBeUndefined();

    const { data } = _serviceBridge.getUserByName({
      username: _credentials.userName,
    });
    const { username } = data;
    expect(username).toEqual(_credentials.userName);
  });

  test("Invalid Password - Short", () => {
    _credentials.userName = "validUsername";
    _credentials.password = "sP1"; // Short password

    const { error } = _serviceBridge.register(_credentials);
    expect(error).toBeDefined();

    const { data } = _serviceBridge.getUserByName({
      username: _credentials.userName,
    });
    const { username } = data;
    expect(username).not.toBe(_credentials.userName);
  });

  test("Invalid Password - Non Capital", () => {
    _credentials.userName = "validUsername";
    _credentials.password = "noncapitalpass123"; // Short password

    const { error } = _serviceBridge.register(_credentials);
    expect(error).toBeDefined();

    const { data } = _serviceBridge.getUserByName({
      username: _credentials.userName,
    });
    const { username } = data;
    expect(username).not.toBe(_credentials.userName);
  });

  test("Invalid Password - Non Digit", () => {
    _credentials.userName = "validUsername";
    _credentials.password = "nonDigitsPass"; // Short password

    const { error } = _serviceBridge.register(_credentials);
    expect(error).toBeDefined();

    const { data } = _serviceBridge.getUserByName({
      username: _credentials.userName,
    });
    const { username } = data;
    expect(username).not.toBe(_credentials.userName);
  });

  test("Invalid Username - Already Taken", () => {
    _credentials.userName = "validUsername";
    _credentials.password = "nonDigitsPass"; // Short password

    const response = _serviceBridge.register(_credentials);
    expect(response.error).toBeUndefined();

    const { error } = _serviceBridge.register(_credentials);
    expect(error).toBeDefined();
  });

  test("Invalid Username - Empty Username", () => {
    _credentials.userName = "";
    _credentials.password = "nonDigitsPass"; // Short password

    const { error } = _serviceBridge.register(_credentials);
    expect(error).toBeDefined();
  });
});
