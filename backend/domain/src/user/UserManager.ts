import {UserRole} from "../common/Enums";
import { BoolResponse,errorMsg } from "../common/internal_api";
import { RegisteredUser,Admin, Buyer } from "./internal_api";
import { Logger as logger } from "../common/Logger";


class UserManager {
  private registeredUsers: RegisteredUser[];
  private loggedInUsers: RegisteredUser[];
  private admins: Admin[];

  constructor() {
    this.registeredUsers = [];
    this.loggedInUsers = [];
    this.admins = [];
  }

  register(userName,password): BoolResponse {
    logger.info(`registering new user : ${userName} ${password} `);

    if(this.getUserByName(userName)){    //user already in system
      logger.info(`fail to register ,${userName} already exist `);
      return {data:{result:false},error:{message:errorMsg['E_AT']}}
    }
     else if(!this.vaildPassword(password)){   
       return {data:{result:false},error:{message:errorMsg['E_BP']}}
     }
    else{
    this.registeredUsers.concat([new Buyer(userName,password)]);
    logger.info(`${userName} has registed to the system `);

    return { data: { result: true } };
    }}
  
   

  login(userName:string,password:string): BoolResponse{
    
    if(!(this.getUserByName(userName))){ 
      logger.info(`fail to login ,${userName} not found `);
      return {data:{result:false},error:{message:errorMsg['E_NF']}}  //not found
    }
    else if(!this.verifyPassword(userName,password)){
      logger.info(`fail to login ${userName} ,bad password `);
      return {data:{result:false},error:{message:errorMsg['E_BP']}} //bad pass
    }
    else if(this.getLoggedInUsers().find((u)=>u.name===userName)){ //already logged in 
      logger.info(`fail to login ,${userName} is allredy logged in `);
      return {data:{result:false},error:{message:errorMsg['E_AL']}}

    }
    else{
    const user=this.getUserByName(userName)
    this.loggedInUsers.concat([user]);
    return { data: { result:true } };  
  }} 


 


  logout(userName:string):BoolResponse{
    logger.info(`logging out ${userName}  `);
    const loggedInUsers=this.getLoggedInUsers()
    if(!loggedInUsers.filter( (u: RegisteredUser) => u.name === userName ).pop()){ //user not logged in
      logger.info(`logging out ${userName} fail, user is not logged in  `);

      return {data:{result:false},error:{message:errorMsg['E_AL']}}
    }
    else{
    this.loggedInUsers=this.loggedInUsers.filter((u)=>u.name!==userName)
    logger.info(`logging out ${userName} seccess `);
    return {data:{result:true}}
    }
  }


  verifyPassword(userName:string,password: string):boolean {
    return true  //to implement with sequrity ..
  }

  vaildPassword(password: string) {
    return password.length>=4;
  }

  getLoggedInUsers(): RegisteredUser[] {
    return this.loggedInUsers;
  }

  getRegisteredUsers(): RegisteredUser[] {
    return this.registeredUsers;
  }

  getUserByName(name: string): RegisteredUser {
    return this.registeredUsers.filter((u) => u.name === name).pop();
  }

  verifyOwner(user: RegisteredUser) : boolean {
    return user.getRole() === UserRole.OWNER;
  }

  verifyManager(user: RegisteredUser) : boolean {
    return user.getRole() === UserRole.MANAGER;
  }

  isLoggedIn(user: RegisteredUser) {
    return false;
  }
  
  isAdmin(u:RegisteredUser) : boolean{
    return this.admins.filter(val=> val.name === u.name).pop() !== null
  }

  setAdmin(userName:string): BoolResponse{
    const u :RegisteredUser = this.getUserByName(userName);
    if(!u) return {data:{result:false} , error: {message: errorMsg['E_NF']}}
    const isAdmin:boolean = this.isAdmin(u);
    if(isAdmin) return {data:{result:false} , error: {message: errorMsg['E_AL']}}

    u.setRole(UserRole.ADMIN);
    this.admins = this.admins.concat([u]);

    this.registeredUsers = this.registeredUsers.concat([u]);
    return {data:{result:true}};
  }
}

export { UserManager };
