import { UserManagementDriver } from "../helpers/UserManagement.driver";
import * as Responses from "../../src/common/internal_api";

describe("User Management Unit Tests", () => {
  let driver: UserManagementDriver;
  beforeEach(() => {
    //driver = new UserManagementDriver();
  });

  driver = new UserManagementDriver();

  test("Registration Success Test", () => {
    driver.mockRegistrationSuccess()
    const res: Responses.RegisterResponse = driver.addUser("ron", "123456");
    expect(res.data.result).toBeTruthy();
  });

  test("Registration user exist Fail Test", () => {
    driver.mockRegistrationUserExistFail()
    const res: Responses.RegisterResponse = driver.addUser("ron", "123456");
    expect(res.data.result).toBeFalsy();
  });

  test("Registration bad pass Fail Test", () => {
    driver.mockRegistrationBadPassFail()
    const res: Responses.RegisterResponse = driver.addUser("ron", "123456");
    expect(res.data.result).toBeFalsy();
  });


  test("Login Success Test", () => {
    driver.mockLoginSuccess();
    const res: Responses.LoginResponse = driver.loginUser("ron", "123456");
    expect(res.data.result).toBeTruthy();
  });

  test("Login bad password fail Test", () => {
    driver.mockWrongPasswordForLoginError();
    const res: Responses.LoginResponse = driver.loginUser("ron", "123456");
    expect(res.data.result).toBeFalsy();
  });

  test("Login already logged in fail Test", () => {
    driver.mockWrongPasswordForLoginError();
    const res: Responses.LoginResponse = driver.loginUser("ron", "123456");
    expect(res.data.result).toBeFalsy();
  });


  test("logout Success Test", () => { 
    driver.mockLogoutSuccess();   
    const res: Responses.LogoutResponse =driver.logoutUser("ron")
    expect(res.data.result).toBeTruthy();
  });

  test("logout already out fail Test", () => { 
    driver.mockLogoutAlreadyOutFail()
    const res: Responses.LogoutResponse =driver.logoutUser('ron')
    expect(res.data.result).toBeFalsy();
  });



});
