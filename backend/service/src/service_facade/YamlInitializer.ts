import YAML from 'yaml';
import fs from 'fs';
const path = require("path");
import {Req, Res} from "se-workshop-20-interfaces";
import {loggerW} from "domain_layer/dist/src/api-int/Logger";
import * as ServiceFacade from "./ServiceFacade";
import {Product} from "domain_layer/dist/src/trading_system/data/Product";
import {IItem} from "se-workshop-20-interfaces/dist/src/CommonInterface";
import {ManagementPermission} from "se-workshop-20-interfaces/dist/src/Enums";

const logger = loggerW(__filename)
const PATH: string = '../../states/state.yml';

let adminToken: string;
let usersMap: Map<string,string> = new Map<string,string>(); // username -> pw
let itemIds: Map<number,number> = new Map<number,number>(); // catalog num -> id

export const initSystemFromFile = (req: Req.Request): Res.BoolResponse => {
    try {
        console.log(__dirname)
        const file = fs.readFileSync(path.resolve(__dirname, PATH), 'utf8')
        const ymlDoc = YAML.parse(file);
        // console.log(ymlDoc.stores);

        systemInit(ymlDoc.init.username, ymlDoc.init.password);
        registerUsers(ymlDoc.users);
        createStores(ymlDoc.stores);

        return { data: { result: true } }
    } catch (e) {
        logger.error(e)
        return { data: { result: ServiceFacade.isSystemUp().data.result }, error: { message: e.message } }
    }
}


const getSession = (): string => {
    return ServiceFacade.startNewSession();
}

const systemInit = (username: string, password: string): void => {
    adminToken = getSession();
    const initReq: Req.InitReq = {  body: { firstAdminName: username, firstAdminPassword: password } , token: adminToken};
    if (!ServiceFacade.systemInit(initReq).data.result)
        throw new Error(`System init failed. {username: ${username}, password: ${password}`);
    usersMap.set(username, password);
}

const registerUser = (username: string, password: string, token, isLoggedInNow: boolean): void => {
    if (isLoggedInNow) {
        logout(username, token);
    }
    const regReq: Req.RegisterRequest = {body: {username, password}, token};
    if (!ServiceFacade.registerUser(regReq).data.result)
        throw new Error(`Registration failed. {username: ${username}, password: ${password}`);
    usersMap.set(username, password);
}

const registerUsers = (users: any[]): void => {
    users.forEach(user => {
        registerUser(user.username, user.password, getSession(), false)
        usersMap.set(user.username, user.password);
    })
}

const loginUser = (username: string, password: string, token, isLoggedInNow: boolean): void => {
    if (isLoggedInNow) {
        logout(username, token);
    }
    const loginReq: Req.LoginRequest = {body: {username, password}, token};
    if (!ServiceFacade.loginUser(loginReq).data.result)
        throw new Error(`Login failed. {username: ${username}, password: ${password}}`)
}

const logout = (username: string, token: string): void => {
    const logoutReq: Req.LogoutRequest = {body: {}, token};
    if (!ServiceFacade.logoutUser(logoutReq).data.result)
        throw new Error(`Logout failed. {username: ${username}}`)
}

const createStore = (storeName: string, token: string): void => {
    const req: Req.OpenStoreRequest = {body: {storeName, description: "store desc"}, token};
    if (!ServiceFacade.createStore(req).data.result)
        throw new Error(`Create store failed. {storeName: ${storeName}}`)
}

const addNewProducts = (storeName: string, products: Product[], token: string): void => {
    if (!ServiceFacade.addNewProducts({body: {storeName, products}, token}).data.result)
        throw new Error(`Add new products failed. {storeName: ${storeName}}`)
    products.forEach(product => {
        if (!itemIds.has(product.catalogNumber))
            itemIds.set(product.catalogNumber, 0)
    })
}

const addNewItems = (storeName: string, items: IItem[], token: string): void => {
    if (!ServiceFacade.addItems({body: {storeName, items}, token}).data.result)
        throw new Error(`Add new items failed. {storeName: ${storeName}}`)
}

const assignStoreManager = (storeName: string, assigner: string, assignee: string, token: string): void => {
    let assignStoreManagerRequest: Req.AssignStoreOwnerRequest = {
        body: {
            storeName,
            usernameToAssign: assignee
        }, token
    };
    const res = ServiceFacade.assignStoreManager(assignStoreManagerRequest);
    if (!res.data.result)
        throw new Error(`Assign store manager failed. {storeName: ${storeName}, assigner: ${assigner}, assignee: ${assignee}}. Error: '${res.error.message}'`)

}

const addPermissions = (manager: string, storeName: string, permissions: ManagementPermission[], token: string): void => {
    const changeManagerPermissionReq: Req.ChangeManagerPermissionRequest = {
        body: {
            managerToChange: manager,
            storeName,
            permissions: permissions
        }, token
    };
    if (!ServiceFacade.addManagerPermissions(changeManagerPermissionReq))
        throw new Error(`Add manager permissions failed. {manager to add permissions: ${manager}, store name ${storeName}}`)
}

const createStores = (stores: any[]): void => {
    stores.forEach(store => {
        const token: string = getSession();
        loginUser(store.owner, usersMap.get(store.owner), token, false);
        createStore(store.storeName, token);

        const products: Product[] = store.items.reduce((acc, curr) => acc.concat([new Product(curr.name, curr.catalogNumber, curr.price, curr.category)]), [])
        addNewProducts(store.storeName, products, token);

        const items: IItem[] = store.items.reduce((acc: IItem[], curr) => {
            let currItems: IItem[] = [];
            for (let i = 0; i < curr.quantity; i++) {
                itemIds.set(curr.catalogNumber, itemIds.get(curr.catalogNumber)+1);
                currItems.push({ id: itemIds.get(curr.catalogNumber), catalogNumber: curr.catalogNumber });
            }
            return acc.concat(currItems);
        }, []);
        addNewItems(store.storeName, items, token);
        logout(store.owner, token);

        store.managers.forEach(currAssign => {
            loginUser(currAssign.assigner, usersMap.get(currAssign.assigner), token, false);
            assignStoreManager(store.storeName, currAssign.assigner, currAssign.assignee, token);
            if (currAssign.permissions && currAssign.permissions.length > 0)
                addPermissions(currAssign.assignee, store.storeName, currAssign.permissions, token)
            logout(currAssign.assigner, token);
        })
    })
}