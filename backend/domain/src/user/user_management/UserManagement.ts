import { RegisterResponse,LoginResponse,LogoutResponse  } from "../../common/Response";
import { User } from "../User";
class UserManagement {
  private users: User[];
  private LoggedInUsers:User[];
  constructor() {
    this.users = [];
    this.LoggedInUsers=[];
  }

  register(userName,password): RegisterResponse {
    if(this.getUserByName(userName)){    //user already in system
      return {data:{isAdded:false},error:{message:'user name is taken'}}
    }

     else if(!this.vaildPassword){   
       return {data:{isAdded:false},error:{message:'invalid password'}}
     }
    else{
    this.users.push(new User(userName,password));
    return { data: { isAdded: true } };
    }}
   

  login(userName:string,password:string): LoginResponse{
    if(!(this.getUserByName(userName))){ 
      return {data:{isLoggedIn:false},error:{message:'user is not exist'}}
    }
    else if(!this.vaildPassword(password)){
      return {data:{isLoggedIn:false},error:{message:'invalid password'}}

    }
    else{
    const user=this.getUserByName(userName)
    this.LoggedInUsers.push(user);
    return { data: { isLoggedIn:true } };  
  }} 


  logout(userName:string):LogoutResponse{
    this.LoggedInUsers=this.LoggedInUsers.filter((u) => u.name !== userName)
    return {data:{isLoggedout:true}}
    
  }




    


   getReigsteredUsers(): User[] {
    return this.users;
  }

   getLoggedInUsers(): User[] {
    return this.LoggedInUsers;
  }
   getUserByName(name: string): User {
    return this.users.filter((u) => u.name === name).pop();
  }

  vaildPassword(password:string):boolean{  //to change later 
    return password.length>4
 }


}

export { UserManagement };
