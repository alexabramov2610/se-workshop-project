import { ServiceBridge, Driver } from "../../src/test_env/exports";

const UNREGISTERED_USER = "User is not registered";
const INCORRECT_PASSWORD = "Password is incorrect";

describe("Guest Login, UC: 2.3", () => {
  let _serviceBridge: ServiceBridge;
  var _username: string;
  var _password: string;

  beforeEach(() => {
    _serviceBridge = Driver.makeBridge();
  });

  test("Valid details and registered", () => {
    _username = "validUsername";
    _password = "validPassword123";
    _serviceBridge.register(_username, _password);

    const { success } = _serviceBridge.login(_username, _password);
    expect(success).toBeTruthy();

    const { users } = _serviceBridge.getLoggedInUsers();
    expect(users.includes(_username)).toBeTruthy();
  });

  test("Wrong password and registered", () => {
    _username = "validUsername";
    _password = "wrongPassword123";
    _serviceBridge.register(_username, _password);

    const { success, error } = _serviceBridge.login(_username, _password);
    expect(success).toBeFalsy();
    expect(error).toBe(INCORRECT_PASSWORD);

    const { users } = _serviceBridge.getLoggedInUsers();
    expect(users.includes(_username)).toBeFalsy();
  });

  test("Valid details and not registered", () => {
    _username = "unregisterdUsername";
    _password = "validPassword123";
    _serviceBridge.removeUser(_username);

    const { success, error } = _serviceBridge.login(_username, _password);
    expect(success).toBeFalsy();
    expect(error).toBe(UNREGISTERED_USER);

    const { users } = _serviceBridge.getLoggedInUsers();
    expect(users.includes(_username)).toBeFalsy();
  });

  test("Valid details and registered and logged in", () => {
    _username = "alreadyLoggedInUsername";
    _password = "validPassword123";
    
    _serviceBridge.register(_username, _password);
    _serviceBridge.login(_username, _password);

    const { success, error } = _serviceBridge.login(_username, _password);
    expect(success).toBeFalsy();
    expect(error).toBe(UNREGISTERED_USER);

    const { users } = _serviceBridge.getLoggedInUsers();
    expect(users.includes(_username)).toBeFalsy();
  });
});
