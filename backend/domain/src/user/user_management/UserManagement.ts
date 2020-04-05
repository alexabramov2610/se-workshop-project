import { RegisterResponse,LoginResponse  } from "../../common/Response";
import { User } from "../User";
class UserManagement {
  private users: User[];
  private LoggedInUsers:User[];
  constructor() {
    this.users = [];
  }

  register(newUser: User): RegisterResponse {
    if(this.getUserByName){    //user already in system
      return {data:{isAdded:false},error:{message:'user name is taken'}}
    }
    // else if(!vaildPassword){   TODO: implement
    //   return {data:{isAdded:false},error:{message:'invalid password'}}
    else{
    this.users.push(newUser);
    return { data: { isAdded: true } };
    }
  }

  login(u:User): LoginResponse{
    if(this.getUserByName(u.name)){ 
      return {data:{isLoggedIn:false},error:{message:'user is not exist'}}
    }
    //TODO:  check password? 
    
    this.LoggedInUsers.push(u);
    return { data: { isLoggedIn: true } };  } 

  getReigsteredUsers(): User[] {
    return this.users;
  }

  getLoggedInUsers(): User[] {
    return this.LoggedInUsers;
  }
  getUserByName(name: string): User {
    return this.users.filter((u) => u.name === name).pop();
  }
}

export { UserManagement };
