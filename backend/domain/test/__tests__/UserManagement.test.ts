import { UserManagementDriver } from "../helpers/UserManagement.driver";
import * as Responses from "../../src/common/internal_api";

describe("User Management Unit Tests", () => {
  let driver: UserManagementDriver;
  beforeEach(() => {
    driver = new UserManagementDriver();
  });

  test("Registration Success Test", () => {
    const res: Responses.RegisterResponse = driver.addUser("ron", "123456");
    expect(res.data.isAdded).toBeTruthy();
  });

  test("Registration user exist Fail Test", () => {
    driver.addUser("ron", "123456")
    const res: Responses.RegisterResponse = driver.addUser("ron", "123456");
    expect(res.data.isAdded).toBeFalsy();
    expect(res.error.message).toBe('user name is taken')
  });


  test("Login Success Test", () => {
    driver.addUser("ron", "123456");
    expect(!driver.getUserByName('ron')).toBeFalsy()
    const res: Responses.LoginResponse = driver.loginUser("ron", "123456");
    console.log(res)
    expect(res.data.isLoggedIn).toBeTruthy();
  });

  test("logout Success Test", () => {
    driver.addUser("ron", "123456");
    driver.loginUser("ron", "123456");
    const res: Responses.LogoutResponse =driver.logoutUser("ron")
    expect(res.data.isLoggedout).toBeTruthy();
  });

  


});
