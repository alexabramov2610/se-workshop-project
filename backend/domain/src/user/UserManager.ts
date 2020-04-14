import {UserRole} from "../api-int/Enums";
import {BoolResponse, errorMsg, SetAdminRequest} from "../api-int/internal_api";
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

    register(userName,password): BoolResponse {
        if(this.getUserByName(userName)){    //user already in system
            return {data:{result:false},error:{message:errorMsg['E_AT']}}
        }
        else if(!this.vaildPassword(password)){
            return {data:{result:false},error:{message:errorMsg['E_BP']}}
        }
        else{
            this.registeredUsers.concat([new Buyer(userName,password)]);
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
        if(!loggedInUsers.filter( (u: RegisteredUser) => u.name === userName ).pop()){ //user not logged in
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

    getLoggedInUsers(): RegisteredUser[] {
        return this.loggedInUsers;
    }

    getRegisteredUsers(): RegisteredUser[] {
        return this.registeredUsers;
    }

    getUserByName(name: string): RegisteredUser {
        return this.registeredUsers.filter((u) => u.name === name).pop();
    }

    getUserByToken(token: string): RegisteredUser {
        return this.registeredUsers.filter((u) => u.UUID === token).pop();
    }

    verifyUser(username: string, loggedInCheck: boolean) : BoolResponse {
        const user: RegisteredUser = this.getUserByName(username);
        if (loggedInCheck) {
            return user && this.isLoggedIn(user) ? {data: {result: true}} :
                !user ? {data: {result: false}, error: {message: errorMsg['E_USER_DOES_NOT_EXIST'] }} :
                    {data: {result: false}, error: {message: errorMsg['E_NOT_LOGGED_IN'] }};
        }
        else {
            return !user ? {data: {result: false}, error: {message: errorMsg['E_USER_DOES_NOT_EXIST'] }} :
                    {data: {result: true} };
        }
    }

    verifyOwner(user: RegisteredUser) : boolean {
        return user.getRole() === UserRole.OWNER;
    }

    verifyManager(user: RegisteredUser) : boolean {
        return user.getRole() === UserRole.MANAGER;
    }

    isLoggedIn(userToCheck: RegisteredUser) : boolean {
        for (let user of this.loggedInUsers) {
            if (userToCheck.UUID === user.UUID)
                return true;
        }
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
