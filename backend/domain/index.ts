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
// const registerReq ={
//     body: {username: 'tal', password: '123456'},
//     token: "token"};
// const loginReq= {
//     body: {username: 'tal', password: '123456'},
//     token: "token"
// };
// const registerRes = getInstance().register(registerReq).then(data=> console.log(data)).catch(err=> console.log(err))
// getInstance().login(loginReq);


export {getInstance, createInstance, logoutUserByName};