import {Store} from "domain_layer/dist/src/store/Store";
import {StoreOwner} from "domain_layer/dist/src/user/users/StoreOwner";
import {Req, Res} from 'se-workshop-20-interfaces'
import {ManagementPermission, Operators, ProductCategory, WeekDays} from "se-workshop-20-interfaces/dist/src/Enums";
import {
    IDiscount,
    IItem,
    IDiscountPolicy,
    ISimplePurchasePolicy, IPurchasePolicy, IProduct
} from 'se-workshop-20-interfaces/dist/src/CommonInterface'
import {RegisteredUser} from "domain_layer/dist/src/user/users/RegisteredUser";
import * as utils from "./utils"
import * as ServiceFacade from "../../../src/service_facade/ServiceFacade"

jest.setTimeout(1500000);

describe("Store Owner Integration Tests", () => {
    const storeOwnerName: string = "store-owner";
    const storeOwnerPassword: string = "store-owner-pw";
    const storeName: string = "store-name";
    const storeDesc: string = "store-Description";

    let store: Store;
    let storeOwnerRegisteredUser: RegisteredUser;
    let storeOwner: StoreOwner;
    let token: string;

    beforeAll(async (done) => {
        await utils.clearDB();
        await utils.systemInit();
        done();
    });

    beforeEach(async (done) => {
        await utils.systemReset();
        await utils.systemInit();
        storeOwnerRegisteredUser = {
            name: storeOwnerName,
            password: storeOwnerPassword,
            pendingEvents: [],
            receipts: [],
            cart: new Map()
        };
        storeOwner = {name: storeOwnerName, assignedStoreOwners: [], assignedStoreManagers: []};
        token = await utils.initSessionRegisterLogin(storeOwnerName, storeOwnerPassword);
        expect(token).toBeDefined();
        await utils.createStore(storeName, token);
        done();
    });

    afterAll((done) => {
        utils.safeShutdown();
        done();
    });

    function createProduct(name: string, catalogNumber: number, price: number, category: ProductCategory): IProduct {
        return {name, category, catalogNumber, price}
    }

    function createRegisteredUser(name: string, password: string): RegisteredUser {
        return {name, password, cart: new Map(), receipts: [], pendingEvents: []}
    }

    function createStoreOwner(name): StoreOwner {
        return {name, assignedStoreOwners: [], assignedStoreManagers: []}
    }

    it("add new products", async (done) => {
        let product1: IProduct = createProduct('mock1', 5, 123, ProductCategory.ELECTRONICS);
        let product2: IProduct = createProduct('mock2', 15, 1123, ProductCategory.HOBBIES);
        let products: IProduct[] = [product1, product2];

        // all products are valid
        let addProductsReq: Req.AddProductsRequest = {body: {storeName, products}, token};
        let productAdditionRes: Res.ProductAdditionResponse = await ServiceFacade.addNewProducts(addProductsReq);
        expect(productAdditionRes.data.result).toBeTruthy();
        expect(productAdditionRes.data.productsNotAdded).toBeDefined();
        expect(productAdditionRes.data.productsNotAdded.length).toBe(0);

        product1 = {name: 'mock1', catalogNumber: 5, price: 123, category: ProductCategory.ELECTRONICS};
        product2 = {name: 'mock2', catalogNumber: 15, price: 1123, category: ProductCategory.HOBBIES};
        products = [product1, product2];

        // all products are invalid
        addProductsReq = {body: {storeName, products}, token};
        productAdditionRes = await ServiceFacade.addNewProducts(addProductsReq);
        expect(productAdditionRes.data.result).toBeFalsy();
        expect(productAdditionRes.error).toBeDefined();
        expect(productAdditionRes.data.productsNotAdded).toBeDefined();
        expect(productAdditionRes.data.productsNotAdded.length).toBe(products.length);

        product1 = {name: 'mock1', catalogNumber: -5, price: 123, category: ProductCategory.ELECTRONICS};
        product2 = {name: 'mock2', catalogNumber: 12, price: 1123, category: ProductCategory.HOBBIES};
        products = [product1, product2];

        // one product is valid
        addProductsReq = {body: {storeName, products}, token};
        productAdditionRes = await ServiceFacade.addNewProducts(addProductsReq);
        expect(productAdditionRes.data.result).toBeTruthy();
        expect(productAdditionRes.data.productsNotAdded).toBeDefined();
        expect(productAdditionRes.data.productsNotAdded.length).toBe(1);
        done();
    });

    it("add new items", async (done) => {
        // products don't exist
        let item1: IItem = {catalogNumber: 1, id: 6};
        let item2: IItem = {catalogNumber: 2, id: 5};
        let items: IItem[] = [item1, item2];

        let addItemsReq: Req.ItemsAdditionRequest = {body: {storeName, items}, token};
        let itemsAdditionRes: Res.ItemsAdditionResponse = await ServiceFacade.addItems(addItemsReq);
        expect(itemsAdditionRes.data.result).toBeFalsy();
        expect(itemsAdditionRes.error).toBeDefined();
        expect(itemsAdditionRes.data.itemsNotAdded).toBeDefined();
        expect(itemsAdditionRes.data.itemsNotAdded.length).toBe(items.length);

        // prepare products to add items
        const product1: IProduct = {name: 'mock1', catalogNumber: 5, price: 123, category: ProductCategory.ELECTRONICS};
        const product2: IProduct = {name: 'mock2', catalogNumber: 15, price: 1123, category: ProductCategory.HOBBIES};
        const products: IProduct[] = [product1, product2];

        // all products are valid
        const addProductsReq: Req.AddProductsRequest = {body: {storeName, products}, token};
        const productAdditionRes: Res.ProductAdditionResponse = await ServiceFacade.addNewProducts(addProductsReq);
        expect(productAdditionRes.data.result).toBeTruthy();
        expect(productAdditionRes.data.productsNotAdded).toBeDefined();
        expect(productAdditionRes.data.productsNotAdded.length).toBe(0);

        // new products addition doesn't affect invalid items
        itemsAdditionRes = await ServiceFacade.addItems(addItemsReq);
        expect(itemsAdditionRes.data.result).toBeFalsy();
        expect(itemsAdditionRes.error).toBeDefined();
        expect(itemsAdditionRes.data.itemsNotAdded).toBeDefined();
        expect(itemsAdditionRes.data.itemsNotAdded.length).toBe(items.length);

        item1 = {catalogNumber: 5, id: 6};
        item2 = {catalogNumber: 15, id: 5};
        items = [item1, item2];

        // valid items
        addItemsReq = {body: {storeName, items}, token};
        itemsAdditionRes = await ServiceFacade.addItems(addItemsReq);
        expect(itemsAdditionRes.data.result).toBeTruthy();
        expect(itemsAdditionRes.error).toBeUndefined();
        expect(itemsAdditionRes.data.itemsNotAdded).toBeDefined();
        expect(itemsAdditionRes.data.itemsNotAdded.length).toBe(0);

        item1 = {catalogNumber: -5, id: 6};
        item2 = {catalogNumber: 15, id: 15};
        items = [item1, item2];

        // 1 valid item
        addItemsReq = {body: {storeName, items}, token};
        itemsAdditionRes = await ServiceFacade.addItems(addItemsReq);
        expect(itemsAdditionRes.data.result).toBeTruthy();
        expect(itemsAdditionRes.error).toBeUndefined();
        expect(itemsAdditionRes.data.itemsNotAdded).toBeDefined();
        expect(itemsAdditionRes.data.itemsNotAdded.length).toBe(1);

        item1 = {catalogNumber: 5, id: 6};
        item2 = {catalogNumber: 15, id: 5};
        items = [item1, item2];

        // items already exist
        addItemsReq = {body: {storeName, items}, token};
        itemsAdditionRes = await ServiceFacade.addItems(addItemsReq);
        expect(itemsAdditionRes.data.result).toBeFalsy();
        expect(itemsAdditionRes.error).toBeDefined();
        expect(itemsAdditionRes.data.itemsNotAdded).toBeDefined();
        expect(itemsAdditionRes.data.itemsNotAdded.length).toBe(items.length);
        done();
    });

    it("change product details and view product info", async (done) => {
        const catalogNumber1: number = 5;
        const oldName1: string = "old-name1";
        const newName1: string = "newProdName";
        const oldPrice1: number = 15;
        const category1: ProductCategory = ProductCategory.ELECTRONICS;

        const catalogNumber2: number = 15;
        const oldName2: string = "old-name2";
        const oldPrice2: number = 200;
        const newPrice2: number = 500;
        const category2: ProductCategory = ProductCategory.HOBBIES;

        const product1: IProduct = {
            name: oldName1,
            catalogNumber: catalogNumber1,
            price: oldPrice1,
            category: category1
        };
        const product2: IProduct = {
            name: oldName2,
            catalogNumber: catalogNumber2,
            price: oldPrice2,
            category: category2
        };
        const products: IProduct[] = [product1, product2];

        // all products are valid
        const addProductsReq: Req.AddProductsRequest = {body: {storeName, products}, token};
        const productAdditionRes: Res.ProductAdditionResponse = await ServiceFacade.addNewProducts(addProductsReq);
        expect(productAdditionRes.data.result).toBeTruthy();
        expect(productAdditionRes.data.productsNotAdded).toBeDefined();
        expect(productAdditionRes.data.productsNotAdded.length).toBe(0);

        const changeProductNameRequest: Req.ChangeProductNameRequest = {
            body: {
                storeName,
                catalogNumber: catalogNumber1,
                newName: newName1
            }, token
        }
        let res: Res.BoolResponse = await ServiceFacade.changeProductName(changeProductNameRequest);

        expect(res.data.result).toBe(true);

        let viewStoreReq: Req.ProductInfoRequest = {body: {storeName, catalogNumber: catalogNumber1}, token};
        let viewStoreRes: Res.ProductInfoResponse = await ServiceFacade.viewProductInfo(viewStoreReq);

        expect(viewStoreRes.data.result).toBe(true);
        expect(viewStoreRes.data.info.category).toBe(category1);
        expect(viewStoreRes.data.info.catalogNumber).toBe(catalogNumber1);
        expect(viewStoreRes.data.info.price).toBe(oldPrice1);
        expect(viewStoreRes.data.info.name).toBe(newName1);

        viewStoreReq = {body: {storeName, catalogNumber: catalogNumber2}, token};
        viewStoreRes = await ServiceFacade.viewProductInfo(viewStoreReq);

        expect(viewStoreRes.data.result).toBe(true);
        expect(viewStoreRes.data.info.category).toBe(category2);
        expect(viewStoreRes.data.info.catalogNumber).toBe(catalogNumber2);
        expect(viewStoreRes.data.info.price).toBe(oldPrice2);
        expect(viewStoreRes.data.info.name).toBe(oldName2);

        const changeProductPriceRequest: Req.ChangeProductPriceRequest = {
            body: {
                storeName,
                catalogNumber: catalogNumber2,
                newPrice: newPrice2
            }, token
        }
        res = await ServiceFacade.changeProductPrice(changeProductPriceRequest);

        expect(res.data.result).toBe(true);


        viewStoreReq = {body: {storeName, catalogNumber: catalogNumber1}, token};
        viewStoreRes = await ServiceFacade.viewProductInfo(viewStoreReq);

        expect(viewStoreRes.data.result).toBe(true);
        expect(viewStoreRes.data.info.category).toBe(category1);
        expect(viewStoreRes.data.info.catalogNumber).toBe(catalogNumber1);
        expect(viewStoreRes.data.info.price).toBe(oldPrice1);
        expect(viewStoreRes.data.info.name).toBe(newName1);

        viewStoreReq = {body: {storeName, catalogNumber: catalogNumber2}, token};
        viewStoreRes = await ServiceFacade.viewProductInfo(viewStoreReq);

        expect(viewStoreRes.data.result).toBe(true);
        expect(viewStoreRes.data.info.category).toBe(category2);
        expect(viewStoreRes.data.info.catalogNumber).toBe(catalogNumber2);
        expect(viewStoreRes.data.info.price).toBe(newPrice2);
        expect(viewStoreRes.data.info.name).toBe(oldName2);
        done();
    });

    it("remove items", async (done) => {
        let item1: IItem = {catalogNumber: 1, id: 6};
        let item2: IItem = {catalogNumber: 2, id: 5};
        let item3: IItem = {catalogNumber: 3, id: 5};
        let item4: IItem = {catalogNumber: 4, id: 5};
        let items: IItem[] = [item1, item2, item3, item4];

        // items don't exist
        let removeItemsReq: Req.ItemsRemovalRequest = {body: {storeName, items}, token};
        let removeItemsRes: Res.ItemsRemovalResponse = await ServiceFacade.removeItems(removeItemsReq);
        expect(removeItemsRes.data.result).toBeFalsy();
        expect(removeItemsRes.error).toBeDefined();
        expect(removeItemsRes.data.itemsNotRemoved).toBeDefined();
        expect(removeItemsRes.data.itemsNotRemoved.length).toBe(items.length);

        // prepare products to add items
        const product1: IProduct = {name: 'mock1', catalogNumber: 5, price: 123, category: ProductCategory.ELECTRONICS};
        const product2: IProduct = {name: 'mock2', catalogNumber: 15, price: 1123, category: ProductCategory.HOBBIES};
        const products: IProduct[] = [product1, product2];

        // all products are valid
        const addProductsReq: Req.AddProductsRequest = {body: {storeName, products}, token};
        const productAdditionRes: Res.ProductAdditionResponse = await ServiceFacade.addNewProducts(addProductsReq);
        expect(productAdditionRes.data.result).toBeTruthy();
        expect(productAdditionRes.data.productsNotAdded).toBeDefined();
        expect(productAdditionRes.data.productsNotAdded.length).toBe(0);

        // new products addition doesn't affect invalid items
        removeItemsRes = await ServiceFacade.removeItems(removeItemsReq);
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
        let addItemsReq: Req.ItemsAdditionRequest = {body: {storeName, items}, token};
        let itemsAdditionRes: Res.ItemsAdditionResponse = await ServiceFacade.addItems(addItemsReq);
        expect(itemsAdditionRes.data.result).toBeTruthy();
        expect(itemsAdditionRes.error).toBeUndefined();
        expect(itemsAdditionRes.data.itemsNotAdded).toBeDefined();
        expect(itemsAdditionRes.data.itemsNotAdded.length).toBe(0);

        // removal
        removeItemsReq = {body: {storeName, items}, token};
        removeItemsRes = await ServiceFacade.removeItems(removeItemsReq);
        expect(removeItemsRes.data.result).toBeTruthy();
        expect(removeItemsRes.error).toBeUndefined();
        expect(removeItemsRes.data.itemsNotRemoved).toBeDefined();
        expect(removeItemsRes.data.itemsNotRemoved.length).toBe(0);

        // addition
        addItemsReq = {body: {storeName, items}, token};
        itemsAdditionRes = await ServiceFacade.addItems(addItemsReq);
        expect(itemsAdditionRes.data.result).toBeTruthy();
        expect(itemsAdditionRes.error).toBeUndefined();
        expect(itemsAdditionRes.data.itemsNotAdded).toBeDefined();
        expect(itemsAdditionRes.data.itemsNotAdded.length).toBe(0);

        item1 = {catalogNumber: 5, id: 5};      // valid
        item2 = {catalogNumber: 15, id: 6};     // valid
        item3 = {catalogNumber: 1, id: 7};
        item4 = {catalogNumber: 15, id: 100};
        const item5: IItem = {catalogNumber: -15, id: 100};
        const item6: IItem = {catalogNumber: 15, id: -100};
        items = [item1, item2, item3, item4, item5, item6];

        // 2 valid items
        removeItemsReq = {body: {storeName, items}, token};
        removeItemsRes = await ServiceFacade.removeItems(removeItemsReq);
        expect(removeItemsRes.data.result).toBeTruthy();
        expect(removeItemsRes.error).toBeUndefined();
        expect(removeItemsRes.data.itemsNotRemoved).toBeDefined();
        expect(removeItemsRes.data.itemsNotRemoved.length).toBe(4);
        done();
    });

    it("remove products", async (done) => {
        let product1: IProduct = {name: 'mock1', catalogNumber: 5, price: 123, category: ProductCategory.ELECTRONICS};
        let product2: IProduct = {name: 'mock2', catalogNumber: 15, price: 1123, category: ProductCategory.HOBBIES};
        let products: IProduct[] = [product1, product2];

        // products don't exist
        let removeProductsReq: Req.ProductRemovalRequest = {body: {storeName, products}, token};
        let removeProductsRes: Res.ProductRemovalResponse = await ServiceFacade.removeProducts(removeProductsReq);

        expect(removeProductsRes.data.result).toBe(false);
        expect(removeProductsRes.data.productsNotRemoved).toBeDefined();
        expect(removeProductsRes.data.productsNotRemoved.length).toBe(products.length);

        // add valid products
        let addProductsReq: Req.AddProductsRequest = {body: {storeName, products}, token};
        let productAdditionRes: Res.ProductAdditionResponse = await ServiceFacade.addNewProducts(addProductsReq);

        expect(productAdditionRes.data.result).toBeTruthy();
        expect(productAdditionRes.data.productsNotAdded).toBeDefined();
        expect(productAdditionRes.data.productsNotAdded.length).toBe(0);

        // remove valid products
        removeProductsRes = await ServiceFacade.removeProducts(removeProductsReq);

        expect(removeProductsRes.data.result).toBe(true);
        expect(removeProductsRes.data.productsNotRemoved).toBeDefined();
        expect(removeProductsRes.data.productsNotRemoved.length).toBe(0);

        // add valid products
        productAdditionRes = await ServiceFacade.addNewProducts(addProductsReq);

        expect(productAdditionRes.data.result).toBeTruthy();
        expect(productAdditionRes.data.productsNotAdded).toBeDefined();
        expect(productAdditionRes.data.productsNotAdded.length).toBe(0);

        // remove some invalid products
        const price1: number = 123;
        const catalog1: number = 5;
        const category1: ProductCategory = ProductCategory.ELECTRONICS;
        const name1: string = "mock1";

        const price2: number = 1123;
        const catalog2: number = 15;
        const category2: ProductCategory = ProductCategory.ELECTRONICS;
        const name2: string = "mock2";

        product1 = {name: name1, catalogNumber: catalog1, price: price1, category: category1};
        product2 = {name: name2, catalogNumber: catalog2, price: price2, category: category2};
        const product3: IProduct = {name: 'mock3', catalogNumber: -15, price: 1123, category: ProductCategory.HOBBIES};
        const product4: IProduct = {name: 'mock4', catalogNumber: 15, price: -1123, category: ProductCategory.HOBBIES};

        products = [product1, product2, product3, product4];
        removeProductsReq = {body: {storeName, products}, token};
        removeProductsRes = await ServiceFacade.removeProducts(removeProductsReq);

        expect(removeProductsRes.data.result).toBe(true);
        expect(removeProductsRes.data.productsNotRemoved).toBeDefined();
        expect(removeProductsRes.data.productsNotRemoved.length).toBe(2);

        // add 2 valid products
        products = [product1, product2];
        addProductsReq = {body: {storeName, products}, token};
        productAdditionRes = await ServiceFacade.addNewProducts(addProductsReq);

        expect(productAdditionRes.data.result).toBe(true);
        expect(productAdditionRes.data.productsNotAdded).toBeDefined();
        expect(productAdditionRes.data.productsNotAdded).toHaveLength(0);

        // product 1 and 2 are added, add items
        const item1: IItem = {catalogNumber: catalog1, id: 1};
        const item2: IItem = {catalogNumber: catalog1, id: 2};
        const item3: IItem = {catalogNumber: catalog1, id: 3};
        const item4: IItem = {catalogNumber: catalog1, id: 4};
        const item5: IItem = {catalogNumber: catalog2, id: 1};
        const item6: IItem = {catalogNumber: catalog2, id: 2};
        const item7: IItem = {catalogNumber: catalog2, id: 3};
        const item8: IItem = {catalogNumber: catalog2, id: 4};
        const items: IItem[] = [item1, item2, item3, item4, item5, item6, item7, item8];


        const addItemsReq: Req.ItemsAdditionRequest = {body: {storeName, items}, token};
        const itemsAdditionRes: Res.ItemsAdditionResponse = await ServiceFacade.addItems(addItemsReq);
        expect(itemsAdditionRes.data.result).toBeTruthy();
        expect(itemsAdditionRes.data.itemsNotAdded).toBeDefined();
        expect(itemsAdditionRes.data.itemsNotAdded).toHaveLength(0);

        // const quantityToRemove1: number = 2;
        // const quantityToRemove2: number = 4;
        // const prodToRemove: ProductWithQuantity[] = [{
        //     quantity: quantityToRemove1,
        //     catalogNumber: catalog1
        // }, {quantity: quantityToRemove2, catalogNumber: catalog2}];
        // const removeProductsWithQuantityReq: Req.RemoveProductsWithQuantity = {
        //     body: {
        //         storeName,
        //         products: prodToRemove
        //     }, token
        // };
        // const removeProductsWithQuantityRes: Res.ProductRemovalResponse = await ServiceFacade.removeProductsWithQuantity(removeProductsWithQuantityReq);
        //
        // expect(removeProductsWithQuantityRes.data.result).toBeTruthy();
        // expect(removeProductsWithQuantityRes.data.productsNotRemoved).toBeDefined();
        // expect(removeProductsWithQuantityRes.data.productsNotRemoved).toHaveLength(0);

        let viewStoreReq: Req.ProductInfoRequest = {body: {storeName, catalogNumber: catalog1}, token};
        let viewStoreRes: Res.ProductInfoResponse = await ServiceFacade.viewProductInfo(viewStoreReq);

        expect(viewStoreRes.data.result).toBe(true);
        expect(viewStoreRes.data.info.category).toBe(category1);
        expect(viewStoreRes.data.info.catalogNumber).toBe(catalog1);
        expect(viewStoreRes.data.info.price).toBe(price1);
        expect(viewStoreRes.data.info.name).toBe(name1);
        expect(viewStoreRes.data.info.quantity).toBe(4);

        viewStoreReq = {body: {storeName, catalogNumber: catalog2}, token};
        viewStoreRes = await ServiceFacade.viewProductInfo(viewStoreReq);

        expect(viewStoreRes.data.result).toBe(true);
        expect(viewStoreRes.data.info.category).toBe(category2);
        expect(viewStoreRes.data.info.catalogNumber).toBe(catalog2);
        expect(viewStoreRes.data.info.price).toBe(price2);
        expect(viewStoreRes.data.info.name).toBe(name2);
        expect(viewStoreRes.data.info.quantity).toBe(4);
        done();
    });

    it("assign and remove store owners", async (done) => {
        const newUsername1: string = "new-assign-mock1";
        const newUsername2: string = "new-assign-mock2";
        const newPassword: string = "new-assign-mock-pw";
        const newUser1: RegisteredUser = createRegisteredUser(newUsername1, newPassword);
        const newUser2: RegisteredUser = createRegisteredUser(newUsername2, newPassword);

        await utils.registerUser(newUser1.name, newUser1.password, token, true);
        await utils.registerUser(newUser2.name, newUser2.password, token, false);
        await utils.loginUser(storeOwnerRegisteredUser.name, storeOwnerRegisteredUser.password, token, false);

        // assign valid store owner
        let assignStoreOwnerRequest: Req.AssignStoreOwnerRequest = {
            body: {storeName, usernameToAssign: newUser1.name},
            token
        };
        let assignStoreOwnerResponse: Res.BoolResponse = await ServiceFacade.assignStoreOwner(assignStoreOwnerRequest);

        expect(assignStoreOwnerResponse.data.result).toBe(true);

        // assign circular store owner
        await utils.loginUser(newUser1.name, newUser1.password, token, true);

        assignStoreOwnerRequest = {body: {storeName, usernameToAssign: storeOwnerRegisteredUser.name}, token};
        assignStoreOwnerResponse = await ServiceFacade.assignStoreOwner(assignStoreOwnerRequest);

        expect(assignStoreOwnerResponse.data.result).toBe(false);

        // assign invalid store owner
        await utils.loginUser(storeOwnerRegisteredUser.name, storeOwnerRegisteredUser.password, token, true);

        assignStoreOwnerRequest = {body: {storeName, usernameToAssign: "invalid-username"}, token};
        assignStoreOwnerResponse = await ServiceFacade.assignStoreOwner(assignStoreOwnerRequest);

        expect(assignStoreOwnerResponse.data.result).toBe(false);

        // store owner tries to assign himself
        assignStoreOwnerRequest = {body: {storeName, usernameToAssign: storeOwner.name}, token};
        assignStoreOwnerResponse = await ServiceFacade.assignStoreOwner(assignStoreOwnerRequest);

        expect(assignStoreOwnerResponse.data.result).toBe(false);

        // store owner tries to remove himself
        let removeStoreOwnerRequest: Req.RemoveStoreOwnerRequest = {
            body: {
                storeName,
                usernameToRemove: storeOwner.name
            }, token
        };
        let removeStoreOwnerResponse: Res.BoolResponse = await ServiceFacade.removeStoreOwner(removeStoreOwnerRequest);

        expect(removeStoreOwnerResponse.data.result).toBe(false);

        // store owner tries to remove not assigned by him store owner //todo: add new store owner in same store , in another
        // same store
        // assign user2 by user1
        await utils.loginUser(newUser1.name, newUser1.password, token, true);

        assignStoreOwnerRequest = {body: {storeName, usernameToAssign: newUser2.name}, token};
        assignStoreOwnerResponse = await ServiceFacade.assignStoreOwner(assignStoreOwnerRequest);

        expect(assignStoreOwnerResponse.data.result).toBe(true);

        // remove user2 by storeOwner
        await utils.loginUser(storeOwnerRegisteredUser.name, storeOwnerRegisteredUser.password, token, true);

        removeStoreOwnerRequest = {body: {storeName, usernameToRemove: newUser2.name}, token};
        removeStoreOwnerResponse = await ServiceFacade.removeStoreOwner(removeStoreOwnerRequest);

        expect(removeStoreOwnerResponse.data.result).toBe(false);


        // another store
        // user2 creates new store
        const storeName2: string = "new-store-name-user-2";
        await utils.loginUser(newUser2.name, newUser2.password, token, true);
        await utils.createStore(storeName2, token);

        // user2 assigns user1
        assignStoreOwnerRequest = {body: {storeName: storeName2, usernameToAssign: newUser1.name}, token};
        assignStoreOwnerResponse = await ServiceFacade.assignStoreOwner(assignStoreOwnerRequest);

        expect(assignStoreOwnerResponse.data.result).toBe(true);

        // storeOwner tries to remove user1, user2 from storeName2
        await utils.loginUser(storeOwnerRegisteredUser.name, storeOwnerRegisteredUser.password, token, true);

        removeStoreOwnerRequest = {body: {storeName: storeName2, usernameToRemove: newUser1.name}, token};
        removeStoreOwnerResponse = await ServiceFacade.removeStoreOwner(removeStoreOwnerRequest);

        expect(removeStoreOwnerResponse.data.result).toBe(false);

        removeStoreOwnerRequest = {body: {storeName: storeName2, usernameToRemove: newUser2.name}, token};
        removeStoreOwnerResponse = await ServiceFacade.removeStoreOwner(removeStoreOwnerRequest);

        expect(removeStoreOwnerResponse.data.result).toBe(false);
        done();
    });

    it("assign, remove store managers and change permissions", async (done) => {
        const newUsername1: string = "new-assign-mock1";
        const newUsername2: string = "new-assign-mock2";
        const newPassword: string = "new-assign-mock-pw";
        const newUser1: RegisteredUser = createRegisteredUser(newUsername1, newPassword);
        const newUser2: RegisteredUser = createRegisteredUser(newUsername2, newPassword);
        const basicPermissions: ManagementPermission[] = [ManagementPermission.WATCH_PURCHASES_HISTORY, ManagementPermission.WATCH_USER_QUESTIONS, ManagementPermission.REPLY_USER_QUESTIONS];

        await utils.registerUser(newUser1.name, newUser1.password, token, true);
        await utils.registerUser(newUser2.name, newUser2.password, token, false);
        await utils.loginUser(storeOwnerRegisteredUser.name, storeOwnerRegisteredUser.password, token, false);

        // assign store manager 1
        let assignStoreManagerRequest: Req.AssignStoreOwnerRequest = {
            body: {
                storeName,
                usernameToAssign: newUser1.name
            }, token
        };
        let assignStoreManagerResponse: Res.BoolResponse = await ServiceFacade.assignStoreManager(assignStoreManagerRequest);

        expect(assignStoreManagerResponse.data.result).toBe(true);

        // verify basic permissions
        let managerPermissionReq: Req.ViewManagerPermissionRequest = {
            body: {
                managerToView: newUser1.name,
                storeName: storeName
            }, token: token
        };
        let managerPermissionRes: Res.ViewManagerPermissionResponse = await ServiceFacade.viewManagerPermissions(managerPermissionReq);

        expect(managerPermissionRes.data.result).toBe(true);
        expect(managerPermissionRes.data.permissions).toHaveLength(3);
        expect(managerPermissionRes.data.permissions).toContainEqual(basicPermissions[0]);
        expect(managerPermissionRes.data.permissions).toContainEqual(basicPermissions[1]);
        expect(managerPermissionRes.data.permissions).toContainEqual(basicPermissions[2]);

        // not yet assigned (store manager 2)
        managerPermissionReq = {body: {managerToView: newUser2.name, storeName: storeName}, token: token};
        managerPermissionRes = await ServiceFacade.viewManagerPermissions(managerPermissionReq);

        expect(managerPermissionRes.data.result).toBe(false);

        // assign store manager 2
        assignStoreManagerRequest = {body: {storeName, usernameToAssign: newUser2.name}, token};
        assignStoreManagerResponse = await ServiceFacade.assignStoreManager(assignStoreManagerRequest);

        expect(assignStoreManagerResponse.data.result).toBe(true);

        // remove store manager1
        const removeStoreManagerRequest: Req.RemoveStoreManagerRequest = {
            body: {
                storeName,
                usernameToRemove: newUser1.name
            }, token
        };
        const removeStoreManagerResponse: Res.BoolResponse = await ServiceFacade.removeStoreManager(removeStoreManagerRequest);

        expect(removeStoreManagerResponse.data.result).toBe(true);

        // remove permissions of manager 2
        const permission1: ManagementPermission = ManagementPermission.MANAGE_INVENTORY;
        const permission2: ManagementPermission = ManagementPermission.REPLY_USER_QUESTIONS;
        const permission3: ManagementPermission = ManagementPermission.WATCH_USER_QUESTIONS;

        const permissionsToChange: ManagementPermission[] = [permission1, permission2, permission3];

        let changeManagerPermissionReq: Req.ChangeManagerPermissionRequest = {
            body: {
                managerToChange: newUser2.name,
                storeName,
                permissions: permissionsToChange
            }, token
        };
        let changeManagerPermissionRes: Res.BoolResponse = await ServiceFacade.removeManagerPermissions(changeManagerPermissionReq);

        expect(changeManagerPermissionRes.data.result).toBe(true);

        // verify permissions were removed
        managerPermissionReq = {body: {managerToView: newUser2.name, storeName: storeName}, token: token};
        managerPermissionRes = await ServiceFacade.viewManagerPermissions(managerPermissionReq);

        expect(managerPermissionRes.data.result).toBe(true);
        expect(managerPermissionRes.data.permissions).not.toContainEqual(permission1);
        expect(managerPermissionRes.data.permissions).not.toContainEqual(permission2);
        expect(managerPermissionRes.data.permissions).not.toContainEqual(permission3);

        // add permissions to manager 2
        changeManagerPermissionReq = {
            body: {
                managerToChange: newUser2.name,
                storeName,
                permissions: permissionsToChange
            }, token
        };
        changeManagerPermissionRes = await ServiceFacade.addManagerPermissions(changeManagerPermissionReq);

        expect(changeManagerPermissionRes.data.result).toBe(true);

        // verify permissions were added
        managerPermissionRes = await ServiceFacade.viewManagerPermissions(managerPermissionReq);

        expect(managerPermissionRes.data.result).toBe(true);
        expect(managerPermissionRes.data.permissions).toContainEqual(permission1);
        expect(managerPermissionRes.data.permissions).toContainEqual(permission2);
        expect(managerPermissionRes.data.permissions).toContainEqual(permission3);
        done();
    });

    it("view store purchases history", async (done) => {
        const buyer1: RegisteredUser = createRegisteredUser("buyer1", "buyer1password");
        const buyer2: RegisteredUser = createRegisteredUser("buyer2", "buyer2password");

        const prod1: IProduct = createProduct("name1", 1, 100, ProductCategory.GENERAL);
        const prod2: IProduct = createProduct("name2", 2, 200, ProductCategory.ELECTRONICS);
        const prod3: IProduct = createProduct("name3", 3, 300, ProductCategory.CLOTHING);
        const prod4: IProduct = createProduct("name4", 4, 400, ProductCategory.HOBBIES);

        const item1: IItem = {id: 1, catalogNumber: prod1.catalogNumber};
        const item2: IItem = {id: 2, catalogNumber: prod2.catalogNumber};
        const item3: IItem = {id: 3, catalogNumber: prod3.catalogNumber};
        const item4: IItem = {id: 4, catalogNumber: prod4.catalogNumber};

        const products: IProduct[] = [prod1, prod2, prod3, prod4];
        const items: IItem[] = [item1, item2, item3, item4];

        await utils.addNewProducts(storeName, products, token, true);
        await utils.addNewItems(storeName, items, token, true);
        await utils.registerUser(buyer1.name, buyer1.password, token, true);
        await utils.registerUser(buyer2.name, buyer2.password, token, false);


        // buyer 1 buys
        await utils.loginUser(buyer1.name, buyer1.password, token, false);
        // save prod1, prod2
        let saveProductToCartReq: Req.SaveToCartRequest = {
            body: {storeName, catalogNumber: products[0].catalogNumber, amount: 1},
            token: token
        }
        let saveProductToCartRes: Res.BoolResponse = await ServiceFacade.saveProductToCart(saveProductToCartReq)
        expect(saveProductToCartRes.data.result).toBeTruthy();

        saveProductToCartReq = {
            body: {storeName, catalogNumber: products[1].catalogNumber, amount: 1},
            token: token
        }
        saveProductToCartRes = await ServiceFacade.saveProductToCart(saveProductToCartReq)
        expect(saveProductToCartRes.data.result).toBeTruthy();

        // buy
        let purchaseReq: Req.PurchaseRequest = {
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
        let purchaseResponse: Res.PurchaseResponse = await ServiceFacade.purchase(purchaseReq)
        expect(purchaseResponse.data.result).toBeTruthy();


        // buyer 2 buys
        await utils.loginUser(buyer2.name, buyer2.password, token, true);
        // save prod1, prod2
        saveProductToCartReq = {
            body: {storeName, catalogNumber: products[2].catalogNumber, amount: 1},
            token: token
        }
        saveProductToCartRes = await ServiceFacade.saveProductToCart(saveProductToCartReq)
        expect(saveProductToCartRes.data.result).toBeTruthy();

        saveProductToCartReq = {
            body: {storeName, catalogNumber: products[3].catalogNumber, amount: 1},
            token: token
        }
        saveProductToCartRes = await ServiceFacade.saveProductToCart(saveProductToCartReq)
        expect(saveProductToCartRes.data.result).toBeTruthy();

        // buy
        purchaseReq = {
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
        purchaseResponse = await ServiceFacade.purchase(purchaseReq)
        expect(purchaseResponse.data.result).toBeTruthy();


        // get purchases history
        await utils.loginUser(storeOwnerName, storeOwnerPassword, token, true);
        const viewPurchasesHistoryReq: Req.ViewShopPurchasesHistoryRequest = {
            body: {storeName: storeName},
            token: token
        };
        const viewPurchasesHistoryRes: Res.ViewShopPurchasesHistoryResponse = await ServiceFacade.viewStorePurchasesHistory(viewPurchasesHistoryReq);
        let idsTakes: number[] = [1, 1, 1, 1, 1];
        let prodCatalogsTaken: number[] = [1, 1, 1, 1, 1];

        expect(viewPurchasesHistoryRes.data.result).toBe(true);
        expect(viewPurchasesHistoryRes.data.receipts).toHaveLength(2);
        viewPurchasesHistoryRes.data.receipts.forEach(receipt => {
            expect(receipt.purchases).toHaveLength(2);
            expect(receipt.purchases[0].storeName).toBe(storeName);
            expect(receipt.purchases[1].storeName).toBe(storeName);

            let itemId: number = receipt.purchases[0].item.id;
            expect(idsTakes[itemId]).toBe(1);
            idsTakes[itemId] = 0;

            let productCatalog: number = receipt.purchases[0].item.catalogNumber;
            expect(prodCatalogsTaken[productCatalog]).toBe(1);
            prodCatalogsTaken[productCatalog] = 0;

            expect(receipt.purchases[0].price).toBe(products[productCatalog - 1].price);
            expect(receipt.purchases[0].userName).toBe(productCatalog <= 2 ? buyer1.name : buyer2.name);

            itemId = receipt.purchases[1].item.id;
            expect(idsTakes[itemId]).toBe(1);
            idsTakes[itemId] = 0;

            productCatalog = receipt.purchases[1].item.catalogNumber;
            expect(prodCatalogsTaken[productCatalog]).toBe(1);
            prodCatalogsTaken[productCatalog] = 0;

            expect(receipt.purchases[1].price).toBe(products[productCatalog - 1].price);
            expect(receipt.purchases[1].userName).toBe(productCatalog <= 2 ? buyer1.name : buyer2.name);

            // expect(receipt.payment.totalCharged).toBe(productCatalog >= 1 ? prod1.price + prod2.price : prod3.price + prod4.price);

        })
        done();
    });

    it("set and view discount policy ", async (done) => {
        const products: IProduct[] = [createProduct("bamba", 1, 20, ProductCategory.GENERAL)]
        await utils.addNewProducts(storeName, products, token, true);
        let items: IItem[] = [];
        for (let i = 0; i < 5; i++)
            items = items.concat({catalogNumber: 1, id: i + 1});
        await utils.addNewItems(storeName, items, token, true);

        const startDate: Date = new Date()
        const duration: number = 3;
        const simpleDiscount: IDiscount = {
            startDate,
            duration,
            products: [1],
            percentage: 50,
        }
        const condDiscount: IDiscount = {
            startDate,
            duration,
            products: [1, 2],
            percentage: 5,
            condition: [{condition: {minPay: 200}, operator: Operators.AND}]
        }

        const policy: IDiscountPolicy = {
            discounts: [{
                discount: condDiscount,
                operator: Operators.OR
            }, {discount: simpleDiscount, operator: Operators.AND}]
        }
        const setPolicyReq: Req.SetDiscountsPolicyRequest = {
            body: {storeName, policy},
            token: token
        }
        const makeDiscountRes: Res.AddDiscountResponse = await ServiceFacade.setDiscountsPolicy(setPolicyReq);
        expect(makeDiscountRes.data.result)

        const req: Req.ViewStoreDiscountsPolicyRequest = {body: {storeName}, token: token};
        const res: Res.ViewStoreDiscountsPolicyResponse = await ServiceFacade.viewDiscountsPolicy(req);
        expect(res.data.policy).toEqual(policy);
        done();
    });

    it("set and view purchase policy ", async (done) => {
        const products: IProduct[] = [createProduct("bamba", 1, 20, ProductCategory.GENERAL)]
        await utils.addNewProducts(storeName, products, token, true);
        let items: IItem[] = [];
        for (let i = 0; i < 5; i++)
            items = items.concat({catalogNumber: 1, id: i + 1});
        await utils.addNewItems(storeName, items, token, true);

        const simplePolicy1: ISimplePurchasePolicy = {
            productPolicy: {catalogNumber: 1, minAmount: 2, maxAmount: 4}
        }
        const simplePolicy2: ISimplePurchasePolicy = {
            bagPolicy: {minAmount: 2, maxAmount: 3}
        }
        const simplePolicy3: ISimplePurchasePolicy = {
            systemPolicy: {notForSellDays: [WeekDays.FRIDAY]}
        }
        const simplePolicy4: ISimplePurchasePolicy = {
            userPolicy: {countries: ["israel"]}
        }

        const policy: IPurchasePolicy = {
            policy: [{
                policy: simplePolicy1,
                operator: Operators.OR
            }, {policy: simplePolicy2, operator: Operators.AND}, {
                policy: simplePolicy3,
                operator: Operators.XOR
            }, {policy: simplePolicy4, operator: Operators.AND}]
        }
        const setPolicyReq: Req.SetPurchasePolicyRequest = {
            body: {storeName, policy},
            token: token
        }
        const makeDiscountRes: Res.BoolResponse = await ServiceFacade.setPurchasePolicy(setPolicyReq);
        expect(makeDiscountRes.data.result).toBe(true);

        const req: Req.ViewStorePurchasePolicyRequest = {body: {storeName}, token: token};
        const res: Res.ViewStorePurchasePolicyResponse = await ServiceFacade.viewPurchasePolicy(req);
        expect(res.data.policy).toEqual(policy);
        done();
    });
});



/* TODO need to adapt the test to the new "approve" system

     it("assign and remove store owners - multiple assignees", async (done) => {
         // const store: Store = new Store("name", "store desc");
         const pw: string = "ababababababa";
         const owners: StoreOwner[] = [
             createStoreOwner("name2"),
             createStoreOwner("name3"),
             createStoreOwner("name4"),
             createStoreOwner("name5"),
             createStoreOwner("name6"),
             createStoreOwner("name7"),
             createStoreOwner("name8")
         ]

         /** storeOwnerRegisteredUser -> owners[0]
          *  storeOwnerRegisteredUser -> owners[1]
          *
          *  owners[0] -> owners[2]
          *  owners[0] -> owners[3]
          *
          *  owners[1] -> owners[4]
          *  owners[1] -> owners[5]
          *
          *  owners[4] -> owners[6]


         await utils.logout(token);

         for (const owner of owners) {
             await utils.registerUser(owner.name, pw, token, false);
         }


         // assignStoreOwnerRequest -> 0,1
         await utils.loginUser(storeOwnerRegisteredUser.name, storeOwnerRegisteredUser.password, token, false);
         let assignStoreOwnerRequest: Req.AssignStoreOwnerRequest = {
             body: {storeName, usernameToAssign: owners[0].name},
             token
         };
         let assignStoreOwnerResponse: Res.BoolResponse = await ServiceFacade.assignStoreOwner(assignStoreOwnerRequest);
         expect(assignStoreOwnerResponse.data.result).toBe(true);

         assignStoreOwnerRequest = {body: {storeName, usernameToAssign: owners[1].name}, token};
         assignStoreOwnerResponse = await ServiceFacade.assignStoreOwner(assignStoreOwnerRequest);
         expect(assignStoreOwnerResponse.data.result).toBe(true);


         // 0 -> 2,3
         await utils.loginUser(owners[0].name, pw, token, true);
         assignStoreOwnerRequest = {body: {storeName, usernameToAssign: owners[2].name}, token};
         assignStoreOwnerResponse = await ServiceFacade.assignStoreOwner(assignStoreOwnerRequest);
         expect(assignStoreOwnerResponse.data.result).toBe(true);

         assignStoreOwnerRequest = {body: {storeName, usernameToAssign: owners[3].name}, token};
         assignStoreOwnerResponse = await ServiceFacade.assignStoreOwner(assignStoreOwnerRequest);
         expect(assignStoreOwnerResponse.data.result).toBe(true);

         // 1 -> 4,5
         await utils.loginUser(owners[1].name, pw, token, true);
         assignStoreOwnerRequest = {body: {storeName, usernameToAssign: owners[4].name}, token};
         assignStoreOwnerResponse = await ServiceFacade.assignStoreOwner(assignStoreOwnerRequest);
         expect(assignStoreOwnerResponse.data.result).toBe(true);

         assignStoreOwnerRequest = {body: {storeName, usernameToAssign: owners[5].name}, token};
         assignStoreOwnerResponse = await ServiceFacade.assignStoreOwner(assignStoreOwnerRequest);
         expect(assignStoreOwnerResponse.data.result).toBe(true);

         // 4 -> 6
         await utils.loginUser(owners[4].name, pw, token, true);
         assignStoreOwnerRequest = {body: {storeName, usernameToAssign: owners[6].name}, token};
         assignStoreOwnerResponse = await ServiceFacade.assignStoreOwner(assignStoreOwnerRequest);
         expect(assignStoreOwnerResponse.data.result).toBe(true);


         // storeOwnerRegisteredUser removes owner1: 4,5,6 should be removed
         await utils.loginUser(storeOwnerRegisteredUser.name, storeOwnerRegisteredUser.password, token, true);
         const removeStoreOwnerRequest: Req.RemoveStoreOwnerRequest = {
             body: {
                 storeName,
                 usernameToRemove: owners[1].name
             }, token
         };
         const removeStoreOwnerResponse: Res.BoolResponse = await ServiceFacade.removeStoreOwner(removeStoreOwnerRequest);

         expect(removeStoreOwnerResponse.data.result).toBe(true);

         const storeInfoReq: Req.StoreInfoRequest = {body: {storeName}, token};
         const storeInfoRes: Res.StoreInfoResponse = await ServiceFacade.viewStoreInfo(storeInfoReq);

         const expectedOwners: string[] = [storeOwnerRegisteredUser.name, owners[0].name, owners[2].name, owners[3].name]

         expect(storeInfoRes.data.result).toBe(true);
         expect(storeInfoRes.data.info.storeOwnersNames).toHaveLength(4);
         expectedOwners.forEach(ownerName => expect(storeInfoRes.data.info.storeOwnersNames).toContainEqual(ownerName))
         done();
     });
 */