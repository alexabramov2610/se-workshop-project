import {Item, Product} from "../trading_system/internal_api";
import * as Res from "../api-ext/Response"
import {errorMsg as Error} from "../api-int/Error"
import { logger } from "../api-int/Logger";
import {StoreOwner, RegisteredUser} from "../user/internal_api";
import {UserRole} from "../api-int/Enums";
import { v4 as uuid } from 'uuid';
import {ProductCatalogNumber, Product as ProductReq, ProductWithQuantity} from "../api-ext/CommonInterface";
import {StoreManager} from "./../user/users/StoreManager";

interface ProductValidator {
    isValid: boolean,
    error?: string
}

export class Store {

    private readonly _UUID: string;
    private _products: Map<Product, Item[]>;
    private readonly _storeName: string;
    private _storeOwners: StoreOwner[];
    private _storeManagers: StoreManager[];

    constructor(storeName: string) {
        this._UUID = uuid();
        this._storeName = storeName;
        this._products = new Map();
        this._storeOwners = [];
        this._storeManagers = [];
    }

    private getProductByCatalogNumber(catalogNumber: number) : Product {
        logger.debug(`searching product with catalog number: ${catalogNumber}`);
        for (let product of this._products.keys()) {
            if (product.catalogNumber === catalogNumber) {
                logger.debug(`found product: ${JSON.stringify(product)}`)
                return product;
            }
        }
        logger.warn(`could not find product with catalog number: ${catalogNumber}`);
        return undefined;
    }

    private getItemById(items: Item[], id: number) : Item {
        logger.debug(`searching item with id: ${id}`);
        for (let item of items) {
            if (item.id === id)
                logger.debug(`found item: ${JSON.stringify(item)}`)
            return item;
        }
        logger.warn(`could not find item with id: ${id}`);
        return undefined;
    }

    private validateProduct(product: Product): ProductValidator{
        logger.debug(`validating product: ${JSON.stringify(product)}`)

        if (!product)
            return {isValid: false, error: Error['E_INVALID_PROD']}

        let isNameValid: boolean = product.name && product.name != "";
        let isIdValid: boolean = product.catalogNumber && product.catalogNumber > 0;

        if (isNameValid && isIdValid) {
            logger.debug(`validated successfully product: ${JSON.stringify(product)}`)
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

    private getStoreOwnerByName(username: string) : StoreOwner {
        for (let storeOwner of this._storeOwners) {
            if (storeOwner.name === username)
                return storeOwner;
        }
        return undefined;
    }

    addItems(items: Item[]) : Res.ItemsAdditionResponse {
        logger.debug(`adding ${items.length} items to store id: ${this._UUID}`)
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
            logger.warn(`failed adding all requested ${items.length} items to store id: ${this._UUID}`)
            return {
                data: {result: false, itemsNotAdded: items },
                error: {message: Error['E_ITEMS_ADD']}
            }
        }
        else {
            logger.debug(`added ${items.length - notAddedItems.length} of ${items.length} request items to store id: ${this._UUID}`)
            return {
                data: {result: true, itemsNotAdded: notAddedItems }}
            }
    }

    removeItems(items: Item[]) : Res.ItemsRemovalResponse {
        logger.debug(`removing ${items.length} items from store id: ${this._UUID}`)
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
            logger.warn(`failed removing all requested ${items.length} items from store id: ${this._UUID}`)
            return {
                data: {result: false, itemsNotRemoved: items },
                error: {message: Error['E_ITEMS_REM']}
            }
        }
        else {
            logger.debug(`removed ${items.length - notRemovedItems.length} of ${items.length} request items from store id: ${this._UUID}`)
            return {
                data: {result: true, itemsNotRemoved: notRemovedItems }}
        }
    }

    removeProductsWithQuantity(products : ProductWithQuantity[]) : Res.ProductRemovalResponse {
        logger.debug(`removing ${products.length} products with quantities from store id: ${this._UUID}`)
        let notRemovedProducts :ProductCatalogNumber[] = [];

        for (let product of products) {
            let productInStore: Product = this.getProductByCatalogNumber(product.catalogNumber);
            if (productInStore) {
                let items: Item[] = this._products.get(productInStore);

                items.length = product.quantity >= items.length ? 0 : items.length - product.quantity;
            } else {
                const prodCatalogNumber: ProductCatalogNumber = {catalogNumber: product.catalogNumber};
                notRemovedProducts.push(prodCatalogNumber);
            }
        }

        if (notRemovedProducts.length === products.length) { // failed removing
            logger.warn(`failed removing all requested ${products.length} products from store id: ${this._UUID}`)
            return {
                data: {result: false, productsNotRemoved: notRemovedProducts },
                error: {message: Error['E_PROD_REM']}
            }
        }
        else {
            logger.debug(`removed ${products.length - notRemovedProducts.length} of ${products.length} request products from store id: ${this._UUID}`)
            return {
                data: {result: true, productsNotRemoved: notRemovedProducts }}
        }

    }

