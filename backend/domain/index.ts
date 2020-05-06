import {TradingSystemManager} from "./src/trading_system/TradingSystemManager";


let tradingSystemInstance = new TradingSystemManager();
const getInstance = (): TradingSystemManager => {
    return tradingSystemInstance;
}
const createInstance = (): TradingSystemManager => {
    // tradingSystemInstance.terminateSocket();
    let socket = undefined;
    if (tradingSystemInstance)
        socket = tradingSystemInstance.getSocket();
    tradingSystemInstance = new TradingSystemManager(socket);
    return tradingSystemInstance;
}
export {getInstance, createInstance};