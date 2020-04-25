import {ContactUsMessage, Item, Product, Receipt} from "../trading_system/internal_api";
import * as Res from "../api-ext/Response"
import {errorMsg as Error} from "../api-int/Error"
import {loggerW} from "../api-int/internal_api";
import {RegisteredUser, StoreManager, StoreOwner} from "../user/internal_api";
import {v4 as uuid} from 'uuid';
import {
    IPayment,
    IProduct as ProductReq,
    ProductCatalogNumber,
    ProductCategory,
    ProductInStore,
    ProductWithQuantity, Purchase,
    SearchFilters,
    SearchQuery
} from "../api-ext/CommonInterface";
import {BuyingTypes, DiscountsTypes, ManagementPermission, Rating} from "../api-ext/Enums";

const logger = loggerW(__filename)

interface ProductValidator {
    isValid: boolean,
    error?: string
}

export class Store {
    private readonly _UUID: string;
    private _rating: Rating;
    private _products: Map<Product, Item[]>;
    private readonly _storeName: string;
    private _storeOwners: StoreOwner[];
    private _storeManagers: StoreManager[];
    private _receipts: Receipt[];
    private _contactUsMessages: ContactUsMessage[];
    private _firstOwner: StoreOwner;
    private _discountTypes: DiscountsTypes[];
    private _buyingTypes: BuyingTypes[];

    constructor(storeName: string) {
        this._UUID = uuid();
        this._storeName = storeName;
        this._products = new Map();
        this._storeOwners = [];
        this._storeManagers = [];
        this._receipts = [];
        this._rating = Rating.MEDIUM;
        this._discountTypes = [DiscountsTypes.SHOWN_DISCOUNT]
        this._buyingTypes = [BuyingTypes.IMMEDIATE_PURCHASE]
    }

    addItems(items: Item[]): Res.ItemsAdditionResponse {
        logger.debug(`adding ${items.length} items to store id: ${this._UUID}`)
        const addedItems: Item[] = [];
        const notAddedItems: Item[] = [];

        for (const item of items) {
            const catalogNumber = item.catalogNumber;

            const product: Product = this.getProductByCatalogNumber(catalogNumber);
            if (product && !this.containsItem(product, item)) {
                this._products.set(product, this._products.get(product).concat([item]));
                addedItems.push(item);
            } else {
                notAddedItems.push(item);
            }
        }

        if (addedItems.length === 0) { // failed adding
            logger.warn(`failed adding all requested ${items.length} items to store id: ${this._UUID}`)
            return {
                data: {result: false, itemsNotAdded: items},
                error: {message: Error.E_ITEMS_ADD}
            }
        } else {
            logger.debug(`added ${items.length - notAddedItems.length} of ${items.length} request items to store id: ${this._UUID}`)
            return {
                data: {result: true, itemsNotAdded: notAddedItems}
            }
        }
    }

    addNewProducts(products: Product[]): Res.ProductAdditionResponse {
        logger.debug(`adding ${products.length} products to store id: ${this._UUID}`)
        const invalidProducts: ProductReq[] = [];

        for (const product of products) {
            if (this.getProductByCatalogNumber(product.catalogNumber)) {
                logger.warn(`product: ${product.catalogNumber} already exists in store`)
                invalidProducts.push(product);
            } else {
                const productValidator: ProductValidator = this.validateProduct(product);
                productValidator.isValid ? this._products.set(product, []) :
                    invalidProducts.push(product)
            }
        }

        if (invalidProducts.length === products.length) { // failed adding
            logger.warn(`failed adding all requested ${products.length} products to store id: ${this._UUID}`)
            return {
                data: {result: false, productsNotAdded: invalidProducts},
                error: {message: Error.E_PROD_ADD}
            }
        } else {
            logger.debug(`added ${products.length - invalidProducts.length} of ${products.length} request products to store id: ${this._UUID}`)
            return {
                data: {result: true, productsNotAdded: invalidProducts}
            }
        }
    }

