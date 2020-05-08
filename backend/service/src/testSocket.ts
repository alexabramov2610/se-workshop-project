import {RegisteredUser} from "domain_layer/dist/src/user/users/RegisteredUser";
import {Product} from "domain_layer/dist/src/trading_system/data/Product";
import {ProductCategory} from "se-workshop-20-interfaces/dist/src/Enums";
import {IItem} from "se-workshop-20-interfaces/dist/src/CommonInterface";
import {Req, Res} from "se-workshop-20-interfaces";
import * as ServiceFacade from "./service_facade/ServiceFacade";
import {Store} from "domain_layer/dist/src/store/Store";
import {StoreOwner} from "domain_layer/dist/src/user/users/StoreOwner";


const storeOwnerName: string = "alex";
const storeOwnerPassword: string = "store-owner-pw";
const storeName: string = "store-name";
const storeDesc: string = "store-Description";


let store: Store;
let storeOwnerRegisteredUser: RegisteredUser;
let storeOwner: StoreOwner;
let token: string;


const adminName: string = "admin";
const adminPassword: string = "admin123123";
let adminToken: string;

export const getGuestSession = (): string => {
    return adminToken = ServiceFacade.startNewSession();
}

export const systemInit = (): void => {
    adminToken = getGuestSession();
    const initReq: Req.InitReq = {  body: { firstAdminName: adminName, firstAdminPassword: adminPassword } , token: adminToken};
    ServiceFacade.systemInit(initReq);
}

export const initSessionRegisterLogin = (username: string, password: string): string => {
    const token = getGuestSession();
    registerUser(username, password, token, false);
    loginUser(username, password, token, false);
    return token;
}

export const loginUser = (username: string, password: string, token, isLoggedInNow: boolean): void => {
    if (isLoggedInNow) {
        logout(token);
    }
    const loginReq: Req.LoginRequest = {body: {username, password}, token};
    ServiceFacade.loginUser(loginReq);
}

export const registerUser = (username: string, password: string, token, isLoggedInNow: boolean): void => {
    if (isLoggedInNow) {
        logout(token);
    }
    const regReq: Req.RegisterRequest = {body: {username, password}, token};
    ServiceFacade.registerUser(regReq);
}

export const logout = (token: string): void => {
    const logoutReq: Req.LogoutRequest = {body: {}, token};
    ServiceFacade.logoutUser(logoutReq);
}

export const createStore = (storeName: string, token: string): void => {
    const req: Req.OpenStoreRequest = {body: {storeName, description: "store desc"}, token};
    ServiceFacade.createStore(req);
}

export const addNewProducts = (storeName: string, products: Product[], token: string, expectedRes: boolean): void => {
    const res: Res.ProductAdditionResponse = ServiceFacade.addNewProducts({body: {storeName, products}, token});
}

export const addNewItems = (storeName: string, items: IItem[], token: string, expectedRes: boolean): void => {
    const res: Res.ItemsAdditionResponse = ServiceFacade.addItems({body: {storeName, items}, token});
}






