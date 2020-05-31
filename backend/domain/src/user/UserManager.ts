import {UserRole} from "../api-int/Enums";
import {
    IProduct,
    BagItem,
    Cart,
    CartProduct
} from "se-workshop-20-interfaces/src/CommonInterface"
import {Admin, RegisteredUser} from "./internal_api";
import {User} from "./users/User";
import {Guest} from "./users/Guest";
import {Req, Res} from 'se-workshop-20-interfaces'
import {ExternalSystemsManager} from "../external_systems/ExternalSystemsManager";
import {errorMsg, loggerW} from "../api-int/internal_api";
import {UserModel} from 'dal'
import {BoolResponse} from "se-workshop-20-interfaces/dist/src/Response";
import {LogoutRequest, RegisterRequest} from "se-workshop-20-interfaces/dist/src/Request";

const logger = loggerW(__filename)

export class UserManager {
    private registeredUsers: RegisteredUser[];
    private loggedInUsers: Map<string, RegisteredUser>;                  // token -> user
    private loggedInRegisteredUsers: Map<string, RegisteredUser>;        // username -> user
    private guests: Map<string, Guest>;
    private admins: Admin[];
    private _externalSystems: ExternalSystemsManager;

    constructor(externalSystems: ExternalSystemsManager) {
        this._externalSystems = externalSystems;
        this.registeredUsers = [];
        this.loggedInUsers = new Map<string, RegisteredUser>();
        this.loggedInRegisteredUsers = new Map<string, RegisteredUser>();
        this.guests = new Map<string, Guest>();
        this.admins = [];
    }
/*
    async register(req: Req.RegisterRequest): Promise<Res.BoolResponse> {
        const userName = req.body.username;
        const password = req.body.password;
        const hashed = this._externalSystems.securitySystem.encryptPassword(password);
        if (this.getUserByName(userName)) {
            logger.debug(`fail to register ,${userName} already exist `);
            return {data: {result: false}, error: {message: errorMsg.E_BU}}
        } else {
            // this.registeredUsers = this.registeredUsers.concat([new RegisteredUser(userName, hashed)]);
            const newUser = new UserModel({cart: new Map(), name: userName, password: hashed, loggedIn: false})
            try{
                const u = await newUser.save()
                logger.debug(`${userName} has registered to the system `);
                return new Promise((resolve,reject)=> resolve({data: {result:true}}))
            }
            catch (e) {
                logger.info(`fail to register ,${userName} already exist `);
                if(e.errors.name.kind === 'unique')
                    return new Promise((resolve,reject)=> resolve({data: {result:false}, error: {message: errorMsg.E_BU}}))
            }

        }
    }
    */

    /*
        login(req: Req.LoginRequest): Res.BoolResponse {
            const userName = req.body.username;
            // const user = this.getUserByName(userName)
            const u = UserModel.findOne({name: userName}, (err, registeredUser) => {
                if (err)
                    return {data: {result: false}, error: {message: errorMsg.E_AL}}
                registeredUser.loggedIn = true;
                registeredUser.save();
            });
            return {data: {result: true}};
            /*
            if (this.isLoggedIn(userName)) { // already logged in
                logger.warn(`failed to login ${userName}, user is already logged in `);
                return {data: {result: false}, error: {message: errorMsg.E_AL}}
            } else if (req.body.asAdmin && !this.isAdmin(user)) {
                logger.warn(`failed to login ${userName} as Admin- this user doesn't have admin privileges `);
                return {data: {result: false}, error: {message: errorMsg.E_NA}}
            } else {
                logger.info(`${userName} has logged in  `);
                this.loggedInUsers = this.loggedInUsers.set(req.token, user);
                this.loggedInRegisteredUsers = this.loggedInRegisteredUsers.set(req.body.username, user);
                user.role = req.body.asAdmin ? UserRole.ADMIN : UserRole.BUYER;
                return {data: {result: true}};
            }


        }
    */


