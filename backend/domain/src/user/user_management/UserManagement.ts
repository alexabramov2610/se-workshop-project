import {RegisterResponse} from "../../common/Response";
import {User} from "../User";
import {UserRole} from "../../common/Enums";

class UserManagement {
  private users: User[];
  constructor() {
    this.users = [];
  }

  // register(newUser: User): RegisterResponse {
  //   this.users.push(newUser);
  //   return { data: { isAdded: true } };
  // }

  getReigsteredUsers(): User[] {
    return this.users;
  }
  getUserByName(name: string): User {
    return this.users.filter((u) => u.name === name).pop();
  }

  verifyOwner(user: User) : boolean {
    return user.getRole() === UserRole.OWNER;
  }

  verifyManager(user: User) : boolean {
    return user.getRole() === UserRole.MANAGER;
  }


  isLoggedIn(user: User) {
    return false;
  }
}

export { UserManagement };
