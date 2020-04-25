import {TradingSystemManager} from "../../../src/trading_system/TradingSystemManager";
import * as Req from "../../../src/api-ext/Request";
import * as Res from "../../../src/api-ext/Response";
import utils from "./utils"
import {Product} from "../../../src/trading_system/data/Product";
import {ProductCategory} from "../../../src/api-ext/Enums";
import {Cart, IReceipt} from "../../../src/api-ext/CommonInterface";
import {UpdateStockRequest} from "../../../src/api-ext/Request";


describe("Guest Integration Tests", () => {
    const username: string = "username";
    const password: string = "usernamepw123";

    let tradingSystemManager: TradingSystemManager;
    let token: string;


    beforeEach(() => {
        tradingSystemManager = new TradingSystemManager();
        token = utils.guestLogin(tradingSystemManager);
        expect(token).toBeDefined();
    });


    it("Register IT test", () => {
        const req: Req.RegisterRequest = {body: {username, password}, token};
        let res: Res.BoolResponse = tradingSystemManager.register(req);
        expect(res.data.result).toBe(true);
        expect(res.error).toBeUndefined();
        res = tradingSystemManager.register(req);
        expect(res.data.result).toBe(false);
        expect(res.data.result).toBeDefined();
    });

    it("Register && Login IT test", () => {
        const regReq: Req.RegisterRequest = {body: {username, password}, token};
        tradingSystemManager.register(regReq)
        const req: Req.LoginRequest = {body: {username, password}, token};
        let res: Res.BoolResponse = tradingSystemManager.login(req);
        expect(res.data.result).toBe(true);
        expect(res.error).toBeUndefined();
        res = tradingSystemManager.login(req);
        expect(res.data.result).toBe(false);
        expect(res.data.result).toBeDefined();
    });

    it("View store information IT test", () => {
        const ownerToken: string = utils.initSessionRegisterLogin(tradingSystemManager, username, password)
        const storeName: string = "store name";
        utils.createStore(tradingSystemManager, storeName, ownerToken);
        utils.addNewProducts(tradingSystemManager, storeName, [new Product("p", 1, 2, ProductCategory.HOME)], ownerToken, true);
        const req: Req.StoreInfoRequest = {body: {storeName}, token};
        let res: Res.StoreInfoResponse = tradingSystemManager.viewStoreInfo(req);
        expect(res.data.result).toBe(true);
        expect(res.data.info.storeName).toEqual(storeName);
        expect(res.data.info.productsNames).toEqual(["p"]);
        utils.removeProducts(tradingSystemManager, storeName, [new Product("p", 1, 2, ProductCategory.HOME)], ownerToken)
        res = tradingSystemManager.viewStoreInfo(req);
        expect(res.data.result).toBe(true);
        expect(res.data.info.storeName).toEqual(storeName);
        expect(res.data.info.productsNames).toEqual([]);
        utils.addNewProducts(tradingSystemManager, storeName, [new Product("p", 1, 2, ProductCategory.HOME)], ownerToken, true);
        utils.addNewProducts(tradingSystemManager, storeName, [new Product("p", 1, 2, ProductCategory.HOME)], ownerToken, false);
        res = tradingSystemManager.viewStoreInfo(req);
        expect(res.data.result).toBe(true);
        expect(res.data.info.storeName).toEqual(storeName);
        expect(res.data.info.productsNames).toEqual(["p"]);
    });


    // TODO
    it("View product information IT test", () => {

        expect(true)
    });

    // TODO
    it("Search IT test", () => {
        expect(true)
    });

    it("Save items in cart IT test", () => {
        const {ownerToken, storeName, products} = utils.makeStoreWithProduct(tradingSystemManager, 1);
        const userToken: string = utils.initSessionRegisterLogin(tradingSystemManager, "tal", "taltal")
        const req: Req.SaveToCartRequest = {
            body: {storeName, catalogNumber: products[0].catalogNumber, amount: 1},
            token: userToken
        }
        const res: Res.BoolResponse = tradingSystemManager.saveProductToCart(req)
        expect(res.data.result).toBeTruthy();
    });

    it("Remove items from cart IT test", () => {
        const {ownerToken, storeName, products} = utils.makeStoreWithProduct(tradingSystemManager, 1);
        const userToken: string = utils.initSessionRegisterLogin(tradingSystemManager, "tal", "taltal")
        const saveReq: Req.SaveToCartRequest = {
            body: {storeName, catalogNumber: products[0].catalogNumber, amount: 1},
            token: userToken
        }
        const saveRes: Res.BoolResponse = tradingSystemManager.saveProductToCart(saveReq)

        const removeReq: Req.RemoveFromCartRequest = {
            body: {
                amount: 1,
                storeName,
                catalogNumber: products[0].catalogNumber
            }, token: userToken
        }
        const watchRes: Res.ViewCartRes = tradingSystemManager.viewCart(removeReq)
        expect(watchRes.data.result).toBeTruthy();
    });

    it("Watch cart IT test", () => {
        const {ownerToken, storeName, products} = utils.makeStoreWithProduct(tradingSystemManager, 1);
        const userToken: string = utils.initSessionRegisterLogin(tradingSystemManager, "tal", "taltal")
        const saveReq: Req.SaveToCartRequest = {
            body: {storeName, catalogNumber: products[0].catalogNumber, amount: 1},
            token: userToken
        }
        const saveRes: Res.BoolResponse = tradingSystemManager.saveProductToCart(saveReq)

        const watchReq: Req.ViewCartReq = {body: {}, token: userToken}
        const watchRes: Res.ViewCartRes = tradingSystemManager.viewCart(watchReq)
        const cart: Cart = {products: [{storeName, bagItems: [{product: products[0], amount: 1}]}]}
        expect(watchRes.data.result).toBeTruthy();
        expect(watchRes.data.cart).toEqual(cart)

    });

    test("pay test", () => {
        const req: Req.PayRequest = {
            body: {
                payment: {
                    cardDetails: {holderName: "tal", number: "152", expYear: "2021", expMonth: "5", ccv: "40"},
                    address: "batyam",
                    city: "batya",
                    country: "israel"
                },
                price: 30
            },
            token
        }
        const res = tradingSystemManager.pay(req)
        expect(res.data.result).toBeTruthy();

    })
    it("Buy items IT test", () => {
        const {ownerToken, storeName, products} = utils.makeStoreWithProduct(tradingSystemManager, 1);
        const userToken: string = utils.initSessionRegisterLogin(tradingSystemManager, "tal", "taltal")
        const saveReq: Req.SaveToCartRequest = {
            body: {storeName, catalogNumber: products[0].catalogNumber, amount: 1},
            token: userToken
        }
        tradingSystemManager.saveProductToCart(saveReq)
        let saveRes: Res.BoolResponse;
        /*
        const purchaseReq: Req.PurchaseRequest = {
            body: {
                payment: {
                    cardDetails: {
                        holderName: "tal",
                        number: "152",
                        expYear: "2021",
                        expMonth: "5",
                        ccv: "40"
                    }, address: "batyam", city: "batya", country: "israel"
                }
            }, token: userToken
        }
        */
        const purchaseReq: UpdateStockRequest = {body:{payment:{totalCharged: 30, lastCC4:"5555"}},token: userToken}
        tradingSystemManager.calculateFinalPrices({token: userToken, body: {}})
        const purchaseRes: Res.PurchaseResponse = tradingSystemManager.purchase(purchaseReq)
        const expectedReciept: IReceipt = {
            date: new Date(),
            purchases: [{
                userName: "tal",
                storeName,
                price: 20,
                item: {catalogNumber: products[0].catalogNumber, id: 2}
            }],payment:{totalCharged: 30, lastCC4:"5555"}
        }
        expect(purchaseRes.data.result).toBeTruthy()

        expect(purchaseRes.data.receipt).toEqual(expectedReciept)
        saveRes = tradingSystemManager.saveProductToCart(saveReq)
        expect(saveRes.data.result).toBeFalsy()

    });


});

