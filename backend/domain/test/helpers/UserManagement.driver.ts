import { UserManagement, User } from "../../src/user/internal_api";
import { Response } from "../../src/common/internal_api";
export class UserManagementDriver {
  userManagement: UserManagement;
  constructor() {
    this.userManagement = new UserManagement();
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
}
