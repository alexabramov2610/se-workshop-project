import { RegisterResponse,LoginResponse,LogoutResponse,errorMsg } from "../../common/internal_api";
import { User } from "../User";
class UserManagement {
  private users: User[];
  private loggedInUsers:User[];
  constructor() {
    this.users = [];
    this.loggedInUsers=[];
  }

  register(userName,password): RegisterResponse {
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
   

  login(userName:string,password:string): LoginResponse{
    
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


 


  logout(userName:string):LogoutResponse{
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


   getReigsteredUsers(): User[] {
    return this.users;
  }

   getLoggedInUsers(): User[] {
    return this.loggedInUsers;
  }
   getUserByName(name: string): User {
    return this.users.filter((u) => u.name === name).pop();
  }

  vaildPassword(password:string):boolean{  //to change later 
    return password.length>4
 }


}

export { UserManagement };
