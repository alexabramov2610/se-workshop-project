import {TradingSystemManager} from "../../../src/trading_system/TradingSystemManager";
import {Store} from "../../../src/store/Store";
import {StoreOwner} from "../../../src/user/users/StoreOwner";
import * as Res from "../../../src/api-ext/Response";
import * as Req from "../../../src/api-ext/Request";
import {Product as ProductReq, Item as ItemReq} from "../../../src/api-ext/external_api";
import {RegisteredUser} from "../../../src/user/users/RegisteredUser";
import utils from "./utils"

describe("Store Owner Integration Tests", () => {
    const storeOwnerName: string = "store-owner";
    const storeOwnerPassword: string = "store-owner-pw";
    const storeName: string = "store-name";


    let tradingSystemManager: TradingSystemManager;
    let store: Store;
    let storeOwnerRegisteredUser: RegisteredUser;
    let storeOwner: StoreOwner;
    let token: string;


    beforeEach(() => {
        storeOwnerRegisteredUser = new RegisteredUser(storeOwnerName, storeOwnerPassword);
        store = new Store(storeName);
        storeOwner = new StoreOwner(storeOwnerName);
        tradingSystemManager = new TradingSystemManager();

        token = utils.registeredUserLogin(tradingSystemManager, storeOwnerName, storeOwnerPassword);
        expect(token).toBeDefined();

        const openStoreReq: Req.OpenStoreRequest = {body: { storeName: storeName}, token: token};
        expect(tradingSystemManager.createStore(openStoreReq).data.result).toBeTruthy();
    });


    it("add new products",() => {
        let product1: ProductReq = {name: 'mock1', catalogNumber: 5, price: 123, category: 1};
        let product2: ProductReq = {name: 'mock2', catalogNumber: 15, price: 1123, category: 2};
        let products: ProductReq[] = [product1, product2];

        // all products are valid
        let addProductsReq: Req.AddProductsRequest = {body: { storeName: storeName, products: products}, token: token};
        let productAdditionRes: Res.ProductAdditionResponse = tradingSystemManager.addNewProducts(addProductsReq);
        expect(productAdditionRes.data.result).toBeTruthy();
        expect(productAdditionRes.data.productsNotAdded).toBeDefined();
        expect(productAdditionRes.data.productsNotAdded.length).toBe(0);

        product1 = {name: 'mock1', catalogNumber: 5, price: 123, category: 1};
        product2 = {name: 'mock2', catalogNumber: 15, price: 1123, category: 2};
        products = [product1, product2];

        // all products are invalid
        addProductsReq = {body: { storeName: storeName, products: products}, token: token};
        productAdditionRes = tradingSystemManager.addNewProducts(addProductsReq);
        expect(productAdditionRes.data.result).toBeFalsy();
        expect(productAdditionRes.error).toBeDefined();
        expect(productAdditionRes.data.productsNotAdded).toBeDefined();
        expect(productAdditionRes.data.productsNotAdded.length).toBe(products.length);

        product1 = {name: 'mock1', catalogNumber: -5, price: 123, category: 1};
        product2 = {name: 'mock2', catalogNumber: 12, price: 1123, category: 2};
        products = [product1, product2];

        // one product is valid
        addProductsReq = {body: { storeName: storeName, products: products}, token: token};
        productAdditionRes = tradingSystemManager.addNewProducts(addProductsReq);
        expect(productAdditionRes.data.result).toBeTruthy();
        expect(productAdditionRes.data.productsNotAdded).toBeDefined();
        expect(productAdditionRes.data.productsNotAdded.length).toBe(1);
    });

    it("add new items",() => {
        let item1: ItemReq = {catalogNumber: 1, id: 6};
        let item2: ItemReq = {catalogNumber: 2, id: 5};
        let items: ItemReq[] = [item1, item2];

        let addItemsReq: Req.ItemsAdditionRequest = {body: { storeName: storeName, items: items}, token: token};
        let itemsAdditionRes: Res.ItemsAdditionResponse = tradingSystemManager.addItems(addItemsReq);
        expect(itemsAdditionRes.data.result).toBeFalsy();
        expect(itemsAdditionRes.error).toBeDefined();
        expect(itemsAdditionRes.data.itemsNotAdded).toBeDefined();
        expect(itemsAdditionRes.data.itemsNotAdded.length).toBe(items.length);

        // prepare products to add items
        const product1: ProductReq = {name: 'mock1', catalogNumber: 5, price: 123, category: 1};
        const product2: ProductReq = {name: 'mock2', catalogNumber: 15, price: 1123, category: 2};
        const products: ProductReq[] = [product1, product2];

        // all products are valid
        const addProductsReq: Req.AddProductsRequest = {body: { storeName: storeName, products: products}, token: token};
        const productAdditionRes: Res.ProductAdditionResponse = tradingSystemManager.addNewProducts(addProductsReq);
        expect(productAdditionRes.data.result).toBeTruthy();
        expect(productAdditionRes.data.productsNotAdded).toBeDefined();
        expect(productAdditionRes.data.productsNotAdded.length).toBe(0);

        // new products doesn't affect invalid items
        itemsAdditionRes = tradingSystemManager.addItems(addItemsReq);
        expect(itemsAdditionRes.data.result).toBeFalsy();
        expect(itemsAdditionRes.error).toBeDefined();
        expect(itemsAdditionRes.data.itemsNotAdded).toBeDefined();
        expect(itemsAdditionRes.data.itemsNotAdded.length).toBe(items.length);

        item1 = {catalogNumber: 5, id: 6};
        item2 = {catalogNumber: 15, id: 5};
        items = [item1, item2];

        // valid items
        addItemsReq = {body: { storeName: storeName, items: items}, token: token};
        itemsAdditionRes = tradingSystemManager.addItems(addItemsReq);
        expect(itemsAdditionRes.data.result).toBeTruthy();
        expect(itemsAdditionRes.error).toBeUndefined();
        expect(itemsAdditionRes.data.itemsNotAdded).toBeDefined();
        expect(itemsAdditionRes.data.itemsNotAdded.length).toBe(0);


        item1 = {catalogNumber: -5, id: 6};
        item2 = {catalogNumber: 15, id: 15};
        items = [item1, item2];

        // 1 valid item
        addItemsReq = {body: { storeName: storeName, items: items}, token: token};
        itemsAdditionRes = tradingSystemManager.addItems(addItemsReq);
        expect(itemsAdditionRes.data.result).toBeTruthy();
        expect(itemsAdditionRes.error).toBeUndefined();
        expect(itemsAdditionRes.data.itemsNotAdded).toBeDefined();
        expect(itemsAdditionRes.data.itemsNotAdded.length).toBe(1);

        item1 = {catalogNumber: 5, id: 6};
        item2 = {catalogNumber: 15, id: 5};
        items = [item1, item2];

        // items already exist
        addItemsReq = {body: { storeName: storeName, items: items}, token: token};
        itemsAdditionRes = tradingSystemManager.addItems(addItemsReq);
        expect(itemsAdditionRes.data.result).toBeFalsy();
        expect(itemsAdditionRes.error).toBeDefined();
        expect(itemsAdditionRes.data.itemsNotAdded).toBeDefined();
        expect(itemsAdditionRes.data.itemsNotAdded.length).toBe(items.length);
    });


});

