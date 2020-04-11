import {Item, Product} from "../trading_system/internal_api";
import * as Res from "../common/Response"
import {errorMsg as Error} from "../common/Error"
import { logger } from "../common/Logger";
import {StoreOwner, RegisteredUser} from "../user/internal_api";
import {UserRole} from "../common/Enums";
import { v4 as uuid } from 'uuid';

interface ProductValidator {
    isValid: boolean,
    error?: string
}

export class Store {

    private readonly _UUID: string;
    private _products: Map<Product, Item[]>;
    private readonly _storeName: string;
    private _storeOwners: StoreOwner[];
    // private _storeManagers: StoreManager[];

    constructor(storeName: string) {
        this._UUID = uuid();
        this._storeName = storeName;
        this._products = new Map();
        this._storeOwners = [];
        // this._storeManagers = [];
    }

    private getProductByCatalogNumber(catalogNumber: number) : Product {
        logger.info(`searching product with catalog number: ${catalogNumber}`);
        for (let product of this._products.keys()) {
            if (product.catalogNumber === catalogNumber) {
                logger.info(`found product: ${JSON.stringify(product)}`)
                return product;
            }
        }
        logger.error(`could not find product with catalog number: ${catalogNumber}`);
        return undefined;
    }

    private getItemById(items: Item[], id: number) : Item {
        logger.info(`searching item with id: ${id}`);
        for (let item of items) {
            if (item.id === id)
                logger.info(`found item: ${JSON.stringify(item)}`)
            return item;
        }
        logger.error(`could not find item with id: ${id}`);
        return undefined;
    }

    private validateProduct(product: Product): ProductValidator{
        logger.info(`validating product: ${JSON.stringify(product)}`)
        let isNameValid: boolean = product.name && product.name != "";
        let isIdValid: boolean = product.catalogNumber && product.catalogNumber > 0;

        if (isNameValid && isIdValid) {
            logger.info(`validated successfully product: ${JSON.stringify(product)}`)
            return {
                isValid: true
            }
        }

        else {
            logger.warn(`invalid product: ${JSON.stringify(product)}`)
            let error: string =
                !isIdValid && !isNameValid ? `product name and id are illegal. name: ${product.name}, id: ${product.catalogNumber}` :
                    !isIdValid ? `product id is illegal. id: ${product.catalogNumber}` :
                        !isNameValid ? `product name is illegal. name: ${product.name}` : "";
            return {
                isValid: false, error: error
            }
        }

    }

