import {UserRole} from "../../common/Enums";
import { BoolResponse,errorMsg } from "../../common/internal_api";
import { User,Admin } from "../internal_api";

class UserManagement {
  private users: User[];
  private loggedInUsers:User[];
  private admins: Admin[];

  constructor() {
    this.users = [];
    this.admins= [];
  }

  register(userName,password): BoolResponse {
    if(this.getUserByName(userName)){    //user already in system
      return {data:{result:false},error:{message:errorMsg['E_AT']}}
    }
     else if(!this.vaildPassword(password)){   
       return {data:{result:false},error:{message:errorMsg['E_BP']}}
     }
    else{
    this.users.concat([new User(userName,password)]);
    return { data: { result: true } };
    }}
  
   

  login(userName:string,password:string): BoolResponse{
    
    if(!(this.getUserByName(userName))){ 
      return {data:{result:false},error:{message:errorMsg['E_NF']}}  //not found
    }
    else if(!this.verifyPassword(userName,password)){
      return {data:{result:false},error:{message:errorMsg['E_BP']}} //bad pass
    }
    else if(this.getLoggedInUsers().find((u)=>u.name===userName)){ //already logged in 
      return {data:{result:false},error:{message:errorMsg['E_AL']}}

    }
    else{
    const user=this.getUserByName(userName)
    this.loggedInUsers.concat([user]);
    return { data: { result:true } };  
  }} 


 


  logout(userName:string):BoolResponse{
    const loggedInUsers=this.getLoggedInUsers()
    if(!loggedInUsers.filter((u)=>{u.name===userName}).pop()){ //user not logged in
      return {data:{result:false},error:{message:errorMsg['E_AL']}}
    }
    else{
    this.loggedInUsers=this.loggedInUsers.filter((u)=>u.name!==userName)
    return {data:{result:true}}
    }
  }


  verifyPassword(userName:string,password: string):boolean {
    return true  //to implement with sequrity ..
  }

  vaildPassword(password: string) {
    return password.length>=4;
  }

  getLoggedInUsers(): User[] {
    return this.loggedInUsers;
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
  
    isAdmin(u:User) : boolean{
    return this.admins.filter(val=> val.name === u.name).pop() !== null
  }

  setAdmin(userName:string): BoolResponse{
    const u :User = this.getUserByName(userName);
    if(!u) return {data:{result:false} , error: {message: errorMsg['E_NF']}}
    const isAdmin:boolean = this.isAdmin(u);
    if(isAdmin) return {data:{result:false} , error: {message: errorMsg['E_AL']}}
    this.admins = this.admins.concat([u]);
    return {data:{result:true}};
  }
}

export { UserManagement };