    addStoreManager(storeManager: StoreManager): Res.BoolResponse {
        if (!this.verifyIsStoreManager(storeManager.name)) {
            logger.debug(`adding user: ${storeManager.name} as a manager to store: ${this.storeName}`)
            this._storeManagers.push(storeManager);
            return {data: {result: true}}
        } else {
            logger.warn(`adding user: ${storeManager.name} as a manager to store: ${this.storeName} FAILED!`)
            return {data: {result: false}, error: {message: Error.E_ASSIGN + "manager."}}
        }
    }

    addStoreOwner(storeOwner: StoreOwner): Res.BoolResponse {
        if (!this.verifyIsStoreOwner(storeOwner.name)) {
            logger.debug(`adding user: ${storeOwner.name} as an owner of store: ${this.storeName}`)
            this._storeOwners.push(storeOwner);
            return {data: {result: true}}
        } else {
            logger.warn(`adding user: ${storeOwner.name} as an owner of store: ${this.storeName} FAILED!`);
            return {data: {result: false}, error: {message: Error.E_ASSIGN + "owner."}}
        }
    }

    setFirstOwner(user: RegisteredUser): void {
        const firstOwner: StoreOwner = new StoreOwner(user.name);
        this._storeOwners.push(firstOwner);
        this._firstOwner = firstOwner;
    }

    removeItems(items: Item[]): Res.ItemsRemovalResponse {
        logger.debug(`removing ${items.length} items from store id: ${this._UUID}`)
        const notRemovedItems: Item[] = [];

        for (const item of items) {
            const catalogNumber = item.catalogNumber;

            const productInStore: Product = this.getProductByCatalogNumber(catalogNumber);
            if (productInStore) {
                const productItems: Item[] = this._products.get(productInStore);
                const itemToRemove: Item = this.getItemById(productItems, item.id);
                if (itemToRemove) {
                    this._products.set(productInStore, productItems.filter(curr => curr !== itemToRemove));
                } else {
                    notRemovedItems.push(item);
                }
            } else {
                notRemovedItems.push(item);
            }
        }

        if (notRemovedItems.length === items.length) { // failed removing
            logger.warn(`failed removing all requested ${items.length} items from store id: ${this._UUID}`)
            return {
                data: {result: false, itemsNotRemoved: items},
                error: {message: Error.E_ITEMS_REM}
            }
        } else {
            logger.debug(`removed ${items.length - notRemovedItems.length} of ${items.length} request items from store id: ${this._UUID}`)
            return {
                data: {result: true, itemsNotRemoved: notRemovedItems}
            }
        }
    }

    removeProductsWithQuantity(products: ProductWithQuantity[], isReturnItems: boolean): Res.ProductRemovalResponse {
        logger.debug(`removing ${products.length} products with quantities from store id: ${this._UUID}`)
        const notRemovedProducts: ProductCatalogNumber[] = [];
        const itemsToReturn: Item[] = [];
        for (const product of products) {
            const productInStore: Product = this.getProductByCatalogNumber(product.catalogNumber);
            if (productInStore) {
                const items: Item[] = this._products.get(productInStore);

                const numOfItemsToRemove: number = product.quantity >= items.length ? items.length : product.quantity;

                if (isReturnItems) {
                    for (let i = 0; i < numOfItemsToRemove; i++) {
                        itemsToReturn.push(items[i]);
                    }
                }
                items.length = items.length - numOfItemsToRemove;

                this._products.set(productInStore, items);
            } else {
                const prodCatalogNumber: ProductCatalogNumber = {catalogNumber: product.catalogNumber};
                notRemovedProducts.push(prodCatalogNumber);
            }
        }

        if (notRemovedProducts.length === products.length) { // failed removing
            logger.warn(`failed removing all requested ${products.length} products from store id: ${this._UUID}`)
            return {
                data: {result: false, productsNotRemoved: notRemovedProducts},
                error: {message: Error.E_PROD_REM}
            }
        } else {
            logger.debug(`removed ${products.length - notRemovedProducts.length} of ${products.length} request products from store id: ${this._UUID}`)
            return isReturnItems ? { data: {result: true, productsNotRemoved: notRemovedProducts, itemsRemoved: itemsToReturn }} :
                { data: {result: true, productsNotRemoved: notRemovedProducts }}
        }

    }