    async register(req: Req.RegisterRequest): Promise<Res.BoolResponse> {
        const userName = req.body.username;
        const password = req.body.password;
        const hashed = this._externalSystems.securitySystem.encryptPassword(password);
        if (this.getUserByName(userName)) {
            logger.debug(`fail to register ,${userName} already exist `);
            return  {data: {result: false}, error: {message: errorMsg.E_BU}}
        } else {
            logger.debug(`${userName} has registered to the system `);
            this.registeredUsers = this.registeredUsers.concat([new RegisteredUser(userName, hashed)]);
            return {data: {result: true}}
        }
    }
    async login(req: Req.LoginRequest): Promise<Res.BoolResponse> {
        const userName = req.body.username;
        const user = this.getUserByName(userName)
        if (this.isLoggedIn(userName)) { // already logged in
            logger.warn(`failed to login ${userName}, user is already logged in `);
            return {data: {result: false}, error: {message: errorMsg.E_AL}}
        } else if (req.body.asAdmin && !this.isAdmin(user)) {
            logger.warn(`failed to login ${userName} as Admin- this user doesn't have admin privileges `);
            return {data: {result: false}, error: {message: errorMsg.E_NA}}
        } else {
            logger.info(`${userName} has logged in  `);
            this.loggedInUsers = this.loggedInUsers.set(req.token, user);
            this.loggedInRegisteredUsers = this.loggedInRegisteredUsers.set(req.body.username, user);
            user.role = req.body.asAdmin ? UserRole.ADMIN : UserRole.BUYER;
            return {data: {result: true}}
        }
    }
   async logout(req: Req.LogoutRequest): Promise<Res.BoolResponse> {
        logger.debug(`logging out success`);
        if (this.getLoggedInUserByToken(req.token) && this.loggedInRegisteredUsers.has(this.getLoggedInUserByToken(req.token).name))
            this.loggedInRegisteredUsers.delete(this.getLoggedInUserByToken(req.token).name);
        this.loggedInUsers.delete(req.token)
        return {data: {result: true}}
    }

    verifyPassword(userName: string, password: string, hashed: string): boolean {
        return this._externalSystems.securitySystem.comparePassword(password, hashed);
    }

    isValidPassword(password: string) {
        return password.length >= 6;
    }

    getLoggedInUsers(): RegisteredUser[] {
        return Array.from(this.loggedInUsers.values());
    }

    getRegisteredUsers(): RegisteredUser[] {
        return this.registeredUsers;
    }

    getUserByName(name: string): RegisteredUser {
        return this.registeredUsers.filter((u) => u.name === name).pop();
    }

    getLoggedInUserByName(name: string): RegisteredUser {
        return this.loggedInRegisteredUsers.get(name);
    }

    getUserByToken(token: string): User {
        const user: User = this.loggedInUsers.get(token);
        return user ? user :
            this.guests.get(token);
    }

    getLoggedInUserByToken(token: string): RegisteredUser {
        return this.loggedInUsers.get(token);
    }

    getTokenOfLoggedInUser(username: string): string {
        this.loggedInUsers.forEach((user, token) => {
            if (user.name === username)
                return token;
        });
        return "";
    }

    isAdmin(u: RegisteredUser): boolean {
        for (const user of this.admins) {
            if (u.name === user.name)
                return true;
        }
        return false;
    }

    isLoggedIn(userToCheck: string): boolean {
        for (const user of this.loggedInUsers.values()) {
            if (userToCheck === user.name)
                return true;
        }
        return false;
    }

    setAdmin(req: Req.SetAdminRequest): Res.BoolResponse {
        const admin: Admin = this.getAdminByToken(req.token);
        if (this.admins.length !== 0 && (!admin)) {
            // there is already admin - only admin can assign another.
            return {data: {result: false}, error: {message: errorMsg.E_NOT_AUTHORIZED}}
        }
        const user: RegisteredUser = this.getUserByName(req.body.newAdminUserName)
        if (!user)
            return {data: {result: false}, error: {message: errorMsg.E_NF}}
        const isAdmin: boolean = this.isAdmin(user);
        if (isAdmin)
            return {data: {result: false}, error: {message: errorMsg.E_AL}}
        this.admins = this.admins.concat([user]);
        return {data: {result: true}};
    }

