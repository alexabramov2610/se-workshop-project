import {UserRole} from "../../common/Enums";
import { BoolResponse,errorMsg } from "../../common/internal_api";
import { User,Admin, Buyer } from "../internal_api";

class UserManager {
  private users: User[];
  private admins: Admin[];

  constructor() {
    this.users = [];
    this.admins= [];
  }

  register(userName: string, password: string): BoolResponse {
    this.users.push(new Buyer(userName,password));
    return { data: { result: true } };
  }

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

  isAdmin(u:User) : boolean {
    return this.admins.filter(val => val.name === u.name).pop() !== null
  }

  setAdmin(userName:string): BoolResponse{
    const u :User = this.getUserByName(userName);
    if(!u) return {data:{result:false} , error: {message: errorMsg['E_NF']}}
    const isAlreadyAdmin:boolean = this.isAdmin(u);
    if(isAlreadyAdmin) return {data:{result:false} , error: {message: errorMsg['E_AL']}}
    this.admins = this.admins.concat([new Admin(userName, u.password)]);
    return {data:{result:true}};
  }
}

export { UserManager };
