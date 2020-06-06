import {RegisteredUser} from "domain_layer/dist/src/user/users/RegisteredUser";
import {ProductCategory} from "se-workshop-20-interfaces/dist/src/Enums";
import {IItem, IProduct} from "se-workshop-20-interfaces/dist/src/CommonInterface";
import {Req, Res} from "se-workshop-20-interfaces";
import * as ServiceFacade from "./service_facade/ServiceFacade";
import {Store} from "domain_layer/dist/src/store/Store";
import {StoreOwner} from "domain_layer/dist/src/user/users/StoreOwner";


const storeOwnerName: string = "alex";
const storeOwnerPassword: string = "store-owner-pw";
const storeName: string = "Max Stock";
const storeDesc: string = "store-Description";

let store: Store;
let storeOwnerRegisteredUser: RegisteredUser;
let storeOwner: StoreOwner;
let token: string;


const adminName: string = "admin";
const adminPassword: string = "admin123123";
let adminToken: string;

export const getSession = (): Promise<string> => {
    return ServiceFacade.startNewSession();
}

export const getAdminSession = async (): Promise<string> => {
    return adminToken = await ServiceFacade.startNewSession();
}

export const NewSessionSession = (): Promise<string> => {
    return ServiceFacade.startNewSession();
}

export const systemInit = async (): Promise<void> => {
    adminToken = await getAdminSession();
    const initReq: Req.InitReq = {
        body: {firstAdminName: adminName, firstAdminPassword: adminPassword},
        token: adminToken
    };
    await ServiceFacade.systemInit(initReq);
}

export const initSessionRegisterLogin = async (username: string, password: string): Promise<string> => {
    const token = await getAdminSession();
    await registerUser(username, password, token, false);
    await loginUser(username, password, token, false);
    return token;
}

export const loginUser = async (username: string, password: string, token, isLoggedInNow: boolean): Promise<void> => {
    if (isLoggedInNow) {
        await logout(token);
    }
    const loginReq: Req.LoginRequest = {body: {username, password}, token};
    await ServiceFacade.loginUser(loginReq);
}

export const registerUser = async (username: string, password: string, token, isLoggedInNow: boolean): Promise<void> => {
    if (isLoggedInNow) {
        await logout(token);
    }
    const regReq: Req.RegisterRequest = {body: {username, password}, token};
    await ServiceFacade.registerUser(regReq);
}

export const logout = async (token: string): Promise<void> => {
    const logoutReq: Req.LogoutRequest = {body: {}, token};
    await ServiceFacade.logoutUser(logoutReq);
}

export const createStore = async (storeName: string, token: string): Promise<void> => {
    const req: Req.OpenStoreRequest = {body: {storeName, description: "store desc"}, token};
    await ServiceFacade.createStore(req);
}

export const addNewProducts = async (storeName: string, products: IProduct[], token: string, expectedRes: boolean): Promise<void> => {
    await ServiceFacade.addNewProducts({body: {storeName, products}, token});
}

export const removeProducts = async (storeName: string, products: IProduct[], token: string): Promise<void> => {
    await ServiceFacade.removeProducts({body: {storeName, products}, token});
}

export const addNewItems = async (storeName: string, items: IItem[], token: string, expectedRes: boolean): Promise<void> => {
    await ServiceFacade.addItems({body: {storeName, items}, token});
}

export const removeItems = async (storeName: string, items: IItem[], token: string, expectedRes: boolean): Promise<void> => {
    await ServiceFacade.removeItems({body: {storeName, items}, token});
}

export const assignStoreOwner = async (storeName: string, usernameToAssign: string, token: string): Promise<void> => {
    await ServiceFacade.assignStoreOwner({body: { storeName, usernameToAssign }, token});
}

export const assignStoreManager = async (storeName: string, usernameToAssign: string, token: string): Promise<void> => {
    await ServiceFacade.assignStoreManager({body: { storeName, usernameToAssign }, token});
}

export const removeStoreManager = async (storeName: string, usernameToRemove: string, token: string): Promise<void> => {
    await ServiceFacade.removeStoreManager({body: { storeName, usernameToRemove }, token});
}

