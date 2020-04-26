import {TradingSystemManager} from "./src/trading_system/TradingSystemManager";


let tradingSystemInstance = new TradingSystemManager();
const getInstance = (): TradingSystemManager => {
    return tradingSystemInstance;
}
const createInstance = (): TradingSystemManager => {
    tradingSystemInstance = new TradingSystemManager();
    return tradingSystemInstance;
}
export {getInstance, createInstance};