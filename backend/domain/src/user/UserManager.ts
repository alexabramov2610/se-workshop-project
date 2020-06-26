import {BagItem, Cart, CartProduct, IProduct} from "se-workshop-20-interfaces/src/CommonInterface"
import {Admin, RegisteredUser} from "./internal_api";
import {User} from "./users/User";
import {Guest} from "./users/Guest";
import {Req, Res} from 'se-workshop-20-interfaces'
import {ExternalSystemsManager} from "../external_systems/ExternalSystemsManager";
import {errorMsg, loggerW} from "../api-int/internal_api";
import {AdminModel, UserModel} from 'dal'
import * as UserMapper from './UserMapper'
import {createAdmin, createGuest, createRegisteredUser} from "../api-int/utils";

const logger = loggerW(__filename)

export class UserManager {
    private readonly DEFAULT_USER_POPULATION: string[] = ["receipts", "pendingEvents"];
    private loggedInUsers: Map<string, string>;                  // token -> username
    private guests: Map<string, Guest>;
    private _admins: Map<string, string>;
    private _externalSystems: ExternalSystemsManager;
    private _usersCache: Map<string, any>;
    private MAX_CACHE_SIZE = 50;

    constructor(externalSystems: ExternalSystemsManager) {
        this._externalSystems = externalSystems;
        this.loggedInUsers = new Map();
        this.guests = new Map<string, Guest>();
        this._admins = new Map();
        this._usersCache = new Map();
    }

    get admins(): Map<string, string> {
        return this._admins;
    }

    async register(req: Req.RegisterRequest): Promise<Res.BoolResponse> {
        const userName = req.body.username;
        const password = req.body.password;
        const hashed = await this._externalSystems.securitySystem.encryptPassword(password);
        try {
            const newUser = await UserModel.create({
                name: userName,
                password: hashed,
                cart: new Map(),
                receipts: [],
                pendingEvents: []
            })
            this.pushToUserCache(userName, newUser);

            logger.debug(`${userName} has registered to the system `);
            return {data: {result: true}}
        } catch (e) {
            if (e.errors && e.errors.name && e.errors.name.kind && e.errors.name.kind === 'unique') {
                logger.warn(`fail to register ,${userName} already exist `);
                return {data: {result: false}, error: {message: errorMsg.E_BU}}
            }
            return {data: {result: false}, error: {message: e.errors.name}}
        }
    }

    async login(req: Req.LoginRequest): Promise<Res.BoolResponse> {     // at this point credentials are already verified
        const userName = req.body.username;
        // const user = this.getUserByName(userName)
        if (this.isLoggedIn(userName)) { // already logged in
            logger.warn(`failed to login ${userName}, user is already logged in `);
            return {data: {result: false}, error: {message: errorMsg.E_AL}}
        }
        try {
            // await UserModel.findOne({name: userName});
            const rUser = await UserModel.findOne({name: req.body.username})
            if (req.body.asAdmin) {
                const isAdmin: boolean = await this.verifyAdminLogin(rUser);
                if (isAdmin)
                    this._admins.set(req.token, userName);
                else
                    return {data: {result: false}, error: {message: errorMsg.E_NA}}
            }
            this.loggedInUsers.set(req.token, userName)
            this.guests.delete(req.token);
            logger.info(`login ${userName} ${req.body.asAdmin ? 'as admin ' : ''}succeed!`);
            return {data: {result: true}};
        } catch (e) {
            logger.error(`login ${userName} failed!`);
            return {data: {result: false}, error: {message: errorMsg.E_NF}}
        }
    }

    async verifyAdminLogin(rUserModel): Promise<boolean> {
        try {
            const admin = await AdminModel.findOne({user: rUserModel._id});
            return admin ? true : false;
        } catch (e) {
            logger.error(`verifyAdminLogin DB ERROR: ${e}`)
        }
        return false;
    }

    async logout(req: Req.LogoutRequest): Promise<Res.BoolResponse> {
        logger.debug(`logging out success`);
        if (!this.loggedInUsers.has(req.token)) {
            logger.warn("user is not logged in!")
            return {data: {result: false}, error: {message: errorMsg.E_NOT_LOGGED_IN}}
        }
        this.loggedInUsers.delete(req.token)
        if (this._admins.has(req.token))
            this._admins.delete(req.token)
        this.guests.set(req.token, createGuest());
        return {data: {result: true}}
    }

