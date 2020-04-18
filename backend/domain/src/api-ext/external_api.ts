import { TradingSystemManager } from "../trading_system/TradingSystemManager"
let tradingSystemInstannce = new TradingSystemManager();
const getInstance = ():TradingSystemManager =>{
    return tradingSystemInstannce;
}
const CreateInstance= ():TradingSystemManager=>{
    tradingSystemInstannce = new TradingSystemManager();
    return tradingSystemInstannce;
}
export * from "./Request"
export * from "./Response"
export * from "./CommonInterface"
export * from "./Enums"
export { getInstance,CreateInstance };