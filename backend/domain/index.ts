import {TradingSystemManager} from "./src/trading_system/TradingSystemManager";

const logoutUserByName = (username: string): void => {
    if (tradingSystemInstance)
        tradingSystemInstance.forceLogout(username);
}

let tradingSystemInstance;
const getInstance = (): TradingSystemManager => {
    if (!tradingSystemInstance)
        tradingSystemInstance = new TradingSystemManager();
    return tradingSystemInstance;
}
const createInstance = (): TradingSystemManager => {
    tradingSystemInstance = new TradingSystemManager();
    return tradingSystemInstance;
}


const registerReq ={
    body: {username: 'ron', password: '123456'},
    token: "token"};
getInstance().register(registerReq);



export {getInstance, createInstance, logoutUserByName};