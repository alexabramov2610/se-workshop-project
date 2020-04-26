import {TradingSystemManager} from "../../../src/trading_system/TradingSystemManager";
import {Req, Res} from 'se-workshop-20-interfaces'
import {Product} from "../../../src/trading_system/internal_api";
import {ProductCategory} from "se-workshop-20-interfaces/dist/src/Enums";
import {RegisteredUser} from "../../../src/user/users/RegisteredUser";

export default {
    initSessionRegisterLogin: (tradingSystemManager: TradingSystemManager, username: string, password: string): string => {
        const token = tradingSystemManager.startNewSession();

        const regReq: Req.RegisterRequest = {body: {username, password}, token};
        expect(tradingSystemManager.register(regReq).data.result).toBeTruthy();

        const loginReq: Req.LoginRequest = {body: {username, password}, token};
        expect(tradingSystemManager.login(loginReq).data.result).toBeTruthy();

        return token;
    },

    guestLogin: (tradingSystemManager: TradingSystemManager): string => {
        return tradingSystemManager.startNewSession();
    },

    createStore(tradingSystemManager: TradingSystemManager, storeName: string, token: string): void {
        const req: Req.StoreInfoRequest = {body: {storeName}, token};
        expect(tradingSystemManager.createStore(req).data.result).toBe(true);
    },

    addNewProducts(tradingSystemManager: TradingSystemManager, storeName: string, products: Product[], token: string, expectedRes: boolean): void {
        expect(tradingSystemManager.addNewProducts({body: {storeName, products}, token}).data.result).toBe(expectedRes);
    },

    removeProducts(tradingSystemManager: TradingSystemManager, storeName: string, products: Product[], token: string): void {
        expect(tradingSystemManager.removeProducts({body: {storeName, products}, token}).data.result).toBe(true);
    },

    registerNewUser(tradingSystemManager: TradingSystemManager, user: RegisteredUser, token: string, isLoggedInNow: boolean): void {
        if (isLoggedInNow) {
            const logoutReq: Req.LogoutRequest = {body: {}, token};
            expect(tradingSystemManager.logout(logoutReq).data.result).toBe(isLoggedInNow);
        }

        const registerReq: Req.RegisterRequest = {body: {username: user.name, password: user.password}, token};
        expect(tradingSystemManager.register(registerReq).data.result).toBe(true);

    },

    loginAsExistingUser(tradingSystemManager: TradingSystemManager, user: RegisteredUser, token: string, isLoggedInNow: boolean): void {
        if (isLoggedInNow) {
            const logoutReq: Req.LogoutRequest = {body: {}, token};
            expect(tradingSystemManager.logout(logoutReq).data.result).toBe(isLoggedInNow);
        }

        const loginReq: Req.LoginRequest = {body: {username: user.name, password: user.password}, token};
        const loginRes: Res.BoolResponse = tradingSystemManager.login(loginReq);
        expect(loginRes.data.result).toBeTruthy();
    },

    makeStoreWithProduct(tradingSystemManager: TradingSystemManager, itemsNumber: number) {
        const ownerToken: string = this.initSessionRegisterLogin(tradingSystemManager, "ownername", "ownerpassword")
        const storeName: string = "store name";
        this.createStore(tradingSystemManager, storeName, ownerToken);
        const catalogNumber: number = 1;
        const products: Product[] = [new Product("bamba", 1, 20, ProductCategory.GENERAL)]
        this.addNewProducts(tradingSystemManager, storeName, products, ownerToken, true)
        tradingSystemManager.addItems({token: ownerToken, body: {storeName, items: [{catalogNumber: 1, id: 2}]}})
        return {ownerToken, storeName, products}
    }


}