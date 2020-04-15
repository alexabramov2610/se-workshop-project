import {UserManager, Buyer, RegisteredUser} from "../../src/user/internal_api";
import {RegisterRequest,LoginRequest,LogoutRequest, Response} from "../../src/api-int/internal_api";
import * as Req from "../../src/api-ext/Request"

export class UserManagerDriver {
 
  
  userManager: UserManager;
  constructor() {
    this.userManager = new UserManager();
  }

  //register
  mockRegistrationSuccess():void{
    jest.spyOn(this.userManager, "getUserByName").mockReturnValue(null);
    jest.spyOn(this.userManager, "vaildPassword").mockReturnValue(true)
  }

  mockRegistrationUserExistFail() {
    jest.spyOn(this.userManager, "getUserByName").mockReturnValue(new Buyer('ron','123456'));
    jest.spyOn(this.userManager, "vaildPassword").mockReturnValue(true)

  }

  mockRegistrationBadPassFail() {
    jest.spyOn(this.userManager, "getUserByName").mockReturnValue(null);
    jest.spyOn(this.userManager, "vaildPassword").mockReturnValue(false)
  }


 //login
  mockLoginSuccess() : void {
    jest.spyOn(this.userManager, "getUserByName").mockReturnValue(new Buyer('ron','123456'));
    jest.spyOn(this.userManager, "vaildPassword").mockReturnValue(true)
  }

  mockWrongPasswordForLoginError() : void {
    jest.spyOn(this.userManager, "getUserByName").mockReturnValue(new Buyer('ron','123456'));
    jest.spyOn(this.userManager, "verifyPassword").mockReturnValue(false);
  }

  mockalreadyLoggedForLoginError() : void {
    jest.spyOn(this.userManager, "getLoggedInUsers").mockReturnValue([new Buyer('ron','123456')]);
  }

  //logout
  mockLogoutSuccess() : void {
    jest.spyOn(this.userManager,"getLoggedInUsers").mockReturnValue([new Buyer('ron','123456')]);
  }

  mockLogoutAlreadyOutFail() : void {
    jest.spyOn(this.userManager,"getLoggedInUsers").mockReturnValue([new Buyer('bob','1111111')]);
  }


  mockSetAdmin(name: string){
   jest.spyOn(this.userManager, "isAdmin").mockReturnValue(false);
   jest.spyOn(this.userManager, "getUserByName").mockReturnValue(new Buyer(name,'123456'));
  }





  addUser(req:RegisterRequest): Response {
    return this.userManager.register(req);
  }

  loginUser(req:LoginRequest):Response{
    return this.userManager.login(req)
  }

  logoutUser(req:LogoutRequest):Response{
    return this.userManager.logout(req)
  }

  getUserByName(name: string): RegisteredUser {
    return this.userManager.getUserByName(name);
  }

  // setAdmin(name: string): Response {
  //   this.mockSetAdmin(name);
  //   return this.userManager.setAdmin(name);
  // }
}
