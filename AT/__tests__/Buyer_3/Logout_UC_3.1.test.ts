import {Bridge, Driver, Credentials} from "../../src";

describe("Guest Buyer, UC: 3.1", () => {
    let _serviceBridge: Bridge;
    var _credentials: Credentials;

    beforeEach(() => {
        _serviceBridge = Driver.makeBridge();
        _credentials = {userName: "Ron", password: "ronpassword"};
    });

  test("Logout - Happy Path: after user was logged in ", () => {
    _serviceBridge.login(_credentials);
    const { users } = _serviceBridge.getLoggedInUsers().data;
    const myUser = users.filter((u) => u === "Ron");
    expect(myUser).toContain('Ron');
    _serviceBridge.logout();
    const usersPostLogout = _serviceBridge.getLoggedInUsers().data.users;
    const myUserAfterLogOut = usersPostLogout.filter((u) => u === "Ron");
    expect(myUserAfterLogOut).toBeUndefined();
  });

  test("Logout - Sad Path: user wasnt logged in ", () => {
    _serviceBridge.logout();
    const { users } = _serviceBridge.getLoggedInUsers().data;
    const myUser = users.filter((u) => u === "Ron");
    expect(myUser).toBeUndefined();
  });
});
