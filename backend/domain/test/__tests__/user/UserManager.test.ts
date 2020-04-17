import { UserManagerDriver } from "../../helpers/UserManager.driver";
import * as Responses from "../../../src/api-int/internal_api";
import {logger, ManagementPermission, UserRole} from "../../../src/api-int/internal_api";
import {Buyer} from "../../../src/user/users/Buyer";
import {UserManager} from "../../../src/user/UserManager";
import {RegisteredUser, StoreManager} from "../../../src/user/internal_api";
import exp from "constants";
import {errorMsg} from "../../../src/api-int/internal_api";

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

  test("Login user not exist fail test",()=>{
    const bob=new Buyer('bob','123456');
    const req={body:{username:bob.name,password:bob.password},token:bob.UUID}
    const res:Responses.BoolResponse=this.userManager.login(req);
    expect(res.data.result).toBeFalsy()
    expect(res.error.message).toEqual(errorMsg['E_NF']);

  })

  test("Login already logged in fail Test", () => {
    const bob=new Buyer('bob','123456');
    const req={body:{username:bob.name,password:bob.password},token:bob.UUID}

    jest.spyOn(this.userManager,'getUserByName').mockReturnValueOnce(bob);
    jest.spyOn(this.userManager,'getLoggedInUsers').mockReturnValueOnce([bob])

    const res:Responses.BoolResponse=this.userManager.login(req);
    expect(res.data.result).toBeFalsy()
    expect(res.error.message).toEqual(errorMsg['E_AL']);
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

  test("valid password seccess test", ()=> {
    const password="123456";
    const res:boolean=this.userManager.vaildPassword(password);
    expect(res).toBeTruthy();
  });

  test("valid password fail test", ()=> {
    const password="123";
    const res:boolean=this.userManager.vaildPassword(password);
    expect(res).toBeFalsy();
  });

  test("getUserByName seccess test", ()=> {
    const bob=new Buyer('bob','123456','1');
    this.userManager.register({body:{username:bob.name,password:bob.password},token:bob.UUID});
    const res=this.userManager.getUserByName('bob');
    expect(res).toEqual(bob);

  });

  test("getUserByName fail test", ()=> {
    const bob=new Buyer('bob','123456','1');
    this.userManager.register({body:{username:bob.name,password:bob.password},token:bob.UUID});
    const res=this.userManager.getUserByName('dor');
    expect(res).toBeFalsy();

  });

  test("getUserByToken seccess test", ()=> {
    const bob=new Buyer('bob','123456');
    this.userManager.register({body:{username:bob.name,password:bob.password},token:bob.UUID});
    const res=this.userManager.getUserByToken(bob.UUID);
    expect(res).toEqual(bob);

  });

  test("getUserByToken fail test", ()=> {
    const bob=new Buyer('bob','123456');
    this.userManager.register({body:{username:bob.name,password:bob.password},token:bob.UUID});
    const res=this.userManager.getUserByToken('5');
    expect(res).toBeFalsy()

  });

  test('getLoggedInUsers seccess test',()=>{
    const bob=new Buyer('bob','123456','1');
    this.userManager.register({body:{username:bob.name,password:bob.password},token:bob.UUID});
    this.userManager.login({body:{username:bob.name,password:bob.password},token:bob.UUID});
    const res=this.userManager.getLoggedInUsers();
    expect(res).toEqual([bob]);
  })

  test('isLoggedIn seccess test',()=>{
    const bob=new Buyer('bob','123456','1');
    this.userManager.register({body:{username:bob.name,password:bob.password},token:bob.UUID});
    this.userManager.login({body:{username:bob.name,password:bob.password},token:bob.UUID});
    const res= this.userManager.isLoggedIn(bob)
    expect(res).toBeTruthy()

  })

  test('isLoggedIn fail test',()=>{
    const bob=new Buyer('bob','123456','1');
    this.userManager.register({body:{username:bob.name,password:bob.password},token:bob.UUID});
    const res= this.userManager.isLoggedIn(bob)
    expect(res).toBeFalsy()

  })

});