export const removeStoreOwner = async (storeName: string, usernameToRemove: string, token: string): Promise<void> => {
    await ServiceFacade.removeStoreOwner({body: { storeName, usernameToRemove }, token});
}


/** creates store -> new buyer -> buyer purchases -> store owner gets notification */
export async function t1() {
    await systemInit();

   // storeOwnerRegisteredUser = new RegisteredUser(storeOwnerName, storeOwnerPassword);
   // store = new Store(storeName, storeDesc);
    //storeOwner = new StoreOwner(storeOwnerName);

    token = await initSessionRegisterLogin(storeOwnerName, storeOwnerPassword);
    await createStore(storeName, token);


    const buyer1: RegisteredUser = new RegisteredUser("buyer1", "buyer1password");
    const buyer2: RegisteredUser = new RegisteredUser("buyer2", "buyer2password");

    const prod1: IProduct = {name: "חתול מעופף", catalogNumber: 1, price: 100, category: ProductCategory.GENERAL};
    const prod2: IProduct = {name: "ביסלי גריל", catalogNumber: 2, price: 200, category: ProductCategory.ELECTRONICS};
    const prod3: IProduct = {name: "אזני המן", catalogNumber: 3, price: 300, category: ProductCategory.CLOTHING};
    const prod4: IProduct = {name: "שערות סבתא", catalogNumber: 4, price: 400, category: ProductCategory.HOBBIES};

    const products: IProduct[] = [prod1, prod2, prod3, prod4];
    let items = [];
    for (let i = 0; i < 20; i++) {
        const item: IItem = {id: i + 1, catalogNumber: products[i % products.length].catalogNumber};
        items.push(item);
    }

    await addNewProducts(storeName, products, token, true);
    await addNewItems(storeName, items, token, true);
    await registerUser(buyer1.name, buyer1.password, token, true);
    await registerUser(buyer2.name, buyer2.password, token, false);


    // buyer 1 buys
    await loginUser(buyer1.name, buyer1.password, token, false);
    // save prod1, prod2
    let saveProductToCartReq: Req.SaveToCartRequest = {
        body: {storeName, catalogNumber: products[0].catalogNumber, amount: 1},
        token: token
    }
    let saveProductToCartRes: Res.BoolResponse = await ServiceFacade.saveProductToCart(saveProductToCartReq)

    saveProductToCartReq = {
        body: {storeName, catalogNumber: products[1].catalogNumber, amount: 1},
        token: token
    }
    saveProductToCartRes = await ServiceFacade.saveProductToCart(saveProductToCartReq)

    // buy
    let purchaseReq: Req.PurchaseRequest = {
        body: {
            payment: {
                cardDetails: {
                    holderName: "tal",
                    number: "152",
                    expYear: "21",
                    expMonth: "5",
                    cvv: "40"
                }, address: "batyam", city: "batya", country: "israel"
            }
        }, token: token
    }
    let purchaseResponse: Res.PurchaseResponse = await ServiceFacade.purchase(purchaseReq)


    // buyer 2 buys
    await loginUser(buyer2.name, buyer2.password, token, true);
    // save prod1, prod2
    saveProductToCartReq = {
        body: {storeName, catalogNumber: products[2].catalogNumber, amount: 1},
        token: token
    }
    saveProductToCartRes = await ServiceFacade.saveProductToCart(saveProductToCartReq)

    saveProductToCartReq = {
        body: {storeName, catalogNumber: products[3].catalogNumber, amount: 1},
        token: token
    }
    saveProductToCartRes = await ServiceFacade.saveProductToCart(saveProductToCartReq)

    // buy
    purchaseReq = {
        body: {
            payment: {
                cardDetails: {
                    holderName: "tal",
                    number: "152",
                    expYear: "21",
                    expMonth: "5",
                    cvv: "40"
                }, address: "batyam", city: "batya", country: "israel"
            }
        }, token: token
    }
    purchaseResponse = await ServiceFacade.purchase(purchaseReq)


    // get purchases history
    await loginUser(storeOwnerName, storeOwnerPassword, token, true);
    const viewPurchasesHistoryReq: Req.ViewShopPurchasesHistoryRequest = {body: {storeName: storeName}, token: token};
    const viewPurchasesHistoryRes: Res.ViewShopPurchasesHistoryResponse = await ServiceFacade.viewStorePurchasesHistory(viewPurchasesHistoryReq);
    let idsTakes: number[] = [1, 1, 1, 1, 1];
    let prodCatalogsTaken: number[] = [1, 1, 1, 1, 1];


    console.log(token);

    await logout(token);


}

