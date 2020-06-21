import YAML from 'yaml';
import fs from 'fs';
const path = require("path");
import {Req, Res} from "se-workshop-20-interfaces";
import {loggerW} from "domain_layer/dist/src/api-int/Logger";
import * as ServiceFacade from "./ServiceFacade";
import {IItem, IProduct} from "se-workshop-20-interfaces/dist/src/CommonInterface";
import {ManagementPermission} from "se-workshop-20-interfaces/dist/src/Enums";
import {BoolResponse} from "se-workshop-20-interfaces/dist/src/Response";

const logger = loggerW(__filename)
const PATH: string = '../../states/state.yml';

let adminToken: string;
let usersMap: Map<string,string> = new Map<string,string>(); // username -> pw
let itemIds: Map<number,number> = new Map<number,number>(); // catalog num -> id

export const initSystemFromFile = async (req: Req.InitFromFileRequest): Promise<Res.BoolResponse> => {
    let isSystemOn: boolean|void = false;
    try {
        console.log(__dirname)
        const pathToFile: string = req.body && req.body.path ? req.body.path : PATH;
        const file = fs.readFileSync(path.resolve(__dirname, pathToFile), 'utf8')
        const ymlDoc = YAML.parse(file);
        // console.log(ymlDoc.stores);

        isSystemOn = await systemInit(ymlDoc.init.username, ymlDoc.init.password);
        if (!isSystemOn)
            return { data: { result: false }, error: { message: "System init failed" } }

        await registerUsers(ymlDoc.users);
        await createStores(ymlDoc.stores);

        return { data: { result: isSystemOn ? isSystemOn : false } }
    } catch (e) {
        logger.error(e)

        return { data: { result: isSystemOn ? isSystemOn : false }, error: { message: e.message } }
    }
}

const LogoutAndThrowError = async (errorMsg: string, token: string): Promise<void> => {
    await logout(token);
    throw new Error(errorMsg);
}

const getSession = async (): Promise<string> => {
    const res: string = await ServiceFacade.startNewSession();
    return res;
}

const systemInit = async (username: string, password: string): Promise<boolean|void> => {
    adminToken = await getSession();
    const initReq: Req.InitReq = {  body: { firstAdminName: username, firstAdminPassword: password } , token: adminToken};
    const res: BoolResponse = await ServiceFacade.systemInit(initReq)
    if (!res.data.result)
        return LogoutAndThrowError(`System init failed. {username: ${username}, password: ${password}`, adminToken)
    usersMap.set(username, password);
    return true;
}

const registerUser = async (username: string, password: string, token, isLoggedInNow: boolean): Promise<void> => {
    if (isLoggedInNow) {
        await logout(token);
    }
    const regReq: Req.RegisterRequest = {body: {username, password}, token};
    const res = await ServiceFacade.registerUser(regReq)
    if (!res.data.result)
        return LogoutAndThrowError(`Registration failed. {username: ${username}, password: ${password}`, token)
    usersMap.set(username, password);
}

const registerUsers = async (users: any[]): Promise<void> => {
    for (const user of users) {
        await registerUser(user.username, user.password, await getSession(), false)
        usersMap.set(user.username, user.password);
    }
}

const loginUser = async (username: string, password: string, token, isLoggedInNow: boolean): Promise<void> => {
    if (isLoggedInNow) {
        await logout(token);
    }
    const loginReq: Req.LoginRequest = {body: {username, password}, token};
    const res: Res.BoolResponse = await ServiceFacade.loginUser(loginReq);
    if (!res.data.result)
        return LogoutAndThrowError(`Login failed. {username: ${username}, password: ${password}}`, token)
}

const logout = async (token: string): Promise<void> => {
    const logoutReq: Req.LogoutRequest = {body: {}, token};
    const res: Res.BoolResponse = await ServiceFacade.logoutUser(logoutReq);
    if (!res.data.result)
        return LogoutAndThrowError(`Logout failed.`, token)
}

const createStore = async (storeName: string, token: string): Promise<void> => {
    const req: Req.OpenStoreRequest = {body: {storeName, description: "store desc"}, token};
    const res: Res.BoolResponse = await ServiceFacade.createStore(req);
    if (!res.data.result)
        return LogoutAndThrowError(`Create store failed. {storeName: ${storeName}}`, token)
}

