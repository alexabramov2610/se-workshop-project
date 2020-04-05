import { RegisterResponse,errorMsg, AssignResponse } from "../../common/internal_api";
import { User,Admin } from "../internal_api";

class UserManagement {
  private users: User[];
  private admins: Admin[];

  constructor() {
    this.users = [];
    this.admins= [];
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

  isAdmin(u:User) : boolean{
    return this.admins.filter(val=> val.name === u.name).pop() === null
  }

  setAdmin(userName:string): AssignResponse{
    const u :User = this.users.filter(val=> val.name === userName)[0];
    if(!u) return {data:{isAssigned:false} , error: {message: errorMsg['E_NF']}}
    const isAdmin:boolean = this.isAdmin(u);
    if(isAdmin) return {data:{isAssigned:false} , error: {message: errorMsg['E_AL']}}
    this.admins = this.admins.concat([u]);
    return {data:{isAssigned:true}};
  }
}

export { UserManagement };
