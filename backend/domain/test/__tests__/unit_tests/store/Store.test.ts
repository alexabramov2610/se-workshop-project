import {StoreManager, StoreOwner} from "../../../../src/user/internal_api";
import {Item, Product, Receipt, Store} from "../../../../src/trading_system/internal_api";
import {
    BagItem,
    IPayment,
    IProduct as ProductReq,
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

describe("Store Management Unit Tests", () => {
    let store: Store;
    let storeOwner: StoreOwner;
    let storeManager: StoreManager;

    beforeEach(() => {
        store = new Store("store", "storeDescription");
        storeOwner = new StoreOwner("name");
        storeManager = new StoreManager("name");
    });

    test("init test - getters & setters", () => {
        const storeName: string = "store";
        let desc: string = "storeDescription";
        store = new Store("store", "storeDescription");
        expect(store.storeOwners).toBeDefined();
        expect(store.storeOwners).toHaveLength(0);
        expect(store.discountPolicy).toBeDefined();
        expect(store.purchasePolicy).toBeDefined();
        expect(store.description).toBeDefined();
        expect(store.description.length > 0).toBe(true);
        expect(store.rating).toBeDefined();
        expect(store.products).toBeDefined();
        expect(store.products.size).toBe(0);
        expect(store.storeName).toBe(storeName);
        expect(store.UUID).toBeDefined();
        expect(store.UUID.length > 0).toBe(true);
        expect(store.getPurchasesHistory()).toBeDefined();
        expect(store.getPurchasesHistory()).toHaveLength(0);
        expect(store.getContactUsMessages()).toBeDefined();
        expect(store.getContactUsMessages()).toHaveLength(0);

        desc = "test description";
        store.description = "test description";
        expect(store.description).toBe(desc);
    });


    test("view store info success", () => {
        const dor = new StoreOwner("dor")
        const dor2 = new StoreManager("dor2")
        const chair = new Product("chair", 6, 200, ProductCategory.HOME)
        store.addStoreOwner(dor)
        store.addNewProducts([chair])
        store.addStoreManager(dor2);

        const res = store.viewStoreInfo()
        expect(res.data.result).toBeTruthy();
        // expect(res.data.info).toStrictEqual({storeName:store.storeName,storeOwnersNames:['dor'],productNames:['chair']})
    })

    test("view store info success", () => {
        const product1 = new Product('product1', 1, 1, ProductCategory.HOME)
        const product2 = new Product('product2', 2, 2, ProductCategory.HOME)
        const products: Product[] = [product1, product2];

        store.addNewProducts(products);
        store.addStoreOwner(storeOwner);

        const res = store.viewStoreInfo();
        expect(res.data.info.storeName).toEqual(store.storeName);
        expect(res.data.info.productsNames).toContain(product1.name);
        expect(res.data.info.productsNames).toContain(product2.name);
        expect(res.data.info.storeOwnersNames).toContain(storeOwner.name)

    })


    test("verifyIsStoreOwner success", () => {
        const res: Res.BoolResponse = store.addStoreOwner(storeOwner);
        expect(res.data.result).toBeTruthy();

        expect(store.verifyIsStoreOwner(storeOwner.name)).toBeTruthy();
    })

    test("verifyIsStoreOwner failure", () => {
        expect(store.verifyIsStoreOwner(storeOwner.name)).toBeFalsy();
    })

    test("verifyIsStoreOwner failure - not store owner", () => {
        expect(store.verifyIsStoreOwner('mockname')).toBeFalsy();
    })


    test("verifyIsStoreManager success", () => {
        const res: Res.BoolResponse = store.addStoreManager(storeOwner);
        expect(res.data.result).toBeTruthy();

        expect(store.verifyIsStoreManager(storeOwner.name)).toBeTruthy();
    })

    test("verifyIsStoreManager failure", () => {
        expect(store.verifyIsStoreManager(storeOwner.name)).toBeFalsy();
    })

    test("verifyIsStoreManager failure - not store owner", () => {
        expect(store.verifyIsStoreManager('mockname')).toBeFalsy();
    })


    test("setFirstOwner", () => {
        store.setFirstOwner(storeOwner);
        expect(store.verifyIsStoreOwner(storeOwner.name)).toBeTruthy();
    })


    test("addNewProducts success", () => {
        const products: Product[] = generateValidProducts(5);
        const res: Res.ProductAdditionResponse = store.addNewProducts(products);

        expect(res.data.result).toBeTruthy();
        expect(res.data.productsNotAdded.length).toBe(0);
    });

    test("addNewProducts failure - duplicated", () => {
        const numOfProducts: number = 5;

        let products: Product[] = generateValidProducts(numOfProducts);
        let res: Res.ProductAdditionResponse = store.addNewProducts(products);

        expect(res.data.result).toBeTruthy();
        expect(res.data.productsNotAdded.length).toBe(0);

        products = generateValidProducts(numOfProducts);
        res = store.addNewProducts(products);

        expect(res.data.result).toBeFalsy();
        expect(res.data.productsNotAdded.length).toBe(numOfProducts);

    });


    test("removeProductsByCatalogNumber success", () => {
        const numOfProducts: number = 5;

        let products: Product[] = generateValidProducts(numOfProducts);
        const res: Res.ProductAdditionResponse = store.addNewProducts(products);

        expect(res.data.result).toBeTruthy();
        expect(res.data.productsNotAdded.length).toBe(0);

        products = generateValidProducts(numOfProducts);
        const resRemove: Res.ProductRemovalResponse = store.removeProductsByCatalogNumber(products);

        expect(resRemove.data.result).toBeTruthy();
        expect(resRemove.data.productsNotRemoved.length).toBe(0);
    });

    test("removeProductsByCatalogNumber failure", () => {
        const numOfProducts: number = 5;

        const products: ProductCatalogNumber[] = generateValidProductsReq(numOfProducts);
        const resRemove: Res.ProductRemovalResponse = store.removeProductsByCatalogNumber(products);

        expect(resRemove.data.result).toBeFalsy();
        expect(resRemove.data.productsNotRemoved.length).toBe(numOfProducts);
    });

    test("removeProductsByCatalogNumber failure - some invalid products", () => {
        const numOfProducts: number = 5;

        let products: Product[] = generateValidProducts(numOfProducts);
        const res: Res.ProductAdditionResponse = store.addNewProducts(products);

        expect(res.data.result).toBeTruthy();
        expect(res.data.productsNotAdded.length).toBe(0);

        products = products.concat(generateInvalidProducts(numOfProducts));
        const resRemove: Res.ProductRemovalResponse = store.removeProductsByCatalogNumber(products);

        expect(resRemove.data.result).toBeTruthy();
        expect(resRemove.data.productsNotRemoved.length).toBe(numOfProducts);
    });

    test("removeProducts failure - all invalid products", () => {
        const numOfProducts: number = 5;

        const products: ProductCatalogNumber[] = generateInvalidProducts(numOfProducts);
        const resRemove: Res.ProductRemovalResponse = store.removeProductsByCatalogNumber(products);

        expect(resRemove.data.result).toBeFalsy();
        expect(resRemove.data.productsNotRemoved.length).toBe(numOfProducts);
    });


    test("addItems success", () => {
        const numberOfItems: number = 5;
        const products: Product[] = generateValidProducts(numberOfItems);
        const res: Res.ProductAdditionResponse = store.addNewProducts(products);

        expect(res.data.result).toBeTruthy();
        expect(res.data.productsNotAdded.length).toBe(0);

        const items: Item[] = generateValidItems(numberOfItems * 2, 0, numberOfItems, 0);

        const addItemsRes: Res.ItemsAdditionResponse = store.addItems(items);
        expect(addItemsRes.data.result).toBeTruthy();
        expect(addItemsRes.data.itemsNotAdded.length).toBe(0);

    });

    test("addItems success - some in store", () => {
        const numberOfItems: number = 5;
        const products: Product[] = generateValidProducts(numberOfItems);
        const res: Res.ProductAdditionResponse = store.addNewProducts(products);

        expect(res.data.result).toBeTruthy();
        expect(res.data.productsNotAdded.length).toBe(0);

        const items: Item[] = generateValidItems(numberOfItems * 2, 0, numberOfItems * 2, 0);

        const addItemsRes: Res.ItemsAdditionResponse = store.addItems(items);
        expect(addItemsRes.data.result).toBeTruthy();
        expect(addItemsRes.data.itemsNotAdded.length).toBe(numberOfItems);

    });

    test("addItems failure - product not in store", () => {
        const numberOfItems: number = 5;

        const items: Item[] = generateValidItems(numberOfItems, 0, numberOfItems, 0);

        const addItemsRes: Res.ItemsAdditionResponse = store.addItems(items);
        expect(addItemsRes.data.result).toBeFalsy();
        expect(addItemsRes.data.itemsNotAdded.length).toBe(numberOfItems);
    });

    test("addItems failure - duplicate items", () => {
        const numberOfItems: number = 5;
        const products: Product[] = generateValidProducts(numberOfItems);
        const res: Res.ProductAdditionResponse = store.addNewProducts(products);

        expect(res.data.result).toBeTruthy();
        expect(res.data.productsNotAdded.length).toBe(0);

        const items: Item[] = generateValidItems(numberOfItems * 2, 0, numberOfItems, 0);

        let addItemsRes: Res.ItemsAdditionResponse = store.addItems(items);
        expect(addItemsRes.data.result).toBeTruthy();
        expect(addItemsRes.data.itemsNotAdded.length).toBe(0);

        addItemsRes = store.addItems(items);
        expect(addItemsRes.data.result).toBeFalsy();
        expect(addItemsRes.data.itemsNotAdded.length).toBe(items.length);

    });


    test("removeItems success - all removed", () => {
        const numberOfItems: number = 5;
        const products: Product[] = generateValidProducts(numberOfItems);
        const res: Res.ProductAdditionResponse = store.addNewProducts(products);

        expect(res.data.result).toBeTruthy();
        expect(res.data.productsNotAdded.length).toBe(0);

        const items: Item[] = generateValidItems(numberOfItems * 2, 0, numberOfItems, 0);

        const addItemsRes: Res.ItemsAdditionResponse = store.addItems(items);
        expect(addItemsRes.data.result).toBeTruthy();
        expect(addItemsRes.data.itemsNotAdded.length).toBe(0);

        const removeItemsRes: Res.ItemsRemovalResponse = store.removeItems(items);
        expect(removeItemsRes.data.result).toBeTruthy();
        expect(removeItemsRes.data.itemsNotRemoved.length).toBe(0);

    });

    test("removeItems success - partial remove", () => {
        const numberOfItems: number = 5;
        const products: Product[] = generateValidProducts(numberOfItems);
        const res: Res.ProductAdditionResponse = store.addNewProducts(products);

        expect(res.data.result).toBeTruthy();
        expect(res.data.productsNotAdded.length).toBe(0);

        const items: Item[] = generateValidItems(numberOfItems * 2, 0, numberOfItems, 0);

        const addItemsRes: Res.ItemsAdditionResponse = store.addItems(items);
        expect(addItemsRes.data.result).toBeTruthy();
        expect(addItemsRes.data.itemsNotAdded.length).toBe(0);

        items.length = numberOfItems;

        const removeItemsRes: Res.ItemsRemovalResponse = store.removeItems(items);
        expect(removeItemsRes.data.result).toBeTruthy();
        expect(removeItemsRes.data.itemsNotRemoved.length).toBe(0);

        const productsInStore: Map<Product, Item[]> = store.products;
        for (const itemsArr of productsInStore.values()) {
            expect(itemsArr.length).toBeGreaterThan(0);
        }

    });

    test("removeItems failure - product not in store", () => {
        const numberOfItems: number = 5;
        const products: Product[] = generateValidProducts(numberOfItems);
        const res: Res.ProductAdditionResponse = store.addNewProducts(products);

        expect(res.data.result).toBeTruthy();
        expect(res.data.productsNotAdded.length).toBe(0);

        const items: Item[] = generateValidItems(numberOfItems * 2, numberOfItems + 1, numberOfItems * 2, 0);

        const addItemsRes: Res.ItemsRemovalResponse = store.removeItems(items);
        expect(addItemsRes.data.result).toBeFalsy();
        expect(addItemsRes.data.itemsNotRemoved.length).toBe(numberOfItems * 2);

    });

    test("removeItems failure - items not in store", () => {
        const numberOfItems: number = 5;
        const products: Product[] = generateValidProducts(numberOfItems);
        const res: Res.ProductAdditionResponse = store.addNewProducts(products);

        expect(res.data.result).toBeTruthy();
        expect(res.data.productsNotAdded.length).toBe(0);

        const items: Item[] = generateValidItems(numberOfItems, 0, numberOfItems, 50);

        const removeItemsRes: Res.ItemsRemovalResponse = store.removeItems(items);
        expect(removeItemsRes.data.result).toBeFalsy();
        expect(removeItemsRes.data.itemsNotRemoved.length).toBe(numberOfItems);
        expect(removeItemsRes.error).toBeDefined();
    });


    test("removeProductsWithQuantity success", () => {
        const numberOfItems: number = 5;
        let products: Product[] = generateValidProducts(numberOfItems);
        const res: Res.ProductAdditionResponse = store.addNewProducts(products);

        expect(res.data.result).toBeTruthy();
        expect(res.data.productsNotAdded.length).toBe(0);

        const items: Item[] = generateValidItems(numberOfItems * 4, 0, numberOfItems, 0);

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
        const removeProdRes: Res.ProductRemovalResponse = store.removeProductsWithQuantity(removeProducts, true);

        expect(removeProdRes.data.result).toBeTruthy();
        expect(removeProdRes.data.productsNotRemoved.length).toBe(0);
        expect(removeProdRes.data.itemsRemoved).toBeDefined();
        expect(removeProdRes.data.itemsRemoved).toHaveLength(numOfItemsToRemove);

        let numOfItemsOfProduct = numberOfItems - 1;
        const productsInStore: Map<Product, Item[]> = store.products;
        for (const itemsArr of productsInStore.values()) {
            expect(itemsArr.length).toBe(numOfItemsOfProduct);
            numOfItemsOfProduct--;
        }
    });

    test("removeProductsWithQuantity success - quantity bigger than items exist", () => {
        const numberOfItems: number = 5;
        let products: Product[] = generateValidProducts(numberOfItems);
        const res: Res.ProductAdditionResponse = store.addNewProducts(products);

        expect(res.data.result).toBeTruthy();
        expect(res.data.productsNotAdded.length).toBe(0);

        const items: Item[] = generateValidItems(numberOfItems * 4, 0, numberOfItems, 0);

        const addItemsRes: Res.ItemsAdditionResponse = store.addItems(items);
        expect(addItemsRes.data.result).toBeTruthy();
        expect(addItemsRes.data.itemsNotAdded.length).toBe(0);

        products = generateValidProducts(numberOfItems);
        const removeProducts: ProductWithQuantity[] = [];

        for (let i = 0; i < numberOfItems; i++) {
            const prodToRemove: ProductWithQuantity = {catalogNumber: products[i].catalogNumber, quantity: i}
            removeProducts.push(prodToRemove);
        }

        const removeProdRes: Res.ProductRemovalResponse = store.removeProductsWithQuantity(removeProducts, false);
        expect(removeProdRes.data.result).toBeTruthy();
        expect(removeProdRes.data.productsNotRemoved.length).toBe(0);

        const productsInStore: Map<Product, Item[]> = store.products;
        let i: number = 4;
        for (const itemsArr of productsInStore.values()) {
            expect(itemsArr.length).toBe(i);
            i--;
        }
    });

    test("removeProductsWithQuantity failure - partial products don't exists", () => {
        const numberOfItems: number = 5;
        let products: Product[] = generateValidProducts(numberOfItems);
        const res: Res.ProductAdditionResponse = store.addNewProducts(products);

        expect(res.data.result).toBeTruthy();
        expect(res.data.productsNotAdded.length).toBe(0);

        const items: Item[] = generateValidItems(numberOfItems * 4, 0, numberOfItems, 0);

        const addItemsRes: Res.ItemsAdditionResponse = store.addItems(items);
        expect(addItemsRes.data.result).toBeTruthy();
        expect(addItemsRes.data.itemsNotAdded.length).toBe(0);

        products = generateValidProducts(numberOfItems * 2);
        const removeProducts: ProductWithQuantity[] = [];

        for (let i = 0; i < numberOfItems * 2; i++) {
            const prodToRemove: ProductWithQuantity = {catalogNumber: products[i].catalogNumber, quantity: i}
            removeProducts.push(prodToRemove);
        }

        const removeProdRes: Res.ProductRemovalResponse = store.removeProductsWithQuantity(removeProducts, false);
        expect(removeProdRes.data.result).toBeTruthy();
        expect(removeProdRes.data.productsNotRemoved.length).toBe(numberOfItems);

        const productsInStore: Map<Product, Item[]> = store.products;
        let i: number = 4;
        for (const itemsArr of productsInStore.values()) {
            expect(itemsArr.length).toBe(i);
            i--;
        }
    });

    test("removeProductsWithQuantity failure - all products fail", () => {
        const numberOfItems: number = 5;
        let products: Product[] = generateValidProducts(numberOfItems);
        const res: Res.ProductAdditionResponse = store.addNewProducts(products);

        expect(res.data.result).toBeTruthy();
        expect(res.data.productsNotAdded.length).toBe(0);
        const numOfProductsInStore: number = store.products.size;
        expect(numOfProductsInStore).toBe(numberOfItems);

        const items: Item[] = generateValidItems(numberOfItems * 4, 0, numberOfItems, 0);

        const addItemsRes: Res.ItemsAdditionResponse = store.addItems(items);
        expect(addItemsRes.data.result).toBeTruthy();
        expect(addItemsRes.data.itemsNotAdded.length).toBe(0);

        products = generateValidProducts(numberOfItems * 2);

        const removeProducts: ProductWithQuantity[] = [];

        for (let i = numberOfItems; i < products.length; i++) {
            const prodToRemove: ProductWithQuantity = {catalogNumber: products[i].catalogNumber, quantity: i}
            removeProducts.push(prodToRemove);
        }

        const removeProdRes: Res.ProductRemovalResponse = store.removeProductsWithQuantity(removeProducts, false);
        expect(removeProdRes.data.result).toBeFalsy();
        expect(removeProdRes.data.productsNotRemoved.length).toBe(removeProducts.length);

        const productsInStore: Map<Product, Item[]> = store.products;
        expect(productsInStore.size).toBe(numOfProductsInStore);
    });


    test("addStoreOwner success", () => {
        const res: Res.BoolResponse = store.addStoreOwner(storeOwner);
        expect(res.data.result).toBeTruthy();
        expect(store.getStoreOwner(storeOwner.name)).toMatchObject(storeOwner);
    });

    test("addStoreOwner failure", () => {
        let res: Res.BoolResponse = store.addStoreOwner(storeOwner);
        ;
        expect(res.data.result).toBeTruthy();
        res = store.addStoreOwner(storeOwner);
        expect(res.data.result).toBeFalsy();
    });


    test("addStoreManager success", () => {
        const res: Res.BoolResponse = store.addStoreManager(storeManager);
        expect(res.data.result).toBeTruthy();
        expect(store.getStoreManager(storeManager.name)).toMatchObject(storeManager);
    });

    test("addStoreManager failure", () => {

        let res: Res.BoolResponse = store.addStoreManager(storeManager);
        expect(res.data.result).toBeTruthy();
        res = store.addStoreManager(storeOwner);
        expect(res.data.result).toBeFalsy();
    });


    test("removeStoreOwner success", () => {
        const res: Res.BoolResponse = store.addStoreOwner(storeOwner);
        expect(res.data.result).toBe(true);
        expect(store.removeStoreOwner(storeOwner).data.result).toBeTruthy();
    });

    test("removeStoreOwner failure", () => {
        const res: Res.BoolResponse = store.removeStoreOwner(storeOwner);
        expect(res.data.result).toBeFalsy();
    });


    test("removeStoreManager success", () => {
        const res: Res.BoolResponse = store.addStoreManager(storeManager);
        expect(res.data.result).toBe(true);
        expect(store.removeStoreManager(storeOwner).data.result).toBeTruthy();
    });

    test("removeStoreManager failure", () => {
        const res: Res.BoolResponse = store.removeStoreManager(storeManager);
        expect(res.data.result).toBeFalsy();
    });


    test("verifyPermission success owner", () => {
        jest.spyOn(store, "verifyIsStoreOwner").mockReturnValue(true)

        expect(store.verifyPermission("tal", ManagementPermission.WATCH_PURCHASES_HISTORY)).toBeTruthy();
    });

    test("verifyPermission success manager", () => {
        jest.spyOn(store, "verifyIsStoreOwner").mockReturnValue(false)
        jest.spyOn(store, "verifyIsStoreManager").mockReturnValue(true)
        jest.spyOn(store, "getStoreManager").mockReturnValue(new StoreManager("tal"))

        expect(store.verifyPermission("tal", ManagementPermission.WATCH_PURCHASES_HISTORY)).toBeTruthy();
    });

    test("verifyPermission failure", () => {
        jest.spyOn(store, "verifyIsStoreOwner").mockReturnValue(false)
        jest.spyOn(store, "verifyIsStoreManager").mockReturnValue(false)

        expect(store.verifyPermission("tal", ManagementPermission.WATCH_PURCHASES_HISTORY)).toBeFalsy();
    });


    test("productInStock success", () => {
        const products: Product[] = generateValidProducts(5);
        store.addNewProducts(products);
        const items: Item[] = generateValidItems(10, 0, 1, 0);
        const res = store.isProductAmountInStock(1, 3);
        expect(res).toBeFalsy();

        store.addItems(items);
        const resAfter = store.isProductAmountInStock(1, 3);
        expect(resAfter).toBeTruthy();
    });


    test("getProductQuantity success", () => {
        const products: Product[] = generateValidProducts(5);
        store.addNewProducts(products);
        const items: Item[] = generateValidItems(10, 0, 1, 0);
        let res = store.getProductQuantity(1);
        expect(res).toBe(0);
        store.addItems(items);
        res = store.getProductQuantity(1);
        expect(res).toBe(10);
    });


    test("getItemsFromStock success", () => {
        const products: Product[] = generateValidProducts(5);
        store.addNewProducts(products);
        const items: Item[] = generateValidItems(10, 0, 1, 0);
        const product: ProductReq = {catalogNumber: 1, category: ProductCategory.ELECTRONICS, name: "name", price: 5, rating: Rating.MEDIUM}
        let res: Item[] = store.getItemsFromStock(product, 3);
        expect(res).toHaveLength(0);
        store.addItems(items);
        res = store.getItemsFromStock(product, 3);
        expect(res).toHaveLength(3);
    })


    test("search - price range", () => {
        const products: Product[] = [];
        const numOfItems: number = 5;
        for (let i = 1; i < numOfItems + 1; i++)
            products.push(new Product("name" + i, i, 20 * i, ProductCategory.ELECTRONICS));

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
        const products: Product[] = [];
        const numOfItems: number = 5;
        for (let i = 1; i < numOfItems + 1; i++)
            products.push(new Product("name" + i, i, 20 * i, ProductCategory.ELECTRONICS));

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
        const products: Product[] = [];
        const numOfItems: number = 5;
        for (let i = 1; i < numOfItems + 1; i++)
            products.push(new Product("name" + i, i, 20 * i, ProductCategory.ELECTRONICS));

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
        const products: Product[] = [];
        const numOfItems: number = 5;
        const category1: ProductCategory = ProductCategory.ELECTRONICS;
        const category2: ProductCategory = ProductCategory.GENERAL;

        for (let i = 1; i < numOfItems + 1; i++)
            products.push(new Product("name" + i, i, 20 * i, category1));

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
        const payment: IPayment = { totalCharged: 100, lastCC4: "1111"};
        const purchases: Purchase[] = [purchase1, purchase2];
        const receipt: Receipt = new Receipt(purchases, payment);
        store.addReceipt(purchases, payment);

        expect(store.getPurchasesHistory()).toContainEqual(receipt);
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

    function generateValidProductsReq(numberOfItems: number): ProductCatalogNumber[] {
        const products: ProductCatalogNumber[] = [];
        for (let i = 1; i < numberOfItems + 1; i++)
            products.push(new Product("name", i, 5, ProductCategory.ELECTRONICS));

        return products;

    }


    // test("view product info seccess",()=>{
    //
    //     let game=new Product("YO-YO",5,19.5,ProductCategory.Hobbies)
    //     game.price=20.5;
    //     const res=game.viewInfo()
    //     expect(res.data.result).toBeTruthy();
    //     expect(res.data.info).toEqual({name:"YO-YO",catalogNumber:5,price:20.5})
    //
    // })


    function generateValidProducts(numOfItems: number): Product[] {
        const products: Product[] = [];
        for (let i = 1; i < numOfItems + 1; i++)
            products.push(new Product("name", i, 5, ProductCategory.ELECTRONICS));

        return products;
    }

    function generateInvalidProducts(numOfItems: number): Product[] {
        const products: Product[] = [];
        for (let i = 1; i < numOfItems + 1; i++)
            products.push(new Product("", i, 5, ProductCategory.ELECTRONICS));

        return products;
    }

    function generateValidItems(numOfItems: number, startingCatalogId: number, catalogNumberMax: number, startingId: number): Item[] {
        const items: Item[] = [];
        for (let i = 1; i < numOfItems + 1; i++)
            items.push(new Item(startingId + i + 1, startingCatalogId + (i % catalogNumberMax) + 1));

        return items;
    }

});