    addItems(items: Item[]) : Res.StoreItemsAdditionResponse {
        logger.info(`adding ${items.length} items to store id: ${this._UUID}`)
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
            logger.error(`failed adding all requested ${items.length} items to store id: ${this._UUID}`)
            return {
                data: {result: false, itemsNotAdded: items },
                error: {message: Error['E_ITEMS_ADD']}
            }
        }
        else {
            logger.info(`added ${items.length - notAddedItems.length} of ${items.length} request items to store id: ${this._UUID}`)
            return {
                data: {result: true, itemsNotAdded: notAddedItems }}
            }
    }

    removeItems(items: Item[]) : Res.StoreItemsRemovalResponse {
        logger.info(`removing ${items.length} items from store id: ${this._UUID}`)
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
            logger.error(`failed removing all requested ${items.length} items from store id: ${this._UUID}`)
            return {
                data: {result: false, itemsNotRemoved: items },
                error: {message: Error['E_ITEMS_REM']}
            }
        }
        else {
            logger.info(`removed ${items.length - notRemovedItems.length} of ${items.length} request items from store id: ${this._UUID}`)
            return {
                data: {result: true, itemsNotRemoved: notRemovedItems }}
        }
    }

    removeProductsWithQuantity(products : Map<Product, number>) : Res.StoreProductRemovalResponse {
        logger.info(`removing ${products.size} products with quantities from store id: ${this._UUID}`)
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
            logger.error(`failed removing all requested ${products.size} products from store id: ${this._UUID}`)
            return {
                data: {result: false, productsNotRemoved: notRemovedProducts },
                error: {message: Error['E_PROD_REM']}
            }
        }
        else {
            logger.info(`removed ${products.size - notRemovedProducts.length} of ${products.size} request products from store id: ${this._UUID}`)
            return {
                data: {result: true, productsNotRemoved: notRemovedProducts }}
        }

    }

    addNewProducts(products: Product[]) : Res.StoreProductAdditionResponse {
        logger.info(`adding ${products.length} products to store id: ${this._UUID}`)
        let invalidProducts: Product[] = [];

        for (let product of products) {
            if (this.getProductByCatalogNumber(product.catalogNumber)){
                logger.warn(`product: ${product.catalogNumber} already exists in store`)
                invalidProducts.push(product);
            }
            else {
                let productValidator: ProductValidator = this.validateProduct(product);
                productValidator.isValid ? this._products.set(product, []) :
                    invalidProducts.push(product)
            }
        }

        if (invalidProducts.length === products.length) { //failed adding
            logger.error(`failed adding all requested ${products.length} products to store id: ${this._UUID}`)
            return {
                data: {result: false, productsNotAdded: invalidProducts},
                error: {message: Error['E_PROD_ADD']}
            }
        }
        else {
            logger.info(`added ${products.length - invalidProducts.length} of ${products.length} request products to store id: ${this._UUID}`)
            return {
                data: {result: true, productsNotAdded: invalidProducts}
            }
        }
    }

    removeProducts(products: Product[]) : Res.StoreProductRemovalResponse {
        logger.info(`removing ${products.length} items from store id: ${this._UUID}`)
        let productsNotRemoved: Product[] = [];

        for (let product of products) {
            let productValidator: ProductValidator = this.validateProduct(product);
            if (productValidator.isValid) {
                let productFromStore :Product = this.getProductByCatalogNumber(product.catalogNumber);
                if (productFromStore) {
                    this._products.delete(productFromStore);
                }
                else {
                    logger.warn(`product: ${product.catalogNumber} does not exist in store`)
                    productsNotRemoved.push(product);
                }
            }
            else {
                productsNotRemoved.push(product);
            }
        }

        if (productsNotRemoved.length === products.length) {
            logger.error(`failed removing all requested ${products.length} products from store id: ${this._UUID}`)
            return {
                data: {result: false, productsNotRemoved: productsNotRemoved},
                error: {message: Error['E_PROD_REM']}
            };
        }
        else {
            logger.info(`removed ${products.length - productsNotRemoved.length} of ${products.length} request products from store id: ${this._UUID}`)
            return {
                data: {result: true, productsNotRemoved: productsNotRemoved}
            };
        }
    }

    verifyIsStoreOwner(user: RegisteredUser) : boolean {
        logger.info(`verifying if user is owner: ${JSON.stringify(user)}`)
        if (user.getRole() != UserRole.OWNER) {
            logger.warn(`user: ${JSON.stringify(user)} is not an owner of store ${this._UUID}`)
            return false;
        }
        for (let owner of this._storeOwners) {
            if (owner.UUID === user.UUID) {
                logger.info(`user: ${user} is an owner of store ${this._UUID}`)
                return true;
            }
        }
        logger.warn(`user: ${JSON.stringify(user)} is not an owner of store ${this._UUID}`)
        return false;
    }

    verifyStoreManager(user: RegisteredUser) : boolean {
        logger.info(`verify if user is manager: ${JSON.stringify(user)}`)
        // if (user.getRole() != UserRole.MANAGER) {
        //                logger.warn(`user: ${JSON.stringify(user)} is not a manager of store ${this._UUID}`)
        //     return false;
        // }
        // for (let manager of this._storeManagers) {
        //     if (manager.UUID === user.UUID) {
        //                        logger.info(`user: ${JSON.stringify(user)} is a manager of store ${this._UUID}`)
        //                        return true;
        //     }
        // }
        //                logger.warn(`user: ${JSON.stringify(user)} is not a manager of store ${this._UUID}`)
        return false;
    }

    addStoreOwner(user: StoreOwner) :Res.BoolResponse {
        if (user.getRole() === UserRole.OWNER && !this.verifyIsStoreOwner(user)) {
            logger.info(`adding user: ${JSON.stringify(user)} as an owner of store: ${this._UUID}`)
            this._storeOwners.push(user);
            return { data: { result:true } }
        }
        else {
            logger.warn(`adding user: ${JSON.stringify(user)} as an owner of store: ${this._UUID} FAILED!`)
            return { data: { result:false }, error: {message: Error['E_ASSIGN'] + "owner."} }
        }
    }

    setFirstOwner(user: RegisteredUser) :void{
        this._storeOwners.push(user);
    }

    // addStoreManager(user: StoreManager) :Responses.StoreManagerAdditionResponse {
    //     if (user.getRole() === UserRole.MANAGER && !this.verifyStoreManager(user)) {
    //                     logger.info(`adding user: ${JSON.stringify(user)} as a manager of store: ${this._UUID}`)
    //         this._storeOwners.push(user);
    //         return { data: { result:true } }
    //     }
    //     else {
    //                     logger.warn(`adding user: ${JSON.stringify(user)} as a manager of store: ${this._UUID} FAILED!`)
    //                     return { data: { result:false }, error: {message: Error['E_ASSIGN'] + "manager."} }
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

}