    removeProductsByCatalogNumber(products: ProductCatalogNumber[]): Res.ProductRemovalResponse {
        logger.debug(`removing ${products.length} items from store id: ${this._UUID}`)
        const productsNotRemoved: Product[] = [];

        for (const catalogNumber of products) {
            const product: Product = this.getProductByCatalogNumber(catalogNumber.catalogNumber);
            if (product) {
                this._products.delete(product);
            } else {
                productsNotRemoved.push(product);
            }
        }

        if (productsNotRemoved.length === products.length) {
            logger.warn(`failed removing all requested ${products.length} products from store id: ${this._UUID}`)
            return {
                data: {result: false, productsNotRemoved},
                error: {message: Error.E_PROD_REM}
            };
        } else {
            logger.debug(`removed ${products.length - productsNotRemoved.length} of ${products.length} request products from store id: ${this._UUID}`)
            return {
                data: {result: true, productsNotRemoved}
            };
        }
    }

    removeStoreOwner(user: StoreOwner): Res.BoolResponse {
        const storeManagerToRemove: StoreOwner = this.getStoreOwnerByName(user.name);
        if (!storeManagerToRemove)
            return {data: {result: false}, error: {message: Error.E_NAL}}

        this._storeOwners = this._storeOwners.filter(currOwner => currOwner.name !== storeManagerToRemove.name);
        return {data: {result: true}};
    }

    removeStoreManager(user: StoreManager): Res.BoolResponse {
        const storeManagerToRemove: StoreManager = this.getStoreManagerByName(user.name);
        if (!storeManagerToRemove)
            return {data: {result: false}, error: {message: Error.E_NAL}}

        this._storeManagers = this._storeManagers.filter(currManager => currManager.name !== storeManagerToRemove.name);
        return {data: {result: true}};
    }

    viewStoreInfo(): Res.StoreInfoResponse {
        return {
            data: {
                result: true,
                info: {
                    storeName: this.storeName,
                    storeRating: this.rating,
                    storeOwnersNames: this._storeOwners.map((owner) => owner.name),
                    storeManagersNames: this._storeManagers.map((manager) => manager.name),
                    productsNames: Array.from(this.products.keys()).map((p) => p.name)
                }
            }
        }
    }

    isProductAmountInStock(catalogNumber: number, amount: number): boolean {
        const product = this.getProductByCatalogNumber(catalogNumber);
        return product && this.products.get(product).length >= amount;
    }

    search(filters: SearchFilters, query: SearchQuery): ProductInStore[] {
        const products: ProductInStore[] = [];

        for (const product of this._products.keys()) {
            if (this.matchingFilters(product, filters, query)) {
                const matchingProduct: ProductReq = {
                    name: product.name,
                    price: product.price,
                    category: product.category,
                    catalogNumber: product.catalogNumber
                };
                const matchingProdInStore: ProductInStore = {product: matchingProduct, storeName: this.storeName};
                products.push(matchingProdInStore);
            }
        }

        return products;
    }

    verifyIsStoreOwner(userName: string): boolean {
        logger.debug(`verifying if user is owner: ${userName}`)
        for (const owner of this._storeOwners) {
            if (owner.name === userName) {
                logger.debug(`user: ${userName} is an owner of store ${this.storeName}`)
                return true;
            }
        }
        logger.warn(`user: ${JSON.stringify(userName)} is not an owner of store ${this.storeName}`)
        return false;
    }

    verifyIsStoreManager(userName: string): boolean {
        logger.debug(`verifying if user is manager: ${userName}`)
        for (const manager of this._storeManagers) {
            if (manager.name === userName) {
                logger.debug(`user: ${userName} is a manager of store ${this.storeName}`)
                return true;
            }
        }
        logger.warn(`user: ${userName} is not a manager of store ${this.storeName}`)
        return false;
    }

    verifyPermission(userName: string, permission: ManagementPermission): boolean {
        if (this.verifyIsStoreOwner(userName))
            return true;
        if (this.verifyIsStoreManager(userName)) {
            const isAllowed: boolean = this.getStoreManager(userName).isAllowed(permission);
            logger.debug(`User ${userName} permission allowed: ${isAllowed}`);
            return isAllowed;
        }
        return false;
    }

