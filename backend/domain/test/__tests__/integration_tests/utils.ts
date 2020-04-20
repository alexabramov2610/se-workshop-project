import {TradingSystemManager} from "../../../src/trading_system/TradingSystemManager";
import * as Req from "../../../src/api-ext/Request";

export default {
    registeredUserLogin: (tradingSystemManager: TradingSystemManager, username: string, password: string): string => {
        const token = tradingSystemManager.startNewSession();

        const regReq: Req.RegisterRequest = {body: {username: username, password: password}, token: token};
        expect(tradingSystemManager.register(regReq).data.result).toBeTruthy();

        const loginReq: Req.LoginRequest = {body: {username: username, password: password}, token: token};
        expect(tradingSystemManager.login(loginReq).data.result).toBeTruthy();

        return token;
    },

    guestLogin: (tradingSystemManager: TradingSystemManager) : string => {
        return tradingSystemManager.startNewSession();
    }

}