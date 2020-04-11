import {UserManager, Buyer, RegisteredUser} from "../../src/user/internal_api";
import { Response } from "../../src/common/internal_api";
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





  addUser(name: string, password: string): Response {
    return this.userManager.register(name, password);
  }

  loginUser(userName:string,password:string):Response{
    return this.userManager.login(userName,password)
  }

  logoutUser(userName:string):Response{
    return this.userManager.logout(userName)
  }

  getUserByName(name: string): RegisteredUser {
    return this.userManager.getUserByName(name);
  }

  setAdmin(name: string): Response {
    this.mockSetAdmin(name);
    return this.userManager.setAdmin(name);
  }
}