/** creates new store with 1 product and 1 item, and 10 users */
export async function t2() {
    // prepare
  //  storeOwnerRegisteredUser = new RegisteredUser(storeOwnerName, storeOwnerPassword);
   // store = new Store(storeName, storeDesc);
 //   storeOwner = new StoreOwner(storeOwnerName);
    const buyerPw: string = "buyerpw";
    const buyer1: RegisteredUser = new RegisteredUser("buyer1", buyerPw);
    const buyer2: RegisteredUser = new RegisteredUser("buyer2", buyerPw);
    const buyer3: RegisteredUser = new RegisteredUser("buyer3", buyerPw);
    const buyer4: RegisteredUser = new RegisteredUser("buyer4", buyerPw);
    const buyer5: RegisteredUser = new RegisteredUser("buyer5", buyerPw);
    const buyer6: RegisteredUser = new RegisteredUser("buyer6", buyerPw);
    const buyer7: RegisteredUser = new RegisteredUser("buyer7", buyerPw);
    const buyer8: RegisteredUser = new RegisteredUser("buyer8", buyerPw);
    const buyer9: RegisteredUser = new RegisteredUser("buyer9", buyerPw);
    const buyer10: RegisteredUser = new RegisteredUser("buyer10", buyerPw);
    const buyer11: RegisteredUser = new RegisteredUser("buyer11", buyerPw);
    const buyer12: RegisteredUser = new RegisteredUser("buyer12", buyerPw);
    const buyer13: RegisteredUser = new RegisteredUser("buyer13", buyerPw);
    const buyer14: RegisteredUser = new RegisteredUser("buyer14", buyerPw);

    const users = [buyer1, buyer2, buyer3, buyer4, buyer5, buyer6, buyer7, buyer8, buyer9, buyer10, buyer11, buyer12, buyer13, buyer14];

    const prod1: IProduct = {name: "name1", catalogNumber: 1, price: 100, category: ProductCategory.GENERAL};
    const item1: IItem = {id: 1, catalogNumber: prod1.catalogNumber};
    const products: IProduct[] = [prod1];
    const items: IItem[] = [item1];
    let saveProductToCartReq: Req.SaveToCartRequest = {
        body: {storeName, catalogNumber: products[0].catalogNumber, amount: 1},
        token: token
    }
    let purchaseReq: Req.PurchaseRequest = {
        body: {
            payment: {
                cardDetails: {
                    holderName: "tal",
                    number: "152",
                    expYear: "21",
                    expMonth: "5",
                    cvv: "40"
                }, address: "batyam", city: "batya", country: "israel"
            }
        }, token: token
    }

    await systemInit();

    // owner
    token = await initSessionRegisterLogin(storeOwnerName, storeOwnerPassword);
    await createStore(storeName, token);
    await addNewProducts(storeName, products, token, true);
    await addNewItems(storeName, items, token, true);

    console.log("added products !");
    let saveProductToCartReqFix: Req.SaveToCartRequest = {
        body: {storeName, catalogNumber: products[0].catalogNumber, amount: 1},
        token: token
    }
    const res = await ServiceFacade.saveProductToCart(saveProductToCartReqFix);
    const saveToCart = res;
    const res2 = await ServiceFacade.viewCart({body:{},token} );
    const viewCart = res2;




    // await removeProducts(storeName, products, token);
    // await removeItems(storeName, items, token, true);


    // await registerUser(buyer1.name, buyerPw, token, true);
    // for (let i = 1; i < users.length; i++)
    //     await registerUser(users[i].name, buyerPw, token, false);
    //
    // await loginUser(storeOwnerName, storeOwnerPassword, token, false);
    // await assignStoreOwner(storeName, buyer1.name, token);
    // await assignStoreOwner(storeName, buyer2.name, token);
    // await assignStoreManager(storeName, buyer13.name, token);
    //
    // await loginUser(buyer1.name, buyer1.password, token, true);
    // await assignStoreOwner(storeName, buyer3.name, token);
    // await assignStoreOwner(storeName, buyer4.name, token);
    // await assignStoreManager(storeName, buyer9.name, token);
    //
    // await loginUser(buyer3.name, buyer3.password, token, true);
    // await assignStoreOwner(storeName, buyer5.name, token);
    // await assignStoreManager(storeName, buyer10.name, token);
    //
    // await loginUser(buyer5.name, buyer5.password, token, true);
    // await assignStoreOwner(storeName, buyer6.name, token);
    // await assignStoreOwner(storeName, buyer7.name, token);
    // await assignStoreManager(storeName, buyer11.name, token);
    // await assignStoreManager(storeName, buyer12.name, token);
    //
    // await loginUser(buyer2.name, buyer2.password, token, true);
    // await assignStoreOwner(storeName, buyer8.name, token);
    // await assignStoreManager(storeName, buyer14.name, token);
    //
    // await loginUser(storeOwnerName, storeOwnerPassword, token, true);
    // await removeStoreOwner(storeName, buyer1.name, token);

    // await assignStoreManager(storeName, buyer2.name, token);
    // await removeStoreManager(storeName, buyer2.name, token);


    let stringToPrint: string[] = [];
    //
    // console.log('generating 10 tokens...')
    // for (let i = 0; i < 10; i++) {
    //     const t = await NewSessionSession();
    //     purchaseReq.token = t;
    //     saveProductToCartReq.token = t;
    //
    //     await registerUser(users[i].name, users[i].password, token, false);
    //     await loginUser(users[i].name, users[i].password, t, false);
    //     // console.log(`saveProductToCart user: ${users[i].name} result: ${ServiceFacade.saveProductToCart(saveProductToCartReq).data.result}`);
    //     // console.log(`purchase request ${i}:`)
    //
    //     // stringToPrint.push(`curl --cacert server.cert -k --header "Content-Type: application/json" "token: ${get}" --request POST --data  '${JSON.stringify(purchaseReq)}'  https://localhost:4000/stores/purchase`)
    // }
}