export function t1 (){
    systemInit();

    storeOwnerRegisteredUser = new RegisteredUser(storeOwnerName, storeOwnerPassword);
    store = new Store(storeName,storeDesc);
    storeOwner = new StoreOwner(storeOwnerName);

    token = initSessionRegisterLogin(storeOwnerName, storeOwnerPassword);
    createStore(storeName, token);


    const buyer1: RegisteredUser = new RegisteredUser("buyer1", "buyer1password");
    const buyer2: RegisteredUser = new RegisteredUser("buyer2", "buyer2password");

    const prod1: Product = new Product("name1", 1, 100, ProductCategory.GENERAL);
    const prod2: Product = new Product("name2", 2, 200, ProductCategory.ELECTRONICS);
    const prod3: Product = new Product("name3", 3, 300, ProductCategory.CLOTHING);
    const prod4: Product = new Product("name4", 4, 400, ProductCategory.HOBBIES);

    const item1: IItem = {id: 1, catalogNumber: prod1.catalogNumber};
    const item2: IItem = {id: 2, catalogNumber: prod2.catalogNumber};
    const item3: IItem = {id: 3, catalogNumber: prod3.catalogNumber};
    const item4: IItem = {id: 4, catalogNumber: prod4.catalogNumber};

    const products: Product[] = [prod1, prod2, prod3, prod4];
    const items: IItem[] = [item1, item2, item3, item4];

    addNewProducts(storeName, products, token, true);
    addNewItems(storeName, items, token, true);
    registerUser(buyer1.name, buyer1.password, token, true);
    registerUser(buyer2.name, buyer2.password, token, false);


    // buyer 1 buys
    loginUser(buyer1.name, buyer1.password, token, false);
    // save prod1, prod2
    let saveProductToCartReq: Req.SaveToCartRequest = {
        body: {storeName, catalogNumber: products[0].catalogNumber, amount: 1},
        token: token
    }
    let saveProductToCartRes: Res.BoolResponse = ServiceFacade.saveProductToCart(saveProductToCartReq)

    saveProductToCartReq = {
        body: {storeName, catalogNumber: products[1].catalogNumber, amount: 1},
        token: token
    }
    saveProductToCartRes = ServiceFacade.saveProductToCart(saveProductToCartReq)

    // buy
    let purchaseReq: Req.PurchaseRequest = {
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
    let purchaseResponse: Res.PurchaseResponse = ServiceFacade.purchase(purchaseReq)


    // buyer 2 buys
    loginUser(buyer2.name, buyer2.password, token, true);
    // save prod1, prod2
    saveProductToCartReq = {
        body: {storeName, catalogNumber: products[2].catalogNumber, amount: 1},
        token: token
    }
    saveProductToCartRes = ServiceFacade.saveProductToCart(saveProductToCartReq)

    saveProductToCartReq = {
        body: {storeName, catalogNumber: products[3].catalogNumber, amount: 1},
        token: token
    }
    saveProductToCartRes = ServiceFacade.saveProductToCart(saveProductToCartReq)

    // buy
    purchaseReq = {
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
    purchaseResponse = ServiceFacade.purchase(purchaseReq)


    // get purchases history
    loginUser(storeOwnerName, storeOwnerPassword, token, true);
    const viewPurchasesHistoryReq: Req.ViewShopPurchasesHistoryRequest = { body: { storeName: storeName }, token: token };
    const viewPurchasesHistoryRes: Res.ViewShopPurchasesHistoryResponse = ServiceFacade.viewStorePurchasesHistory(viewPurchasesHistoryReq);
    let idsTakes: number[] = [1, 1, 1, 1, 1];
    let prodCatalogsTaken: number[] = [1, 1, 1, 1, 1];


    console.log(token);




}
export function t2 (){
    storeOwnerRegisteredUser = new RegisteredUser(storeOwnerName, storeOwnerPassword);
    store = new Store(storeName,storeDesc);
    storeOwner = new StoreOwner(storeOwnerName);

    token = initSessionRegisterLogin(storeOwnerName, storeOwnerPassword);
    createStore(storeName, token);


    const buyer1: RegisteredUser = new RegisteredUser("buyer1", "buyer1password");
    const buyer2: RegisteredUser = new RegisteredUser("buyer2", "buyer2password");

    const prod1: Product = new Product("name1", 1, 100, ProductCategory.GENERAL);
    const prod2: Product = new Product("name2", 2, 200, ProductCategory.ELECTRONICS);
    const prod3: Product = new Product("name3", 3, 300, ProductCategory.CLOTHING);
    const prod4: Product = new Product("name4", 4, 400, ProductCategory.HOBBIES);

    const item1: IItem = {id: 1, catalogNumber: prod1.catalogNumber};
    const item2: IItem = {id: 2, catalogNumber: prod2.catalogNumber};
    const item3: IItem = {id: 3, catalogNumber: prod3.catalogNumber};
    const item4: IItem = {id: 4, catalogNumber: prod4.catalogNumber};

    const products: Product[] = [prod1, prod2, prod3, prod4];
    const items: IItem[] = [item1, item2, item3, item4];

    addNewProducts(storeName, products, token, true);
    addNewItems(storeName, items, token, true);
    registerUser(buyer1.name, buyer1.password, token, true);
    registerUser(buyer2.name, buyer2.password, token, false);


    // buyer 1 buys
    loginUser(buyer1.name, buyer1.password, token, false);
    // save prod1, prod2
    let saveProductToCartReq: Req.SaveToCartRequest = {
        body: {storeName, catalogNumber: products[0].catalogNumber, amount: 1},
        token: token
    }
    let saveProductToCartRes: Res.BoolResponse = ServiceFacade.saveProductToCart(saveProductToCartReq)

    saveProductToCartReq = {
        body: {storeName, catalogNumber: products[1].catalogNumber, amount: 1},
        token: token
    }
    saveProductToCartRes = ServiceFacade.saveProductToCart(saveProductToCartReq)

    // buy
    let purchaseReq: Req.PurchaseRequest = {
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
    let purchaseResponse: Res.PurchaseResponse = ServiceFacade.purchase(purchaseReq)


    // buyer 2 buys
    loginUser(buyer2.name, buyer2.password, token, true);
    // save prod1, prod2
    saveProductToCartReq = {
        body: {storeName, catalogNumber: products[2].catalogNumber, amount: 1},
        token: token
    }
    saveProductToCartRes = ServiceFacade.saveProductToCart(saveProductToCartReq)

    saveProductToCartReq = {
        body: {storeName, catalogNumber: products[3].catalogNumber, amount: 1},
        token: token
    }
    saveProductToCartRes = ServiceFacade.saveProductToCart(saveProductToCartReq)

    // buy
    purchaseReq = {
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
    purchaseResponse = ServiceFacade.purchase(purchaseReq)


    // get purchases history
    loginUser(storeOwnerName, storeOwnerPassword, token, true);
    const viewPurchasesHistoryReq: Req.ViewShopPurchasesHistoryRequest = { body: { storeName: storeName }, token: token };
    const viewPurchasesHistoryRes: Res.ViewShopPurchasesHistoryResponse = ServiceFacade.viewStorePurchasesHistory(viewPurchasesHistoryReq);
    let idsTakes: number[] = [1, 1, 1, 1, 1];
    let prodCatalogsTaken: number[] = [1, 1, 1, 1, 1];




}