    async getUserByName(name: string, populateWith = this.DEFAULT_USER_POPULATION): Promise<RegisteredUser> {
        try {
            const fromCache = this._usersCache.get(name)
            if (fromCache) {
                const cart = await UserMapper.cartMapperFromDB(fromCache.cart)
                return createRegisteredUser(fromCache.name, fromCache.password, fromCache.pendingEvents, fromCache.receipts, cart);
            }

            logger.debug(`trying to find user ${name} in DB`)
            const populateQuery = populateWith.map(field => {
                return {path: field}
            });
            const u = await UserModel.findOne({name}).populate(populateQuery);
            if (!u)
                return u;
            const cart = await UserMapper.cartMapperFromDB(u.cart)
            return createRegisteredUser(u.name, u.password, u.pendingEvents, u.receipts, cart);
        } catch (e) {
            logger.error(`getUserByName DB ERROR: ${e}`)
            return undefined
        }
    }

    async getUserModelByName(name: string, populateWith = this.DEFAULT_USER_POPULATION): Promise<any> {
        try {
            const fromCache = this._usersCache.get(name)
            if (fromCache) {
                return fromCache
            }
            logger.debug(`trying to find user ${name} in DB`)
            const populateQuery = populateWith.map(field => {
                return {path: field}
            });
            const u = await UserModel.findOne({name}).populate(populateQuery);
            return u;
        } catch (e) {
            logger.error(`getUserModelByName DB ERROR: ${e}`)
            return undefined
        }
    }

    async saveNotification(username: string, event): Promise<void> {
        const u = await this.getUserModelByName(username);
        try {
            u.pendingEvents.push(event);
            if (u) {
                await u.save();
                logger.debug(`saveNotification: successfully save event to user: ${username} in DB`)
            } else
                logger.error(`saveNotification: ${errorMsg.E_USER_DOES_NOT_EXIST}`)
        } catch (e) {
            logger.error(`saveNotification DB ERROR: ${e}`)
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

    getLoggedInUserByToken(token: string, populateWith = this.DEFAULT_USER_POPULATION): Promise<RegisteredUser> {
        const username = this.loggedInUsers.get(token)
        if (username) {
            return this.getUserByName(username, populateWith)
        } else {
            return undefined
        }
    }

    getLoggedInUsernameByToken(token: string): string {
        return this.loggedInUsers.get(token)
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

    checkIsAdminByToken(token: string): boolean {
        return this._admins.has(token);
    }

    isLoggedIn(userToCheck: string): boolean {
        return Array.from(this.loggedInUsers.values()).some((name) => name === userToCheck);
    }

    async findUserModelByName(name: string, populateWith = this.DEFAULT_USER_POPULATION): Promise<any> {
        try {
            const fromCache = this._usersCache.get(name)
            if (fromCache) {
                return fromCache
            }
            const populateQuery = populateWith.map(field => {
                return {path: field}
            });
            const s = await UserModel.findOne({name}).populate(populateQuery);
            return s;
        } catch (e) {
            logger.error(`findUserModelByName DB ERROR: ${e}`);
            return undefined
        }
        return undefined;
    }

    async setAdmin(req: Req.SetAdminRequest): Promise<Res.BoolResponse> {
        const admin: Admin = await this.getAdminByToken(req.token);
        if (this._admins.size !== 0 && (!admin)) {
            // there is already admin - only admin can assign another.
            return {data: {result: false}, error: {message: errorMsg.E_NOT_AUTHORIZED}}
        }
        try {
            const userModel = await this.findUserModelByName(req.body.newAdminUserName);
            if (!userModel)
                return {data: {result: false}, error: {message: errorMsg.E_NF}}
            const isAdmin: boolean = await this.verifyAdminLogin(userModel);
            if (isAdmin)
                return {data: {result: false}, error: {message: errorMsg.E_AL}}
            await AdminModel.create({user: userModel})
        } catch (e) {
            logger.error(`setAdmin DB ERROR: ${e}`)
        }

        return {data: {result: true}};
    }


    private async getAdminByName(name: string, populateWith = this.DEFAULT_USER_POPULATION): Promise<Admin> {
        try {
            logger.debug(`trying to find user ${name} in DB`)
            const u = await AdminModel.findOne({name}).populate('user')
            if (!u)
                return undefined;
            const cart = await UserMapper.cartMapperFromDB(u.cart)
            return createAdmin(u.name, u.password, u.receipts, u.cart, u.pendingEvents)
        } catch (e) {
            logger.error(`getAdminByName DB ERROR: ${e}`)
            return undefined
        }
    }

    private async getAdminByToken(token: string): Promise<Admin> {
        const user: RegisteredUser = await this.getLoggedInUserByToken(token);
        return !user ? user : this.getAdminByName(user.name)
    }

    addGuestToken(token: string): void {
        this.guests.set(token, createGuest());
    }

    isGuest(token: string): boolean {
        return this.guests.get(token) !== undefined
    }

    async saveProductToCart(user: User, storeName: string, product: IProduct, amount: number, isGuest: boolean): Promise<boolean> {
        this.saveProductToUserCart(storeName, product, amount, user);
        if (!isGuest) {
            const rUser = user as RegisteredUser;
            const cart = UserMapper.cartMapperToDB(rUser.cart);
            try {
               await this.updateUserModel(rUser.name, {cart})
                return true;
            } catch (e) {
                return false;
            }
        }
    }

    saveProductToUserCart(storeName: string, product: IProduct, amount: number, user: User): void {
        logger.debug(`saving ${amount} of product ${product.name} to cart`)
        const storeBag: BagItem[] = user.cart.get(storeName);
        if (!storeBag) {
            logger.debug(`new bag for store ${storeName}`)
            const newBag: BagItem = {product, amount};
            user.cart.set(storeName, [newBag]);
            return
        }
        logger.debug(`add bag item to existing bag in store ${storeName}`)
        const oldBagItem = storeBag.find((b) => b.product.catalogNumber === product.catalogNumber)
        const newBagItem = oldBagItem ? {product, amount: oldBagItem.amount + amount} : {product, amount}
        const newStoreBag = storeBag.filter((b) => b.product.catalogNumber !== product.catalogNumber).concat([newBagItem]);
        user.cart.set(storeName, newStoreBag);
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
        this.removeProductFromUserCart(storeName, product, amountToRemove, user)
        if (rUser) {
            try {
                const cart = UserMapper.cartMapperToDB(rUser.cart);
                await  this.updateUserModel(rUser.name, {cart})
                return {data: {result: true}}
            } catch (e) {
                logger.error(`removeProductFromCart ${e}`)
                return {data: {result: false}, error: {message: errorMsg.E_DB}}
            }
        } else // guest
            return {data: {result: true}};

    }

    removeProductFromUserCart(storeName: string, product: IProduct, amount: number, user: User): void {
        const storeCart: BagItem[] = user.cart.get(storeName);
        const oldBagItem: BagItem = storeCart.find((b) => b.product.catalogNumber === product.catalogNumber);
        const newBagItem = {product: oldBagItem.product, amount: oldBagItem.amount - amount}

        const filteredBag = storeCart.filter((b) => b.product.catalogNumber !== product.catalogNumber)
        if (newBagItem.amount > 0) {
            user.cart.set(storeName, filteredBag.concat([newBagItem]))
        } else {
            user.cart.set(storeName, filteredBag)
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

                    return {
                        date: r.date,
                        purchases: Array.from(r.purchases),
                        payment: {
                            // @ts-ignore
                            lastCC4: r.lastCC4 ? r.lastCC4 : r.payment.lastCC4,
                            // @ts-ignore
                            totalCharged: r.totalCharged ? r.totalCharged : r.payment.totalCharged,
                            // @ts-ignore
                            transactionID: r.transactionID ? r.transactionID : r.payment.transactionID
                        }
                    }
                })
            }
        }
    }

