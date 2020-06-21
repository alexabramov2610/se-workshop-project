import {
    IItem,
    IProduct, IReceipt,
    ProductCatalogNumber,
    ProductCategory
} from "se-workshop-20-interfaces/dist/src/CommonInterface";
import {StoreOwner} from "../../../../src/user/users/StoreOwner";
import {StoreManager} from "../../../../src/user/users/StoreManager";
import {ManagementPermission} from "se-workshop-20-interfaces/dist/src/Enums";
import {Store} from "../../../../src/store/Store";
import {PurchasePolicy} from "../../../../src/store/PurchasePolicy/PurchasePolicy";
import {Discount} from "../../../../src/store/discounts/Discount";

const basicPermissions: ManagementPermission[] = [ ManagementPermission.WATCH_PURCHASES_HISTORY, ManagementPermission.WATCH_USER_QUESTIONS, ManagementPermission.REPLY_USER_QUESTIONS ]

export function generateValidProductsReq(numberOfItems: number): ProductCatalogNumber[] {
    const products: ProductCatalogNumber[] = [];
    for (let i = 1; i < numberOfItems + 1; i++)
        products.push(createProduct("name", i, 5, ProductCategory.ELECTRONICS));

    return products;
}

export function generateValidProducts(numOfItems: number): IProduct[] {
    const products: IProduct[] = [];
    for (let i = 1; i < numOfItems + 1; i++)
        products.push(createProduct("name", i, 5, ProductCategory.ELECTRONICS));

    return products;
}

export function generateInvalidProducts(numOfItems: number): IProduct[] {
    const products: IProduct[] = [];
    for (let i = 1; i < numOfItems + 1; i++)
        products.push(createProduct("", i, 5, ProductCategory.ELECTRONICS));

    return products;
}

export function generateValidItems(numOfItems: number, startingCatalogId: number, catalogNumberMax: number, startingId: number): IItem[] {
    const items: IItem[] = [];
    for (let i = 1; i < numOfItems + 1; i++)
        items.push(createItem(startingId + i + 1, startingCatalogId + (i % catalogNumberMax) + 1));

    return items;
}

export function createStoreOwner(username: string): StoreOwner {
    return { name: username, assignedStoreOwners: [], assignedStoreManagers: [] }
}

export function createStoreManager(username: string): StoreManager {
    return { name: username, managerPermissions: basicPermissions }
}

export function createProduct(name: string, catalogNumber: number, price: number, category: ProductCategory): IProduct {
    return { name, catalogNumber, price, category}
}

export function createItem(id: number, catalogNumber: number): IItem {
    return { id, catalogNumber }
}

export function createStore(name: string, description: string): Store {
    return new Store(name, description, new Map(), [], [], [], undefined, undefined, undefined)
}
