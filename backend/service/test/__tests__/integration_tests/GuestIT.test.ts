import {Req, Res} from 'se-workshop-20-interfaces'
import * as utils from "./utils"
import {Product} from "domain_layer/dist/src/trading_system/data/Product";
import {ProductCategory} from "se-workshop-20-interfaces/dist/src/Enums"
import {Cart} from "se-workshop-20-interfaces/dist/src/CommonInterface";
import * as ServiceFacade from "../../../src/service_facade/ServiceFacade"

describe("Guest Integration Tests", () => {
    const username: string = "username";
    const password: string = "usernamepw123";
    const ownerUsername: string = "username";
    const ownerPassword: string = "usernamepw123";
    let token: string;

    beforeAll(() => {
        utils.systemInit();
    });

    beforeEach(() => {
        utils.systemReset();
        token = utils.getGuestSession();
        expect(token).toBeDefined();
    });

    it("Register IT test", () => {
        const req: Req.RegisterRequest = {body: {username, password}, token};
        let res: Res.BoolResponse = ServiceFacade.registerUser(req);
        expect(res.data.result).toBe(true);
        expect(res.error).toBeUndefined();

        res = ServiceFacade.registerUser(req);
        expect(res.data.result).toBe(false);
        expect(res.data.result).toBeDefined();
    });

    it("Register && Login IT test", () => {
        const regReq: Req.RegisterRequest = {body: {username, password}, token};
        ServiceFacade.registerUser(regReq);
        const req: Req.LoginRequest = {body: {username, password}, token};
        let res: Res.BoolResponse = ServiceFacade.loginUser(req);

        expect(res.data.result).toBe(true);
        expect(res.error).toBeUndefined();

        res = ServiceFacade.loginUser(req);
        expect(res.data.result).toBe(false);
        expect(res.data.result).toBeDefined();
    });

    it("View store information IT test", () => {
        const storeName: string = "store name";
        const { ownerToken, products} = utils.makeStoreWithProduct(2, ownerUsername, ownerPassword, storeName, undefined);

        const storeInfoReq: Req.StoreInfoRequest = {body: {storeName}, token};
        let storeInfoRes: Res.StoreInfoResponse = ServiceFacade.viewStoreInfo(storeInfoReq);
        const prodNames: string[] = products.map(product => product.name);

        expect(storeInfoRes.data.result).toBe(true);
        expect(storeInfoRes.data.info.storeName).toEqual(storeName);
        expect(storeInfoRes.data.info.productsNames).toMatchObject(prodNames);

        utils.removeProducts(storeName, [new Product("p", 1, 2, ProductCategory.HOME)], ownerToken)
        storeInfoRes = ServiceFacade.viewStoreInfo(storeInfoReq);

        expect(storeInfoRes.data.result).toBe(true);
        expect(storeInfoRes.data.info.storeName).toEqual(storeName);
        expect(storeInfoRes.data.info.productsNames).toEqual([]);

        utils.addNewProducts(storeName, [new Product("p1", 1, 2, ProductCategory.HOME)], ownerToken, true);
        utils.addNewProducts(storeName, [new Product("p1", 1, 2, ProductCategory.HOME)], ownerToken, false);
        storeInfoRes = ServiceFacade.viewStoreInfo(storeInfoReq);

        expect(storeInfoRes.data.result).toBe(true);
        expect(storeInfoRes.data.info.storeName).toEqual(storeName);
        expect(storeInfoRes.data.info.productsNames).toMatchObject(["p1"]);
    });

    it("View product information IT test", () => {
        const storeName: string = "store name";
        const itemsNumber: number = 1;
        const productCatalogNumber: number = 1;
        const { ownerToken, products } = utils.makeStoreWithProduct(itemsNumber, ownerUsername, ownerPassword, storeName, undefined);

        const productInfoRequest: Req.ProductInfoRequest = {body: {storeName, catalogNumber: productCatalogNumber}, token};
        let productInfoResponse: Res.ProductInfoResponse = ServiceFacade.viewProductInfo(productInfoRequest);

        expect(productInfoResponse.data.result).toBe(true);
        expect(productInfoResponse.data.info.quantity).toEqual(itemsNumber);
        expect(productInfoResponse.data.info.category).toEqual(products[0].category);
        expect(productInfoResponse.data.info.price).toEqual(products[0].price);
        expect(productInfoResponse.data.info.catalogNumber).toEqual(productCatalogNumber);

        utils.removeProducts(storeName, [new Product("p", 1, 2, ProductCategory.HOME)], ownerToken)
        productInfoResponse = ServiceFacade.viewProductInfo(productInfoRequest);

        expect(productInfoResponse.data.result).toBe(false);

        const prodPrice: number = 200;
        const prodCategory: ProductCategory = ProductCategory.CLOTHING;
        utils.addNewProducts(storeName, [new Product("p1", productCatalogNumber, prodPrice, prodCategory)], ownerToken, true);
        utils.addNewProducts(storeName, [new Product("p1", productCatalogNumber, prodPrice, prodCategory)], ownerToken, false);
        productInfoResponse = ServiceFacade.viewProductInfo(productInfoRequest);

        expect(productInfoResponse.data.result).toBe(true);
        expect(productInfoResponse.data.info.quantity).toEqual(0);
        expect(productInfoResponse.data.info.category).toEqual(prodCategory);
        expect(productInfoResponse.data.info.price).toEqual(prodPrice);
        expect(productInfoResponse.data.info.catalogNumber).toEqual(productCatalogNumber);
    });

    it("Search IT test", () => {    //todo
        expect(true)
    });

    it("Save items in cart IT test", () => {
        const storeName: string = "store name";
        const { ownerToken, products} = utils.makeStoreWithProduct(2, ownerUsername, ownerPassword, storeName, undefined);

        const req: Req.SaveToCartRequest = {
            body: {storeName, catalogNumber: products[0].catalogNumber, amount: 1},
            token: token
        }
        const res: Res.BoolResponse = ServiceFacade.saveProductToCart(req)
        expect(res.data.result).toBeTruthy();
    });

    it("Remove items from cart IT test", () => {
        const storeName: string = "store name";
        const { ownerToken, products} = utils.makeStoreWithProduct(2, ownerUsername, ownerPassword, storeName, undefined);

        const req: Req.SaveToCartRequest = {
            body: {storeName, catalogNumber: products[0].catalogNumber, amount: 1},
            token: token
        }
        const res: Res.BoolResponse = ServiceFacade.saveProductToCart(req)
        expect(res.data.result).toBeTruthy();

        const removeReq: Req.RemoveFromCartRequest = {
            body: {
                amount: 1,
                storeName,
                catalogNumber: products[0].catalogNumber
            }, token: token
        }
        const removeRes: Res.BoolResponse = ServiceFacade.removeProductFromCart(removeReq)
        expect(removeRes.data.result).toBeTruthy();
    });

    it("Watch cart IT test", () => {
        const storeName: string = "store name";
        const { ownerToken, products} = utils.makeStoreWithProduct(2, ownerUsername, ownerPassword, storeName, undefined);

        const req: Req.SaveToCartRequest = {
            body: {storeName, catalogNumber: products[0].catalogNumber, amount: 1},
            token: token
        }
        const res: Res.BoolResponse = ServiceFacade.saveProductToCart(req)
        expect(res.data.result).toBeTruthy();

        const watchReq: Req.ViewCartReq = {body: {}, token: token}
        const watchRes: Res.ViewCartRes = ServiceFacade.viewCart(watchReq)

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
        const res = ServiceFacade.pay(req)
        expect(res.data.result).toBeTruthy();
    })

    it("Buy items IT test", () => {
        const storeName: string = "store name";
        const { ownerToken, products} = utils.makeStoreWithProduct(2, ownerUsername, ownerPassword, storeName, undefined);

        const req: Req.SaveToCartRequest = {
            body: {storeName, catalogNumber: products[0].catalogNumber, amount: 1},
            token: token
        }
        const res: Res.BoolResponse = ServiceFacade.saveProductToCart(req)
        expect(res.data.result).toBeTruthy();

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
            }, token: token
        }
        const purchaseResponse: Res.PurchaseResponse = ServiceFacade.purchase(purchaseReq)
        expect(purchaseResponse.data.result).toBeTruthy();
    });


});