const addNewProducts = async (storeName: string, products: IProduct[], token: string): Promise<void> => {
    const res: Res.BoolResponse = await ServiceFacade.addNewProducts({body: {storeName, products}, token})
    if (!res.data.result)
        return LogoutAndThrowError(`Add new products failed. {storeName: ${storeName}}`, token)
    products.forEach(product => {
        if (!itemIds.has(product.catalogNumber))
            itemIds.set(product.catalogNumber, 0)
    })
}

const addNewItems = async (storeName: string, items: IItem[], token: string): Promise<void> => {
    const res: Res.BoolResponse = await ServiceFacade.addItems({body: {storeName, items}, token});
    if (!res.data.result)
        return LogoutAndThrowError(`Add new items failed. {storeName: ${storeName}}`, token)
}

const assignStoreManager = async (storeName: string, assigner: string, assignee: string, token: string): Promise<void> => {
    let assignStoreManagerRequest: Req.AssignStoreManagerRequest = {
        body: {
            storeName,
            usernameToAssign: assignee
        }, token
    };
    const res: Res.BoolResponse = await ServiceFacade.assignStoreManager(assignStoreManagerRequest);
    if (!res.data.result)
        return LogoutAndThrowError(`Assign store manager failed. {storeName: ${storeName}, assigner: ${assigner}, assignee: ${assignee}}. Error: '${res.error.message}'`, token)
}

const assignStoreOwner = async (storeName: string, assigner: string, assignee: string, token: string): Promise<void> => {
    let assignStoreManagerRequest: Req.AssignStoreOwnerRequest = {
        body: {
            storeName,
            usernameToAssign: assignee
        }, token
    };
    const res: Res.BoolResponse = await ServiceFacade.assignStoreOwner(assignStoreManagerRequest);
    if (!res.data.result)
        return LogoutAndThrowError(`Assign store owner failed. {storeName: ${storeName}, assigner: ${assigner}, assignee: ${assignee}}. Error: '${res.error.message}'`, token)
}

const addPermissions = async (manager: string, storeName: string, permissions: ManagementPermission[], token: string): Promise<void> => {
    const changeManagerPermissionReq: Req.ChangeManagerPermissionRequest = {
        body: {
            managerToChange: manager,
            storeName,
            permissions: permissions
        }, token
    };
    const res: Res.BoolResponse = await ServiceFacade.addManagerPermissions(changeManagerPermissionReq);
    if (!res.data.result)
        return LogoutAndThrowError(`Add manager permissions failed. {manager to add permissions: ${manager}, store name ${storeName}}`, token)
}

const createStores = async (stores: any[]): Promise<void> => {
    for (const store of stores) {
        const token: string = await getSession();
        await loginUser(store.owner, usersMap.get(store.owner), token, false);
        await createStore(store.storeName, token);

        if (store.items) {
            const products: IProduct[] = store.items.reduce((acc, curr) => {
                return curr ? acc.concat([{
                    name: curr.name,
                    catalogNumber: curr.catalogNumber,
                    price: curr.price,
                    category: curr.category
                }]) : acc;
            }, [])
            await addNewProducts(store.storeName, products, token);

            const items: IItem[] = store.items.reduce((acc: IItem[], curr) => {
                if (!curr)
                    return acc
                let currItems: IItem[] = [];
                for (let i = 0; i < curr.quantity; i++) {
                    itemIds.set(curr.catalogNumber, itemIds.get(curr.catalogNumber)+1);
                    currItems.push({ id: itemIds.get(curr.catalogNumber), catalogNumber: curr.catalogNumber });
                }
                return acc.concat(currItems);
            }, []);
            await addNewItems(store.storeName, items, token);
        }

        await logout(token);

        if (store.managers) {
            for (const currAssign of store.managers) {
                await loginUser(currAssign.assigner, usersMap.get(currAssign.assigner), token, false);
                await assignStoreManager(store.storeName, currAssign.assigner, currAssign.assignee, token);
                if (currAssign.permissions && currAssign.permissions.length > 0)
                    await addPermissions(currAssign.assignee, store.storeName, currAssign.permissions, token)
                await logout(token);
            }
        }

        if (store.managers) {
            for (const currAssign of store.owners) {
                await loginUser(currAssign.assigner, usersMap.get(currAssign.assigner), token, false);
                await assignStoreOwner(store.storeName, currAssign.assigner, currAssign.assignee, token);
                await logout(token);
            }
        }
    }
}