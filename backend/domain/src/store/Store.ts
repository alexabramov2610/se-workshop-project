import {Item, Product} from "../trading_system/internal_api";
import * as Responses from "../common/Response"
import {errorMsg as Error} from "../common/Error"
import {StoreOwner, User} from "../user/internal_api";
import {UserRole} from "../common/Enums";

interface ProductValidator {
    isValid: boolean,
    error?: string
}

export class Store {

    private readonly _UUID: string;
    private _products: Map<Product, Item[]>;
    private readonly _storeName: string;
    private readonly _storeId: number;
    private _storeOwners: StoreOwner[];
    // private _storeManagers: StoreManager[];



    constructor(storeName: string, id: number) {
        this._UUID = Math.random().toString(36).substring(2) + Date.now().toString(36);
        this._storeName = storeName;
        this._products = new Map();
        this._storeId = id;
        this._storeOwners = [];
        // this._storeManagers = [];
    }

    private getProductByCatalogNumber(catalogNumber: number) : Product {
        for (let product of this._products.keys()) {
            if (product.catalogNumber === catalogNumber) {
                return product;
            }
        }
        return undefined;
    }

    private getItemById(items: Item[], id: number) : Item {
        for (let item of items) {
            if (item.id === id)
                return item;
        }
        return undefined;
    }


    addItems(items: Item[]) : Responses.StoreItemsAdditionResponse {
        let addedItems: Item[] = [];
        let notAddedItems: Item[] = [];

        for (let item of items) {
            const catalogNumber = item.catalogNumber;

            let product: Product = this.getProductByCatalogNumber(catalogNumber);
            if (product) {
                this._products.set(product, this._products.get(product).concat([item]));
                addedItems.push(item);
            }
            else {
                notAddedItems.push(item);
            }
        }

        if (addedItems.length === 0) { // failed adding
            return {
                data: {result: false, ItemsNotAdded: items },
                error: {message: Error['E_ITEMS_ADD']}
            }
        }
        else {
            return {
                data: {result: true, ItemsNotAdded: notAddedItems }}
            }
    }

    removeItems(items: Item[]) : Responses.StoreItemsRemovalResponse {
        let notRemovedItems: Item[] = [];

        for (let item of items) {
            const catalogNumber = item.catalogNumber;

            let productInStore: Product = this.getProductByCatalogNumber(catalogNumber);
            if (productInStore) {
                let productItems: Item[] = this._products.get(productInStore);
                let itemToRemove: Item = this.getItemById(productItems, item.id);
                if (itemToRemove) {
                    this._products.set(productInStore, productItems.filter( curr => curr != itemToRemove));
                }
                else {
                    notRemovedItems.push(item);
                }
            }
            else {
                notRemovedItems.push(item);
            }
        }

        if (notRemovedItems.length === items.length) { // failed removing
            return {
                data: {result: false, ItemsNotRemoved: items },
                error: {message: Error['E_ITEMS_REM']}
            }
        }
        else {
            return {
                data: {result: true, ItemsNotRemoved: notRemovedItems }}
        }
    }

    removeProductsWithQuantity(products : Map<Product, number>) : Responses.StoreProductRemovalResponse {
        let notRemovedProducts :Product[] = [];

        for (let product of products.keys()) {
            let productInStore: Product = this.getProductByCatalogNumber(product.catalogNumber);
            if (productInStore) {
                let items: Item[] = this._products.get(productInStore);
                let numToRemove: number = products.get(product);

                items.length = numToRemove >= items.length ? 0 : items.length - numToRemove;
            } else {
                notRemovedProducts.push(product);
            }
        }

        if (notRemovedProducts.length === products.size) { // failed removing
            return {
                data: {result: false, productsNotRemoved: notRemovedProducts },
                error: {message: Error['E_PROD_REM']}
            }
        }
        else {
            return {
                data: {result: true, productsNotRemoved: notRemovedProducts }}
        }

    }