/** creates 10 stores */
export async function t3() {
    // prepare
    const buyer1: RegisteredUser = new RegisteredUser("buyer1", "buyer1password");
    const buyer2: RegisteredUser = new RegisteredUser("buyer2", "buyer2password");
    const buyer3: RegisteredUser = new RegisteredUser("buyer3", "buyer2password");
    const buyer4: RegisteredUser = new RegisteredUser("buyer4", "buyer2password");
    const buyer5: RegisteredUser = new RegisteredUser("buyer5", "buyer2password");
    const buyer6: RegisteredUser = new RegisteredUser("buyer6", "buyer2password");
    const buyer7: RegisteredUser = new RegisteredUser("buyer7", "buyer2password");
    const buyer8: RegisteredUser = new RegisteredUser("buyer8", "buyer2password");
    const buyer9: RegisteredUser = new RegisteredUser("buyer9", "buyer2password");
    const buyer10: RegisteredUser = new RegisteredUser("buyer10", "buyer2password");

    const storeName1: string = "store1";
    const storeName2: string = "store2";
    const storeName3: string = "store3";
    const storeName4: string = "store4";
    const storeName5: string = "store5";
    const storeName6: string = "store6";
    const storeName7: string = "store7";
    const storeName8: string = "store8";
    const storeName9: string = "store9";
    const storeName10: string = "store10";


    const prod1: IProduct = {name: "name1", catalogNumber: 1, price: 100, category: ProductCategory.GENERAL };
    const prod2: IProduct = {name: "name2", catalogNumber: 2, price: 200, category: ProductCategory.ELECTRONICS };
    const prod3: IProduct = {name: "name3", catalogNumber: 3, price: 300, category: ProductCategory.CLOTHING };
    const prod4: IProduct = {name: "name4", catalogNumber: 4, price: 400, category: ProductCategory.HOBBIES };

    const item1: IItem = {id: 1, catalogNumber: prod1.catalogNumber};
    const item2: IItem = {id: 2, catalogNumber: prod2.catalogNumber};
    const item3: IItem = {id: 3, catalogNumber: prod3.catalogNumber};
    const item4: IItem = {id: 4, catalogNumber: prod4.catalogNumber};

    const products: IProduct[] = [prod1, prod2, prod3, prod4];
    const items: IItem[] = [item1, item2, item3, item4];

    await systemInit();


    // store 1
    token = await initSessionRegisterLogin(buyer1.name, buyer1.password);
    console.log("creating store...")
    await createStore(storeName1, token);
    await addNewProducts(storeName1, products, token, true);
    await addNewItems(storeName1, items, token, true);

    // store 2
    await registerUser(buyer2.name, buyer2.password, token, true);
    await loginUser(buyer2.name, buyer2.password, token, false);
    await createStore(storeName2, token);
    await addNewProducts(storeName2, products, token, true);
    await addNewItems(storeName2, items, token, true);

    // store 3
    await registerUser(buyer3.name, buyer3.password, token, true);
    await loginUser(buyer3.name, buyer3.password, token, false);
    await createStore(storeName3, token);
    await addNewProducts(storeName3, products, token, true);
    await addNewItems(storeName3, items, token, true);

    // store 4
    await registerUser(buyer4.name, buyer4.password, token, true);
    await loginUser(buyer4.name, buyer4.password, token, false);
    await createStore(storeName4, token);
    await addNewProducts(storeName4, products, token, true);
    await addNewItems(storeName4, items, token, true);

    // store 5
    await registerUser(buyer5.name, buyer5.password, token, true);
    await loginUser(buyer5.name, buyer5.password, token, false);
    await createStore(storeName5, token);
    await addNewProducts(storeName5, products, token, true);
    await addNewItems(storeName5, items, token, true);

    // store 6
    await registerUser(buyer6.name, buyer6.password, token, true);
    await loginUser(buyer6.name, buyer6.password, token, false);
    await createStore(storeName6, token);
    await addNewProducts(storeName6, products, token, true);
    await addNewItems(storeName6, items, token, true);

    // store 7
    await registerUser(buyer7.name, buyer7.password, token, true);
    await loginUser(buyer7.name, buyer7.password, token, false);
    await createStore(storeName7, token);
    await addNewProducts(storeName7, products, token, true);
    await addNewItems(storeName7, items, token, true);

    // store 8
    await registerUser(buyer8.name, buyer8.password, token, true);
    await loginUser(buyer8.name, buyer8.password, token, false);
    await createStore(storeName8, token);
    await addNewProducts(storeName8, products, token, true);
    await addNewItems(storeName8, items, token, true);

    // store 9
    await registerUser(buyer9.name, buyer9.password, token, true);
    await loginUser(buyer9.name, buyer9.password, token, false);
    await createStore(storeName9, token);
    await addNewProducts(storeName9, products, token, true);
    await addNewItems(storeName9, items, token, true);

    // store 10
    await registerUser(buyer10.name, buyer10.password, token, true);
    await loginUser(buyer10.name, buyer10.password, token, false);
    await createStore(storeName10, token);
    await addNewProducts(storeName10, products, token, true);
    await addNewItems(storeName10, items, token, true);

    console.log(token)
}

