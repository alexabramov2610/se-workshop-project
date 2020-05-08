import {TradingSystemManager} from "./src/trading_system/TradingSystemManager";

const logoutUserByName = (username: string): void => {
    if (tradingSystemInstance)
        tradingSystemInstance.forceLogout(username);
}

let tradingSystemInstance = new TradingSystemManager();
const getInstance = (): TradingSystemManager => {
    return tradingSystemInstance;
}
const createInstance = (): TradingSystemManager => {
    tradingSystemInstance = new TradingSystemManager();
    return tradingSystemInstance;
}



export {getInstance, createInstance, logoutUserByName};