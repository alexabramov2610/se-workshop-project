import { RegisterResponse } from "../../common/Response";
import { User } from "../User";
class UserManagement {
  private users: User[];
  constructor() {
    this.users = [];
  }

  register(newUser: User): RegisterResponse {
    this.users.push(newUser);
    return { data: { isAdded: true } };
  }

  getReigsteredUsers(): User[] {
    return this.users;
  }
  getUserByName(name: string): User {
    return this.users.filter((u) => u.name === name).pop();
  }
}

export { UserManagement };
