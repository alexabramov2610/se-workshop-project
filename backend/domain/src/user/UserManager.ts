import { UserRole, ManagementPermission } from "../api-int/Enums";
import {BoolResponse, errorMsg, SetAdminRequest} from "../api-int/internal_api";
import {Admin, Buyer, RegisteredUser, StoreOwner, StoreManager} from "./internal_api";
import { logger } from "../api-int/internal_api";

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

    isOwner(user: RegisteredUser) : boolean {
        return user.getRole() === UserRole.OWNER;
    }

    isManager(user: RegisteredUser) : boolean {
        return user.getRole() === UserRole.MANAGER;
    }

    isAdmin(u:RegisteredUser) : boolean{
        return this.admins.filter(val=> val.name === u.name).pop() !== null
    }

    isLoggedIn(userToCheck: RegisteredUser) : boolean {
        for (let user of this.loggedInUsers) {
            if (userToCheck.UUID === user.UUID)
                return true;
        }
        return false;
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

    setUserRole(username: string, role: UserRole) : BoolResponse {
        const userToChange: RegisteredUser = this.getUserByName(username);
        if (userToChange) {
            let newUser: RegisteredUser;
            switch (role) {
                case UserRole.OWNER: {
                    newUser = new StoreOwner(userToChange.name, userToChange.password, userToChange.UUID);
                    break;
                }
                case UserRole.MANAGER: {
                    newUser = new StoreManager(userToChange.name, userToChange.password, userToChange.UUID);
                    break;
                }
            }

            if (newUser) {
                let newRegisteredUsers : RegisteredUser[] = this.registeredUsers.filter(user => user.UUID != userToChange.UUID);
                this.registeredUsers = newRegisteredUsers.concat([newUser]);

                if (this.isLoggedIn((userToChange))) {
                    let newRegisteredUsers : RegisteredUser[] = this.loggedInUsers.filter(user => user.UUID != userToChange.UUID);
                    this.loggedInUsers = newRegisteredUsers.concat([newUser]);
                }
                return {data : {result: true, value: newUser}};
            }
            else {
                const error: string = `failed setting user role, invalid user role: ${role}`;
                logger.warn(error);
                return {data: {result: false}, error: {message: error}};
            }

        }
        else {
            const error: string = `failed setting user role, user does not exist: ${username}`;
            logger.warn(error);
            return {data: {result: false}, error: {message: error}};
        }

    }

    assignStoreManagerBasicPermissions (username : string) : BoolResponse {
        const userToChange: RegisteredUser = this.getUserByName(username);
        let error: string = !userToChange ?  `failed assigning basic permissions, user does not exists: ${username}` :
            !(userToChange.getRole().valueOf() === UserRole.MANAGER) ? `failed assigning basic permissions, user is not manager: ${username}` : undefined;

        if (error) {
            logger.warn(error);
            return {data: {result: false}, error: {message: error}};
        }

        (<StoreManager> userToChange).addPermission(ManagementPermission.WATCH_PURCHASES_HISTORY);
        (<StoreManager> userToChange).addPermission(ManagementPermission.WATCH_USER_QUESTIONS);
        (<StoreManager> userToChange).addPermission(ManagementPermission.REPLY_USER_QUESTIONS);

        return {data: {result: true}};
    }

}

export { UserManager };
