import { UserManagement, User } from "../../src/user/internal_api";
import { Response } from "../../src/common/internal_api";
export class UserManagementDriver {
  userManagement: UserManagement;
  constructor() {
    this.userManagement = new UserManagement();
  }
  addUser(name: string, password: string): Response {
    return this.userManagement.register(new User(name, password));
  }
  setAdmin(name: string): Response {
    this.mockSetAdmin(name);
    return this.userManagement.setAdmin(name);
  }

  mockSetAdmin(name: string){
   jest.spyOn(this.userManagement, "isAdmin").mockReturnValue(false);
   jest.spyOn(this.userManagement, "getUserByName").mockReturnValue(new User(name,'123456'));
  }
  
  getUserByName(name: string): User {
    return this.userManagement.getUserByName(name);
  }
}