    getUserCart(user: User) {
        return user.cart;
    }

    resetUserCart(user: User) {
        user.cart = new Map();
    }

    async verifyCredentials(req: Req.VerifyCredentialsReq): Promise<Res.BoolResponse> {
        try {
            const rUser = await UserModel.findOne({name: req.body.username})
            if(!rUser)
                return {data: {result: false}, error: {message: errorMsg.E_NF}}
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

    async getAllUsers(req: Req.Request): Promise<Res.GetAllUsersResponse> {
        if (!this.checkIsAdminByToken(req.token))
            return {data: {result: false, users: []}, error: {message: errorMsg.E_NOT_AUTHORIZED}}
        try {
            const adminName: string = this.getLoggedInUsernameByToken(req.token);
            logger.debug(`trying to retrieve all users for admin: ${adminName} from DB`)
            const u = await UserModel.find({})
            if (!u)
                throw new Error(`retrieved undefined from DB`)
            return {data: {result: true, users: u.map(currUser => currUser.name)}}
        } catch (e) {
            logger.error(`getAllUsers DB ERROR: ${e}`)
            return {data: {result: false, users: []}, error: {message: e}}
        }
    }

    async updateUserModel(name: string, fields: any): Promise<boolean> {
        try {
            const populateQuery = this.DEFAULT_USER_POPULATION.map(field => {
                return {path: field}
            });
            const u = await UserModel.findOneAndUpdate({name}, fields, {new: true}).populate(populateQuery)
            this.pushToUserCache(name, u)
            return true;
        } catch (e) {
            logger.error(`updateUserModel DB ERROR cant ${e}`)
            return false;
        }
    }

    pushToUserCache(userName: any, newUser: any) {
        if (this._usersCache.has(userName))
            this._usersCache.delete(userName);
        else if (this._usersCache.size === this.MAX_CACHE_SIZE)
            this._usersCache.delete(this._usersCache.keys().next().value);
        this._usersCache.set(userName, newUser)
    }
}