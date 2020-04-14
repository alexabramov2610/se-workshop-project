import {UserRole} from "../common/Enums";
import { BoolResponse,errorMsg,UserRequest } from "../common/internal_api";
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

  register(req:UserRequest): BoolResponse {
    const userName=req.body.username
    const password=req.body.password
    logger.info(`registering new user : ${req.body.uuid} `);

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
  
   

  login(req:UserRequest): BoolResponse{
    const userName=req.body.username;
    const password=req.body.password;
    const uuid=req.body.uuid;
    logger.info(`try to login ,${uuid}  `);
    if(!(this.getUserByName(uuid))){ 
      logger.warn(`fail to login ,${uuid} not found `);
      return {data:{result:false},error:{message:errorMsg['E_NF']}}  //not found
    }
    else if(!this.verifyPassword(userName,password)){
      logger.warn(`fail to login ${uuid} ,bad password `);
      return {data:{result:false},error:{message:errorMsg['E_BP']}} //bad pass
    }
    else if(this.getLoggedInUsers().find((u)=>u.name===userName)){ //already logged in 
      logger.warn(`fail to login ,${uuid} is allredy logged in `);
      return {data:{result:false},error:{message:errorMsg['E_AL']}}

    }
    else{
    const user=this.getUserByName(userName)
    this.loggedInUsers.concat([user]);
    logger.info(`${uuid} has logged in  `);
    return { data: { result:true } };  
  }} 


 


  logout(req:UserRequest):BoolResponse{
    const userName=req.body.username;
    const password=req.body.password;
    const uuid=req.body.uuid;
    logger.info(`logging out ${uuid}  `);
    const loggedInUsers=this.getLoggedInUsers()
    if(!loggedInUsers.filter( (u: RegisteredUser) => u.name === userName ).pop()){ //user not logged in
      logger.warn(`logging out ${uuid} fail, user is not logged in  `);

      return {data:{result:false},error:{message:errorMsg['E_AL']}}
    }
    else{
    this.loggedInUsers=this.loggedInUsers.filter((u)=>u.name!==userName)
    logger.info(`logging out ${uuid} seccess `);
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
