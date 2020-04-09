import {Store} from "../../../src/store/internal_api";
import * as Responses from "../../../src/common/Response";
import {StoreOwner} from "../../../src/user/internal_api";
import {Item, Product} from "../../../src/trading_system/internal_api";

describe("Store Management Unit Tests", () => {
    let store: Store;
    let user: StoreOwner;

    beforeEach(() => {
        store = new Store("store", 5);
        user = new StoreOwner("name","123123");
    });

    test("addNewProducts success", () => {
        let products: Product[] = generateValidProducts(5);
        let res: Responses.StoreProductAdditionResponse = store.addNewProducts(products);

        expect(res.data.result).toBeTruthy();
        expect(res.data.ProductsNotAdded.length).toBe(0);
    });

    test("addNewProducts failure - duplicated", () => {
        const numOfProducts: number = 5;

        let products: Product[] = generateValidProducts(numOfProducts);
        let res: Responses.StoreProductAdditionResponse = store.addNewProducts(products);

        expect(res.data.result).toBeTruthy();
        expect(res.data.ProductsNotAdded.length).toBe(0);

        products = generateValidProducts(numOfProducts);
        res = store.addNewProducts(products);

        expect(res.data.result).toBeFalsy();
        expect(res.data.ProductsNotAdded.length).toBe(numOfProducts);

    });

    test("removeProducts success", () => {
        const numOfProducts: number = 5;

        let products: Product[] = generateValidProducts(numOfProducts);
        let res: Responses.StoreProductAdditionResponse = store.addNewProducts(products);

        expect(res.data.result).toBeTruthy();
        expect(res.data.ProductsNotAdded.length).toBe(0);

        products = generateValidProducts(numOfProducts);
        let resRemove: Responses.StoreProductRemovalResponse = store.removeProducts(products);

        expect(resRemove.data.result).toBeTruthy();
        expect(resRemove.data.ProductsNotRemoved.length).toBe(0);
    });

    test("removeProducts failure", () => {
        const numOfProducts: number = 5;

        let products: Product[] = generateValidProducts(numOfProducts);
        let resRemove: Responses.StoreProductRemovalResponse = store.removeProducts(products);

        expect(resRemove.data.result).toBeFalsy();
        expect(resRemove.data.ProductsNotRemoved.length).toBe(numOfProducts);
    });

    test("removeProducts failure - some invalid products", () => {
        const numOfProducts: number = 5;

        let products: Product[] = generateValidProducts(numOfProducts);
        let res: Responses.StoreProductAdditionResponse = store.addNewProducts(products);

        expect(res.data.result).toBeTruthy();
        expect(res.data.ProductsNotAdded.length).toBe(0);

        products = products.concat(generateInvalidProducts(numOfProducts));
        let resRemove: Responses.StoreProductRemovalResponse = store.removeProducts(products);

        expect(resRemove.data.result).toBeTruthy();
        expect(resRemove.data.ProductsNotRemoved.length).toBe(numOfProducts);
    });

    test("removeProducts failure - all invalid products", () => {
        const numOfProducts: number = 5;

        let products: Product[] = generateValidProducts(numOfProducts);

        products = products.concat(generateInvalidProducts(numOfProducts));
        let resRemove: Responses.StoreProductRemovalResponse = store.removeProducts(products);

        expect(resRemove.data.result).toBeFalsy();
        expect(resRemove.data.ProductsNotRemoved.length).toBe(10);
    });

    test("addItems success", () => {
        let numberOfItems: number = 5;
        let products: Product[] = generateValidProducts(numberOfItems);
        let res: Responses.StoreProductAdditionResponse = store.addNewProducts(products);

        expect(res.data.result).toBeTruthy();
        expect(res.data.ProductsNotAdded.length).toBe(0);

        let items: Item[] = generateValidItems(numberOfItems*2, 0, numberOfItems, 0);

        let addItemsRes: Responses.StoreItemsAdditionResponse = store.addItems(items);
        expect(addItemsRes.data.result).toBeTruthy();
        expect(addItemsRes.data.ItemsNotAdded.length).toBe(0);

    });

    test("addItems failure - product not in store", () => {
        let numberOfItems: number = 5;

        let items: Item[] = generateValidItems(numberOfItems, 0, numberOfItems, 0);

        let addItemsRes: Responses.StoreItemsAdditionResponse = store.addItems(items);
        expect(addItemsRes.data.result).toBeFalsy();
        expect(addItemsRes.data.ItemsNotAdded.length).toBe(numberOfItems);
    });

    test("addItems success - some in store", () => {
        let numberOfItems: number = 5;
        let products: Product[] = generateValidProducts(numberOfItems);
        let res: Responses.StoreProductAdditionResponse = store.addNewProducts(products);

        expect(res.data.result).toBeTruthy();
        expect(res.data.ProductsNotAdded.length).toBe(0);

        let items: Item[] = generateValidItems(numberOfItems*2, 0, numberOfItems*2, 0);

        let addItemsRes: Responses.StoreItemsAdditionResponse = store.addItems(items);
        expect(addItemsRes.data.result).toBeTruthy();
        expect(addItemsRes.data.ItemsNotAdded.length).toBe(numberOfItems);

    });

    test("removeItems success - all removed", () => {
        let numberOfItems: number = 5;
        let products: Product[] = generateValidProducts(numberOfItems);
        let res: Responses.StoreProductAdditionResponse = store.addNewProducts(products);

        expect(res.data.result).toBeTruthy();
        expect(res.data.ProductsNotAdded.length).toBe(0);

        let items: Item[] = generateValidItems(numberOfItems*2, 0, numberOfItems, 0);

        let addItemsRes: Responses.StoreItemsAdditionResponse = store.addItems(items);
        expect(addItemsRes.data.result).toBeTruthy();
        expect(addItemsRes.data.ItemsNotAdded.length).toBe(0);

        let removeItemsRes: Responses.StoreItemsRemovalResponse = store.removeItems(items);
        expect(removeItemsRes.data.result).toBeTruthy();
        expect(removeItemsRes.data.ItemsNotRemoved.length).toBe(0);

    });

    test("removeItems success - partial remove", () => {
        let numberOfItems: number = 5;
        let products: Product[] = generateValidProducts(numberOfItems);
        let res: Responses.StoreProductAdditionResponse = store.addNewProducts(products);

        expect(res.data.result).toBeTruthy();
        expect(res.data.ProductsNotAdded.length).toBe(0);

        let items: Item[] = generateValidItems(numberOfItems*2, 0, numberOfItems, 0);

        let addItemsRes: Responses.StoreItemsAdditionResponse = store.addItems(items);
        expect(addItemsRes.data.result).toBeTruthy();
        expect(addItemsRes.data.ItemsNotAdded.length).toBe(0);

        items.length = numberOfItems;

        let removeItemsRes: Responses.StoreItemsRemovalResponse = store.removeItems(items);
        expect(removeItemsRes.data.result).toBeTruthy();
        expect(removeItemsRes.data.ItemsNotRemoved.length).toBe(0);

        let productsInStore: Map<Product, Item[]> = store.products;
        for (let items of productsInStore.values()) {
            expect(items.length).toBeGreaterThan(0);
        }

    });

    test("removeItems failure - product not in store", () => {
        let numberOfItems: number = 5;
        let products: Product[] = generateValidProducts(numberOfItems);
        let res: Responses.StoreProductAdditionResponse = store.addNewProducts(products);

        expect(res.data.result).toBeTruthy();
        expect(res.data.ProductsNotAdded.length).toBe(0);

        let items: Item[] = generateValidItems(numberOfItems*2, numberOfItems+1, numberOfItems*2, 0);

        let addItemsRes: Responses.StoreItemsRemovalResponse = store.removeItems(items);
        expect(addItemsRes.data.result).toBeFalsy();
        expect(addItemsRes.data.ItemsNotRemoved.length).toBe(numberOfItems*2);

    });

    test("removeItems failure - items not in store", () => {
        let numberOfItems: number = 5;
        let products: Product[] = generateValidProducts(numberOfItems);
        let res: Responses.StoreProductAdditionResponse = store.addNewProducts(products);

        expect(res.data.result).toBeTruthy();
        expect(res.data.ProductsNotAdded.length).toBe(0);

        let items: Item[] = generateValidItems(numberOfItems, 0, numberOfItems, 50);

        let removeItemsRes: Responses.StoreItemsRemovalResponse = store.removeItems(items);
        expect(removeItemsRes.data.result).toBeFalsy();
        expect(removeItemsRes.data.ItemsNotRemoved.length).toBe(numberOfItems);
        expect(removeItemsRes.error).toBeDefined();
    });

    test("removeProductsWithQuantity success", () => {
        let numberOfItems: number = 5;
        let products: Product[] = generateValidProducts(numberOfItems);
        let res: Responses.StoreProductAdditionResponse = store.addNewProducts(products);

        expect(res.data.result).toBeTruthy();
        expect(res.data.ProductsNotAdded.length).toBe(0);

        let items: Item[] = generateValidItems(numberOfItems*4, 0, numberOfItems, 0);

        let addItemsRes: Responses.StoreItemsAdditionResponse = store.addItems(items);
        expect(addItemsRes.data.result).toBeTruthy();
        expect(addItemsRes.data.ItemsNotAdded.length).toBe(0);

        products = generateValidProducts(numberOfItems);
        let removeProducts :Map<Product, number> = new Map();

        for (let i = 0 ; i< numberOfItems ; i++){
            removeProducts.set(products[i], i);
        }

        let removeProdRes: Responses.StoreProductRemovalResponse = store.removeProductsWithQuantity(removeProducts);
        expect(removeProdRes.data.result).toBeTruthy();
        expect(removeProdRes.data.ProductsNotRemoved.length).toBe(0);

        let numOfItemsOfProduct = numberOfItems - 1;
        let productsInStore: Map<Product, Item[]> = store.products;
        for (let items of productsInStore.values()) {
            expect(items.length).toBe(numOfItemsOfProduct);
            numOfItemsOfProduct--;
        }
    });

    test("removeProductsWithQuantity success - quantity bigger than items exist", () => {
        let numberOfItems: number = 5;
        let products: Product[] = generateValidProducts(numberOfItems);
        let res: Responses.StoreProductAdditionResponse = store.addNewProducts(products);

        expect(res.data.result).toBeTruthy();
        expect(res.data.ProductsNotAdded.length).toBe(0);

        let items: Item[] = generateValidItems(numberOfItems * 4, 0, numberOfItems, 0);

        let addItemsRes: Responses.StoreItemsAdditionResponse = store.addItems(items);
        expect(addItemsRes.data.result).toBeTruthy();
        expect(addItemsRes.data.ItemsNotAdded.length).toBe(0);

        products = generateValidProducts(numberOfItems);
        let removeProducts: Map<Product, number> = new Map();

        for (let i = 0; i < numberOfItems; i++) {
            removeProducts.set(products[i], numberOfItems * 10);
        }

        let removeProdRes: Responses.StoreProductRemovalResponse = store.removeProductsWithQuantity(removeProducts);
        expect(removeProdRes.data.result).toBeTruthy();
        expect(removeProdRes.data.ProductsNotRemoved.length).toBe(0);

        let productsInStore: Map<Product, Item[]> = store.products;
        for (let items of productsInStore.values()) {
            expect(items.length).toBe(0);
        }
    });

    test("removeProductsWithQuantity failure - partial products don't exists", () => {
        let numberOfItems: number = 5;
        let products: Product[] = generateValidProducts(numberOfItems);
        let res: Responses.StoreProductAdditionResponse = store.addNewProducts(products);

        expect(res.data.result).toBeTruthy();
        expect(res.data.ProductsNotAdded.length).toBe(0);

        let items: Item[] = generateValidItems(numberOfItems * 4, 0, numberOfItems, 0);

        let addItemsRes: Responses.StoreItemsAdditionResponse = store.addItems(items);
        expect(addItemsRes.data.result).toBeTruthy();
        expect(addItemsRes.data.ItemsNotAdded.length).toBe(0);

        products = generateValidProducts(numberOfItems*2);
        let removeProducts: Map<Product, number> = new Map();

        for (let i = 0; i < numberOfItems*2; i++) {
            removeProducts.set(products[i], numberOfItems * 10);
        }

        let removeProdRes: Responses.StoreProductRemovalResponse = store.removeProductsWithQuantity(removeProducts);
        expect(removeProdRes.data.result).toBeTruthy();
        expect(removeProdRes.data.ProductsNotRemoved.length).toBe(numberOfItems);

        let productsInStore: Map<Product, Item[]> = store.products;
        for (let items of productsInStore.values()) {
            expect(items.length).toBe(0);
        }
    });


    function generateValidProducts(numOfItems: number): Product[] {
        let products: Product[] = [];
        for (let i = 1; i < numOfItems +1; i ++)
            products.push(new Product("name", i));

        return products;
    }

    function generateInvalidProducts(numOfItems: number): Product[] {
        let products: Product[] = [];
        for (let i = 1; i < numOfItems +1; i ++)
            products.push(new Product("", i));

        return products;
    }

    function generateValidItems(numOfItems: number, startingCatalogId: number, catalogNumberMax: number, startingId: number): Item[] {
        let items: Item[] = [];
        for (let i = 1; i < numOfItems +1; i ++)
            items.push(new Item(startingId + i+1, startingCatalogId + (i % catalogNumberMax) +1));

        return items;
    }

});