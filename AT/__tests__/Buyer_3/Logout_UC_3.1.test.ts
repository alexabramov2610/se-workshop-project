import { Bridge, Driver } from "../../src";
import { AuthDetails } from "../../src/test_env/types";

describe("Guest Buyer, UC: 3.1", () => {
  let _serviceBridge: Bridge;
  var _authDetails: AuthDetails;

  beforeEach(() => {
    _serviceBridge = Driver.makeBridge();
    _authDetails = { userName: "Ron", password: "ronpassword" };
  });

  test("Logout - Happy Path: after user was logged in ", () => {
    _serviceBridge.login(_authDetails);
    const { users } = _serviceBridge.getLoggedInUsers().data;
    const myUser = users.filter((u) => u === "Ron");
    expect(myUser).toBeTruthy();
    _serviceBridge.logout();
    const usersPostLogout = _serviceBridge.getLoggedInUsers().data.users;
    const myUserAfterLogOut = usersPostLogout.filter((u) => u === "Ron");
    expect(myUserAfterLogOut).toBeFalsy();
  });

  test("Logout - Sad Path: user wasnt logged in ", () => {
    _serviceBridge.logout();
    const { users } = _serviceBridge.getLoggedInUsers().data;
    _serviceBridge.logout();
    const myUser = users.filter((u) => u === "Ron");
    expect(myUser).toBeFalsy();
  });
});
