import {Store} from "domain_layer/dist/src/store/Store";
import {StoreOwner} from "domain_layer/dist/src/user/users/StoreOwner";
import {Req, Res} from 'se-workshop-20-interfaces'
import { ManagementPermission, ProductCategory} from "se-workshop-20-interfaces/dist/src/Enums";
import { IItem as ItemReq, IProduct as ProductReq, ProductWithQuantity } from 'se-workshop-20-interfaces/dist/src/CommonInterface'
import { RegisteredUser } from "domain_layer/dist/src/user/users/RegisteredUser";
import * as utils from "./utils"
import * as ServiceFacade from "../../../src/service_facade/ServiceFacade"


describe("Store Owner Integration Tests", () => {
    const storeOwnerName: string = "store-owner";
    const storeOwnerPassword: string = "store-owner-pw";
    const storeName: string = "store-name";

    let store: Store;
    let storeOwnerRegisteredUser: RegisteredUser;
    let storeOwner: StoreOwner;
    let token: string;


    beforeAll(() => {
        utils.systemInit();
    });

    beforeEach(() => {
        utils.systemReset();
        storeOwnerRegisteredUser = new RegisteredUser(storeOwnerName, storeOwnerPassword);
        store = new Store(storeName);
        storeOwner = new StoreOwner(storeOwnerName);

        token = utils.initSessionRegisterLogin(storeOwnerName, storeOwnerPassword);
        expect(token).toBeDefined();

        utils.createStore(storeName, token);
    });


    it("add new products", () => {
        let product1: ProductReq = {name: 'mock1', catalogNumber: 5, price: 123, category: 1};
        let product2: ProductReq = {name: 'mock2', catalogNumber: 15, price: 1123, category: 2};
        let products: ProductReq[] = [product1, product2];

        // all products are valid
        let addProductsReq: Req.AddProductsRequest = {body: {storeName, products}, token};
        let productAdditionRes: Res.ProductAdditionResponse = ServiceFacade.addNewProducts(addProductsReq);
        expect(productAdditionRes.data.result).toBeTruthy();
        expect(productAdditionRes.data.productsNotAdded).toBeDefined();
        expect(productAdditionRes.data.productsNotAdded.length).toBe(0);

        product1 = {name: 'mock1', catalogNumber: 5, price: 123, category: 1};
        product2 = {name: 'mock2', catalogNumber: 15, price: 1123, category: 2};
        products = [product1, product2];

        // all products are invalid
        addProductsReq = {body: {storeName, products}, token};
        productAdditionRes = ServiceFacade.addNewProducts(addProductsReq);
        expect(productAdditionRes.data.result).toBeFalsy();
        expect(productAdditionRes.error).toBeDefined();
        expect(productAdditionRes.data.productsNotAdded).toBeDefined();
        expect(productAdditionRes.data.productsNotAdded.length).toBe(products.length);

        product1 = {name: 'mock1', catalogNumber: -5, price: 123, category: 1};
        product2 = {name: 'mock2', catalogNumber: 12, price: 1123, category: 2};
        products = [product1, product2];

        // one product is valid
        addProductsReq = {body: {storeName, products}, token};
        productAdditionRes = ServiceFacade.addNewProducts(addProductsReq);
        expect(productAdditionRes.data.result).toBeTruthy();
        expect(productAdditionRes.data.productsNotAdded).toBeDefined();
        expect(productAdditionRes.data.productsNotAdded.length).toBe(1);
    });

    it("add new items", () => {
        // products don't exist
        let item1: ItemReq = {catalogNumber: 1, id: 6};
        let item2: ItemReq = {catalogNumber: 2, id: 5};
        let items: ItemReq[] = [item1, item2];

        let addItemsReq: Req.ItemsAdditionRequest = {body: {storeName, items}, token};
        let itemsAdditionRes: Res.ItemsAdditionResponse = ServiceFacade.addItems(addItemsReq);
        expect(itemsAdditionRes.data.result).toBeFalsy();
        expect(itemsAdditionRes.error).toBeDefined();
        expect(itemsAdditionRes.data.itemsNotAdded).toBeDefined();
        expect(itemsAdditionRes.data.itemsNotAdded.length).toBe(items.length);

        // prepare products to add items
        const product1: ProductReq = {name: 'mock1', catalogNumber: 5, price: 123, category: 1};
        const product2: ProductReq = {name: 'mock2', catalogNumber: 15, price: 1123, category: 2};
        const products: ProductReq[] = [product1, product2];

        // all products are valid
        const addProductsReq: Req.AddProductsRequest = {body: {storeName, products}, token};
        const productAdditionRes: Res.ProductAdditionResponse = ServiceFacade.addNewProducts(addProductsReq);
        expect(productAdditionRes.data.result).toBeTruthy();
        expect(productAdditionRes.data.productsNotAdded).toBeDefined();
        expect(productAdditionRes.data.productsNotAdded.length).toBe(0);

        // new products addition doesn't affect invalid items
        itemsAdditionRes = ServiceFacade.addItems(addItemsReq);
        expect(itemsAdditionRes.data.result).toBeFalsy();
        expect(itemsAdditionRes.error).toBeDefined();
        expect(itemsAdditionRes.data.itemsNotAdded).toBeDefined();
        expect(itemsAdditionRes.data.itemsNotAdded.length).toBe(items.length);

        item1 = {catalogNumber: 5, id: 6};
        item2 = {catalogNumber: 15, id: 5};
        items = [item1, item2];

        // valid items
        addItemsReq = {body: {storeName, items}, token};
        itemsAdditionRes = ServiceFacade.addItems(addItemsReq);
        expect(itemsAdditionRes.data.result).toBeTruthy();
        expect(itemsAdditionRes.error).toBeUndefined();
        expect(itemsAdditionRes.data.itemsNotAdded).toBeDefined();
        expect(itemsAdditionRes.data.itemsNotAdded.length).toBe(0);

        item1 = {catalogNumber: -5, id: 6};
        item2 = {catalogNumber: 15, id: 15};
        items = [item1, item2];

        // 1 valid item
        addItemsReq = {body: {storeName, items}, token};
        itemsAdditionRes = ServiceFacade.addItems(addItemsReq);
        expect(itemsAdditionRes.data.result).toBeTruthy();
        expect(itemsAdditionRes.error).toBeUndefined();
        expect(itemsAdditionRes.data.itemsNotAdded).toBeDefined();
        expect(itemsAdditionRes.data.itemsNotAdded.length).toBe(1);

        item1 = {catalogNumber: 5, id: 6};
        item2 = {catalogNumber: 15, id: 5};
        items = [item1, item2];

        // items already exist
        addItemsReq = {body: {storeName, items}, token};
        itemsAdditionRes = ServiceFacade.addItems(addItemsReq);
        expect(itemsAdditionRes.data.result).toBeFalsy();
        expect(itemsAdditionRes.error).toBeDefined();
        expect(itemsAdditionRes.data.itemsNotAdded).toBeDefined();
        expect(itemsAdditionRes.data.itemsNotAdded.length).toBe(items.length);
    });

    it("change product details and view product info", () => {
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

        const product1: ProductReq = {
            name: oldName1,
            catalogNumber: catalogNumber1,
            price: oldPrice1,
            category: category1
        };
        const product2: ProductReq = {
            name: oldName2,
            catalogNumber: catalogNumber2,
            price: oldPrice2,
            category: category2
        };
        const products: ProductReq[] = [product1, product2];

        // all products are valid
        const addProductsReq: Req.AddProductsRequest = {body: {storeName, products}, token};
        const productAdditionRes: Res.ProductAdditionResponse = ServiceFacade.addNewProducts(addProductsReq);
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
        let res: Res.BoolResponse = ServiceFacade.changeProductName(changeProductNameRequest);

        expect(res.data.result).toBe(true);

        let viewStoreReq: Req.ProductInfoRequest = {body: {storeName, catalogNumber: catalogNumber1}, token};
        let viewStoreRes: Res.ProductInfoResponse = ServiceFacade.viewProductInfo(viewStoreReq);

        expect(viewStoreRes.data.result).toBe(true);
        expect(viewStoreRes.data.info.category).toBe(category1);
        expect(viewStoreRes.data.info.catalogNumber).toBe(catalogNumber1);
        expect(viewStoreRes.data.info.price).toBe(oldPrice1);
        expect(viewStoreRes.data.info.name).toBe(newName1);

        viewStoreReq = {body: {storeName, catalogNumber: catalogNumber2}, token};
        viewStoreRes = ServiceFacade.viewProductInfo(viewStoreReq);

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
        res = ServiceFacade.changeProductPrice(changeProductPriceRequest);

        expect(res.data.result).toBe(true);


        viewStoreReq = {body: {storeName, catalogNumber: catalogNumber1}, token};
        viewStoreRes = ServiceFacade.viewProductInfo(viewStoreReq);

        expect(viewStoreRes.data.result).toBe(true);
        expect(viewStoreRes.data.info.category).toBe(category1);
        expect(viewStoreRes.data.info.catalogNumber).toBe(catalogNumber1);
        expect(viewStoreRes.data.info.price).toBe(oldPrice1);
        expect(viewStoreRes.data.info.name).toBe(newName1);

        viewStoreReq = {body: {storeName, catalogNumber: catalogNumber2}, token};
        viewStoreRes = ServiceFacade.viewProductInfo(viewStoreReq);

        expect(viewStoreRes.data.result).toBe(true);
        expect(viewStoreRes.data.info.category).toBe(category2);
        expect(viewStoreRes.data.info.catalogNumber).toBe(catalogNumber2);
        expect(viewStoreRes.data.info.price).toBe(newPrice2);
        expect(viewStoreRes.data.info.name).toBe(oldName2);

    });

    it("remove items", () => {
        let item1: ItemReq = {catalogNumber: 1, id: 6};
        let item2: ItemReq = {catalogNumber: 2, id: 5};
        let item3: ItemReq = {catalogNumber: 3, id: 5};
        let item4: ItemReq = {catalogNumber: 4, id: 5};
        let items: ItemReq[] = [item1, item2, item3, item4];

        // items don't exist
        let removeItemsReq: Req.ItemsRemovalRequest = {body: {storeName, items}, token};
        let removeItemsRes: Res.ItemsRemovalResponse = ServiceFacade.removeItems(removeItemsReq);
        expect(removeItemsRes.data.result).toBeFalsy();
        expect(removeItemsRes.error).toBeDefined();
        expect(removeItemsRes.data.itemsNotRemoved).toBeDefined();
        expect(removeItemsRes.data.itemsNotRemoved.length).toBe(items.length);

        // prepare products to add items
        const product1: ProductReq = {name: 'mock1', catalogNumber: 5, price: 123, category: 1};
        const product2: ProductReq = {name: 'mock2', catalogNumber: 15, price: 1123, category: 2};
        const products: ProductReq[] = [product1, product2];

        // all products are valid
        const addProductsReq: Req.AddProductsRequest = {body: {storeName, products}, token};
        const productAdditionRes: Res.ProductAdditionResponse = ServiceFacade.addNewProducts(addProductsReq);
        expect(productAdditionRes.data.result).toBeTruthy();
        expect(productAdditionRes.data.productsNotAdded).toBeDefined();
        expect(productAdditionRes.data.productsNotAdded.length).toBe(0);

        // new products addition doesn't affect invalid items
        removeItemsRes = ServiceFacade.removeItems(removeItemsReq);
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
        let itemsAdditionRes: Res.ItemsAdditionResponse = ServiceFacade.addItems(addItemsReq);
        expect(itemsAdditionRes.data.result).toBeTruthy();
        expect(itemsAdditionRes.error).toBeUndefined();
        expect(itemsAdditionRes.data.itemsNotAdded).toBeDefined();
        expect(itemsAdditionRes.data.itemsNotAdded.length).toBe(0);

        // removal
        removeItemsReq = {body: {storeName, items}, token};
        removeItemsRes = ServiceFacade.removeItems(removeItemsReq);
        expect(removeItemsRes.data.result).toBeTruthy();
        expect(removeItemsRes.error).toBeUndefined();
        expect(removeItemsRes.data.itemsNotRemoved).toBeDefined();
        expect(removeItemsRes.data.itemsNotRemoved.length).toBe(0);

        // addition
        addItemsReq = {body: {storeName, items}, token};
        itemsAdditionRes = ServiceFacade.addItems(addItemsReq);
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
        removeItemsReq = {body: {storeName, items}, token};
        removeItemsRes = ServiceFacade.removeItems(removeItemsReq);
        expect(removeItemsRes.data.result).toBeTruthy();
        expect(removeItemsRes.error).toBeUndefined();
        expect(removeItemsRes.data.itemsNotRemoved).toBeDefined();
        expect(removeItemsRes.data.itemsNotRemoved.length).toBe(4);
    });

    it("remove products", () => {
        let product1: ProductReq = {name: 'mock1', catalogNumber: 5, price: 123, category: 1};
        let product2: ProductReq = {name: 'mock2', catalogNumber: 15, price: 1123, category: 2};
        let products: ProductReq[] = [product1, product2];

        // products don't exist
        let removeProductsReq: Req.ProductRemovalRequest = {body: {storeName, products}, token};
        let removeProductsRes: Res.ProductRemovalResponse = ServiceFacade.removeProducts(removeProductsReq);

        expect(removeProductsRes.data.result).toBe(false);
        expect(removeProductsRes.data.productsNotRemoved).toBeDefined();
        expect(removeProductsRes.data.productsNotRemoved.length).toBe(products.length);

        // add valid products
        let addProductsReq: Req.AddProductsRequest = {body: {storeName, products}, token};
        let productAdditionRes: Res.ProductAdditionResponse = ServiceFacade.addNewProducts(addProductsReq);

        expect(productAdditionRes.data.result).toBeTruthy();
        expect(productAdditionRes.data.productsNotAdded).toBeDefined();
        expect(productAdditionRes.data.productsNotAdded.length).toBe(0);

        // remove valid products
        removeProductsRes = ServiceFacade.removeProducts(removeProductsReq);

        expect(removeProductsRes.data.result).toBe(true);
        expect(removeProductsRes.data.productsNotRemoved).toBeDefined();
        expect(removeProductsRes.data.productsNotRemoved.length).toBe(0);

        // add valid products
        productAdditionRes = ServiceFacade.addNewProducts(addProductsReq);

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
        const product3: ProductReq = {name: 'mock3', catalogNumber: -15, price: 1123, category: 2};
        const product4: ProductReq = {name: 'mock4', catalogNumber: 15, price: -1123, category: 2};
        const product5: ProductReq = {name: 'mock5', catalogNumber: 15, price: 1123, category: -2};

        products = [product1, product2, product3, product4, product5];
        removeProductsReq = {body: {storeName, products}, token};
        removeProductsRes = ServiceFacade.removeProducts(removeProductsReq);

        expect(removeProductsRes.data.result).toBe(true);
        expect(removeProductsRes.data.productsNotRemoved).toBeDefined();
        expect(removeProductsRes.data.productsNotRemoved.length).toBe(3);

        // add 2 valid products
        products = [product1, product2];
        addProductsReq = {body: {storeName, products}, token};
        productAdditionRes = ServiceFacade.addNewProducts(addProductsReq);

        expect(productAdditionRes.data.result).toBe(true);
        expect(productAdditionRes.data.productsNotAdded).toBeDefined();
        expect(productAdditionRes.data.productsNotAdded).toHaveLength(0);

        // product 1 and 2 are added, add items
        const item1: ItemReq = {catalogNumber: catalog1, id: 1};
        const item2: ItemReq = {catalogNumber: catalog1, id: 2};
        const item3: ItemReq = {catalogNumber: catalog1, id: 3};
        const item4: ItemReq = {catalogNumber: catalog1, id: 4};
        const item5: ItemReq = {catalogNumber: catalog2, id: 1};
        const item6: ItemReq = {catalogNumber: catalog2, id: 2};
        const item7: ItemReq = {catalogNumber: catalog2, id: 3};
        const item8: ItemReq = {catalogNumber: catalog2, id: 4};
        const items: ItemReq[] = [item1, item2, item3, item4, item5, item6, item7, item8];

        const quantityToRemove1: number = 2;
        const quantityToRemove2: number = 4;

        const addItemsReq: Req.ItemsAdditionRequest = {body: {storeName, items}, token};
        const itemsAdditionRes: Res.ItemsAdditionResponse = ServiceFacade.addItems(addItemsReq);
        expect(itemsAdditionRes.data.result).toBeTruthy();
        expect(itemsAdditionRes.data.itemsNotAdded).toBeDefined();
        expect(itemsAdditionRes.data.itemsNotAdded).toHaveLength(0);

        const prodToRemove: ProductWithQuantity[] = [{
            quantity: quantityToRemove1,
            catalogNumber: catalog1
        }, {quantity: quantityToRemove2, catalogNumber: catalog2}];
        const removeProductsWithQuantityReq: Req.RemoveProductsWithQuantity = {
            body: {
                storeName,
                products: prodToRemove
            }, token
        };
        const removeProductsWithQuantityRes: Res.ProductRemovalResponse = ServiceFacade.removeProductsWithQuantity(removeProductsWithQuantityReq);

        expect(removeProductsWithQuantityRes.data.result).toBeTruthy();
        expect(removeProductsWithQuantityRes.data.productsNotRemoved).toBeDefined();
        expect(removeProductsWithQuantityRes.data.productsNotRemoved).toHaveLength(0);

        let viewStoreReq: Req.ProductInfoRequest = {body: {storeName, catalogNumber: catalog1}, token};
        let viewStoreRes: Res.ProductInfoResponse = ServiceFacade.viewProductInfo(viewStoreReq);

        expect(viewStoreRes.data.result).toBe(true);
        expect(viewStoreRes.data.info.category).toBe(category1);
        expect(viewStoreRes.data.info.catalogNumber).toBe(catalog1);
        expect(viewStoreRes.data.info.price).toBe(price1);
        expect(viewStoreRes.data.info.name).toBe(name1);
        expect(viewStoreRes.data.info.quantity).toBe(4 - quantityToRemove1);

        viewStoreReq = {body: {storeName, catalogNumber: catalog2}, token};
        viewStoreRes = ServiceFacade.viewProductInfo(viewStoreReq);

        expect(viewStoreRes.data.result).toBe(true);
        expect(viewStoreRes.data.info.category).toBe(category2);
        expect(viewStoreRes.data.info.catalogNumber).toBe(catalog2);
        expect(viewStoreRes.data.info.price).toBe(price2);
        expect(viewStoreRes.data.info.name).toBe(name2);
        expect(viewStoreRes.data.info.quantity).toBe(4 - quantityToRemove2);

    });

    it("assign and remove store owners", () => {
        const newUsername1: string = "new-assign-mock1";
        const newUsername2: string = "new-assign-mock2";
        const newPassword: string = "new-assign-mock-pw";
        const newUser1: RegisteredUser = new RegisteredUser(newUsername1, newPassword);
        const newUser2: RegisteredUser = new RegisteredUser(newUsername2, newPassword);

        utils.registerUser(newUser1.name, newUser1.password, token, true);
        utils.registerUser(newUser2.name, newUser2.password, token, false);
        utils.loginUser(storeOwnerRegisteredUser.name, storeOwnerRegisteredUser.password, token, false);

        // assign valid store owner
        let assignStoreOwnerRequest: Req.AssignStoreOwnerRequest = {
            body: {storeName, usernameToAssign: newUser1.name},
            token
        };
        let assignStoreOwnerResponse: Res.BoolResponse = ServiceFacade.assignStoreOwner(assignStoreOwnerRequest);

        expect(assignStoreOwnerResponse.data.result).toBe(true);

        // assign circular store owner
        utils.loginUser(newUser1.name, newUser1.password, token, true);

        assignStoreOwnerRequest = {body: {storeName, usernameToAssign: storeOwnerRegisteredUser.name}, token};
        assignStoreOwnerResponse = ServiceFacade.assignStoreOwner(assignStoreOwnerRequest);

        expect(assignStoreOwnerResponse.data.result).toBe(false);

        // assign invalid store owner
        utils.loginUser(storeOwnerRegisteredUser.name, storeOwnerRegisteredUser.password, token, true);

        assignStoreOwnerRequest = {body: {storeName, usernameToAssign: "invalid-username"}, token};
        assignStoreOwnerResponse = ServiceFacade.assignStoreOwner(assignStoreOwnerRequest);

        expect(assignStoreOwnerResponse.data.result).toBe(false);

        // store owner tries to assign himself
        assignStoreOwnerRequest = {body: {storeName, usernameToAssign: storeOwner.name}, token};
        assignStoreOwnerResponse = ServiceFacade.assignStoreOwner(assignStoreOwnerRequest);

        expect(assignStoreOwnerResponse.data.result).toBe(false);

        // store owner tries to remove himself
        let removeStoreOwnerRequest: Req.RemoveStoreOwnerRequest = {
            body: {
                storeName,
                usernameToRemove: storeOwner.name
            }, token
        };
        let removeStoreOwnerResponse: Res.BoolResponse = ServiceFacade.removeStoreOwner(removeStoreOwnerRequest);

        expect(removeStoreOwnerResponse.data.result).toBe(false);

        // store owner tries to remove not assigned by him store owner //todo: add new store owner in same store , in another
        // same store
        // assign user2 by user1
        utils.loginUser(newUser1.name, newUser1.password, token, true);

        assignStoreOwnerRequest = {body: {storeName, usernameToAssign: newUser2.name}, token};
        assignStoreOwnerResponse = ServiceFacade.assignStoreOwner(assignStoreOwnerRequest);

        expect(assignStoreOwnerResponse.data.result).toBe(true);

        // remove user2 by storeOwner
        utils.loginUser(storeOwnerRegisteredUser.name, storeOwnerRegisteredUser.password, token, true);

        removeStoreOwnerRequest = {body: {storeName, usernameToRemove: newUser2.name}, token};
        removeStoreOwnerResponse = ServiceFacade.removeStoreOwner(removeStoreOwnerRequest);

        expect(removeStoreOwnerResponse.data.result).toBe(false);


        // another store
        // user2 creates new store
        const storeName2: string = "new-store-name-user-2";
        utils.loginUser(newUser2.name, newUser2.password, token, true);
        utils.createStore(storeName2, token);

        // user2 assigns user1
        assignStoreOwnerRequest = {body: {storeName: storeName2, usernameToAssign: newUser1.name}, token};
        assignStoreOwnerResponse = ServiceFacade.assignStoreOwner(assignStoreOwnerRequest);

        expect(assignStoreOwnerResponse.data.result).toBe(true);

        // storeOwner tries to remove user1, user2 from storeName2
        utils.loginUser(storeOwnerRegisteredUser.name, storeOwnerRegisteredUser.password, token, true);

        removeStoreOwnerRequest = {body: {storeName: storeName2, usernameToRemove: newUser1.name}, token};
        removeStoreOwnerResponse = ServiceFacade.removeStoreOwner(removeStoreOwnerRequest);

        expect(removeStoreOwnerResponse.data.result).toBe(false);

        removeStoreOwnerRequest = {body: {storeName: storeName2, usernameToRemove: newUser2.name}, token};
        removeStoreOwnerResponse = ServiceFacade.removeStoreOwner(removeStoreOwnerRequest);

        expect(removeStoreOwnerResponse.data.result).toBe(false);

    });

    it("assign, remove store managers and change permissions", () => {
        const newUsername1: string = "new-assign-mock1";
        const newUsername2: string = "new-assign-mock2";
        const newPassword: string = "new-assign-mock-pw";
        const newUser1: RegisteredUser = new RegisteredUser(newUsername1, newPassword);
        const newUser2: RegisteredUser = new RegisteredUser(newUsername2, newPassword);

        utils.registerUser(newUser1.name, newUser1.password, token, true);
        utils.registerUser(newUser2.name, newUser2.password, token, false);
        utils.loginUser(storeOwnerRegisteredUser.name, storeOwnerRegisteredUser.password, token, false);

        // assign valid store manager
        let assignStoreManagerRequest: Req.AssignStoreOwnerRequest = {
            body: {
                storeName,
                usernameToAssign: newUser1.name
            }, token
        };
        let assignStoreManagerResponse: Res.BoolResponse = ServiceFacade.assignStoreManager(assignStoreManagerRequest);

        expect(assignStoreManagerResponse.data.result).toBe(true);

        assignStoreManagerRequest = {body: {storeName, usernameToAssign: newUser2.name}, token};
        assignStoreManagerResponse = ServiceFacade.assignStoreManager(assignStoreManagerRequest);

        expect(assignStoreManagerResponse.data.result).toBe(true);

        // remove store manager1
        const removeStoreManagerRequest: Req.RemoveStoreManagerRequest = {
            body: {
                storeName,
                usernameToRemove: newUser1.name
            }, token
        };
        const removeStoreManagerResponse: Res.BoolResponse = ServiceFacade.removeStoreManager(removeStoreManagerRequest);

        expect(removeStoreManagerResponse.data.result).toBe(true);

        const permission1: ManagementPermission = ManagementPermission.MANAGE_INVENTORY;
        const permission2: ManagementPermission = ManagementPermission.MANAGE_INVENTORY;
        const permission3: ManagementPermission = ManagementPermission.MANAGE_INVENTORY;

        const permissionsToChange: ManagementPermission[] = [permission1, permission2, permission3];

        let changeManagerPermissionReq: Req.ChangeManagerPermissionRequest = {
            body: {
                managerToChange: newUser2.name,
                storeName,
                permissions: permissionsToChange
            }, token
        };
        let changeManagerPermissionRes: Res.BoolResponse = ServiceFacade.removeManagerPermissions(changeManagerPermissionReq);

        expect(changeManagerPermissionRes.data.result).toBe(true);

        changeManagerPermissionReq = {
            body: {
                managerToChange: newUser2.name,
                storeName,
                permissions: permissionsToChange
            }, token
        };
        changeManagerPermissionRes = ServiceFacade.addManagerPermissions(changeManagerPermissionReq);

        expect(changeManagerPermissionRes.data.result).toBe(true);

        // todo: once get all permissions by user is implemented we can verify permissions were changed
    });

});
