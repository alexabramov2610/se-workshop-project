import {UserRole} from "../api-int/Enums";
import {
    LoginRequest,
    LogoutRequest,
    Product,
    RegisterRequest,
    BagItem,
    Cart,
    CartProduct
} from "../api-ext/external_api"
import {Admin, RegisteredUser, StoreManager, StoreOwner} from "./internal_api";
import {User} from "./users/User";
import {Guest} from "./users/Guest";
import * as Req from "../api-ext/Request";
import * as Res from "../api-ext/Response";
import {ExternalSystemsManager} from "../external_systems/ExternalSystemsManager";
import {BoolResponse, errorMsg, loggerW, SetAdminRequest} from "../api-int/internal_api";

const logger = loggerW(__filename)

export class UserManager {
    private registeredUsers: RegisteredUser[];
    private loggedInUsers: Map<string, RegisteredUser>;
    private guests: Map<string, Guest>;
    private admins: Admin[];
    private _externalSystems: ExternalSystemsManager;

    constructor(externalSystems: ExternalSystemsManager) {
        this._externalSystems = externalSystems;
        this.registeredUsers = [];
        this.loggedInUsers = new Map<string, RegisteredUser>();
        this.guests = new Map<string, Guest>();
        this.admins = [];
    }

    register(req: RegisterRequest): BoolResponse {
        const userName = req.body.username;
        const password = req.body.password;
        const hashed = this._externalSystems.securitySystem.encryptPassword(password);
        if (this.getUserByName(userName)) {
            logger.debug(`fail to register ,${userName} already exist `);
            return {data: {result: false}, error: {message: errorMsg.E_BU}}
        } else if (!this.isValidPassword(password)) {
            return {data: {result: false}, error: {message: errorMsg.E_BP}}
        } else {
            logger.debug(`${userName} has registered to the system `);
            this.registeredUsers = this.registeredUsers.concat([new RegisteredUser(userName, hashed)]);
            return {data: {result: true}};
        }
    }

    login(req: LoginRequest): BoolResponse {
        const userName = req.body.username;
        const password = req.body.password;
        const user = this.getUserByName(userName)
        if (!user) {
            logger.warn(`failed to login ${userName}, user not found `);
            return {data: {result: false}, error: {message: errorMsg.E_NF}}  // not found
        } else if (!this.verifyPassword(userName, password, user.password)) {
            logger.warn(`failed to login ${userName}, bad password `);
            return {data: {result: false}, error: {message: errorMsg.E_BP}} // bad pass
        } else if (this.isLoggedIn(userName)) { // already logged in
            logger.warn(`failed to login ${userName}, user is already logged in `);
            return {data: {result: false}, error: {message: errorMsg.E_AL}}
        } else if (req.body.asAdmin && !this.isAdmin(user)) {
            logger.warn(`failed to login ${userName} as Admin- this user doesn't have admin privileges `);
            return {data: {result: false}, error: {message: errorMsg.E_NA}}
        } else {
            logger.info(`${userName} has logged in  `);
            this.loggedInUsers = this.loggedInUsers.set(req.token, user);
            user.role = req.body.asAdmin ? UserRole.ADMIN : UserRole.BUYER;
            return {data: {result: true}};
        }
    }

    logout(req: LogoutRequest): BoolResponse {
        const user: RegisteredUser = this.getLoggedInUserByToken(req.token);
        if (!user) { // user not logged in
            logger.warn(`logging out fail, user is not logged in  `);
            return {data: {result: false}, error: {message: errorMsg.E_NOT_AUTHORIZED}}
        } else {
            logger.debug(`logging out ${user.name} success`);
            this.loggedInUsers.delete(req.token)
            return {data: {result: true}}
        }
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

    getUserByToken(token: string): User {
        const user: User = this.loggedInUsers.get(token);
        return user ? user :
            this.guests.get(token);
    }

    getLoggedInUserByToken(token: string): RegisteredUser {
        return this.loggedInUsers.get(token);
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

    setAdmin(req: SetAdminRequest): BoolResponse {
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

    private getAdminByToken(token: string): Admin {
        const user: RegisteredUser = this.getLoggedInUserByToken(token);
        return !user ? user : this.admins.find((a) => user.name === a.name)
    }

    saveProductToCart(user: User, storeName: string, product: Product, amount: number): void {
        user.saveProductToCart(storeName, product, amount);
    }

    removeProductFromCart(user: User, storeName: string, product: Product, amountToRemove: number): BoolResponse {
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

    viewCart(req: Req.ViewCartReq): Res.ViewCartRes {
        const user = this.getUserByToken(req.token)

        if (!user) {
            return {data: {result: false, cart: undefined}, error: {message: errorMsg.E_NOT_AUTHORIZED}}
        }

        const cartRes: Cart = this.transferToCartRes(user.cart)
        return {data: {result: true, cart: cartRes}}
    }

    private transferToCartRes(cart: Map<string, BagItem[]>): Cart {
        const cartProducts: CartProduct[] = [];
        for (const [storeName, bagItems] of cart) {
            cartProducts.push({storeName, bagItems})
        }
        const cartRes: Cart = {products: cartProducts}
        return cartRes
    }

    viewRegisteredUserPurchasesHistory(user: RegisteredUser): Res.ViewRUserPurchasesHistoryRes {
        return {data: {result: true, receipts: user.receipts.map(r=>{return {date: r.date,purchases:r.purchases}})}}
    }

    getUserCart(user: User) {
        return user.cart;

    }

}