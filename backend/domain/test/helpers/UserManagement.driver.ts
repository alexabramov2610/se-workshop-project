import { UserManagement, User } from "../../src/user/internal_api";
import { Response } from "../../src/common/internal_api";
export class UserManagementDriver {
 
  
  userManagement: UserManagement;
  constructor() {
    this.userManagement = new UserManagement();
  }

  //register
  mockRegistrationSuccess():void{
    jest.spyOn(this.userManagement, "getUserByName").mockReturnValue(null);
    jest.spyOn(this.userManagement, "vaildPassword").mockReturnValue(true)
  }

  mockRegistrationUserExistFail() {
    jest.spyOn(this.userManagement, "getUserByName").mockReturnValue(new User('ron','123456'));
    jest.spyOn(this.userManagement, "vaildPassword").mockReturnValue(true)

  }

  mockRegistrationBadPassFail() {
    jest.spyOn(this.userManagement, "getUserByName").mockReturnValue(null);
    jest.spyOn(this.userManagement, "vaildPassword").mockReturnValue(false)  
  }


 //login
  mockLoginSuccess() : void {
    jest.spyOn(this.userManagement, "getUserByName").mockReturnValue(new User('ron','123456'));
    jest.spyOn(this.userManagement, "vaildPassword").mockReturnValue(true)
  }

  mockWrongPasswordForLoginError() : void {
    jest.spyOn(this.userManagement, "getUserByName").mockReturnValue(new User('ron','123456'));
    jest.spyOn(this.userManagement, "verifyPassword").mockReturnValue(false);
  }

  mockalreadyLoggedForLoginError() : void {
    jest.spyOn(this.userManagement, "getLoggedInUsers").mockReturnValue([new User('ron','123456')]);
  }

  //logout
  mockLogoutSuccess() : void {
    jest.spyOn(this.userManagement,"getLoggedInUsers").mockReturnValue([new User('ron','123456')]);
  }

  mockLogoutAlreadyOutFail() : void {
    jest.spyOn(this.userManagement,"getLoggedInUsers").mockReturnValue([new User('bob','1111111')]);
  }


  mockSetAdmin(name: string){
   jest.spyOn(this.userManagement, "isAdmin").mockReturnValue(false);
   jest.spyOn(this.userManagement, "getUserByName").mockReturnValue(new User(name,'123456'));
  }





  addUser(name: string, password: string): Response {
    return this.userManagement.register(name, password);
  }

  loginUser(userName:string,password:string):Response{
    return this.userManagement.login(name,password)
  }

  logoutUser(userName:string):Response{
    return this.userManagement.logout(userName)
  }

  getUserByName(name: string): User {
    return this.userManagement.getUserByName(name);
  }

  setAdmin(name: string): Response {
    this.mockSetAdmin(name);
    return this.userManagement.setAdmin(name);
  }
}
