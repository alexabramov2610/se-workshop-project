import {Req, Res} from 'se-workshop-20-interfaces'
import * as utils from "./utils"
import {Operators, ProductCategory, Rating} from "se-workshop-20-interfaces/dist/src/Enums"
import {
    IProduct,
    Cart,
    IDiscount,
    IDiscountPolicy,
    IItem,
    IPurchasePolicy,
    ISimplePurchasePolicy,
    SearchFilters,
    SearchQuery
} from "se-workshop-20-interfaces/dist/src/CommonInterface";
import * as ServiceFacade from "../../../src/service_facade/ServiceFacade"

describe("Guest Integration Tests", () => {
    const username: string = "username";
    const password: string = "usernamepw123";
    const ownerUsername: string = "username";
    const ownerPassword: string = "usernamepw123";
    const storeName: string = "store name";
    let token: string;

    beforeAll(async (done) => {
        await utils.clearDB();
        await utils.systemInit();
        done();
    });

    beforeEach(async (done) => {
        await utils.systemReset();
        await utils.systemInit();
        token = await utils.getGuestSession();
        expect(token).toBeDefined();
        done();
    });

    afterAll((done) => {
        utils.safeShutdown();
        done();
    });

    it("Register IT test", async (done) => {
        const req: Req.RegisterRequest = {body: {username, password}, token};
        let res: Res.BoolResponse = await ServiceFacade.registerUser(req);
        expect(res.data.result).toBe(true);
        expect(res.error).toBeUndefined();

        res = await ServiceFacade.registerUser(req);
        expect(res.data.result).toBe(false);
        expect(res.data.result).toBeDefined();
        done();
    });

    it("Register && Login IT test", async (done) => {
        // login without register
        const req: Req.LoginRequest = {body: {username, password}, token};
        let res: Res.BoolResponse = await ServiceFacade.loginUser(req);
        expect(res.data.result).toBe(false);

        const regReq: Req.RegisterRequest = {body: {username, password}, token};
        await ServiceFacade.registerUser(regReq);
        res = await ServiceFacade.loginUser(req);

        expect(res.data.result).toBe(true);
        expect(res.error).toBeUndefined();

        // login again
        res = await ServiceFacade.loginUser(req);
        expect(res.data.result).toBe(false);
        expect(res.data.result).toBeDefined();
        done();
    });

    it("View store information IT test", async (done) => {
        const catalogNumber: number = 1;
        const {ownerToken, products} = await utils.makeStoreWithProduct(catalogNumber, 2, ownerUsername, ownerPassword, storeName, undefined);

        const storeInfoReq: Req.StoreInfoRequest = {body: {storeName}, token};
        let storeInfoRes: Res.StoreInfoResponse = await ServiceFacade.viewStoreInfo(storeInfoReq);
        const prodNames: string[] = products.map(product => product.name);

        expect(storeInfoRes.data.result).toBe(true);
        expect(storeInfoRes.data.info.storeName).toEqual(storeName);
        expect(storeInfoRes.data.info.productsNames).toMatchObject(prodNames);

        await utils.removeProducts(storeName, [utils.createProduct("p", 1, 2, ProductCategory.HOME)], ownerToken)
        storeInfoRes = await ServiceFacade.viewStoreInfo(storeInfoReq);

        expect(storeInfoRes.data.result).toBe(true);
        expect(storeInfoRes.data.info.storeName).toEqual(storeName);
        expect(storeInfoRes.data.info.productsNames).toEqual([]);

        await utils.addNewProducts(storeName, [utils.createProduct("p1", 1, 2, ProductCategory.HOME)], ownerToken, true);
        await utils.addNewProducts(storeName, [utils.createProduct("p1", 1, 2, ProductCategory.HOME)], ownerToken, false);
        storeInfoRes = await ServiceFacade.viewStoreInfo(storeInfoReq);

        expect(storeInfoRes.data.result).toBe(true);
        expect(storeInfoRes.data.info.storeName).toEqual(storeName);
        expect(storeInfoRes.data.info.productsNames).toMatchObject(["p1"]);
        done();
    });

    it("View product information IT test", async (done) => {
        const itemsNumber: number = 1;
        const productCatalogNumber: number = 1;
        const catalogNumber: number = 1;
        const {ownerToken, products} = await utils.makeStoreWithProduct(catalogNumber, itemsNumber, ownerUsername, ownerPassword, storeName, undefined);

        const productInfoRequest: Req.ProductInfoRequest = {
            body: {storeName, catalogNumber: productCatalogNumber},
            token
        };
        let productInfoResponse: Res.ProductInfoResponse = await ServiceFacade.viewProductInfo(productInfoRequest);

        expect(productInfoResponse.data.result).toBe(true);
        expect(productInfoResponse.data.info.quantity).toEqual(itemsNumber);
        expect(productInfoResponse.data.info.category).toEqual(products[0].category);
        expect(productInfoResponse.data.info.price).toEqual(products[0].price);
        expect(productInfoResponse.data.info.catalogNumber).toEqual(productCatalogNumber);

        await utils.removeProducts(storeName, [utils.createProduct("p", 1, 2, ProductCategory.HOME)], ownerToken)
        productInfoResponse = await ServiceFacade.viewProductInfo(productInfoRequest);

        expect(productInfoResponse.data.result).toBe(false);

        const prodPrice: number = 200;
        const prodCategory: ProductCategory = ProductCategory.CLOTHING;
        await utils.addNewProducts(storeName, [utils.createProduct("p1", productCatalogNumber, prodPrice, prodCategory)], ownerToken, true);
        await utils.addNewProducts(storeName, [utils.createProduct("p1", productCatalogNumber, prodPrice, prodCategory)], ownerToken, false);
        productInfoResponse = await ServiceFacade.viewProductInfo(productInfoRequest);

        expect(productInfoResponse.data.result).toBe(true);
        expect(productInfoResponse.data.info.quantity).toEqual(0);
        expect(productInfoResponse.data.info.category).toEqual(prodCategory);
        expect(productInfoResponse.data.info.price).toEqual(prodPrice);
        expect(productInfoResponse.data.info.catalogNumber).toEqual(productCatalogNumber);
        done();
    });

    it("Search IT", async (done) => {
        const storeName1: string = "store name1";
        const storeName2: string = "store name2";
        const storeName3: string = "store name3";
        const itemsNumber: number = 2;
        const prodName1: string = "bamba";
        const prodName2: string = "cheese";
        const prodName3: string = "laptop";
        const price1: number = 100;
        const price2: number = 200;
        const price3: number = 300;
        const catalogNumber1: number = 1;
        const catalogNumber2: number = 2;
        const catalogNumber3: number = 3;
        const prodCategory1: ProductCategory = ProductCategory.CLOTHING;
        const prodCategory2: ProductCategory = ProductCategory.ELECTRONICS;
        const prodCategory3: ProductCategory = ProductCategory.GENERAL;
        let totalItemsCatalogNumber1: number = 0;
        let totalItemsCatalogNumber2: number = 0;
        let totalItemsCatalogNumber3: number = 0;

        // no items at all stores
        let filters: SearchFilters = {}
        let searchQuery: SearchQuery = {}
        let searchReq: Req.SearchRequest = {body: {filters, searchQuery}, token};
        let searchRes: Res.SearchResponse = await ServiceFacade.search(searchReq);

        expect(searchRes.data.result).toBeTruthy();
        expect(searchRes.data.products).toHaveLength(totalItemsCatalogNumber1);

        const {ownerToken, products} = await utils.makeStoreWithProductWithProdDetails(prodName1, price1, prodCategory1, catalogNumber1, itemsNumber, ownerUsername, ownerPassword, storeName1, undefined);
        totalItemsCatalogNumber1 = 1;
        await utils.makeStoreWithProductWithProdDetails(prodName2, price2, prodCategory2, catalogNumber2, itemsNumber, ownerUsername, ownerPassword, storeName2, ownerToken);
        totalItemsCatalogNumber2 = 1;

        // low rating - no items
        // filters = {storeRating: Rating.LOW}
        searchQuery = {}
        searchReq = {body: {filters, searchQuery}, token: ownerToken};
        searchRes = await ServiceFacade.search(searchReq);

        expect(searchRes.data.result).toBeTruthy();
        expect(searchRes.data.products).toHaveLength(2);

        // mid rating - all items
        filters = {storeRating: Rating.MEDIUM}
        searchQuery = {}
        searchReq = {body: {filters, searchQuery}, token: ownerToken};
        searchRes = await ServiceFacade.search(searchReq);

        expect(searchRes.data.result).toBeTruthy();
        expect(searchRes.data.products).toHaveLength(totalItemsCatalogNumber1 + totalItemsCatalogNumber2 + totalItemsCatalogNumber3);
        expect(searchRes.data.result).toBeTruthy();
        searchRes.data.products.forEach(product => {
            const storeNamePredicate: number = product.storeName === storeName1 ? 1 : product.storeName === storeName2 ? 2 : product.storeName === storeName3 ? 3 : undefined;
            if (!storeNamePredicate)
                done.fail(new Error("invalid store name retrieved from search IT"));
            expect(product.product.catalogNumber).toBe(storeNamePredicate === 1 ? catalogNumber1 : storeNamePredicate === 2 ? catalogNumber2 : catalogNumber3);
            expect(product.product.category).toBe(storeNamePredicate === 1 ? prodCategory1 : storeNamePredicate === 2 ? prodCategory2 : prodCategory3);
            expect(product.product.name).toBe(storeNamePredicate === 1 ? prodName1 : storeNamePredicate === 2 ? prodName2 : prodName3);
            expect(product.product.price).toBe(storeNamePredicate === 1 ? price1 : storeNamePredicate === 2 ? price2 : price3);
        });

        // prodCategory1
        filters = {productCategory: prodCategory1}
        searchQuery = {}
        searchReq = {body: {filters, searchQuery}, token};
        searchRes = await ServiceFacade.search(searchReq);

        expect(searchRes.data.result).toBeTruthy();
        expect(searchRes.data.products).toHaveLength(totalItemsCatalogNumber1);

        await utils.makeStoreWithProductWithProdDetails(prodName3, price3, prodCategory3, catalogNumber3, itemsNumber, ownerUsername, ownerPassword, storeName3, ownerToken);
        totalItemsCatalogNumber3 = 1;

        // prodCategory3
        filters = {productCategory: prodCategory3}
        searchQuery = {}
        searchReq = {body: {filters, searchQuery}, token};
        searchRes = await ServiceFacade.search(searchReq);

        expect(searchRes.data.result).toBeTruthy();
        expect(searchRes.data.products).toHaveLength(totalItemsCatalogNumber3);
        searchRes.data.products.forEach(product => {
            expect(product.storeName).toBe(storeName3);
            expect(product.product.catalogNumber).toBe(catalogNumber3);
            expect(product.product.category).toBe(prodCategory3);
            expect(product.product.name).toBe(prodName3);
            expect(product.product.price).toBe(price3);
        });

        // by price
        filters = {priceRange: {min: 150, max: 300}}
        searchQuery = {}
        searchReq = {body: {filters, searchQuery}, token};
        searchRes = await ServiceFacade.search(searchReq);

        expect(searchRes.data.result).toBeTruthy();
        expect(searchRes.data.products).toHaveLength(totalItemsCatalogNumber2 + totalItemsCatalogNumber3);
        searchRes.data.products.forEach(product => {
            const storeNamePredicate: number = product.storeName === storeName2 ? 2 : product.storeName === storeName3 ? 3 : undefined;
            if (!storeNamePredicate)
                done.fail(new Error("invalid store name retrieved from search IT"));
            expect(product.product.catalogNumber).toBe(storeNamePredicate === 2 ? catalogNumber2 : catalogNumber3);
            expect(product.product.category).toBe(storeNamePredicate === 2 ? prodCategory2 : prodCategory3);
            expect(product.product.name).toBe(storeNamePredicate === 2 ? prodName2 : prodName3);
            expect(product.product.price).toBe(storeNamePredicate === 2 ? price2 : price3);
        });

        // by price and prodCategory2
        filters = {priceRange: {min: 150, max: 300}, productCategory: prodCategory2}
        searchQuery = {}
        searchReq = {body: {filters, searchQuery}, token};
        searchRes = await ServiceFacade.search(searchReq);

        expect(searchRes.data.result).toBeTruthy();
        expect(searchRes.data.products).toHaveLength(totalItemsCatalogNumber2);
        searchRes.data.products.forEach(product => {
            expect(product.storeName).toBe(storeName2);
            expect(product.product.catalogNumber).toBe(catalogNumber2);
            expect(product.product.category).toBe(prodCategory2);
            expect(product.product.name).toBe(prodName2);
            expect(product.product.price).toBe(price2);
        });

        // by price and prodCategory1
        filters = {priceRange: {min: 150, max: 300}, productCategory: prodCategory1}
        searchQuery = {}
        searchReq = {body: {filters, searchQuery}, token};
        searchRes = await ServiceFacade.search(searchReq);

        expect(searchRes.data.result).toBeTruthy();
        expect(searchRes.data.products).toHaveLength(0);

        // by price, prodCategory2, storeName2, prodName2
        filters = {priceRange: {min: 150, max: 300}, productCategory: prodCategory2}
        searchQuery = {storeName: storeName2, productName: prodName2}
        searchReq = {body: {filters, searchQuery}, token};
        searchRes = await ServiceFacade.search(searchReq);

        expect(searchRes.data.result).toBeTruthy();
        expect(searchRes.data.products).toHaveLength(totalItemsCatalogNumber2);
        searchRes.data.products.forEach(product => {
            expect(product.storeName).toBe(storeName2);
            expect(product.product.catalogNumber).toBe(catalogNumber2);
            expect(product.product.category).toBe(prodCategory2);
            expect(product.product.name).toBe(prodName2);
            expect(product.product.price).toBe(price2);
        });

        // by price, prodCategory2, prodName2
        filters = {priceRange: {min: 150, max: 300}, productCategory: prodCategory2}
        searchQuery = {productName: prodName2}
        searchReq = {body: {filters, searchQuery}, token};
        searchRes = await ServiceFacade.search(searchReq);

        expect(searchRes.data.result).toBeTruthy();
        expect(searchRes.data.products).toHaveLength(totalItemsCatalogNumber2);
        searchRes.data.products.forEach(product => {
            expect(product.storeName).toBe(storeName2);
            expect(product.product.catalogNumber).toBe(catalogNumber2);
            expect(product.product.category).toBe(prodCategory2);
            expect(product.product.name).toBe(prodName2);
            expect(product.product.price).toBe(price2);
        });

        // by price, prodCategory2, prodName2, storeName3
        filters = {priceRange: {min: 150, max: 300}, productCategory: prodCategory2}
        searchQuery = {storeName: storeName3, productName: prodName2}
        searchReq = {body: {filters, searchQuery}, token};
        searchRes = await ServiceFacade.search(searchReq);

        expect(searchRes.data.result).toBeTruthy();
        expect(searchRes.data.products).toHaveLength(0);

        // by price, prodCategory2, prodName2, storeName3
        filters = {priceRange: {min: 150, max: 300}, productCategory: prodCategory2}
        searchQuery = {storeName: storeName3, productName: prodName2}
        searchReq = {body: {filters, searchQuery}, token};
        searchRes = await ServiceFacade.search(searchReq);

        expect(searchRes.data.result).toBeTruthy();
        expect(searchRes.data.products).toHaveLength(0);

        done();
    });

    it("Save items in cart IT test", async (done) => {
        const catalogNumber: number = 1;
        const {ownerToken, products} = await utils.makeStoreWithProduct(catalogNumber, 2, ownerUsername, ownerPassword, storeName, undefined);

        const req: Req.SaveToCartRequest = {
            body: {storeName, catalogNumber: products[0].catalogNumber, amount: 1},
            token: token
        }
        const res: Res.BoolResponse = await ServiceFacade.saveProductToCart(req)
        expect(res.data.result).toBeTruthy();
        done();
    });

    it("Remove items from cart IT test", async (done) => {
        const catalogNumber: number = 1;
        const {ownerToken, products} = await utils.makeStoreWithProduct(catalogNumber, 2, ownerUsername, ownerPassword, storeName, undefined);

        const req: Req.SaveToCartRequest = {
            body: {storeName, catalogNumber: products[0].catalogNumber, amount: 1},
            token: token
        }
        const res: Res.BoolResponse = await ServiceFacade.saveProductToCart(req)
        expect(res.data.result).toBeTruthy();

        const removeReq: Req.RemoveFromCartRequest = {
            body: {
                amount: 1,
                storeName,
                catalogNumber: products[0].catalogNumber
            }, token: token
        }
        const removeRes: Res.BoolResponse = await ServiceFacade.removeProductFromCart(removeReq)
        expect(removeRes.data.result).toBeTruthy();
        done();
    });

    it("Watch cart IT test", async (done) => {
        const catalogNumber: number = 1;
        const {ownerToken, products} = await utils.makeStoreWithProduct(catalogNumber, 2, ownerUsername, ownerPassword, storeName, undefined);

        const req: Req.SaveToCartRequest = {
            body: {storeName, catalogNumber: products[0].catalogNumber, amount: 1},
            token: token
        }
        const res: Res.BoolResponse = await ServiceFacade.saveProductToCart(req)
        expect(res.data.result).toBeTruthy();

        const watchReq: Req.ViewCartReq = {body: {}, token: token}
        const watchRes: Res.ViewCartRes = await ServiceFacade.viewCart(watchReq)

        const cart: Cart = {products: [{storeName, bagItems: [{product: products[0], amount: 1, finalPrice: 20}]}]}
        expect(watchRes.data.result).toBeTruthy();
        watchRes.data.cart.products[0].bagItems[0].product.db_id = "0"
        expect(watchRes.data.cart).toEqual(cart)
        done();
    });

    it("pay test", async (done) => {
        const req: Req.PayRequest = {
            body: {
                payment: {
                    cardDetails: {
                        holderName: "tal", number: "152", expYear: "21", expMonth: "5", cvv: "40", id: "123456789"
                    },
                    address: "batyam",
                    city: "batya",
                    country: "israel",

                },
                price: 30
            },
            token
        }
        const res = await ServiceFacade.pay(req)
        expect(res.data.result).toBeTruthy();
        done();
    })

    it("Buy items IT test", async (done) => {
        const catalogNumber: number = 1;
        const {ownerToken, products} = await utils.makeStoreWithProduct(catalogNumber, 2, ownerUsername, ownerPassword, storeName, undefined);

        const req: Req.SaveToCartRequest = {
            body: {storeName, catalogNumber: products[0].catalogNumber, amount: 1},
            token: token
        }
        const res: Res.BoolResponse = await ServiceFacade.saveProductToCart(req)
        expect(res.data.result).toBeTruthy();

        const purchaseReq: Req.PurchaseRequest = {
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
        const purchaseResponse: Res.PurchaseResponse = await ServiceFacade.purchase(purchaseReq)
        expect(purchaseResponse.data.result).toBeTruthy();
        done();
    });

    /*
    -------------Discounts tests-------------
     */
    it("Buy items with simple discount IT test", async (done) => {
        const catalogNumber: number = 1;
        const {ownerToken, products} = await utils.makeStoreWithProduct(catalogNumber, 2, ownerUsername, ownerPassword, storeName, undefined);

        const startDate: Date = new Date()
        const duration: number = 3;
        const simpleDiscount: IDiscount = {
            startDate,
            duration,
            products: [1],
            percentage: 50,
        }
        const policy: IDiscountPolicy = {discounts: [{discount: simpleDiscount, operator: Operators.AND}]}
        const setPolicyReq: Req.SetDiscountsPolicyRequest = {
            body: {storeName, policy},
            token: ownerToken
        }
        const makeDiscountRes: Res.AddDiscountResponse = await ServiceFacade.setDiscountsPolicy(setPolicyReq);

        const req: Req.SaveToCartRequest = {
            body: {storeName, catalogNumber: products[0].catalogNumber, amount: 1},
            token
        }
        const res: Res.BoolResponse = await ServiceFacade.saveProductToCart(req)
        expect(res.data.result).toBeTruthy();

        const purchaseReq: Req.PurchaseRequest = await utils.getPurchaseReq(token)
        const purchaseResponse: Res.PurchaseResponse = await ServiceFacade.purchase(purchaseReq)
        expect(purchaseResponse.data.result).toBeTruthy();
        expect(purchaseResponse.data.receipt.payment.totalCharged).toEqual(10);
        done();
    });

    it("Buy items with PRODUCT COND discount IT test", async (done) => {
        const catalogNumber: number = 1;
        const {ownerToken, products} = await utils.makeStoreWithProduct(catalogNumber, 5, ownerUsername, ownerPassword, storeName, undefined);

        const startDate: Date = new Date()
        const duration: number = 3;
        const condDiscount: IDiscount = {
            startDate,
            duration,
            products: [1],
            percentage: 50,
            condition: [{condition: {catalogNumber: 1, minAmount: 1}, operator: Operators.AND}]
        }
        const policy: IDiscountPolicy = {discounts: [{discount: condDiscount, operator: Operators.AND}]}
        const setPolicyReq: Req.SetDiscountsPolicyRequest = {
            body: {storeName, policy},
            token: ownerToken
        }
        const makeDiscountRes: Res.AddDiscountResponse = await ServiceFacade.setDiscountsPolicy(setPolicyReq);


        const req: Req.SaveToCartRequest = {
            body: {storeName, catalogNumber: products[0].catalogNumber, amount: 4},
            token: token
        }
        const res: Res.BoolResponse = await ServiceFacade.saveProductToCart(req)
        expect(res.data.result).toBeTruthy();

        const purchaseReq: Req.PurchaseRequest = await utils.getPurchaseReq(token);
        const purchaseResponse: Res.PurchaseResponse = await ServiceFacade.purchase(purchaseReq)
        expect(purchaseResponse.data.result).toBeTruthy();
        expect(purchaseResponse.data.receipt.payment.totalCharged).toEqual(60);
        done();
    });

    it("Buy items with XOR discount", async (done) => {
        const catalogNumber: number = 1;
        const {ownerToken, products} = await utils.makeStoreWithProduct(catalogNumber, 5, ownerUsername, ownerPassword, storeName, undefined);
        const products2: IProduct[] = [utils.createProduct("bisli", catalogNumber + 1, 30, ProductCategory.GENERAL)]
        await utils.addNewProducts(storeName, products2, ownerToken, true);
        let items: IItem[] = [];
        for (let i = 0; i < 5; i++)
            items = items.concat({catalogNumber: catalogNumber + 1, id: i + 1});
        await utils.addNewItems(storeName, items, ownerToken, true);

        const startDate: Date = new Date()
        const duration: number = 3;
        const simpleDiscount: IDiscount = {
            startDate,
            duration,
            products: [1],
            percentage: 50,
        }
        const simpleDiscount2: IDiscount = {
            startDate,
            duration,
            products: [2],
            percentage: 50,
        }

        const policy: IDiscountPolicy = {
            discounts: [{
                discount: simpleDiscount,
                operator: Operators.XOR
            }, {discount: simpleDiscount2, operator: Operators.AND}]
        }
        const setPolicyReq: Req.SetDiscountsPolicyRequest = {
            body: {storeName, policy},
            token: ownerToken
        }
        const makeDiscountRes: Res.AddDiscountResponse = await ServiceFacade.setDiscountsPolicy(setPolicyReq);

        let req: Req.SaveToCartRequest = {
            body: {storeName, catalogNumber: products[0].catalogNumber, amount: 2},
            token: token
        }

        let res: Res.BoolResponse = await ServiceFacade.saveProductToCart(req)
        expect(res.data.result).toBeTruthy();
        req = {
            body: {storeName, catalogNumber: products2[0].catalogNumber, amount: 2},
            token: token
        }
        res = await ServiceFacade.saveProductToCart(req)
        expect(res.data.result).toBeTruthy();

        const purchaseReq: Req.PurchaseRequest = await utils.getPurchaseReq(token);
        const purchaseResponse: Res.PurchaseResponse = await ServiceFacade.purchase(purchaseReq)
        expect(purchaseResponse.data.result).toBeTruthy();
        expect(purchaseResponse.data.receipt.payment.totalCharged).toEqual(80); // 20*2*(50%) + 30*2 - one item with discount
        done();
    });

    it("Buy items with AND discount", async (done) => {
        const catalogNumber: number = 1;
        const {ownerToken, products} = await utils.makeStoreWithProduct(catalogNumber, 5, ownerUsername, ownerPassword, storeName, undefined);
        const products2: IProduct[] = [utils.createProduct("bisli", catalogNumber + 1, 30, ProductCategory.GENERAL)]
        await utils.addNewProducts(storeName, products2, ownerToken, true);
        let items: IItem[] = [];
        for (let i = 0; i < 5; i++)
            items = items.concat({catalogNumber: catalogNumber + 1, id: i + 1});
        await utils.addNewItems(storeName, items, ownerToken, true);

        const startDate: Date = new Date()
        const duration: number = 3;
        const simpleDiscount: IDiscount = {
            startDate,
            duration,
            products: [1],
            percentage: 50,
        }
        const simpleDiscount2: IDiscount = {
            startDate,
            duration,
            products: [1],
            percentage: 20,
        }

        const policy: IDiscountPolicy = {
            discounts: [{
                discount: simpleDiscount,
                operator: Operators.AND
            }, {discount: simpleDiscount2, operator: Operators.AND}]
        }
        const setPolicyReq: Req.SetDiscountsPolicyRequest = {
            body: {storeName, policy},
            token: ownerToken
        }
        const makeDiscountRes: Res.AddDiscountResponse = await ServiceFacade.setDiscountsPolicy(setPolicyReq);

        // add two products to cart
        let req: Req.SaveToCartRequest = {
            body: {storeName, catalogNumber: products[0].catalogNumber, amount: 2},
            token: token
        }
        let res: Res.BoolResponse = await ServiceFacade.saveProductToCart(req)
        expect(res.data.result).toBeTruthy();
        req = {
            body: {storeName, catalogNumber: products2[0].catalogNumber, amount: 2},
            token: token
        }
        res = await ServiceFacade.saveProductToCart(req)
        expect(res.data.result).toBeTruthy();

        const purchaseReq: Req.PurchaseRequest = await utils.getPurchaseReq(token);
        const purchaseResponse: Res.PurchaseResponse = await ServiceFacade.purchase(purchaseReq)
        expect(purchaseResponse.data.result).toBeTruthy();
        expect(purchaseResponse.data.receipt.payment.totalCharged).toEqual(76); // 20*2*(50%)*(20%) + 30*2 - one item with discount
        done();
    });

    it("Buy items with OR discount", async (done) => {
        const catalogNumber: number = 1;
        const {ownerToken, products} = await utils.makeStoreWithProduct(catalogNumber, 5, ownerUsername, ownerPassword, storeName, undefined);
        const products2: IProduct[] = [utils.createProduct("bisli", catalogNumber + 1, 30, ProductCategory.GENERAL)]
        await utils.addNewProducts(storeName, products2, ownerToken, true);
        let items: IItem[] = [];
        for (let i = 0; i < 5; i++)
            items = items.concat({catalogNumber: catalogNumber + 1, id: i + 1});
        await utils.addNewItems(storeName, items, ownerToken, true);

        const startDate: Date = new Date()
        const duration: number = 3;
        const simpleDiscount: IDiscount = {
            startDate,
            duration,
            products: [1],
            percentage: 50,
        }
        const simpleDiscount2: IDiscount = {
            startDate,
            duration,
            products: [1],
            percentage: 20,
        }

        const policy: IDiscountPolicy = {
            discounts: [{
                discount: simpleDiscount,
                operator: Operators.OR
            }, {discount: simpleDiscount2, operator: Operators.AND}]
        }
        const setPolicyReq: Req.SetDiscountsPolicyRequest = {
            body: {storeName, policy},
            token: ownerToken
        }
        const makeDiscountRes: Res.AddDiscountResponse = await ServiceFacade.setDiscountsPolicy(setPolicyReq);

        // add two products to cart
        let req: Req.SaveToCartRequest = {
            body: {storeName, catalogNumber: products[0].catalogNumber, amount: 2},
            token: token
        }
        let res: Res.BoolResponse = await ServiceFacade.saveProductToCart(req)
        expect(res.data.result).toBeTruthy();
        req = {
            body: {storeName, catalogNumber: products2[0].catalogNumber, amount: 2},
            token: token
        }
        res = await ServiceFacade.saveProductToCart(req)
        expect(res.data.result).toBeTruthy();

        const purchaseReq: Req.PurchaseRequest = await utils.getPurchaseReq(token);
        const purchaseResponse: Res.PurchaseResponse = await ServiceFacade.purchase(purchaseReq)
        expect(purchaseResponse.data.result).toBeTruthy();
        expect(purchaseResponse.data.receipt.payment.totalCharged).toEqual(80); // 20*2*(50%) + 30*2 - one item with discount (OR)
        done();
    });

    it("Buy items with STORE COND discount", async (done) => {
        const catalogNumber: number = 1;
        const {ownerToken, products} = await utils.makeStoreWithProduct(catalogNumber, 5, ownerUsername, ownerPassword, storeName, undefined);
        const products2: IProduct[] = [utils.createProduct("bisli", catalogNumber + 1, 100, ProductCategory.GENERAL)]
        await utils.addNewProducts(storeName, products2, ownerToken, true);
        let items: IItem[] = [];
        for (let i = 0; i < 5; i++)
            items = items.concat({catalogNumber: catalogNumber + 1, id: i + 1});
        await utils.addNewItems(storeName, items, ownerToken, true);

        const startDate: Date = new Date()
        const duration: number = 3;
        const condDiscount: IDiscount = {
            startDate,
            duration,
            products: [1, 2],
            percentage: 5,
            condition: [{condition: {minPay: 200}, operator: Operators.AND}]
        }

        const policy: IDiscountPolicy = {discounts: [{discount: condDiscount, operator: Operators.OR}]}
        const setPolicyReq: Req.SetDiscountsPolicyRequest = {
            body: {storeName, policy},
            token: ownerToken
        }
        const makeDiscountRes: Res.AddDiscountResponse = await ServiceFacade.setDiscountsPolicy(setPolicyReq);

        // add two products to cart
        let req: Req.SaveToCartRequest = {
            body: {storeName, catalogNumber: products[0].catalogNumber, amount: 2},
            token: token
        }
        let res: Res.BoolResponse = await ServiceFacade.saveProductToCart(req)
        expect(res.data.result).toBeTruthy();
        req = {
            body: {storeName, catalogNumber: products2[0].catalogNumber, amount: 2},
            token: token
        }
        res = await ServiceFacade.saveProductToCart(req)
        expect(res.data.result).toBeTruthy();

        const purchaseReq: Req.PurchaseRequest = await utils.getPurchaseReq(token);
        const purchaseResponse: Res.PurchaseResponse = await ServiceFacade.purchase(purchaseReq)
        expect(purchaseResponse.data.result).toBeTruthy();
        expect(purchaseResponse.data.receipt.payment.totalCharged).toEqual(228); //  100*2*(5%) + 20*2*(5%) - one item with discount
        done();
    });

    it("Buy items with NO respect to store policy", async (done) => {
        const catalogNumber: number = 1;
        const {ownerToken, products} = await utils.makeStoreWithProduct(catalogNumber, 5, ownerUsername, ownerPassword, storeName, undefined);
        const products2: IProduct[] = [utils.createProduct("bisli", catalogNumber + 1, 100, ProductCategory.GENERAL)]
        await utils.addNewProducts(storeName, products2, ownerToken, true);
        let items: IItem[] = [];
        for (let i = 0; i < 5; i++)
            items = items.concat({catalogNumber: catalogNumber + 1, id: i + 1});
        await utils.addNewItems(storeName, items, ownerToken, true);

        const simplePolicy1: ISimplePurchasePolicy = {
            productPolicy: {catalogNumber: 1, minAmount: 2, maxAmount: 4}
        }
        const simplePolicy2: ISimplePurchasePolicy = {
            bagPolicy: {minAmount: 2, maxAmount: 3}
        }


        const policy: IPurchasePolicy = {
            policy: [{
                policy: simplePolicy1,
                operator: Operators.AND
            }, {policy: simplePolicy2, operator: Operators.AND}]
        }
        const setPolicyReq: Req.SetPurchasePolicyRequest = {
            body: {storeName, policy},
            token: ownerToken
        }
        await ServiceFacade.setPurchasePolicy(setPolicyReq)
        // add two products to cart
        let req: Req.SaveToCartRequest = {
            body: {storeName, catalogNumber: products[0].catalogNumber, amount: 1},
            token: token
        }
        let res: Res.BoolResponse = await ServiceFacade.saveProductToCart(req)
        expect(res.data.result).toBeTruthy();
        req = {
            body: {storeName, catalogNumber: products2[0].catalogNumber, amount: 2},
            token: token
        }
        res = await ServiceFacade.saveProductToCart(req)
        expect(res.data.result).toBeTruthy();

        const purchaseReq: Req.PurchaseRequest = await utils.getPurchaseReq(token);
        const purchaseResponse: Res.PurchaseResponse = await ServiceFacade.purchase(purchaseReq)
        expect(purchaseResponse.data.result).toBeFalsy();
        done();
    });

    it("Buy items with respect to store policy", async (done) => {
        const catalogNumber: number = 1;
        const {ownerToken, products} = await utils.makeStoreWithProduct(catalogNumber, 5, ownerUsername, ownerPassword, storeName, undefined);
        const products2: IProduct[] = [utils.createProduct("bisli", catalogNumber + 1, 100, ProductCategory.GENERAL)]
        await utils.addNewProducts(storeName, products2, ownerToken, true);
        let items: IItem[] = [];
        for (let i = 0; i < 5; i++)
            items = items.concat({catalogNumber: catalogNumber + 1, id: i + 1});
        await utils.addNewItems(storeName, items, ownerToken, true);

        const simplePolicy1: ISimplePurchasePolicy = {
            productPolicy: {catalogNumber: 1, minAmount: 2, maxAmount: 4}
        }
        const simplePolicy2: ISimplePurchasePolicy = {
            bagPolicy: {minAmount: 3, maxAmount: 5}
        }

        const policy: IPurchasePolicy = {
            policy: [{
                policy: simplePolicy1,
                operator: Operators.AND
            }, {policy: simplePolicy2, operator: Operators.AND}]
        }
        const setPolicyReq: Req.SetPurchasePolicyRequest = {
            body: {storeName, policy},
            token: ownerToken
        }
        await ServiceFacade.setPurchasePolicy(setPolicyReq)
        // add two products to cart
        let req: Req.SaveToCartRequest = {
            body: {storeName, catalogNumber: products[0].catalogNumber, amount: 2},
            token: token
        }
        let res: Res.BoolResponse = await ServiceFacade.saveProductToCart(req)
        expect(res.data.result).toBeTruthy();
        req = {
            body: {storeName, catalogNumber: products2[0].catalogNumber, amount: 1},
            token: token
        }
        res = await ServiceFacade.saveProductToCart(req)
        expect(res.data.result).toBeTruthy();

        const purchaseReq: Req.PurchaseRequest = await utils.getPurchaseReq(token);
        const purchaseResponse: Res.PurchaseResponse = await ServiceFacade.purchase(purchaseReq)
        expect(purchaseResponse.data.result).toBeTruthy();
        done();
    });

    it("Buy items with CATEGORY discount", async (done) => {
        const catalogNumber: number = 1;
        const {ownerToken, products} = await utils.makeStoreWithProduct(catalogNumber, 5, ownerUsername, ownerPassword, storeName, undefined);
        const products2: IProduct[] = [utils.createProduct("bisli", catalogNumber + 1, 100, ProductCategory.ELECTRONICS)]
        await utils.addNewProducts(storeName, products2, ownerToken, true);
        let items: IItem[] = [];
        for (let i = 0; i < 5; i++)
            items = items.concat({catalogNumber: catalogNumber + 1, id: i + 1});
        await utils.addNewItems(storeName, items, ownerToken, true);

        const startDate: Date = new Date()
        const duration: number = 3;
        const simpleDiscount: IDiscount = {
            startDate,
            duration,
            products: [],
            category: ProductCategory.GENERAL,
            percentage: 50,
        }
        const simpleDiscount2: IDiscount = {
            startDate,
            duration,
            products: [],
            category: ProductCategory.ELECTRONICS,
            percentage: 10,
        }

        const policy: IDiscountPolicy = {
            discounts: [{
                discount: simpleDiscount,
                operator: Operators.AND
            }, {discount: simpleDiscount2, operator: Operators.AND}]
        }
        const setPolicyReq: Req.SetDiscountsPolicyRequest = {
            body: {storeName, policy},
            token: ownerToken
        }
        const makeDiscountRes: Res.AddDiscountResponse = await ServiceFacade.setDiscountsPolicy(setPolicyReq);

        // add two products to cart
        let req: Req.SaveToCartRequest = {
            body: {storeName, catalogNumber: products[0].catalogNumber, amount: 2},
            token: token
        }
        let res: Res.BoolResponse = await ServiceFacade.saveProductToCart(req)
        expect(res.data.result).toBeTruthy();
        req = {
            body: {storeName, catalogNumber: products2[0].catalogNumber, amount: 2},
            token: token
        }
        res = await ServiceFacade.saveProductToCart(req)
        expect(res.data.result).toBeTruthy();

        const purchaseReq: Req.PurchaseRequest = await utils.getPurchaseReq(token);
        const purchaseResponse: Res.PurchaseResponse = await ServiceFacade.purchase(purchaseReq)
        expect(purchaseResponse.data.result).toBeTruthy();
        expect(purchaseResponse.data.receipt.payment.totalCharged).toEqual(200); // 20*2*(50%) + 100*2*10% - one item with discount
        done();
    });

    it("Buy items with respect to xor store policy", async (done) => {
        const catalogNumber: number = 1;
        const {ownerToken, products} = await utils.makeStoreWithProduct(catalogNumber, 5, ownerUsername, ownerPassword, storeName, undefined);
        const products2: IProduct[] = [utils.createProduct("bisli", catalogNumber + 1, 100, ProductCategory.GENERAL)]
        await utils.addNewProducts(storeName, products2, ownerToken, true);
        let items: IItem[] = [];
        for (let i = 0; i < 5; i++)
            items = items.concat({catalogNumber: catalogNumber + 1, id: i + 1});
        await utils.addNewItems(storeName, items, ownerToken, true);

        const simplePolicy1: ISimplePurchasePolicy = {
            productPolicy: {catalogNumber: 1, minAmount: 2, maxAmount: 4}
        }
        const simplePolicy2: ISimplePurchasePolicy = {
            bagPolicy: {minAmount: 3, maxAmount: 5}
        }

        const policy: IPurchasePolicy = {
            policy: [{
                policy: simplePolicy1,
                operator: Operators.XOR
            }, {policy: simplePolicy2, operator: Operators.AND}]
        }
        const setPolicyReq: Req.SetPurchasePolicyRequest = {
            body: {storeName, policy},
            token: ownerToken
        }
        await ServiceFacade.setPurchasePolicy(setPolicyReq)
        // add two products to cart
        let req: Req.SaveToCartRequest = {
            body: {storeName, catalogNumber: products[0].catalogNumber, amount: 2},
            token: token
        }
        let res: Res.BoolResponse = await ServiceFacade.saveProductToCart(req)
        expect(res.data.result).toBeTruthy();
        req = {
            body: {storeName, catalogNumber: products2[0].catalogNumber, amount: 1},
            token: token
        }
        res = await ServiceFacade.saveProductToCart(req)
        expect(res.data.result).toBeTruthy();

        const purchaseReq: Req.PurchaseRequest = await utils.getPurchaseReq(token);
        const purchaseResponse: Res.PurchaseResponse = await ServiceFacade.purchase(purchaseReq)
        expect(purchaseResponse.data.result).toBeFalsy();
        done();
    });
});