    addGuestToken(token: string): void {
        this.guests.set(token, new Guest());
    }

    removeGuest(token: string): void {
        this.guests.delete(token);
    }

    saveProductToCart(user: User, storeName: string, product: IProduct, amount: number): void {
        user.saveProductToCart(storeName, product, amount);
    }

    async removeProductFromCart(user: User, storeName: string, product: IProduct, amountToRemove: number): Promise<Res.BoolResponse> {
        const storeBag: BagItem[] = user.cart.get(storeName);
        if (!storeBag) {
            return {data: {result: false}, error: {message: errorMsg.E_BAG_NOT_EXIST}}
        }
        const oldBagItem = storeBag.find((b) => b.product.catalogNumber === product.catalogNumber);
        if (!oldBagItem) {
            return {data: {result: false}, error: {message: errorMsg.E_ITEM_NOT_EXISTS}}
        }
        if (oldBagItem.amount - amountToRemove < 0) {
            return {data: {result: false}, error: {message: errorMsg.E_BAG_BAD_AMOUNT}}
        }
        user.removeProductFromCart(storeName, product, amountToRemove)
        return {
            data: {result: true}
        }
    }

    async viewCart(req: Req.ViewCartReq): Promise<Res.ViewCartRes> {
        const user = this.getUserByToken(req.token);
        if (!user)
            return {data: {result: false, cart: undefined}, error: {message: errorMsg.E_USER_DOES_NOT_EXIST}};
        const cartRes: Cart = this.transferToCartRes(user.cart)
        return {data: {result: true, cart: cartRes}}
    }

    async viewRegisteredUserPurchasesHistory(user: RegisteredUser): Promise<Res.ViewRUserPurchasesHistoryRes> {
        return {
            data: {
                result: true, receipts: user.receipts.map(r => {
                    return {date: r.date, purchases: r.purchases}
                })
            }
        }
    }

    getUserCart(user: User) {
        return user.cart;
    }

    verifyCredentials(req: Req.VerifyCredentialsReq): Res.BoolResponse {
        const rUser: RegisteredUser = this.getUserByName(req.body.username)
        if (!rUser)
            return {data: {result: false}, error: {message: errorMsg.E_NF}}  // not found
        const isValid: boolean = this.verifyPassword(req.body.username, req.body.password, rUser.password)
        return isValid ? {data: {result: true}} : {data: {result: false}, error: {message: errorMsg.E_BP}}
    }

    isValidUserName(username: string): boolean {
        return this.getUserByName(username) === undefined && username.length >= 2;
    }

    verifyNewCredentials(req: Req.VerifyCredentialsReq): Res.BoolResponse {
        const validName: boolean = this.isValidUserName(req.body.username)
        if (!validName)
            return {data: {result: false}, error: {message: errorMsg.E_USER_EXISTS}}
        const validPass: boolean = this.isValidPassword(req.body.password)
        if (!validPass)
            return {data: {result: false}, error: {message: errorMsg.E_BP}}
        return {data: {result: true}}
    }

    verifyToken(token: string): Res.BoolResponse {
        return {data: {result: this.guests.has(token) || this.loggedInUsers.has(token)}};
    }

    private getAdminByToken(token: string): Admin {
        const user: RegisteredUser = this.getLoggedInUserByToken(token);
        return !user ? user : this.admins.find((a) => user.name === a.name)
    }

    private transferToCartRes(cart: Map<string, BagItem[]>): Cart {
        const cartProducts: CartProduct[] = [];
        for (const [storeName, bagItems] of cart) {
            cartProducts.push({storeName, bagItems})
        }
        const cartRes: Cart = {products: cartProducts}
        return cartRes
    }

}