    getProductByCatalogNumber(catalogNumber: number): Product {
        logger.debug(`searching product with catalog number: ${catalogNumber}`);
        for (const product of this._products.keys()) {
            if (product.catalogNumber === catalogNumber) {
                logger.debug(`found product: ${JSON.stringify(product)}`);
                return product;
            }
        }
        logger.debug(`could not find product with catalog number: ${catalogNumber}`);
        return undefined;
    }

    getProductQuantity(catalogNumber: number): number {
        const product = this.getProductByCatalogNumber(catalogNumber);
        return product ? this._products.get(product).length : 0;
    }

    getPurchasesHistory(): Receipt[] {
        return this._receipts;
    }

    getContactUsMessages(): ContactUsMessage[] {
        return this._contactUsMessages;
    }

    getStoreManager(userName: string): StoreManager {
        return this._storeManagers.find((manager: StoreManager) => manager.name === userName)
    }

    getStoreOwner(userName: string): StoreOwner {
        return this._storeOwners.find((owner: StoreOwner) => owner.name === userName)
    }


    private getItemById(items: Item[], id: number): Item {
        logger.debug(`searching item with id: ${id}`);
        for (const item of items) {
            if (item.id === id) {
                logger.debug(`found item: ${JSON.stringify(item)}`)
                return item;
            }
        }
        logger.warn(`could not find item with id: ${id}`);
        return undefined;
    }

    private validateProduct(product: Product): ProductValidator {
        logger.debug(`validating product: ${JSON.stringify(product)}`)

        if (!product)
            return {isValid: false, error: Error.E_INVALID_PROD}

        const isNameValid: boolean = product.name && product.name !== "";
        const isIdValid: boolean = product.catalogNumber && product.catalogNumber > 0;
        const isPriceValid: boolean = product.price && product.price > 0;
        const isCategoryValid: boolean = Object.values(ProductCategory).includes(product.category);

        if (isNameValid && isIdValid && isPriceValid && isCategoryValid) {
            logger.debug(`validated successfully product: ${JSON.stringify(product)}`);
            return {
                isValid: true
            }
        } else {
            const error: string = `invalid product: ${JSON.stringify(product)}`;
            logger.warn(error);
            return {
                isValid: false, error
            }
        }

    }

    private getStoreOwnerByName(username: string): StoreOwner {
        for (const storeOwner of this._storeOwners) {
            if (storeOwner.name === username)
                return storeOwner;
        }
        return undefined;
    }

    private getStoreManagerByName(username: string): StoreManager {
        for (const storeManager of this._storeManagers) {
            if (storeManager.name === username)
                return storeManager;
        }
        return undefined;
    }

    private containsItem(product: Product, item: Item): boolean {
        return this._products.get(product).reduce((acc, currItem) => acc || currItem.id === item.id, false)
    }

    private matchingFilters(product: Product, filters: SearchFilters, query: SearchQuery): boolean {
        if (typeof query.productName !== "undefined" && query.productName !== product.name)
            return false;
        if (typeof filters.priceRange !== "undefined" && (product.price < filters.priceRange.min || filters.priceRange.max < product.price))
            return false;
        if (typeof filters.productCategory !== "undefined" && filters.productCategory !== product.category)
            return false;
        if (typeof filters.productRating !== "undefined" && filters.productRating !== product.rating)
            return false;
        return true;
    }

    getItemsFromStock(product: ProductReq, amount: number): Item[] {
        const productInStore: Product = this.getProductByCatalogNumber(product.catalogNumber);
        const items: Item[] = this._products.get(productInStore);
        const itemsToReturn: Item[] = items.slice(0, amount);
        const itemsRemaining: Item[] = items.slice(amount, items.length);
        this._products.set(productInStore, itemsRemaining)
        return itemsToReturn;

    }

    get storeName(): string {
        return this._storeName;
    }

    get products(): Map<Product, Item[]> {
        return this._products;
    }

    get UUID(): string {
        return this._UUID;
    }

    get rating(): Rating {
        return this._rating;
    }


    addReceipt(purchases: Purchase[], payment:IPayment) {
        this._receipts.push(new Receipt(purchases,payment))
    }


    // TODO calculate from discount object
    getProductFinalPrice(product: ProductReq) {
        return product.price;
    }
}