    addNewProducts(products: Product[]) : Responses.StoreProductAdditionResponse {
        let invalidProducts: Product[] = [];

        for (let product of products) {
            if (this.getProductByCatalogNumber(product.catalogNumber)){
                invalidProducts.push(product);
            }
            else {
                let productValidator: ProductValidator = this.validateProduct(product);
                productValidator.isValid ? this._products.set(product, []) :
                    invalidProducts.push(product)
            }
        }

        if (invalidProducts.length === products.length) { //failed adding
            return {
                data: {result: false, productsNotAdded: invalidProducts},
                error: {message: Error['E_PROD_ADD']}
            }
        }
        else {
            return {
                data: {result: true, productsNotAdded: invalidProducts}
            }
        }
    }

    removeProducts(products: Product[]) : Responses.StoreProductRemovalResponse {
        let productsNotRemoved: Product[] = [];

        for (let product of products) {
            let productValidator: ProductValidator = this.validateProduct(product);
            if (productValidator.isValid) {
                let productFromStore :Product = this.getProductByCatalogNumber(product.catalogNumber);
                if (productFromStore) {
                    this._products.delete(productFromStore);
                }
                else {
                    productsNotRemoved.push(product);
                }
            }
            else {
                productsNotRemoved.push(product);
            }
        }

        if (productsNotRemoved.length === products.length) {
            return {
                data: {result: false, productsNotRemoved: productsNotRemoved},
                error: {message: Error['E_PROD_REM']}
            };
        }
        else {
            return {
                data: {result: true, productsNotRemoved: productsNotRemoved}
            };
        }
    }

    private validateProduct(product: Product): ProductValidator{
        let isNameValid: boolean = product.name && product.name != "";
        let isIdValid: boolean = product.catalogNumber && product.catalogNumber > 0;

        if (isNameValid && isIdValid) {
            return {
                isValid: true
            }
        }

        else {
            let error: string =
                !isIdValid && !isNameValid ? `product name and id are illegal. name: ${product.name}, id: ${product.catalogNumber}` :
                    !isIdValid ? `product id is illegal. id: ${product.catalogNumber}` :
                        !isNameValid ? `product name is illegal. name: ${product.name}` : "";
            console.log("error: invalid product");
            return {
                isValid: false, error: error
            }
        }

    }

    verifyStoreOwner(user: User) : boolean {
        if (user.getRole() != UserRole.OWNER) {
            return false;
        }
        for (let owner of this._storeOwners) {
            if (owner.UUID === user.UUID) {
                return true;
            }
        }
        return false;
    }

    verifyStoreManager(user: User) : boolean {
        // if (user.getRole() != UserRole.MANAGER) {
        //     return false;
        // }
        // for (let manager of this._storeManagers) {
        //     if (manager.UUID === user.UUID) {
        //         return true;
        //     }
        // }
        return false;
    }

    addStoreOwner(user: StoreOwner) :Responses.BoolResponse {
        if (user.getRole() === UserRole.OWNER && !this.verifyStoreOwner(user)) {
            this._storeOwners.push(user);
            return { data: { result:true } }
        }
        else {
            return { data: { result:false }, error: {message: Error['E_ASSIGN'] + "owner."} }
        }
    }

    // addStoreManager(user: StoreManager) :Responses.StoreManagerAdditionResponse {
    //     if (user.getRole() === UserRole.MANAGER && !this.verifyStoreManager(user)) {
    //         this._storeOwners.push(user);
    //         return { data: { result:true } }
    //     }
    //     else {
    //         return { data: { result:false }, error: {message: Error['E_ASSIGN'] + "manager."} }
    //     }
    // }

    get storeName(): string {
        return this._storeName;
    }

    get products() : Map<Product,Item[]> {
        return this._products;
    }

    get UUID(): string {
        return this._UUID;
    }

    get storeId(): number {
        return this._storeId;
    }
}