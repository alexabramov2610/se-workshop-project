import { UserManagerDriver } from "../../helpers/UserManager.driver";
import * as Responses from "../../../src/common/internal_api";
import { logger } from "../../../src/common/internal_api";

describe("RegisteredUser Management Unit Tests", () => {
  let driver: UserManagerDriver;
  beforeEach(() => {
    //driver = new UserManagerDriver();

  });

  driver = new UserManagerDriver();

  test("Registration Success Test", () => {
    driver.mockRegistrationSuccess()
    const res: Responses.BoolResponse = driver.addUser("ron", "123456");
    expect(res.data.result).toBeTruthy();
  });

  test("Registration user exist Fail Test", () => {
    driver.mockRegistrationUserExistFail()
    const res: Responses.BoolResponse = driver.addUser("ron", "123456");
    expect(res.data.result).toBeFalsy();
  });

  test("Registration bad pass Fail Test", () => {
    driver.mockRegistrationBadPassFail()
    const res: Responses.BoolResponse = driver.addUser("ron", "123456");
    expect(res.data.result).toBeFalsy();
  });


  test("Login Success Test", () => {
    driver.mockLoginSuccess();
    const res: Responses.BoolResponse = driver.loginUser("ron", "123456");
    expect(res.data.result).toBeTruthy();
  });

  test("Login bad password fail Test", () => {
    driver.mockWrongPasswordForLoginError();
    const res: Responses.BoolResponse = driver.loginUser("ron", "123456");
    expect(res.data.result).toBeFalsy();
  });

  test("Login already logged in fail Test", () => {
    driver.mockWrongPasswordForLoginError();
    const res: Responses.BoolResponse = driver.loginUser("ron", "123456");
    expect(res.data.result).toBeFalsy();
  });


  test("logout Success Test", () => { 
    driver.mockLogoutSuccess();   
    const res: Responses.BoolResponse = driver.logoutUser("ron")
    expect(res.data.result).toBeTruthy();
  });

  test("logout already out fail Test", () => { 
    driver.mockLogoutAlreadyOutFail()
    const res: Responses.BoolResponse =driver.logoutUser('ron')
    expect(res.data.result).toBeFalsy();
  });



});
