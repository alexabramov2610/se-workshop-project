import {Event, Req, Res} from 'se-workshop-20-interfaces'
import {Product} from "domain_layer/dist/src/trading_system/internal_api";
import {ProductCategory} from "se-workshop-20-interfaces/dist/src/Enums";
import * as ServiceFacade from "../../../src/service_facade/ServiceFacade"
import {IItem} from "se-workshop-20-interfaces/dist/src/CommonInterface";


const adminName: string = "admin";
const adminPassword: string = "admin123123";
let adminToken: string;

export const getGuestSession = (): string => {
    return adminToken = ServiceFacade.startNewSession();
}

export const systemInit = (): void => {
    adminToken = getGuestSession();
    const initReq: Req.InitReq = {  body: { firstAdminName: adminName, firstAdminPassword: adminPassword } , token: adminToken};
    expect(ServiceFacade.systemInit(initReq).data.result).toBeTruthy();
}

export const systemReset = (): void => {
    ServiceFacade.tradingSystem.terminateSocket();
    ServiceFacade.reset();
    this.systemInit();
}

export const logout = (token: string): void => {
    const logoutReq: Req.LogoutRequest = {body: {}, token};
    expect(ServiceFacade.logoutUser(logoutReq).data.result).toBe(true);
}

export const loginUser = (username: string, password: string, token, isLoggedInNow: boolean): void => {
    if (isLoggedInNow) {
        this.logout(token);
    }
    const loginReq: Req.LoginRequest = {body: {username, password}, token};
    expect(ServiceFacade.loginUser(loginReq).data.result).toBeTruthy();
}

export const registerUser = (username: string, password: string, token, isLoggedInNow: boolean): void => {
    if (isLoggedInNow) {
        this.logout(token);
    }
    const regReq: Req.RegisterRequest = {body: {username, password}, token};
    expect(ServiceFacade.registerUser(regReq).data.result).toBeTruthy();
}

export const initSessionRegisterLogin = (username: string, password: string): string => {
    const token = this.getGuestSession();
    this.registerUser(username, password, token, false);
    this.loginUser(username, password, token, false);
    return token;
}

export const createStore = (storeName: string, token: string): void => {
    const req: Req.StoreInfoRequest = {body: {storeName}, token};
    expect(ServiceFacade.createStore(req).data.result).toBe(true);
}

export const addNewProducts = (storeName: string, products: Product[], token: string, expectedRes: boolean): void => {
    const res: Res.ProductAdditionResponse = ServiceFacade.addNewProducts({body: {storeName, products}, token});
    expect(res.data.result).toBe(expectedRes);
}

export const addNewItems = (storeName: string, items: IItem[], token: string, expectedRes: boolean): void => {
    const res: Res.ItemsAdditionResponse = ServiceFacade.addItems({body: {storeName, items}, token});
    expect(res.data.result).toBe(expectedRes);
}

export const removeProducts = (storeName: string, products: Product[], token: string): void => {
    expect(ServiceFacade.removeProducts({body: {storeName, products}, token}).data.result).toBe(true);
}

export const makeStoreWithProduct = (catalogNumber: number, itemsNumber: number, username: string, password: string, storeName: string, ownerToken: string) => {
    // if ownerToken === undefined -> another user performs the creation
    if (!ownerToken)
        ownerToken = this.initSessionRegisterLogin(username, password);
    this.createStore(storeName, ownerToken);
    const products: Product[] = [new Product("bamba", catalogNumber, 20, ProductCategory.GENERAL)]
    this.addNewProducts(storeName, products, ownerToken, true)
    let items: IItem[] = [];

    for (let i = 0; i < itemsNumber; i++ )
        items = items.concat({catalogNumber: 1, id: i+1});
    ServiceFacade.addItems({token: ownerToken, body: {storeName, items: items}});

    return {ownerToken, products}
}

export const makeStoreWithProductWithProdDetails = (name: string, price: number, prodCategory: ProductCategory, catalogNumber: number, itemsNumber: number, username: string, password: string, storeName: string, ownerToken: string) => {
    // if ownerToken === undefined -> another user performs the creation
    if (!ownerToken)
        ownerToken = this.initSessionRegisterLogin(username, password);
    this.createStore(storeName, ownerToken);
    const products: Product[] = [new Product(name, catalogNumber, price, prodCategory)]
    this.addNewProducts(storeName, products, ownerToken, true)
    let items: IItem[] = [];

    for (let i = 0; i < itemsNumber; i++ )
        items = items.concat({catalogNumber: 1, id: i+1});
    ServiceFacade.addItems({token: ownerToken, body: {storeName, items: items}});

    return {ownerToken, products}
}

export const getPurchaseReq = (token: string): Req.PurchaseRequest =>{
    return {
        body: {
            payment: {
                cardDetails: {
                    holderName: "tal",
                    number: "152",
                    expYear: "2021",
                    expMonth: "5",
                    cvv: "40"
                }, address: "batyam", city: "batya", country: "israel"
            }
        }, token: token
    }
}

export const terminateSocket = async () => {
    await ServiceFacade.tradingSystem.terminateSocket()
}
