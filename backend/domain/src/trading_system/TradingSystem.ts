import { UserManagement, User } from "../user/internal_api";

class TradingSystem {
  private userManagement: UserManagement;
  constructor() {
    this.userManagement = new UserManagement();
  }
  register(userName: string, password: string): void {
    const newUser: User = new User(userName, password);
    const res = this.userManagement.register(newUser);
  }
  getUserByName(userName: string) {
    return this.userManagement.getUserByName(userName);
  }
}
