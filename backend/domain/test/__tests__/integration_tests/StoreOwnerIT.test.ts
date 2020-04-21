import {TradingSystemManager} from "../../../src/trading_system/TradingSystemManager";
import {Store} from "../../../src/store/Store";
import {StoreOwner} from "../../../src/user/users/StoreOwner";
import * as Res from "../../../src/api-ext/Response";
import * as Req from "../../../src/api-ext/Request";
import {Product as ProductReq, Item as ItemReq, ProductCategory} from "../../../src/api-ext/external_api";
import {RegisteredUser} from "../../../src/user/users/RegisteredUser";
import utils from "./utils"
import {Product} from "../../../src/trading_system/data/Product";
import {logger} from "../../../src/api-int/Logger";

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
        logger.info("starting IT: add new products");
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
        logger.info("starting IT: add new items");
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

        // new products addition doesn't affect invalid items
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

    it("change product details and view product info", () => {
        logger.info("starting IT: change product details");

        const catalogNumber1: number = 5;
        const oldName1: string = "old-name1";
        const newName1: string = "newProdName";
        const oldPrice1: number = 15;
        const category1: ProductCategory = ProductCategory.Electronics;

        const catalogNumber2: number = 15;
        const oldName2: string = "old-name2";
        const oldPrice2: number = 200;
        const newPrice2: number = 500;
        const category2: ProductCategory = ProductCategory.Hobbies;

        const product1: ProductReq = {name: oldName1, catalogNumber: catalogNumber1, price: oldPrice1, category: category1};
        const product2: ProductReq = {name: oldName2, catalogNumber: catalogNumber2, price: oldPrice2, category: category2};
        const products: ProductReq[] = [product1, product2];

        // all products are valid
        const addProductsReq: Req.AddProductsRequest = {body: { storeName: storeName, products: products}, token: token};
        const productAdditionRes: Res.ProductAdditionResponse = tradingSystemManager.addNewProducts(addProductsReq);
        expect(productAdditionRes.data.result).toBeTruthy();
        expect(productAdditionRes.data.productsNotAdded).toBeDefined();
        expect(productAdditionRes.data.productsNotAdded.length).toBe(0);

        logger.info("IT: changing product name...")
        const changeProductNameRequest: Req.ChangeProductNameRequest = {body: {storeName: storeName, catalogNumber: catalogNumber1, newName: newName1}, token}
        let res: Res.BoolResponse = tradingSystemManager.changeProductName(changeProductNameRequest);

        expect(res.data.result).toBe(true);

        let viewStoreReq: Req.ProductInfoRequest = {body: {storeName: storeName, catalogNumber: catalogNumber1}, token};
        let viewStoreRes: Res.ProductInfoResponse = tradingSystemManager.viewProductInfo(viewStoreReq);

        expect(viewStoreRes.data.result).toBe(true);
        expect(viewStoreRes.data.info.catagory).toBe(category1);
        expect(viewStoreRes.data.info.catalogNumber).toBe(catalogNumber1);
        expect(viewStoreRes.data.info.price).toBe(oldPrice1);
        expect(viewStoreRes.data.info.name).toBe(newName1);

        viewStoreReq = {body: {storeName: storeName, catalogNumber: catalogNumber2}, token};
        viewStoreRes = tradingSystemManager.viewProductInfo(viewStoreReq);

        expect(viewStoreRes.data.result).toBe(true);
        expect(viewStoreRes.data.info.catagory).toBe(category2);
        expect(viewStoreRes.data.info.catalogNumber).toBe(catalogNumber2);
        expect(viewStoreRes.data.info.price).toBe(oldPrice2);
        expect(viewStoreRes.data.info.name).toBe(oldName2);

        logger.info("IT: chaning product price...")
        const changeProductPriceRequest: Req.ChangeProductPriceRequest = {body: {storeName: storeName, catalogNumber: catalogNumber2, newPrice: newPrice2}, token}
        res = tradingSystemManager.changeProductPrice(changeProductPriceRequest);

        expect(res.data.result).toBe(true);


        viewStoreReq = {body: {storeName: storeName, catalogNumber: catalogNumber1}, token};
        viewStoreRes = tradingSystemManager.viewProductInfo(viewStoreReq);

        expect(viewStoreRes.data.result).toBe(true);
        expect(viewStoreRes.data.info.catagory).toBe(category1);
        expect(viewStoreRes.data.info.catalogNumber).toBe(catalogNumber1);
        expect(viewStoreRes.data.info.price).toBe(oldPrice1);
        expect(viewStoreRes.data.info.name).toBe(newName1);

        viewStoreReq = {body: {storeName: storeName, catalogNumber: catalogNumber2}, token};
        viewStoreRes = tradingSystemManager.viewProductInfo(viewStoreReq);

        expect(viewStoreRes.data.result).toBe(true);
        expect(viewStoreRes.data.info.catagory).toBe(category2);
        expect(viewStoreRes.data.info.catalogNumber).toBe(catalogNumber2);
        expect(viewStoreRes.data.info.price).toBe(newPrice2);
        expect(viewStoreRes.data.info.name).toBe(oldName2);

    });

    it("remove items", () => {
        logger.info("starting IT: remove items");

        let item1: ItemReq = {catalogNumber: 1, id: 6};
        let item2: ItemReq = {catalogNumber: 2, id: 5};
        let item3: ItemReq = {catalogNumber: 3, id: 5};
        let item4: ItemReq = {catalogNumber: 4, id: 5};
        let items: ItemReq[] = [item1, item2, item3, item4];

        // items don't exist
        let removeItemsReq: Req.ItemsRemovalRequest = {body: { storeName: storeName, items: items}, token: token};
        let removeItemsRes: Res.ItemsRemovalResponse = tradingSystemManager.removeItems(removeItemsReq);
        expect(removeItemsRes.data.result).toBeFalsy();
        expect(removeItemsRes.error).toBeDefined();
        expect(removeItemsRes.data.itemsNotRemoved).toBeDefined();
        expect(removeItemsRes.data.itemsNotRemoved.length).toBe(items.length);

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

        // new products addition doesn't affect invalid items
        removeItemsRes = tradingSystemManager.removeItems(removeItemsReq);
        expect(removeItemsRes.data.result).toBeFalsy();
        expect(removeItemsRes.error).toBeDefined();
        expect(removeItemsRes.data.itemsNotRemoved).toBeDefined();
        expect(removeItemsRes.data.itemsNotRemoved.length).toBe(items.length);

        item1 = {catalogNumber: 5, id: 5};
        item2 = {catalogNumber: 15, id: 6};
        item3 = {catalogNumber: 5, id: 7};
        item4 = {catalogNumber: 15, id: 8};
        items = [item1, item2, item3, item4];

        // valid items
        // addition
        let addItemsReq: Req.ItemsAdditionRequest = {body: { storeName: storeName, items: items}, token: token};
        let itemsAdditionRes : Res.ItemsAdditionResponse = tradingSystemManager.addItems(addItemsReq);
        expect(itemsAdditionRes.data.result).toBeTruthy();
        expect(itemsAdditionRes.error).toBeUndefined();
        expect(itemsAdditionRes.data.itemsNotAdded).toBeDefined();
        expect(itemsAdditionRes.data.itemsNotAdded.length).toBe(0);

        // removal
        removeItemsReq = {body: { storeName: storeName, items: items}, token: token};
        removeItemsRes = tradingSystemManager.removeItems(removeItemsReq);
        expect(removeItemsRes.data.result).toBeTruthy();
        expect(removeItemsRes.error).toBeUndefined();
        expect(removeItemsRes.data.itemsNotRemoved).toBeDefined();
        expect(removeItemsRes.data.itemsNotRemoved.length).toBe(0);

        // addition
        addItemsReq = {body: { storeName: storeName, items: items}, token: token};
        itemsAdditionRes = tradingSystemManager.addItems(addItemsReq);
        expect(itemsAdditionRes.data.result).toBeTruthy();
        expect(itemsAdditionRes.error).toBeUndefined();
        expect(itemsAdditionRes.data.itemsNotAdded).toBeDefined();
        expect(itemsAdditionRes.data.itemsNotAdded.length).toBe(0);

        item1 = {catalogNumber: 5, id: 5};      // valid
        item2 = {catalogNumber: 15, id: 6};     // valid
        item3 = {catalogNumber: 1, id: 7};
        item4 = {catalogNumber: 15, id: 100};
        const item5: ItemReq = {catalogNumber: -15, id: 100};
        const item6: ItemReq = {catalogNumber: 15, id: -100};
        items = [item1, item2, item3, item4, item5, item6];

        // 2 valid items
        removeItemsReq = {body: { storeName: storeName, items: items}, token: token};
        removeItemsRes = tradingSystemManager.removeItems(removeItemsReq);
        expect(removeItemsRes.data.result).toBeTruthy();
        expect(removeItemsRes.error).toBeUndefined();
        expect(removeItemsRes.data.itemsNotRemoved).toBeDefined();
        expect(removeItemsRes.data.itemsNotRemoved.length).toBe(4);
    });

    it("remove products",() => {
        logger.info("starting IT: remove products");
        let product1: ProductReq = {name: 'mock1', catalogNumber: 5, price: 123, category: 1};
        let product2: ProductReq = {name: 'mock2', catalogNumber: 15, price: 1123, category: 2};
        let products: ProductReq[] = [product1, product2];

        // products don't exist
        let removeProductsReq: Req.ProductRemovalRequest = {body: { storeName: storeName, products: products}, token: token};
        let removeProductsRes: Res.ProductRemovalResponse = tradingSystemManager.removeProducts(removeProductsReq);

        expect(removeProductsRes.data.result).toBe(false);
        expect(removeProductsRes.data.productsNotRemoved).toBeDefined();
        expect(removeProductsRes.data.productsNotRemoved.length).toBe(products.length);

        // add valid products
        const addProductsReq: Req.AddProductsRequest = {body: { storeName: storeName, products: products}, token: token};
        let productAdditionRes: Res.ProductAdditionResponse = tradingSystemManager.addNewProducts(addProductsReq);

        expect(productAdditionRes.data.result).toBeTruthy();
        expect(productAdditionRes.data.productsNotAdded).toBeDefined();
        expect(productAdditionRes.data.productsNotAdded.length).toBe(0);

        // remove valid products
        removeProductsRes = tradingSystemManager.removeProducts(removeProductsReq);

        expect(removeProductsRes.data.result).toBe(true);
        expect(removeProductsRes.data.productsNotRemoved).toBeDefined();
        expect(removeProductsRes.data.productsNotRemoved.length).toBe(0);

        // add valid products
        productAdditionRes = tradingSystemManager.addNewProducts(addProductsReq);

        expect(productAdditionRes.data.result).toBeTruthy();
        expect(productAdditionRes.data.productsNotAdded).toBeDefined();
        expect(productAdditionRes.data.productsNotAdded.length).toBe(0);


        // remove some invalid products
        product1 = {name: 'mock1', catalogNumber: 5, price: 123, category: 1};
        product2 = {name: 'mock2', catalogNumber: 15, price: 1123, category: 2};
        const product3 = {name: 'mock3', catalogNumber: -15, price: 1123, category: 2};
        const product4 = {name: 'mock4', catalogNumber: 15, price: -1123, category: 2};
        const product5 = {name: 'mock5', catalogNumber: 15, price: 1123, category: -2};

        products = [product1, product2, product3, product4, product5];
        removeProductsReq = {body: { storeName: storeName, products: products}, token: token};
        removeProductsRes = tradingSystemManager.removeProducts(removeProductsReq);

        expect(removeProductsRes.data.result).toBe(true);
        expect(removeProductsRes.data.productsNotRemoved).toBeDefined();
        expect(removeProductsRes.data.productsNotRemoved.length).toBe(3);

    });


});

