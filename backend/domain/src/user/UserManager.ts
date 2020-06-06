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
import * as UserMapper from './UserMapper'

const logger = loggerW(__filename)

export class UserManager {
    private loggedInUsers: Map<string, string>;                  // token -> username
    private guests: Map<string, Guest>;
    private admins: Admin[];
    private _externalSystems: ExternalSystemsManager;

    constructor(externalSystems: ExternalSystemsManager) {
        this._externalSystems = externalSystems;
        this.loggedInUsers = new Map();
        this.guests = new Map<string, Guest>();
        this.admins = [];
    }

    async register(req: Req.RegisterRequest): Promise<Res.BoolResponse> {
        const userName = req.body.username;
        const password = req.body.password;
        const hashed = this._externalSystems.securitySystem.encryptPassword(password);
        try {
            await UserModel.create({name: userName, password: hashed, cart: new Map(), receipts: [], pendingEvents: []})
            logger.debug(`${userName} has registered to the system `);
            return {data: {result: true}}
        } catch (e) {
            if (e.errors.name.kind === 'unique') {
                logger.warn(`fail to register ,${userName} already exist `);
                return {data: {result: false}, error: {message: errorMsg.E_BU}}
            }
            return {data: {result: false}, error: {message: e.errors.name}}
        }
    }

    async login(req: Req.LoginRequest): Promise<Res.BoolResponse> {
        const userName = req.body.username;
        // const user = this.getUserByName(userName)
        if (this.isLoggedIn(userName)) { // already logged in
            logger.warn(`failed to login ${userName}, user is already logged in `);
            return {data: {result: false}, error: {message: errorMsg.E_AL}}
        }
        try {
            await UserModel.findOne({name: userName}).lean();
            this.loggedInUsers.set(req.token, userName)
            this.guests.delete(req.token);
            logger.info(`login ${userName} succeed!`);
            return {data: {result: true}};
        } catch (e) {
            logger.warn(`login ${userName} failed!`);
            return {data: {result: false}, error: {message: errorMsg.E_NF}}
        }
    }

    async logout(req: Req.LogoutRequest): Promise<Res.BoolResponse> {
        logger.debug(`logging out success`);
        this.loggedInUsers.delete(req.token)
        this.guests.set(req.token, new Guest());
        return {data: {result: true}}
    }

    async getUserByName(name: string): Promise<RegisteredUser> {
        try {
            logger.debug(`trying to find user ${name} in DB`)
            const u = await UserModel.findOne({name})
                .populate('receipts')
                .populate('pendingEvents');
            const cart = await UserMapper.cartMapperFromDB(u.cart)
            return new RegisteredUser(u.name, u.password, u.pendingEvents, u.receipts, cart);
        } catch (e) {
            logger.warn(`getUserByName DB ERROR: ${e}`)
            return undefined
        }
    }

    isTokenTaken(token: string): boolean {
        if (this.guests.get(token) || this.loggedInUsers.get(token))
            return true;
        return false;
    }

    async getUserByToken(token: string): Promise<User> {
        const user: string = this.loggedInUsers.get(token)
        if (user) {
            const u: RegisteredUser = await this.getUserByName(user)
            return u;
        } else {
            return this.guests.get(token);
        }
    }

    getLoggedInUserByToken(token: string): Promise<RegisteredUser> {
        const username = this.loggedInUsers.get(token)
        if (username) {
            return this.getUserByName(username)
        } else {
            return undefined
        }

    }

    getGuestByToken(token: string): User {
        return this.guests.get(token);
    }

    getTokenOfLoggedInUser(username: string): string {
        this.loggedInUsers.forEach((user, token) => {
            if (user === username)
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
        return Array.from(this.loggedInUsers.values()).some((name) => name === userToCheck);
    }

    async setAdmin(req: Req.SetAdminRequest): Promise<Res.BoolResponse> {
        const admin: Admin = await this.getAdminByToken(req.token);
        if (this.admins.length !== 0 && (!admin)) {
            // there is already admin - only admin can assign another.
            return {data: {result: false}, error: {message: errorMsg.E_NOT_AUTHORIZED}}
        }
        const user: RegisteredUser = await this.getUserByName(req.body.newAdminUserName)
        if (!user)
            return {data: {result: false}, error: {message: errorMsg.E_NF}}
        const isAdmin: boolean = this.isAdmin(user);
        if (isAdmin)
            return {data: {result: false}, error: {message: errorMsg.E_AL}}
        this.admins = this.admins.concat([user]);
        return {data: {result: true}};
    }

    private async getAdminByToken(token: string): Promise<Admin> {
        const user: RegisteredUser = await this.getLoggedInUserByToken(token);
        return !user ? user : this.admins.find((a) => user.name === a.name)
    }

    addGuestToken(token: string): void {
        this.guests.set(token, new Guest());
    }

    isGuest(token: string): boolean {
        return this.guests.get(token) !== undefined
    }

    async saveProductToCart(user: User, storeName: string, product: IProduct, amount: number, isGuest: boolean): Promise<boolean> {
        user.saveProductToCart(storeName, product, amount);
        if (!isGuest) {
            const rUser = user as RegisteredUser;
            const cart = UserMapper.cartMapperToDB(rUser.cart);
            try {
                await UserModel.updateOne({name: rUser.name}, {cart})
                return true;
            } catch (e) {
                return false;
            }
        }
    }

    async removeProductFromCart(user: User, storeName: string, product: IProduct, amountToRemove: number, rUser: RegisteredUser): Promise<Res.BoolResponse> {
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
        if (rUser) {
            try {
                const cart = UserMapper.cartMapperToDB(rUser.cart);
                await UserModel.updateOne({name: rUser.name}, {cart})
                return {data: {result: true}}
            } catch (e) {
                logger.error(`removeProductFromCart ${e}`)
                return {data: {result: false}, error: {message: errorMsg.E_DB}}
            }
        }

    }

    async viewCart(req: Req.ViewCartReq): Promise<Res.ViewCartRes> {
        const user = await this.getUserByToken(req.token);
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

    async verifyCredentials(req: Req.VerifyCredentialsReq): Promise<Res.BoolResponse> {
        try {
            const rUser = await UserModel.findOne({name: req.body.username})
            const isValid: boolean = this.verifyPassword(req.body.username, req.body.password, rUser.password)
            return isValid ? {data: {result: true}} : {data: {result: false}, error: {message: errorMsg.E_BP}}
        } catch (e) {
            logger.error(`verifyCredentials DB ERROR: ${e}`);
            return {data: {result: false}, error: {message: errorMsg.E_NF}}  // not found
        }
    }

    verifyPassword(userName: string, password: string, hashed: string): boolean {
        return this._externalSystems.securitySystem.comparePassword(password, hashed);
    }

    isValidUserName(username: string): boolean {
        return username.length >= 2;
    }

    verifyNewCredentials(req: Req.VerifyCredentialsReq): Res.BoolResponse {
        const validName: boolean = this.isValidUserName(req.body.username)
        if (!validName)
            return {data: {result: false}, error: {message: errorMsg.E_USER_NOT_VALID}}
        const validPass: boolean = this.isValidPassword(req.body.password)
        if (!validPass)
            return {data: {result: false}, error: {message: errorMsg.E_BP}}
        return {data: {result: true}}
    }

    isValidPassword(password: string) {
        return password.length >= 6;
    }

    verifyToken(token: string): Res.BoolResponse {
        return {data: {result: this.guests.has(token) || this.loggedInUsers.has(token)}};
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