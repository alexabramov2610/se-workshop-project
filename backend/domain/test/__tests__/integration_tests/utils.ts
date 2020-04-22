import {TradingSystemManager} from "../../../src/trading_system/TradingSystemManager";
import * as Req from "../../../src/api-ext/Request";
import * as Res from "../../../src/api-ext/Response";
import {Product} from "../../../src/trading_system/internal_api";
import {ProductCategory} from "../../../src/api-ext/Enums";
import {RegisteredUser} from "../../../src/user/users/RegisteredUser";

export default {
    initSessionRegisterLogin: (tradingSystemManager: TradingSystemManager, username: string, password: string): string => {
        const token = tradingSystemManager.startNewSession();

        const regReq: Req.RegisterRequest = {body: {username: username, password: password}, token: token};
        expect(tradingSystemManager.register(regReq).data.result).toBeTruthy();

        const loginReq: Req.LoginRequest = {body: {username: username, password: password}, token: token};
        expect(tradingSystemManager.login(loginReq).data.result).toBeTruthy();

        return token;
    },

    guestLogin: (tradingSystemManager: TradingSystemManager): string => {
        return tradingSystemManager.startNewSession();
    },

    createStore(tradingSystemManager: TradingSystemManager, storeName: string, token:string): void{
        const req: Req.StoreInfoRequest = {body: {storeName}, token};
        expect(tradingSystemManager.createStore(req).data.result).toBe(true);
    },

    addNewProducts(tradingSystemManager: TradingSystemManager, storeName: string, products: Product[], token:string, expectedRes: boolean): void{
        expect(tradingSystemManager.addNewProducts({body: {storeName, products}, token}).data.result).toBe(expectedRes);
    },

    removeProducts(tradingSystemManager: TradingSystemManager, storeName: string, products: Product[], token:string): void{
        expect(tradingSystemManager.removeProducts({body: {storeName, products}, token}).data.result).toBe(true);
    },

    registerNewUser(tradingSystemManager: TradingSystemManager, user: RegisteredUser, token:string, isLoggedInNow: boolean): void {
        if (isLoggedInNow) {
            const logoutReq: Req.LogoutRequest = {body: {}, token};
            expect(tradingSystemManager.logout(logoutReq).data.result).toBe(isLoggedInNow);
        }

        const registerReq: Req.RegisterRequest = {body: {username: user.name, password: user.password}, token};
        expect(tradingSystemManager.register(registerReq).data.result).toBe(true);

    },

    loginAsExistingUser(tradingSystemManager: TradingSystemManager, user: RegisteredUser, token:string, isLoggedInNow: boolean): void {
        if (isLoggedInNow) {
            const logoutReq: Req.LogoutRequest = {body: {}, token};
            expect(tradingSystemManager.logout(logoutReq).data.result).toBe(isLoggedInNow);
        }

        const loginReq: Req.LoginRequest = {body: {username: user.name, password: user.password}, token: token};
        const loginRes: Res.BoolResponse = tradingSystemManager.login(loginReq);
        expect(loginRes.data.result).toBeTruthy();
    }




}