import { UserManagerDriver } from "../../helpers/UserManager.driver";
import * as Responses from "../../../src/api-int/internal_api";
import {logger, ManagementPermission, UserRole} from "../../../src/api-int/internal_api";
import {Buyer} from "../../../src/user/users/Buyer";
import {UserManager} from "../../../src/user/UserManager";
import {RegisteredUser, StoreManager} from "../../../src/user/internal_api";
import exp from "constants";

describe("RegisteredUser Management Unit Tests", () => {
  let driver: UserManagerDriver;
  let userManager: UserManager;

  beforeEach(() => {
    //driver = new UserManagerDriver();
    this.userManager = new UserManager();
  });

  driver = new UserManagerDriver();

  test("Registration Success Test", () => {
    driver.mockRegistrationSuccess()
    const res: Responses.BoolResponse = driver.addUser({body:{username:'ron',password:'123456'},token:"token"});
    expect(res.data.result).toBeTruthy();
  });

  test("Registration user exist Fail Test", () => {
    driver.mockRegistrationUserExistFail()
    const res: Responses.BoolResponse = driver.addUser({body:{username:'ron',password:'123456'},token:"token"});
    expect(res.data.result).toBeFalsy();
  });

  test("Registration bad pass Fail Test", () => {
    driver.mockRegistrationBadPassFail()
    const res: Responses.BoolResponse = driver.addUser({body:{username:'ron',password:'123456'},token:"token"});
    expect(res.data.result).toBeFalsy();
  });


  test("Login Success Test", () => {
    driver.mockLoginSuccess();
    const res: Responses.BoolResponse = driver.loginUser({body:{username:'ron',password:'123456'},token:"token"});
    expect(res.data.result).toBeTruthy();
  });

  test("Login bad password fail Test", () => {
    driver.mockWrongPasswordForLoginError();
    const res: Responses.BoolResponse = driver.loginUser({body:{username:'ron',password:'123456'},token:"token"});
    expect(res.data.result).toBeFalsy();
  });

  test("Login already logged in fail Test", () => {
    driver.mockWrongPasswordForLoginError();
    const res: Responses.BoolResponse = driver.loginUser({body:{username:'ron',password:'123456'},token:"token"});
    expect(res.data.result).toBeFalsy();
  });


  test("logout Success Test", () => { 
    driver.mockLogoutSuccess();   
    const res: Responses.BoolResponse = driver.logoutUser({body:{username:'ron'},token:"token"})
    expect(res.data.result).toBeTruthy();
  });

  test("logout already out fail Test", () => { 
    driver.mockLogoutAlreadyOutFail()
    const res: Responses.BoolResponse =driver.logoutUser({body:{username:'ron'},token:"token"})
    expect(res.data.result).toBeFalsy();
  });

  test("verifyUser Success - not logged in", () => {
    const isLoggedIn: boolean = false;
    const buyer: Buyer = new Buyer('test', '111111');
    jest.spyOn(this.userManager,"getUserByName").mockReturnValue(buyer);
    jest.spyOn(this.userManager,"isLoggedIn").mockReturnValue(isLoggedIn);
    const res: Responses.BoolResponse = this.userManager.verifyUser(buyer.name, isLoggedIn)

    expect(res.data.result).toBeTruthy();
  });

  test("verifyUser Success - logged in", () => {
    const isLoggedIn: boolean = true;
    const buyer: Buyer = new Buyer('test', '111111');
    jest.spyOn(this.userManager,"getUserByName").mockReturnValue(buyer);
    jest.spyOn(this.userManager,"isLoggedIn").mockReturnValue(isLoggedIn);
    const res: Responses.BoolResponse = this.userManager.verifyUser(buyer.name, isLoggedIn)

    expect(res.data.result).toBeTruthy();
  });

  test("verifyUser Failure - not logged in", () => {
    const isLoggedIn: boolean = false;
    const buyer: Buyer = new Buyer('test', '111111');
    jest.spyOn(this.userManager,"getUserByName").mockReturnValue(undefined);
    jest.spyOn(this.userManager,"isLoggedIn").mockReturnValue(isLoggedIn);
    const res: Responses.BoolResponse = this.userManager.verifyUser(buyer.name, isLoggedIn)

    expect(res.data.result).toBeFalsy();
  });

  test("verifyUser Failure - logged in", () => {
    const isLoggedIn: boolean = true;
    const buyer: Buyer = new Buyer('test', '111111');
    jest.spyOn(this.userManager,"getUserByName").mockReturnValue(undefined);
    jest.spyOn(this.userManager,"isLoggedIn").mockReturnValue(isLoggedIn);
    const res: Responses.BoolResponse = this.userManager.verifyUser(buyer.name, isLoggedIn)

    expect(res.data.result).toBeFalsy();
  });

  test("setUserRole - Manager, logged in - Success", () => {
    const isLoggedIn: boolean = true;
    const buyer: Buyer = new Buyer('test', '111111');
    const roleToAssign: UserRole = UserRole.MANAGER;
    jest.spyOn(this.userManager,"getUserByName").mockReturnValueOnce(buyer);
    jest.spyOn(this.userManager,"isLoggedIn").mockReturnValue(isLoggedIn);

    const res: Responses.BoolResponse = this.userManager.setUserRole(buyer.name, roleToAssign)
    expect(res.data.result).toBeTruthy();

    const userChangedInRegistered: RegisteredUser = this.userManager.getRegisteredUsers().pop();
    const userChangedInLoggedIn: RegisteredUser = this.userManager.getLoggedInUsers().pop();

    expect(userChangedInRegistered).toBeDefined();
    expect(userChangedInRegistered.getRole()).toBe(roleToAssign);
    expect(userChangedInRegistered.UUID).toBe(buyer.UUID);
    expect(userChangedInRegistered.name).toBe(buyer.name);
    expect(userChangedInRegistered.password).toBe(buyer.password);

    expect(userChangedInLoggedIn).toBeDefined();
    expect(userChangedInLoggedIn.getRole()).toBe(roleToAssign);
    expect(userChangedInLoggedIn.UUID).toBe(buyer.UUID);
    expect(userChangedInLoggedIn.name).toBe(buyer.name);
    expect(userChangedInLoggedIn.password).toBe(buyer.password);
  });

  test("setUserRole - Manager - Failure - User doesn't exist", () => {
    const isLoggedIn: boolean = true;
    const buyer: Buyer = new Buyer('test', '111111');
    const roleToAssign: UserRole = UserRole.MANAGER;
    jest.spyOn(this.userManager,"getUserByName").mockReturnValueOnce(undefined);
    jest.spyOn(this.userManager,"isLoggedIn").mockReturnValue(isLoggedIn);

    const res: Responses.BoolResponse = this.userManager.setUserRole(buyer.name, roleToAssign)
    expect(res.data.result).toBeFalsy();

    const userChangedInRegistered: RegisteredUser = this.userManager.getRegisteredUsers().pop();
    const userChangedInLoggedIn: RegisteredUser = this.userManager.getLoggedInUsers().pop();

    expect(userChangedInRegistered).toBeUndefined();
    expect(userChangedInLoggedIn).toBeUndefined();
  });

  test("setUserRole - Manager - Failure - Invalid role", () => {
    const isLoggedIn: boolean = true;
    const buyer: Buyer = new Buyer('test', '111111');
    jest.spyOn(this.userManager,"getUserByName").mockReturnValueOnce(buyer);
    jest.spyOn(this.userManager,"isLoggedIn").mockReturnValue(isLoggedIn);

    const res: Responses.BoolResponse = this.userManager.setUserRole(buyer.name, -2)
    expect(res.data.result).toBeFalsy();

    const userChangedInRegistered: RegisteredUser = this.userManager.getRegisteredUsers().pop();
    const userChangedInLoggedIn: RegisteredUser = this.userManager.getLoggedInUsers().pop();

    expect(userChangedInRegistered).toBeUndefined();
    expect(userChangedInLoggedIn).toBeUndefined();
  });

  test("setUserRole - Owner, logged in - Success", () => {
    const isLoggedIn: boolean = true;
    const buyer: Buyer = new Buyer('test', '111111');
    const roleToAssign: UserRole = UserRole.OWNER;
    jest.spyOn(this.userManager,"getUserByName").mockReturnValueOnce(buyer);
    jest.spyOn(this.userManager,"isLoggedIn").mockReturnValue(isLoggedIn);

    const res: Responses.BoolResponse = this.userManager.setUserRole(buyer.name, roleToAssign)
    expect(res.data.result).toBeTruthy();

    const userChangedInRegistered: RegisteredUser = this.userManager.getRegisteredUsers().pop();
    const userChangedInLoggedIn: RegisteredUser = this.userManager.getLoggedInUsers().pop();

    expect(userChangedInRegistered).toBeDefined();
    expect(userChangedInRegistered.getRole()).toBe(roleToAssign);
    expect(userChangedInRegistered.UUID).toBe(buyer.UUID);
    expect(userChangedInRegistered.name).toBe(buyer.name);
    expect(userChangedInRegistered.password).toBe(buyer.password);

    expect(userChangedInLoggedIn).toBeDefined();
    expect(userChangedInLoggedIn.getRole()).toBe(roleToAssign);
    expect(userChangedInLoggedIn.UUID).toBe(buyer.UUID);
    expect(userChangedInLoggedIn.name).toBe(buyer.name);
    expect(userChangedInLoggedIn.password).toBe(buyer.password);
  });

  test("setUserRole - Owner - Failure - User doesn't exist", () => {
    const isLoggedIn: boolean = true;
    const buyer: Buyer = new Buyer('test', '111111');
    const roleToAssign: UserRole = UserRole.OWNER;
    jest.spyOn(this.userManager,"getUserByName").mockReturnValueOnce(undefined);
    jest.spyOn(this.userManager,"isLoggedIn").mockReturnValue(isLoggedIn);

    const res: Responses.BoolResponse = this.userManager.setUserRole(buyer.name, roleToAssign)
    expect(res.data.result).toBeFalsy();

    const userChangedInRegistered: RegisteredUser = this.userManager.getRegisteredUsers().pop();
    const userChangedInLoggedIn: RegisteredUser = this.userManager.getLoggedInUsers().pop();

    expect(userChangedInRegistered).toBeUndefined();
    expect(userChangedInLoggedIn).toBeUndefined();
  });

  test("setUserRole - Owner - Failure - Invalid role", () => {
    const isLoggedIn: boolean = true;
    const buyer: Buyer = new Buyer('test', '111111');
    jest.spyOn(this.userManager,"getUserByName").mockReturnValueOnce(buyer);
    jest.spyOn(this.userManager,"isLoggedIn").mockReturnValue(isLoggedIn);

    const res: Responses.BoolResponse = this.userManager.setUserRole(buyer.name, -2)
    expect(res.data.result).toBeFalsy();

    const userChangedInRegistered: RegisteredUser = this.userManager.getRegisteredUsers().pop();
    const userChangedInLoggedIn: RegisteredUser = this.userManager.getLoggedInUsers().pop();

    expect(userChangedInRegistered).toBeUndefined();
    expect(userChangedInLoggedIn).toBeUndefined();
  });

  test("assignStoreManagerBasicPermissions - Success", () => {
    const manager: StoreManager = new StoreManager('test', '111111');
    jest.spyOn(this.userManager,"getUserByName").mockReturnValueOnce(manager);

    const res: Responses.BoolResponse = this.userManager.assignStoreManagerBasicPermissions(manager.name);
    expect(res.data.result).toBeTruthy();

    const userPermissions: ManagementPermission[] = manager.getPermissions();

    expect(userPermissions).toContain(ManagementPermission.WATCH_PURCHASES_HISTORY);
    expect(userPermissions).toContain(ManagementPermission.WATCH_USER_QUESTIONS);
    expect(userPermissions).toContain(ManagementPermission.REPLY_USER_QUESTIONS);

  });

  test("assignStoreManagerBasicPermissions - Failure - user doesn't exist", () => {
    const manager: StoreManager = new StoreManager('test', '111111');
    jest.spyOn(this.userManager,"getUserByName").mockReturnValueOnce(undefined);

    const res: Responses.BoolResponse = this.userManager.assignStoreManagerBasicPermissions(manager.name);
    expect(res.data.result).toBeFalsy();

    const userPermissions: ManagementPermission[] = manager.getPermissions();
    expect(userPermissions.length).toBe(0);

  });


});
