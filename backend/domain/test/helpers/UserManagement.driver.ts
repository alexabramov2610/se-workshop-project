import { UserManager, User, Buyer } from "../../src/user/internal_api";
import { Response } from "../../src/common/internal_api";
export class UserManagementDriver {
  userManagement: UserManager;
  constructor() {
    this.userManagement = new UserManager();
  }
  addUser(name: string, password: string): Response {
    return this.userManagement.register(name,password);
  }
  setAdmin(name: string): Response {
    this.mockSetAdmin(name);
    return this.userManagement.setAdmin(name);
  }

  mockSetAdmin(name: string){
   jest.spyOn(this.userManagement, "isAdmin").mockReturnValue(false);
   jest.spyOn(this.userManagement, "getUserByName").mockReturnValue(new Buyer(name,'123456'));
  }
  
  getUserByName(name: string): User {
    return this.userManagement.getUserByName(name);
  }


}
