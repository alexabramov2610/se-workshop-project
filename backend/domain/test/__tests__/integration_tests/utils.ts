import {TradingSystemManager} from "../../../src/trading_system/TradingSystemManager";
import * as Req from "../../../src/api-ext/Request";
import {Product} from "../../../src/trading_system/internal_api";
import {ProductCategory} from "../../../src/api-ext/Enums";

export default {
    registeredUserLogin: (tradingSystemManager: TradingSystemManager, username: string, password: string): string => {
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
        tradingSystemManager.createStore(req)
    },
    addNewProducts(tradingSystemManager: TradingSystemManager, storeName: string, products: Product[], token:string): void{
        tradingSystemManager.addNewProducts({body:{storeName,products},token});
    },
    removeProducts(tradingSystemManager: TradingSystemManager, storeName: string, products: Product[], token:string): void{
        tradingSystemManager.removeProducts({body:{storeName,products},token});
    }


}