    addNewProducts(products: Product[]) : Res.ProductAdditionResponse {
        logger.debug(`adding ${products.length} products to store id: ${this._UUID}`)
        let invalidProducts: ProductReq[] = [];

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
            logger.warn(`failed adding all requested ${products.length} products to store id: ${this._UUID}`)
            return {
                data: {result: false, productsNotAdded: invalidProducts},
                error: {message: Error['E_PROD_ADD']}
            }
        }
        else {
            logger.debug(`added ${products.length - invalidProducts.length} of ${products.length} request products to store id: ${this._UUID}`)
            return {
                data: {result: true, productsNotAdded: invalidProducts}
            }
        }
    }

    removeProductsByCatalogNumber(products: ProductCatalogNumber[]) : Res.ProductRemovalResponse {
        logger.debug(`removing ${products.length} items from store id: ${this._UUID}`)
        let productsNotRemoved: Product[] = [];

        for (let catalogNumber of products) {
            const product: Product = this.getProductByCatalogNumber(catalogNumber.catalogNumber);
            const productValidator: ProductValidator = this.validateProduct(product);
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
            logger.warn(`failed removing all requested ${products.length} products from store id: ${this._UUID}`)
            return {
                data: {result: false, productsNotRemoved: productsNotRemoved},
                error: {message: Error['E_PROD_REM']}
            };
        }
        else {
            logger.debug(`removed ${products.length - productsNotRemoved.length} of ${products.length} request products from store id: ${this._UUID}`)
            return {
                data: {result: true, productsNotRemoved: productsNotRemoved}
            };
        }
    }

    verifyIsStoreOwner(user: RegisteredUser) : boolean {
        logger.debug(`verifying if user is owner: ${JSON.stringify(user.UUID)}`)
        if (user.getRole() != UserRole.OWNER) {
            logger.warn(`user: ${JSON.stringify(user)} is not an owner of store ${this._UUID}`)
            return false;
        }
        for (let owner of this._storeOwners) {
            if (owner.UUID === user.UUID) {
                logger.debug(`user: ${user} is an owner of store ${this._UUID}`)
                return true;
            }
        }
        logger.warn(`user: ${JSON.stringify(user.UUID)} is not an owner of store ${this._UUID}`)
        return false;
    }

    verifyIsStoreManager(user: RegisteredUser) : boolean {
        logger.debug(`verify if user is manager: ${JSON.stringify(user.UUID)}`)
        if (user.getRole() != UserRole.MANAGER) {
                       logger.warn(`user: ${JSON.stringify(user.UUID)} is not a manager of store ${this._UUID}`)
            return false;
        }
        for (let manager of this._storeManagers) {
            if (manager.UUID === user.UUID) {
               logger.debug(`user: ${JSON.stringify(user.UUID)} is a manager of store ${this._UUID}`)
               return true;
            }
        }
        logger.warn(`user: ${JSON.stringify(user.UUID)} is not a manager of store ${this._UUID}`)
        return false;
    }

    addStoreOwner(user: StoreOwner) : Res.BoolResponse {
        if (user.getRole() === UserRole.OWNER && !this.verifyIsStoreOwner(user)) {
            logger.debug(`adding user: ${JSON.stringify(user.UUID)} as an owner of store: ${this._UUID}`)
            this._storeOwners.push(user);
            return { data: { result:true } }
        }
        else {
            logger.warn(`adding user: ${JSON.stringify(user.UUID)} as an owner of store: ${this._UUID} FAILED!`)
            return { data: { result:false }, error: {message: Error['E_ASSIGN'] + "owner."} }
        }
    }



    viewStoreInfo():Res.StoreInfoResponse{
        let productNames = Array.from( this.products.keys() ).map((p)=>p.name);
        let storeOwnersNames=this._storeOwners.map((o)=>o.name)
        return {data:{result:true,info:{storeName:this.storeName,storeOwnersNames,productNames}}}
    }


    setFirstOwner(user: StoreOwner) : void {
        this._storeOwners.push(user);
    }

    addStoreManager(user: StoreManager) : Res.BoolResponse {
        if (user.getRole() === UserRole.MANAGER && !this.verifyIsStoreManager(user)) {
            logger.debug(`adding user: ${JSON.stringify(user.UUID)} as a manager to store: ${this._UUID}`)
            this._storeManagers.push(user);
            return { data: { result:true } }
        }
        else {
            logger.warn(`adding user: ${JSON.stringify(user.UUID)} as a manager to store: ${this._UUID} FAILED!`)
            return { data: { result:false }, error: {message: Error['E_ASSIGN'] + "manager."} }
        }
    }

    removeStoreOwner(user: StoreOwner) : Res.BoolResponse {
        const storeManagerToRemove: StoreOwner = this.getStoreOwnerByName(user.name);
        if (!storeManagerToRemove)
            return {data: { result:false }, error: {message: Error['E_NAL']}}

        this._storeOwners = this._storeOwners.filter(currOwner => currOwner.UUID != storeManagerToRemove.UUID)
        return { data: { result:true}};
    }

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