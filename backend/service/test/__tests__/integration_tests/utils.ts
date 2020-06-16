import {Req, Res} from 'se-workshop-20-interfaces'
import {ProductCategory} from "se-workshop-20-interfaces/dist/src/Enums";
import * as ServiceFacade from "../../../src/service_facade/ServiceFacade"
import {IProduct, IItem} from "se-workshop-20-interfaces/dist/src/CommonInterface";

const adminName: string = "admin";
const adminPassword: string = "admin123123";
let adminToken: string;

export const createProduct = (name: string, catalogNumber: number, price: number, category: ProductCategory): IProduct => {
    return {name, catalogNumber, price, category}
}

export const getGuestSession = async (): Promise<string> => {
    adminToken = await ServiceFacade.startNewSession();
    return adminToken;
}

export const systemInit = async (): Promise<void> => {
    adminToken = await getGuestSession();
    const initReq: Req.InitReq = {
        body: {firstAdminName: adminName, firstAdminPassword: adminPassword},
        token: adminToken
    };
    const res = await ServiceFacade.systemInit(initReq)
    expect(res.data.result).toBeTruthy();
}

export const systemReset = async (): Promise<void> => {
    await safeShutdown();
    await ServiceFacade.reset();
}

export const clearDB = async (): Promise<void> => {
    const path: string = "../../dev-dropall.sh";
    await ServiceFacade.dropDB(path);
}

export const safeShutdown = async (): Promise<void> => {
    await ServiceFacade.tradingSystem.terminateSocket();
    await clearDB();
}

export const logout = async (token: string): Promise<void> => {
    const logoutReq: Req.LogoutRequest = {body: {}, token};
    const res = await ServiceFacade.logoutUser(logoutReq)
    expect(res.data.result).toBe(true);
}

export const loginUser = async (username: string, password: string, token, isLoggedInNow: boolean): Promise<void> => {
    if (isLoggedInNow) {
        await logout(token);
    }
    const loginReq: Req.LoginRequest = {body: {username, password}, token};
    const res = await ServiceFacade.loginUser(loginReq)
    expect(res.data.result).toBeTruthy();
}

export const registerUser = async (username: string, password: string, token, isLoggedInNow: boolean): Promise<void> => {
    if (isLoggedInNow) {
        await logout(token);
    }
    const regReq: Req.RegisterRequest = {body: {username, password}, token};
    const res = await ServiceFacade.registerUser(regReq)
    expect(res.data.result).toBeTruthy();
}

export const initSessionRegisterLogin = async (username: string, password: string): Promise<string> => {
    const token = await getGuestSession();
    await registerUser(username, password, token, false);
    await loginUser(username, password, token, false);
    return token;
}

export const createStore = async (storeName: string, token: string): Promise<void> => {
    const req: Req.OpenStoreRequest = {body: {storeName, description: "store desc"}, token};
    const res = await ServiceFacade.createStore(req)
    expect(res.data.result).toBe(true);
}

export const addNewProducts = async (storeName: string, products: IProduct[], token: string, expectedRes: boolean): Promise<void> => {
    const res: Res.ProductAdditionResponse = await ServiceFacade.addNewProducts({body: {storeName, products}, token});
    expect(res.data.result).toBe(expectedRes);
}

export const addNewItems = async (storeName: string, items: IItem[], token: string, expectedRes: boolean): Promise<void> => {
    const res: Res.ItemsAdditionResponse = await ServiceFacade.addItems({body: {storeName, items}, token});
    expect(res.data.result).toBe(expectedRes);
}

export const removeProducts = async (storeName: string, products: IProduct[], token: string): Promise<void> => {
    const res = await ServiceFacade.removeProducts({body: {storeName, products}, token})
    expect(res.data.result).toBe(true);
}

export const makeStoreWithProduct = async (catalogNumber: number, itemsNumber: number, username: string, password: string, storeName: string, ownerToken: string) => {
    // if ownerToken === undefined -> another user performs the creation
    if (!ownerToken)
        ownerToken = await initSessionRegisterLogin(username, password);
    await createStore(storeName, ownerToken);
    const products: IProduct[] = [{
        name: "bamba",
        catalogNumber,
        price: 20,
        category: ProductCategory.GENERAL,
        db_id: "0"
    }]
    await addNewProducts(storeName, products, ownerToken, true)
    let items: IItem[] = [];

    for (let i = 0; i < itemsNumber; i++)
        items = items.concat({catalogNumber: 1, id: i + 1});
    await ServiceFacade.addItems({token: ownerToken, body: {storeName, items: items}});

    return {ownerToken, products}
}

export const makeStoreWithProductWithProdDetails = async (name: string, price: number, prodCategory: ProductCategory, catalogNumber: number, itemsNumber: number, username: string, password: string, storeName: string, ownerToken: string) => {
    // if ownerToken === undefined -> another user performs the creation
    if (!ownerToken)
        ownerToken = await initSessionRegisterLogin(username, password);
    await createStore(storeName, ownerToken);
    const products: IProduct[] = [{name, catalogNumber, price, category: prodCategory}]
    await addNewProducts(storeName, products, ownerToken, true)
    let items: IItem[] = [];

    for (let i = 0; i < itemsNumber; i++)
        items = items.concat({catalogNumber: 1, id: i + 1});
    await ServiceFacade.addItems({token: ownerToken, body: {storeName, items: items}});

    return {ownerToken, products}
}

export const getPurchaseReq = async (token: string): Promise<Req.PurchaseRequest> => {
    return {
        body: {
            payment: {
                cardDetails: {
                    holderName: "tal",
                    number: "152",
                    expYear: "21",
                    expMonth: "5",
                    cvv: "40",
                    id: "123456789"
                }, address: "batyam", city: "batya", country: "israel"
            }
        }, token: token
    }
}

export const terminateSocket = async () => {
    await ServiceFacade.tradingSystem.terminateSocket()
}
