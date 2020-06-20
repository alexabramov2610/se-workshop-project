import {StoreManager, StoreOwner} from "../../../../src/user/internal_api";
import {
    BagItem,
    IItem,
    IPayment,
    IProduct,
    IReceipt,
    ProductCatalogNumber,
    ProductCategory,
    ProductInStore,
    ProductWithQuantity,
    Purchase,
    SearchFilters,
    SearchQuery
} from "se-workshop-20-interfaces/dist/src/CommonInterface";
import {Res} from 'se-workshop-20-interfaces'
import {ManagementPermission, Rating} from "se-workshop-20-interfaces/dist/src/Enums";
import {PurchasePolicy} from "../../../../src/store/PurchasePolicy/PurchasePolicy";
import {Discount} from "../../../../src/store/discounts/Discount";
import {
    createProduct,
    createStoreManager,
    createStoreOwner,
    generateInvalidProducts, generateValidItems,
    generateValidProducts, generateValidProductsReq
} from "../utils/utils";
import {Store} from "../../../../src/store/Store";

describe("Store Unit Tests", () => {
    let store: Store;
    let firstOwner: StoreOwner;
    let storeManager: StoreManager;

    let storeName: string;
    let description: string;
    let productsInStore: Map<IProduct, IItem[]>;
    let storeOwners: StoreOwner[];
    let storeManagers: StoreManager[];
    let storeReceipts: IReceipt[];
    let purchasePolicy: PurchasePolicy;
    let discountPolicy: Discount;

    const storeOwnerName: string = "store-owner-name";
    const storeManagerName: string = "store-manager-name";
    const basicPermissions: ManagementPermission[] = [ ManagementPermission.WATCH_PURCHASES_HISTORY, ManagementPermission.WATCH_USER_QUESTIONS, ManagementPermission.REPLY_USER_QUESTIONS ]

    beforeEach(async () => {
        jest.useFakeTimers();

        firstOwner = { name: storeOwnerName, assignedStoreManagers: [], assignedStoreOwners: [] };
        storeManager = { name: storeManagerName, managerPermissions: basicPermissions }

        storeName = "store";
        description = "storeDescription";
        productsInStore = new Map();
        storeOwners = [firstOwner];
        storeManagers = [storeManager];
        storeReceipts = [];
        purchasePolicy = undefined;
        discountPolicy = undefined;

        // mockProductModel();
        store = new Store(storeName, description, productsInStore, storeOwners, storeManagers, storeReceipts, firstOwner, purchasePolicy, discountPolicy);
    });

    afterAll(async () => {
        await new Promise(resolve => setTimeout(resolve, 10));
    })

    test("init test - init", () => {
        expect(store.storeName).toBe(storeName);
        expect(store.description).toBe(description);
        expect(store.products).toBe(productsInStore);
        expect(store.storeOwners).toBe(storeOwners);
        expect(store.storeManagers).toBe(storeManagers);
        expect(store.receipts).toBe(storeReceipts);
        expect(store.firstOwner).toBe(firstOwner);
        expect(store.purchasePolicy).toBe(purchasePolicy);
        expect(store.discountPolicy).toBe(discountPolicy);
        expect(store.rating).toBe(Rating.MEDIUM);
    });


    test("view store info success", () => {
        const dor: StoreOwner = createStoreOwner("dor")
        const dor2: StoreManager = createStoreManager("dor2")
        const chair = createProduct("chair", 6, 200, ProductCategory.HOME)
        store.addStoreOwner(dor)
        store.addNewProducts([chair])
        store.addStoreManager(dor2);

        const res = store.viewStoreInfo()
        expect(res.data.result).toBeTruthy();
        expect(res.data.info.storeName).toBe(storeName)
        expect(res.data.info.description).toBe(description)
        expect(res.data.info.storeRating).toBe(Rating.MEDIUM)
        expect(res.data.info.storeOwnersNames).toStrictEqual([firstOwner.name].concat([dor.name]))
        expect(res.data.info.storeManagersNames).toStrictEqual([storeManager.name].concat([dor2.name]))
        expect(res.data.info.productsNames).toStrictEqual([chair.name])
    })

    test("view store info success 2", () => {
        const product1 = createProduct('product1', 1, 1, ProductCategory.HOME)
        const product2 = createProduct('product2', 2, 2, ProductCategory.HOME)
        const products: IProduct[] = [product1, product2];

        store.addNewProducts(products);
        store.addStoreOwner(firstOwner);

        const res = store.viewStoreInfo();
        expect(res.data.info.storeName).toBe(store.storeName);
        expect(res.data.info.productsNames).toContain(product1.name);
        expect(res.data.info.productsNames).toContain(product2.name);
        expect(res.data.info.storeOwnersNames).toContain(firstOwner.name)
    })


    test("addStoreOwner & verifyIsStoreOwner success", () => {
        expect(store.verifyIsStoreOwner(firstOwner.name)).toBeTruthy();

        const newStoreOwnerName: string = "new-store-owner";
        const newStoreOwner: StoreOwner = createStoreOwner(newStoreOwnerName);
        const res: Res.BoolResponse = store.addStoreOwner(newStoreOwner);
        expect(res.data.result).toBeTruthy();

        expect(store.verifyIsStoreOwner(newStoreOwnerName)).toBeTruthy();
        expect(store.getStoreOwner(newStoreOwnerName)).toMatchObject(newStoreOwner);
    })

    test("addStoreOwner failure", () => {
        let res: Res.BoolResponse = store.addStoreOwner(firstOwner);
        expect(res.data.result).toBeFalsy();
    });

    test("verifyIsStoreOwner failure - not store owner", () => {
        const newStoreOwnerName: string = "new-store-owner";
        expect(store.verifyIsStoreOwner(newStoreOwnerName)).toBeFalsy();
    })


    test("removeStoreOwner success", () => {
        expect(store.removeStoreOwner(firstOwner).data.result).toBeTruthy();
    });

    test("removeStoreOwner failure", () => {
        const newStoreOwnerName: string = "new-store-owner";
        const newStoreOwner: StoreOwner = createStoreOwner(newStoreOwnerName);
        const res: Res.BoolResponse = store.removeStoreOwner(newStoreOwner);
        expect(res.data.result).toBeFalsy();
    });


    test("addStoreManager & verifyIsStoreManager success", () => {
        expect(store.verifyIsStoreManager(storeManager.name)).toBeTruthy();

        const newStoreManagerName: string = "new-store-manager";
        const newStoreManager: StoreManager = createStoreManager(newStoreManagerName);
        const res: Res.BoolResponse = store.addStoreManager(newStoreManager);
        expect(res.data.result).toBeTruthy();

        expect(store.verifyIsStoreManager(newStoreManagerName)).toBeTruthy();
        expect(store.getStoreManager(newStoreManagerName)).toMatchObject(newStoreManager);
    })

    test("addStoreManager failure", () => {
        let res: Res.BoolResponse = store.addStoreManager(storeManager);
        expect(res.data.result).toBeFalsy();
    });

    test("verifyIsStoreManager failure - not store owner", () => {
        const newStoreManagerName: string = "new-store-manager";
        expect(store.verifyIsStoreManager(newStoreManagerName)).toBeFalsy();
    })


    test("removeStoreManager success", () => {
        expect(store.removeStoreManager(storeManager).data.result).toBeTruthy();
    });

    test("removeStoreManager failure", () => {
        const newStoreManagerName: string = "new-store-manager";
        const newStoreManager: StoreManager = createStoreManager(newStoreManagerName);
        const res: Res.BoolResponse = store.removeStoreManager(newStoreManager);
        expect(res.data.result).toBeFalsy();
    });


    test("addNewProducts success", () => {
        const products: IProduct[] = generateValidProducts(5);
        const res: Res.ProductAdditionResponse = store.addNewProducts(products);

        expect(res.data.result).toBeTruthy();
        expect(res.data.productsNotAdded.length).toBe(0);
    });

    test("addNewProducts failure - duplicated", () => {
        const numOfProducts: number = 5;

        let products: IProduct[] = generateValidProducts(numOfProducts);
        let res: Res.ProductAdditionResponse = store.addNewProducts(products);

        expect(res.data.result).toBeTruthy();
        expect(res.data.productsNotAdded.length).toBe(0);

        products = generateValidProducts(numOfProducts);
        res = store.addNewProducts(products);

        expect(res.data.result).toBeFalsy();
        expect(res.data.productsNotAdded.length).toBe(numOfProducts);
    });


    test("removeProductsByCatalogNumber success", (done) => {
        const numOfProducts: number = 5;

        let products: IProduct[] = generateValidProducts(numOfProducts);
        const res: Res.ProductAdditionResponse = store.addNewProducts(products);

        expect(res.data.result).toBeTruthy();
        expect(res.data.productsNotAdded.length).toBe(0);

        products = generateValidProducts(numOfProducts);
        const productRemovalRes: Res.ProductRemovalResponse = store.removeProductsByCatalogNumber(products);
        expect(productRemovalRes.data.result).toBeTruthy();
        expect(productRemovalRes.data.productsNotRemoved.length).toBe(0);
        done();
    });

    test("removeProductsByCatalogNumber failure", (done) => {
        const numOfProducts: number = 5;
        const products: ProductCatalogNumber[] = generateValidProductsReq(numOfProducts);
        const resRemove: Res.ProductRemovalResponse = store.removeProductsByCatalogNumber(products);
        expect(resRemove.data.result).toBeFalsy();
        expect(resRemove.data.productsNotRemoved.length).toBe(numOfProducts);
        done();
    });


    test("removeProductsByCatalogNumber failure - some invalid products", (done) => {
        const numOfProducts: number = 5;

        let products: IProduct[] = generateValidProducts(numOfProducts);
        const res: Res.ProductAdditionResponse = store.addNewProducts(products);

        expect(res.data.result).toBeTruthy();
        expect(res.data.productsNotAdded.length).toBe(0);

        products = products.concat(generateInvalidProducts(numOfProducts));
        const resRemove: Res.ProductRemovalResponse = store.removeProductsByCatalogNumber(products);

        expect(resRemove.data.result).toBeTruthy();
        expect(resRemove.data.productsNotRemoved.length).toBe(numOfProducts);
        done();
    });

    test("removeProducts failure - all invalid products", (done) => {
        const numOfProducts: number = 5;
        const products: ProductCatalogNumber[] = generateInvalidProducts(numOfProducts);
        const resRemove: Res.ProductRemovalResponse = store.removeProductsByCatalogNumber(products)
        expect(resRemove.data.result).toBeFalsy();
        expect(resRemove.data.productsNotRemoved.length).toBe(numOfProducts);
        done();
    });


    test("addItems success", () => {
        const numberOfItems: number = 5;
        const products: IProduct[] = generateValidProducts(numberOfItems);
        const res: Res.ProductAdditionResponse = store.addNewProducts(products);

        expect(res.data.result).toBeTruthy();
        expect(res.data.productsNotAdded.length).toBe(0);

        const items: IItem[] = generateValidItems(numberOfItems * 2, 0, numberOfItems, 0);
        const addItemsRes: Res.ItemsAdditionResponse = store.addItems(items);

        expect(addItemsRes.data.result).toBeTruthy();
        expect(addItemsRes.data.itemsNotAdded.length).toBe(0);

    });

    test("addItems success - some in store", () => {
        const numberOfItems: number = 5;
        const products: IProduct[] = generateValidProducts(numberOfItems);
        const res: Res.ProductAdditionResponse = store.addNewProducts(products);

        expect(res.data.result).toBeTruthy();
        expect(res.data.productsNotAdded.length).toBe(0);

        const items: IItem[] = generateValidItems(numberOfItems * 2, 0, numberOfItems * 2, 0);
        const addItemsRes: Res.ItemsAdditionResponse = store.addItems(items);

        expect(addItemsRes.data.result).toBeTruthy();
        expect(addItemsRes.data.itemsNotAdded.length).toBe(numberOfItems);

    });

    test("addItems failure - product not in store", () => {
        const numberOfItems: number = 5;

        const items: IItem[] = generateValidItems(numberOfItems, 0, numberOfItems, 0);

        const addItemsRes: Res.ItemsAdditionResponse = store.addItems(items);
        expect(addItemsRes.data.result).toBeFalsy();
        expect(addItemsRes.data.itemsNotAdded.length).toBe(numberOfItems);
    });

    test("addItems failure - duplicate items", () => {
        const numberOfItems: number = 5;
        const products: IProduct[] = generateValidProducts(numberOfItems);
        const res: Res.ProductAdditionResponse = store.addNewProducts(products);

        expect(res.data.result).toBeTruthy();
        expect(res.data.productsNotAdded.length).toBe(0);

        const items: IItem[] = generateValidItems(numberOfItems * 2, 0, numberOfItems, 0);

        let addItemsRes: Res.ItemsAdditionResponse = store.addItems(items);
        expect(addItemsRes.data.result).toBeTruthy();
        expect(addItemsRes.data.itemsNotAdded.length).toBe(0);

        addItemsRes = store.addItems(items);
        expect(addItemsRes.data.result).toBeFalsy();
        expect(addItemsRes.data.itemsNotAdded.length).toBe(items.length);

    });


    test("removeItems success - all removed", () => {
        const numberOfItems: number = 5;
        const products: IProduct[] = generateValidProducts(numberOfItems);
        const res: Res.ProductAdditionResponse = store.addNewProducts(products);

        expect(res.data.result).toBeTruthy();
        expect(res.data.productsNotAdded.length).toBe(0);

        const items: IItem[] = generateValidItems(numberOfItems * 2, 0, numberOfItems, 0);

        const addItemsRes: Res.ItemsAdditionResponse = store.addItems(items);
        expect(addItemsRes.data.result).toBeTruthy();
        expect(addItemsRes.data.itemsNotAdded.length).toBe(0);

        const removeItemsRes: Res.ItemsRemovalResponse = store.removeItems(items);
        expect(removeItemsRes.data.result).toBeTruthy();
        expect(removeItemsRes.data.itemsNotRemoved.length).toBe(0);

    });

    test("removeItems success - partial remove", () => {
        const numberOfItems: number = 5;
        const products: IProduct[] = generateValidProducts(numberOfItems);
        const res: Res.ProductAdditionResponse = store.addNewProducts(products);

        expect(res.data.result).toBeTruthy();
        expect(res.data.productsNotAdded.length).toBe(0);

        const items: IItem[] = generateValidItems(numberOfItems * 2, 0, numberOfItems, 0);

        const addItemsRes: Res.ItemsAdditionResponse = store.addItems(items);
        expect(addItemsRes.data.result).toBeTruthy();
        expect(addItemsRes.data.itemsNotAdded.length).toBe(0);

        items.length = numberOfItems;

        const removeItemsRes: Res.ItemsRemovalResponse = store.removeItems(items);
        expect(removeItemsRes.data.result).toBeTruthy();
        expect(removeItemsRes.data.itemsNotRemoved.length).toBe(0);

        const productsInStore: Map<IProduct, IItem[]> = store.products;
        for (const itemsArr of productsInStore.values()) {
            expect(itemsArr.length).toBeGreaterThan(0);
        }

    });

    test("removeItems failure - product not in store", () => {
        const numberOfItems: number = 5;
        const products: IProduct[] = generateValidProducts(numberOfItems);
        const res: Res.ProductAdditionResponse = store.addNewProducts(products);

        expect(res.data.result).toBeTruthy();
        expect(res.data.productsNotAdded.length).toBe(0);

        const items: IItem[] = generateValidItems(numberOfItems * 2, numberOfItems + 1, numberOfItems * 2, 0);

        const addItemsRes: Res.ItemsRemovalResponse = store.removeItems(items);
        expect(addItemsRes.data.result).toBeFalsy();
        expect(addItemsRes.data.itemsNotRemoved.length).toBe(numberOfItems * 2);

    });

    test("removeItems failure - items not in store", () => {
        const numberOfItems: number = 5;
        const products: IProduct[] = generateValidProducts(numberOfItems);
        const res: Res.ProductAdditionResponse = store.addNewProducts(products);

        expect(res.data.result).toBeTruthy();
        expect(res.data.productsNotAdded.length).toBe(0);

        const items: IItem[] = generateValidItems(numberOfItems, 0, numberOfItems, 50);

        const removeItemsRes: Res.ItemsRemovalResponse = store.removeItems(items);
        expect(removeItemsRes.data.result).toBeFalsy();
        expect(removeItemsRes.data.itemsNotRemoved.length).toBe(numberOfItems);
        expect(removeItemsRes.error).toBeDefined();
    });


    test("removeProductsWithQuantity success", (done) => {
        const numberOfItems: number = 5;
        let products: IProduct[] = generateValidProducts(numberOfItems);
        const res: Res.ProductAdditionResponse = store.addNewProducts(products);

        expect(res.data.result).toBeTruthy();
        expect(res.data.productsNotAdded.length).toBe(0);

        const items: IItem[] = generateValidItems(numberOfItems * 4, 0, numberOfItems, 0);

        const addItemsRes: Res.ItemsAdditionResponse = store.addItems(items);
        expect(addItemsRes.data.result).toBeTruthy();
        expect(addItemsRes.data.itemsNotAdded.length).toBe(0);

        products = generateValidProducts(numberOfItems);
        const removeProducts: ProductWithQuantity[] = [];

        for (let i = 0; i < numberOfItems; i++) {
            const prodToRemove: ProductWithQuantity = {catalogNumber: products[i].catalogNumber, quantity: i}
            removeProducts.push(prodToRemove);
        }

        const numOfItemsToRemove: number = removeProducts.reduce((acc, curr) => curr.quantity + acc, 0);
        store.removeProductsWithQuantity(removeProducts, true)
            .then((removeProdRes: Res.ProductRemovalResponse) => {
                expect(removeProdRes.data.result).toBeTruthy();
                expect(removeProdRes.data.productsNotRemoved.length).toBe(0);
                expect(removeProdRes.data.itemsRemoved).toBeDefined();
                expect(removeProdRes.data.itemsRemoved).toHaveLength(numOfItemsToRemove);

                let numOfItemsOfProduct = numberOfItems - 1;
                const productsInStore: Map<IProduct, IItem[]> = store.products;
                for (const itemsArr of productsInStore.values()) {
                    expect(itemsArr.length).toBe(numOfItemsOfProduct);
                    numOfItemsOfProduct--;
                }
                done();
            })
            .catch((err) => {
                done.fail(err);
            })
    });

    test("removeProductsWithQuantity success - quantity bigger than items exist", (done) => {
        const numberOfItems: number = 5;
        let products: IProduct[] = generateValidProducts(numberOfItems);
        const res: Res.ProductAdditionResponse = store.addNewProducts(products);

        expect(res.data.result).toBeTruthy();
        expect(res.data.productsNotAdded.length).toBe(0);

        const items: IItem[] = generateValidItems(numberOfItems * 4, 0, numberOfItems, 0);

        const addItemsRes: Res.ItemsAdditionResponse = store.addItems(items);
        expect(addItemsRes.data.result).toBeTruthy();
        expect(addItemsRes.data.itemsNotAdded.length).toBe(0);

        products = generateValidProducts(numberOfItems);
        const removeProducts: ProductWithQuantity[] = [];

        for (let i = 0; i < numberOfItems; i++) {
            const prodToRemove: ProductWithQuantity = {catalogNumber: products[i].catalogNumber, quantity: i}
            removeProducts.push(prodToRemove);
        }

        store.removeProductsWithQuantity(removeProducts, false)
            .then((removeProdRes: Res.ProductRemovalResponse) => {
                expect(removeProdRes.data.result).toBeTruthy();
                expect(removeProdRes.data.productsNotRemoved.length).toBe(0);

                const productsInStore: Map<IProduct, IItem[]> = store.products;
                let i: number = 4;
                for (const itemsArr of productsInStore.values()) {
                    expect(itemsArr.length).toBe(i);
                    i--;
                }
                done();
            })
            .catch( e => done.fail(e) )
    });

    test("removeProductsWithQuantity failure - partial products don't exists", (done) => {
        const numberOfItems: number = 5;
        let products: IProduct[] = generateValidProducts(numberOfItems);
        const res: Res.ProductAdditionResponse = store.addNewProducts(products);

        expect(res.data.result).toBeTruthy();
        expect(res.data.productsNotAdded.length).toBe(0);

        const items: IItem[] = generateValidItems(numberOfItems * 4, 0, numberOfItems, 0);

        const addItemsRes: Res.ItemsAdditionResponse = store.addItems(items);
        expect(addItemsRes.data.result).toBeTruthy();
        expect(addItemsRes.data.itemsNotAdded.length).toBe(0);

        products = generateValidProducts(numberOfItems * 2);
        const removeProducts: ProductWithQuantity[] = [];

        for (let i = 0; i < numberOfItems * 2; i++) {
            const prodToRemove: ProductWithQuantity = {catalogNumber: products[i].catalogNumber, quantity: i}
            removeProducts.push(prodToRemove);
        }

        store.removeProductsWithQuantity(removeProducts, false)
            .then((removeProdRes: Res.ProductRemovalResponse) => {
                expect(removeProdRes.data.result).toBeTruthy();
                expect(removeProdRes.data.productsNotRemoved.length).toBe(numberOfItems);

                const productsInStore: Map<IProduct, IItem[]> = store.products;
                let i: number = 4;
                for (const itemsArr of productsInStore.values()) {
                    expect(itemsArr.length).toBe(i);
                    i--;
                }
                done();
            })
            .catch(err => {done.fail(err)})

    });

    test("removeProductsWithQuantity failure - all products fail", (done) => {
        const numberOfItems: number = 5;
        let products: IProduct[] = generateValidProducts(numberOfItems);
        const res: Res.ProductAdditionResponse = store.addNewProducts(products);

        expect(res.data.result).toBeTruthy();
        expect(res.data.productsNotAdded.length).toBe(0);
        const numOfProductsInStore: number = store.products.size;
        expect(numOfProductsInStore).toBe(numberOfItems);

        const items: IItem[] = generateValidItems(numberOfItems * 4, 0, numberOfItems, 0);

        const addItemsRes: Res.ItemsAdditionResponse = store.addItems(items);
        expect(addItemsRes.data.result).toBeTruthy();
        expect(addItemsRes.data.itemsNotAdded.length).toBe(0);

        products = generateValidProducts(numberOfItems * 2);

        const removeProducts: ProductWithQuantity[] = [];

        for (let i = numberOfItems; i < products.length; i++) {
            const prodToRemove: ProductWithQuantity = {catalogNumber: products[i].catalogNumber, quantity: i}
            removeProducts.push(prodToRemove);
        }

        store.removeProductsWithQuantity(removeProducts, false)
            .then((removeProdRes: Res.ProductRemovalResponse) => {
                expect(removeProdRes.data.result).toBeFalsy();
                expect(removeProdRes.data.productsNotRemoved.length).toBe(removeProducts.length);

                const productsInStore: Map<IProduct, IItem[]> = store.products;
                expect(productsInStore.size).toBe(numOfProductsInStore);
                done();
            })
            .catch(err => done.fail(err))

    });


    test("productInStock success", () => {
        const products: IProduct[] = generateValidProducts(5);
        store.addNewProducts(products);
        const items: IItem[] = generateValidItems(10, 0, 1, 0);
        const res = store.isProductAmountInStock(1, 3);
        expect(res).toBeFalsy();

        store.addItems(items);
        const resAfter = store.isProductAmountInStock(1, 3);
        expect(resAfter).toBeTruthy();
    });


    test("getProductQuantity success", () => {
        const products: IProduct[] = generateValidProducts(5);
        store.addNewProducts(products);
        const items: IItem[] = generateValidItems(10, 0, 1, 0);
        let res = store.getProductQuantity(1);
        expect(res).toBe(0);
        store.addItems(items);
        res = store.getProductQuantity(1);
        expect(res).toBe(10);
    });


    // test("getItemsFromStock success", async () => {
    //     const products: IProduct[] = generateValidProducts(5);
    //     store.addNewProducts(products);
    //     const items: IItem[] = generateValidItems(10, 0, 1, 0);
    //     const product: IProduct = {catalogNumber: 1, category: ProductCategory.ELECTRONICS, name: "name", price: 5, rating: Rating.MEDIUM}
    //     let res: IItem[] = await store.getItemsFromStock(product, 3);
    //     expect(res).toHaveLength(0);
    //     store.addItems(items);
    //     res = await store.getItemsFromStock(product, 3);
    //     expect(res).toHaveLength(3);
    // })


    test("search - price range", () => {
        const products: IProduct[] = [];
        const numOfItems: number = 5;
        for (let i = 1; i < numOfItems + 1; i++)
            products.push(createProduct("name" + i, i, 20 * i, ProductCategory.ELECTRONICS));

        const res: Res.ProductAdditionResponse = store.addNewProducts(products);

        expect(res.data.result).toBeTruthy();
        expect(res.data.productsNotAdded.length).toBe(0);


        // filter by price range
        const filters: SearchFilters = {
            priceRange: {min: 0, max: 60}
        };
        const query: SearchQuery = {};
        const productsInStore: ProductInStore[] = store.search(filters, query);

        const expectedRes: ProductInStore[] = [];

        for (let i = 0; i < 3; i++)
            expectedRes.push({
                product: {
                    catalogNumber: i + 1,
                    category: products[i].category,
                    name: products[i].name,
                    price: products[i].price,
                    rating: Rating.MEDIUM
                }, storeName: store.storeName, storeRating: Rating.MEDIUM
            });

        expect(productsInStore).toHaveLength(expectedRes.length);
        expect(productsInStore).toMatchObject(expectedRes);
    });

    test("search - product name", () => {
        const products: IProduct[] = [];
        const numOfItems: number = 5;
        for (let i = 1; i < numOfItems + 1; i++)
            products.push(createProduct("name" + i, i, 20 * i, ProductCategory.ELECTRONICS));

        const res: Res.ProductAdditionResponse = store.addNewProducts(products);

        expect(res.data.result).toBeTruthy();
        expect(res.data.productsNotAdded.length).toBe(0);


        // filter by name
        const filters: SearchFilters = {};
        const query: SearchQuery = {
            productName: products[0].name
        };
        const productsInStore: ProductInStore[] = store.search(filters, query);

        const expectedRes: ProductInStore[] = [{
            product: {
                catalogNumber: products[0].catalogNumber,
                category: products[0].category,
                rating: Rating.MEDIUM,
                name: products[0].name,
                price: products[0].price
            }, storeName: store.storeName, storeRating: Rating.MEDIUM
        }];

        expect(productsInStore).toHaveLength(expectedRes.length);
        expect(productsInStore).toMatchObject(expectedRes);
    });

    test("search - rating", () => {
        const products: IProduct[] = [];
        const numOfItems: number = 5;
        for (let i = 1; i < numOfItems + 1; i++)
            products.push(createProduct("name" + i, i, 20 * i, ProductCategory.ELECTRONICS));

        const res: Res.ProductAdditionResponse = store.addNewProducts(products);

        expect(res.data.result).toBeTruthy();
        expect(res.data.productsNotAdded.length).toBe(0);

        // filter by rating
        let filters: SearchFilters = {
            productRating: Rating.MEDIUM
        };
        const query: SearchQuery = {};
        let productsInStore: ProductInStore[] = store.search(filters, query);

        let expectedRes: ProductInStore[] = [];

        for (let i = 0; i < 5; i++)
            expectedRes.push({
                product: {
                    catalogNumber: i + 1,
                    category: products[i].category,
                    name: products[i].name,
                    price: products[i].price,
                    rating: Rating.MEDIUM,
                }, storeName: store.storeName, storeRating: Rating.MEDIUM
            });

        expect(productsInStore).toHaveLength(5);
        expect(productsInStore).toMatchObject(expectedRes);

        filters = {
            productRating: Rating.HIGH
        };
        productsInStore = store.search(filters, query);

        expectedRes = [];

        expect(productsInStore).toHaveLength(0);
        expect(productsInStore).toMatchObject(expectedRes);

    });

    test("search - category", () => {
        const products: IProduct[] = [];
        const numOfItems: number = 5;
        const category1: ProductCategory = ProductCategory.ELECTRONICS;
        const category2: ProductCategory = ProductCategory.GENERAL;

        for (let i = 1; i < numOfItems + 1; i++)
            products.push(createProduct("name" + i, i, 20 * i, category1));

        const res: Res.ProductAdditionResponse = store.addNewProducts(products);

        expect(res.data.result).toBeTruthy();
        expect(res.data.productsNotAdded.length).toBe(0);

        // filter by rating
        let filters: SearchFilters = {
            productCategory: category1
        };
        const query: SearchQuery = {};
        let productsInStore: ProductInStore[] = store.search(filters, query);

        let expectedRes: ProductInStore[] = [];

        for (let i = 0; i < 5; i++)
            expectedRes.push({
                product: {
                    catalogNumber: i + 1,
                    category: products[i].category,
                    name: products[i].name,
                    price: products[i].price,
                    rating: Rating.MEDIUM,
                }, storeName: store.storeName, storeRating: Rating.MEDIUM
            });

        expect(productsInStore).toHaveLength(5);
        expect(productsInStore).toMatchObject(expectedRes);

        filters = {
            productCategory: category2
        };
        productsInStore = store.search(filters, query);

        expectedRes = [];

        expect(productsInStore).toHaveLength(0);
        expect(productsInStore).toMatchObject(expectedRes);
    });


    test("add receipt", () => {
        const purchase1: Purchase = { userName: "alex", price: 50, item: { id: 1, catalogNumber: 1}, storeName: "what-store"};
        const purchase2: Purchase = { userName: "alex", price: 50, item: { id: 2, catalogNumber: 1}, storeName: "what-store"};
        const payment: IPayment = { totalCharged: 100, lastCC4: "1111", transactionID: 11};
        const purchases: Purchase[] = [purchase1, purchase2];
        const receipt: IReceipt = { purchases, payment, date: new Date() };
        store.addReceipt(receipt);

        const resReceipt: IReceipt[] = store.receipts;
        expect(resReceipt).toHaveLength(1);
        expect(resReceipt[0].purchases).toMatchObject(purchases);
        expect(resReceipt[0].payment).toMatchObject(payment);
    });


    test("getBagPrice", () => {
        const price1: number = 50;
        const price2: number = 1352;
        const price3: number = 210;
        const finalPrice: number = price1 + price2 + price3;

        const bagItem1: BagItem = { amount: price1, finalPrice: price1,
            product: { catalogNumber: 1, name: "name", rating: Rating.MEDIUM, category: ProductCategory.ELECTRONICS, price: price1}
        };
        const bagItem2: BagItem = { amount: price2, finalPrice: price2,
            product: { catalogNumber: 1, name: "name", rating: Rating.MEDIUM, category: ProductCategory.ELECTRONICS, price: price2}
        };
        const bagItem3: BagItem = { amount: price3, finalPrice: price3,
            product: { catalogNumber: 1, name: "name", rating: Rating.MEDIUM, category: ProductCategory.ELECTRONICS, price: price3}
        };
        const bagItems: BagItem[] = [bagItem1, bagItem2, bagItem3];
        expect(store.getBagPrice(bagItems)).toBe(finalPrice);
    });

});
