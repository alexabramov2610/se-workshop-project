import {UserRole} from "../common/Enums";
import {BoolResponse, errorMsg, SetAdminRequest,UserRequest,logger, RegisterRequest,LoginRequest,LogoutRequest} from "../common/internal_api";
import {Admin, Buyer, RegisteredUser} from "./internal_api";

class UserManager {
  private registeredUsers: RegisteredUser[];
  private loggedInUsers: RegisteredUser[];
  private admins: Admin[];

  constructor() {
    this.registeredUsers = [];
    this.loggedInUsers = [];
    this.admins = [];
  }

  register(req:RegisterRequest): BoolResponse {
    const userName=req.body.username
    const password=req.body.password
    logger.info(`registering new user : ${req.body.username} `);

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
  
   

  login(req:LoginRequest): BoolResponse{
    const userName=req.body.username;
    const password=req.body.password;
    logger.info(`try to login ,${userName}  `);
    if(!(this.getUserByName(userName))){ 
      logger.warn(`fail to login ,${userName} not found `);
      return {data:{result:false},error:{message:errorMsg['E_NF']}}  //not found
    }
    else if(!this.verifyPassword(userName,password)){
      logger.warn(`fail to login ${userName} ,bad password `);
      return {data:{result:false},error:{message:errorMsg['E_BP']}} //bad pass
    }
    else if(this.getLoggedInUsers().find((u)=>u.name===userName)){ //already logged in 
      logger.warn(`fail to login ,${userName} is allredy logged in `);
      return {data:{result:false},error:{message:errorMsg['E_AL']}}

    }
    else{
    const user=this.getUserByName(userName)
    this.loggedInUsers.concat([user]);
    logger.info(`${userName} has logged in  `);
    return { data: { result:true } };  
  }} 

  logout(req:LogoutRequest):BoolResponse{
    const username=req.body.username;
    logger.info(`logging out ${username}  `);
    const loggedInUsers=this.getLoggedInUsers()
    if(!loggedInUsers.filter( (u: RegisteredUser) => u.name === username ).pop()){ //user not logged in
      logger.warn(`logging out ${username} fail, user is not logged in  `);

      return {data:{result:false},error:{message:errorMsg['E_AL']}}
    }
    else{
    this.loggedInUsers=this.loggedInUsers.filter((u)=>u.name!==username)
    logger.info(`logging out ${username} seccess `);
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

  isLoggedIn(uuid: string): boolean {
    return this.loggedInUsers.filter(u=> u.name === uuid).pop() !== null
  }
  
  isAdmin(u:RegisteredUser) : boolean{
    return this.admins.filter(val=> val.name === u.name).pop() !== null
  }

  getUserByToken(uuid: string): RegisteredUser {
    return this.registeredUsers.filter((u) => u.UUID === uuid).pop();
  }

  setAdmin(setAdminRequest: SetAdminRequest): BoolResponse{
    const admin :RegisteredUser = this.getUserByToken(setAdminRequest.token);
    if(this.admins.length !== 0 && (!admin || admin.getRole() !== UserRole.ADMIN)){
      //there is already admin - only admin can assign another.
      return {data:{result:false} , error: {message: errorMsg['E_NOT_AUTHORIZED']}}
    }
    const u :RegisteredUser = this.getUserByToken(setAdminRequest.body.newAdminUUID);
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