/** creates 10 stores without init */
export async function t4() {
    // prepare
    const buyer1: RegisteredUser = new RegisteredUser("buyer1", "buyer1password");
    const buyer2: RegisteredUser = new RegisteredUser("buyer2", "buyer2password");
    const buyer3: RegisteredUser = new RegisteredUser("buyer3", "buyer2password");
    const buyer4: RegisteredUser = new RegisteredUser("buyer4", "buyer2password");
    const buyer5: RegisteredUser = new RegisteredUser("buyer5", "buyer2password");
    const buyer6: RegisteredUser = new RegisteredUser("buyer6", "buyer2password");
    const buyer7: RegisteredUser = new RegisteredUser("buyer7", "buyer2password");
    const buyer8: RegisteredUser = new RegisteredUser("buyer8", "buyer2password");
    const buyer9: RegisteredUser = new RegisteredUser("buyer9", "buyer2password");
    const buyer10: RegisteredUser = new RegisteredUser("buyer10", "buyer2password");

    const storeName1: string = "store1";
    const storeName2: string = "store2";
    const storeName3: string = "store3";
    const storeName4: string = "store4";
    const storeName5: string = "store5";
    const storeName6: string = "store6";
    const storeName7: string = "store7";
    const storeName8: string = "store8";
    const storeName9: string = "store9";
    const storeName10: string = "store10";


    const prod1: IProduct = { name: "name1", catalogNumber: 1, price: 100, category: ProductCategory.GENERAL};
    const prod2: IProduct = { name: "name2", catalogNumber: 2, price: 200, category: ProductCategory.ELECTRONICS};
    const prod3: IProduct = { name: "name3", catalogNumber: 3, price: 300, category: ProductCategory.CLOTHING};
    const prod4: IProduct = { name: "name4", catalogNumber: 4, price: 400, category: ProductCategory.HOBBIES};

    const item1: IItem = {id: 1, catalogNumber: prod1.catalogNumber};
    const item2: IItem = {id: 2, catalogNumber: prod2.catalogNumber};
    const item3: IItem = {id: 3, catalogNumber: prod3.catalogNumber};
    const item4: IItem = {id: 4, catalogNumber: prod4.catalogNumber};

    const products: IProduct[] = [prod1, prod2, prod3, prod4];
    const items: IItem[] = [item1, item2, item3, item4];

    token = await NewSessionSession();

    // store 1
    await registerUser(buyer1.name, buyer1.password, token, false);
    await loginUser(buyer1.name, buyer1.password, token, false);
    await createStore(storeName1, token);
    await addNewProducts(storeName1, products, token, true);
    await addNewItems(storeName1, items, token, true);

    // store 2
    await registerUser(buyer2.name, buyer2.password, token, true);
    await loginUser(buyer2.name, buyer2.password, token, false);
    await createStore(storeName2, token);
    await addNewProducts(storeName2, products, token, true);
    await addNewItems(storeName2, items, token, true);

    // store 3
    await registerUser(buyer3.name, buyer3.password, token, true);
    await loginUser(buyer3.name, buyer3.password, token, false);
    await createStore(storeName3, token);
    await addNewProducts(storeName3, products, token, true);
    await addNewItems(storeName3, items, token, true);

    // store 4
    await registerUser(buyer4.name, buyer4.password, token, true);
    await loginUser(buyer4.name, buyer4.password, token, false);
    await createStore(storeName4, token);
    await addNewProducts(storeName4, products, token, true);
    await addNewItems(storeName4, items, token, true);

    // store 5
    await registerUser(buyer5.name, buyer5.password, token, true);
    await loginUser(buyer5.name, buyer5.password, token, false);
    await createStore(storeName5, token);
    await addNewProducts(storeName5, products, token, true);
    await addNewItems(storeName5, items, token, true);

    // store 6
    await registerUser(buyer6.name, buyer6.password, token, true);
    await loginUser(buyer6.name, buyer6.password, token, false);
    await createStore(storeName6, token);
    await addNewProducts(storeName6, products, token, true);
    await addNewItems(storeName6, items, token, true);

    // store 7
    await registerUser(buyer7.name, buyer7.password, token, true);
    await loginUser(buyer7.name, buyer7.password, token, false);
    await createStore(storeName7, token);
    await addNewProducts(storeName7, products, token, true);
    await addNewItems(storeName7, items, token, true);

    // store 8
    await registerUser(buyer8.name, buyer8.password, token, true);
    await loginUser(buyer8.name, buyer8.password, token, false);
    await createStore(storeName8, token);
    await addNewProducts(storeName8, products, token, true);
    await addNewItems(storeName8, items, token, true);

    // store 9
    await registerUser(buyer9.name, buyer9.password, token, true);
    await loginUser(buyer9.name, buyer9.password, token, false);
    await createStore(storeName9, token);
    await addNewProducts(storeName9, products, token, true);
    await addNewItems(storeName9, items, token, true);

    // store 10
    await registerUser(buyer10.name, buyer10.password, token, true);
    await loginUser(buyer10.name, buyer10.password, token, false);
    await createStore(storeName10, token);
    await addNewProducts(storeName10, products, token, true);
    await addNewItems(storeName10, items, token, true);

    console.log(token)
}

/** 3 users buy from store: Best-Store! */
export async function t5() {
    // prepare
    const buyer1: RegisteredUser = new RegisteredUser("בזבזן גדול", "buyer1password");
    const buyer2: RegisteredUser = new RegisteredUser("אוהב לקנות הכל", "buyer1password");
    const buyer3: RegisteredUser = new RegisteredUser("love-spending", "buyer1password");

    const prod1: IProduct = {name: "במבה אסם", catalogNumber: 1, price: 100, category: ProductCategory.GENERAL};
    const prod2: IProduct = {name: "ביסלי גריל", catalogNumber: 2, price: 200, category: ProductCategory.ELECTRONICS};
    const prod3: IProduct = {name: "אזני המן", catalogNumber: 3, price: 300, category: ProductCategory.CLOTHING};
    const prod4: IProduct = {name: "שערות סבתא", catalogNumber: 4, price: 400, category: ProductCategory.HOBBIES};

    const products: IProduct[] = [prod1, prod2, prod3, prod4];

    token = await getSession();
    await registerUser(buyer1.name, buyer1.password, token, false);
    await registerUser(buyer2.name, buyer2.password, token, false);
    await registerUser(buyer3.name, buyer3.password, token, false);


    // buyer 1 buys
    await loginUser(buyer1.name, buyer1.password, token, false);

    // save prod1 -X2, prod2 -X1
    let saveProductToCartReq: Req.SaveToCartRequest = {
        body: {storeName, catalogNumber: products[0].catalogNumber, amount: 2},
        token: token
    }
    await ServiceFacade.saveProductToCart(saveProductToCartReq)

    saveProductToCartReq = {
        body: {storeName, catalogNumber: products[1].catalogNumber, amount: 1},
        token: token
    }
    await ServiceFacade.saveProductToCart(saveProductToCartReq)

    // buy
    let purchaseReq: Req.PurchaseRequest = {
        body: {
            payment: {
                cardDetails: {
                    holderName: "tal",
                    number: "152",
                    expYear: "21",
                    expMonth: "5",
                    cvv: "40"
                }, address: "batyam", city: "batya", country: "israel"
            }
        }, token: token
    }
    await ServiceFacade.purchase(purchaseReq);


    // buyer 2 buys
    await loginUser(buyer2.name, buyer2.password, token, true);
    // save prod2 -X1, prod3 -X2
    await ServiceFacade.saveProductToCart(saveProductToCartReq)

    saveProductToCartReq = {
        body: {storeName, catalogNumber: products[2].catalogNumber, amount: 2},
        token: token
    }
    await ServiceFacade.saveProductToCart(saveProductToCartReq)

    // buy
    purchaseReq = {
        body: {
            payment: {
                cardDetails: {
                    holderName: "tal",
                    number: "152",
                    expYear: "21",
                    expMonth: "5",
                    cvv: "40"
                }, address: "batyam", city: "batya", country: "israel"
            }
        }, token: token
    }
    await ServiceFacade.purchase(purchaseReq)


    // buyer 3 buys
    await loginUser(buyer3.name, buyer3.password, token, true);
    // save prod4 -X2
    saveProductToCartReq = {
        body: {storeName, catalogNumber: products[3].catalogNumber, amount: 2},
        token: token
    }
    await ServiceFacade.saveProductToCart(saveProductToCartReq)

    // buy
    purchaseReq = {
        body: {
            payment: {
                cardDetails: {
                    holderName: "tal",
                    number: "152",
                    expYear: "21",
                    expMonth: "5",
                    cvv: "40"
                }, address: "batyam", city: "batya", country: "israel"
            }
        }, token: token
    }
    await ServiceFacade.purchase(purchaseReq)

    await logout(token);
}
