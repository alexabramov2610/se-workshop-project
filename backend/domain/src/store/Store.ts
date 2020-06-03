import { Item, Receipt} from "../trading_system/internal_api";
import {Res} from 'se-workshop-20-interfaces'
import {errorMsg as Error} from "../api-int/Error"
import {loggerW} from "../api-int/internal_api";
import {RegisteredUser, StoreManager, StoreOwner} from "../user/internal_api";
import {
    BagItem, ICondition, IConditionOfDiscount,
    IDiscount, IDiscountInPolicy,
    IPayment,
    IProduct, IPurchasePolicyElement, ISimplePurchasePolicy,
    ProductCatalogNumber,
    ProductCategory,
    ProductInStore,
    ProductWithQuantity,
    Purchase,
    SearchFilters,
    SearchQuery
} from "se-workshop-20-interfaces/dist/src/CommonInterface";
import {Operators, ManagementPermission, Rating} from "se-workshop-20-interfaces/dist/src/Enums";
import {ShownDiscount} from "./discounts/ShownDiscount";
import {CondDiscount} from "./discounts/CondDiscount";
import {Discount} from "./discounts/Discount";
import {DiscountPolicy} from "./discounts/DiscountPolicy";
import {Condition} from "./discounts/conditions/Condition";
import {MinPayCondition} from "./discounts/conditions/MinPayCondition";
import {MinAmountCondition} from "./discounts/conditions/MinAmountCondition";
import {PurchasePolicy} from "./PurchasePolicy/PurchasePolicy";
import {UserPolicy} from "./PurchasePolicy/Policies/UserPolicy";
import {PurchasePolicyImpl} from "./PurchasePolicy/PurchasePolicyImpl";
import {ProductPolicy} from "./PurchasePolicy/Policies/ProductPolicy";
import {BagPolicy} from "./PurchasePolicy/Policies/BagPolicy";
import {SystemPolicy} from "./PurchasePolicy/Policies/SystemPolicy";
import { ProductModel } from "dal"

const logger = loggerW(__filename)

interface ProductValidator {
    isValid: boolean,
    error?: string
}

export class Store {
    storeName: string;
    description: string;
    products: Map<IProduct, Item[]>;
    storeOwners: StoreOwner[];
    storeManagers: StoreManager[];
    receipts: Receipt[];
    firstOwner: StoreOwner;
    purchasePolicy: PurchasePolicy;
    discountPolicy: Discount;
    rating: Rating;

    constructor(storeName: string, description: string, products: Map<IProduct, Item[]>, storeOwner: StoreOwner[],storeManagers:StoreManager[],receipts: Receipt[],firstOwner: StoreOwner, purchasePolicy:PurchasePolicy, discountPolicy:Discount) {
        this.storeName = storeName;
        this.description = description;
        this.products = products;
        this.storeOwners = storeOwner
        this.storeManagers = storeManagers;
        this.receipts = receipts;
        // this.purchasePolicy = new PurchasePolicyImpl();
        // this.discountPolicy = new DiscountPolicy();
        this.purchasePolicy = purchasePolicy;
        this.discountPolicy = discountPolicy;
        this.rating = Rating.MEDIUM;
    }


    addItems(items: Item[]): Res.ItemsAdditionResponse {
        logger.debug(`adding ${items.length} items to store id: `)
        const addedItems: Item[] = [];
        const notAddedItems: Item[] = [];

        for (const item of items) {
            const catalogNumber = item.catalogNumber;

            const product: IProduct = this.getProductByCatalogNumber(catalogNumber);
            if (product && !this.containsItem(product, item)) {
                this.products.set(product, this.products.get(product).concat([item]));
                addedItems.push(item);
            } else {
                notAddedItems.push(item);
            }
        }

        if (addedItems.length === 0) { // failed adding
            logger.warn(`failed adding all requested ${items.length} items to store `)
            return {
                data: {result: false, itemsNotAdded: items},
                error: {message: Error.E_ITEMS_ADD}
            }
        } else {
            logger.debug(`added ${items.length - notAddedItems.length} of ${items.length} request items to store`)
            return {
                data: {result: true, itemsNotAdded: notAddedItems}
            }
        }
    }

    addNewProducts(products: IProduct[]): Res.ProductAdditionResponse {
        logger.debug(`adding ${products.length} products to store`)
        const invalidProducts: IProduct[] = [];

        for (const product of products) {
            if (this.getProductByCatalogNumber(product.catalogNumber)) {
                logger.warn(`product: ${product.catalogNumber} already exists in store`)
                invalidProducts.push(product);
            } else {
                const productValidator: ProductValidator = this.validateProduct(product);
                productValidator.isValid ? this.products.set(product, []) :
                    invalidProducts.push(product)
            }
        }

        if (invalidProducts.length === products.length) { // failed adding
            logger.warn(`failed adding all requested ${products.length} products to store`)
            return {
                data: {result: false, productsNotAdded: invalidProducts},
                error: {message: Error.E_PROD_ADD}
            }
        } else {
            logger.debug(`added ${products.length - invalidProducts.length} of ${products.length} request products to store `)
            return {
                data: {result: true, productsNotAdded: invalidProducts}
            }
        }
    }

    addStoreManager(storeManager: StoreManager): Res.BoolResponse {
        if (!this.verifyIsStoreManager(storeManager.name)) {
            logger.debug(`adding user: ${storeManager.name} as a manager to store: ${this.storeName}`)
            this.storeManagers.push(storeManager);
            return {data: {result: true}}
        } else {
            logger.warn(`adding user: ${storeManager.name} as a manager to store: ${this.storeName} FAILED!`)
            return {data: {result: false}, error: {message: Error.E_ASSIGN + "manager."}}
        }
    }

    addStoreOwner(storeOwner: StoreOwner): Res.BoolResponse {
        if (!this.verifyIsStoreOwner(storeOwner.name)) {
            logger.debug(`adding user: ${storeOwner.name} as an owner of store: ${this.storeName}`)
            this.storeOwners.push(storeOwner);
            return {data: {result: true}}
        } else {
            logger.warn(`adding user: ${storeOwner.name} as an owner of store: ${this.storeName} FAILED!`);
            return {data: {result: false}, error: {message: Error.E_ASSIGN + "owner."}}
        }
    }

    setFirstOwner(user: RegisteredUser): void {
        const firstOwner: StoreOwner = new StoreOwner(user.name);
        this.storeOwners.push(firstOwner);
        this.firstOwner = firstOwner;
    }

    removeItems(items: Item[]): Res.ItemsRemovalResponse {
        logger.debug(`removing ${items.length} items from store`)
        const notRemovedItems: Item[] = [];

        for (const item of items) {
            const catalogNumber = item.catalogNumber;

            const productInStore: IProduct = this.getProductByCatalogNumber(catalogNumber);
            if (productInStore) {
                const productItems: Item[] = this.products.get(productInStore);
                const itemToRemove: Item = this.getItemById(productItems, item.id);
                if (itemToRemove) {
                    this.products.set(productInStore, productItems.filter(curr => curr !== itemToRemove));
                } else {
                    notRemovedItems.push(item);
                }
            } else {
                notRemovedItems.push(item);
            }
        }

        if (notRemovedItems.length === items.length) { // failed removing
            logger.warn(`failed removing all requested ${items.length} items from store`)
            return {
                data: {result: false, itemsNotRemoved: items},
                error: {message: Error.E_ITEMS_REM}
            }
        } else {
            logger.debug(`removed ${items.length - notRemovedItems.length} of ${items.length} request items from store`)
            return {
                data: {result: true, itemsNotRemoved: notRemovedItems}
            }
        }
    }

    async removeProductsWithQuantity(products: ProductWithQuantity[], isReturnItems: boolean): Promise<Res.ProductRemovalResponse> {
        logger.debug(`removing ${products.length} products with quantities from store`)
        const notRemovedProducts: ProductCatalogNumber[] = [];
        const itemsToReturn: Item[] = [];
        for (const product of products) {
            const productInStore: IProduct = this.getProductByCatalogNumber(product.catalogNumber);
            if (productInStore) {
                const items: Item[] = this.products.get(productInStore);

                const numOfItemsToRemove: number = product.quantity >= items.length ? items.length : product.quantity;

                if (isReturnItems) {
                    for (let i = 0; i < numOfItemsToRemove; i++) {
                        itemsToReturn.push(items[i]);
                    }
                }
                items.length = items.length - numOfItemsToRemove;

                this.products.set(productInStore, items);
            } else {
                const prodCatalogNumber: ProductCatalogNumber = {catalogNumber: product.catalogNumber};
                notRemovedProducts.push(prodCatalogNumber);
            }
        }

        if (notRemovedProducts.length === products.length) { // failed removing
            logger.warn(`failed removing all requested ${products.length} products from store`)
            return {
                data: {result: false, productsNotRemoved: notRemovedProducts},
                error: {message: Error.E_PROD_REM}
            }
        } else {
            logger.debug(`removed ${products.length - notRemovedProducts.length} of ${products.length} request products from store`)
            return isReturnItems ? {
                    data: {
                        result: true,
                        productsNotRemoved: notRemovedProducts,
                        itemsRemoved: itemsToReturn
                    }
                } :
                {data: {result: true, productsNotRemoved: notRemovedProducts}}
        }

    }

    async removeProductsByCatalogNumber(products: ProductCatalogNumber[]): Promise<Res.ProductRemovalResponse> {
        logger.debug(`removing ${products.length} items from store`)
        const productsNotRemoved: IProduct[] = [];

        for (const catalogNumber of products) {
            const product: IProduct = this.getProductByCatalogNumber(catalogNumber.catalogNumber);
            if (product) {
                this.products.delete(product);
            } else {
                productsNotRemoved.push(product);
            }
        }

        if (productsNotRemoved.length === products.length) {
            logger.warn(`failed removing all requested ${products.length} products from store`)
            return {
                data: {result: false, productsNotRemoved},
                error: {message: Error.E_PROD_REM}
            };
        } else {
            logger.debug(`removed ${products.length - productsNotRemoved.length} of ${products.length} request products from store`)
            return {
                data: {result: true, productsNotRemoved}
            };
        }
    }

    removeStoreOwner(user: StoreOwner): Res.BoolResponse {
        const storeManagerToRemove: StoreOwner = this.getStoreOwnerByName(user.name);
        if (!storeManagerToRemove)
            return {data: {result: false}, error: {message: Error.E_NAL}}

        this.storeOwners = this.storeOwners.filter(currOwner => currOwner.name !== storeManagerToRemove.name);
        return {data: {result: true}};
    }

    removeStoreManager(user: StoreManager): Res.BoolResponse {
        const storeManagerToRemove: StoreManager = this.getStoreManagerByName(user.name);
        if (!storeManagerToRemove)
            return {data: {result: false}, error: {message: Error.E_NAL}}

        this.storeManagers = this.storeManagers.filter(currManager => currManager.name !== storeManagerToRemove.name);
        return {data: {result: true}};
    }

    viewStoreInfo(): Res.StoreInfoResponse {
        return {
            data: {
                result: true,
                info: {
                    storeName: this.storeName,
                    description: this.description,
                    storeRating: this.rating,
                    storeOwnersNames: this.storeOwners.map((owner) => owner.name),
                    storeManagersNames: this.storeManagers.map((manager) => manager.name),
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

        for (const product of this.products.keys()) {
            if (this.matchingFilters(product, filters, query)) {
                const matchingProduct: IProduct = {
                    name: product.name,
                    price: product.price,
                    category: product.category,
                    catalogNumber: product.catalogNumber,
                    rating: product.rating
                };
                const matchingProdInStore: ProductInStore = {
                    product: matchingProduct,
                    storeName: this.storeName,
                    storeRating: this.rating
                };
                products.push(matchingProdInStore);
            }
        }

        return products;
    }

    verifyIsStoreOwner(userName: string): boolean {
        logger.debug(`verifying if user is owner: ${userName}`)
        for (const owner of this.storeOwners) {
            if (owner.name === userName) {
                logger.debug(`user: ${userName} is an owner of store ${this.storeName}`)
                return true;
            }
        }
        logger.debug(`user: ${JSON.stringify(userName)} is not an owner of store ${this.storeName}`)
        return false;
    }

    verifyIsStoreManager(userName: string): boolean {
        logger.debug(`verifying if user is manager: ${userName}`)
        for (const manager of this.storeManagers) {
            if (manager.name === userName) {
                logger.debug(`user: ${userName} is a manager of store ${this.storeName}`)
                return true;
            }
        }
        logger.debug(`user: ${userName} is not a manager of store ${this.storeName}`)
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

    getProductByCatalogNumber(catalogNumber: number): IProduct {
        logger.info(`searching product with catalog number: ${catalogNumber}`);
        for (const product of this.products.keys()) {
            logger.debug(` product: ${JSON.stringify(product)}`);
            logger.debug(`${product.catalogNumber} === ${catalogNumber}` + (product.catalogNumber === catalogNumber))
            if (product.catalogNumber === +catalogNumber) {
                logger.debug(`found product: ${JSON.stringify(product)}`);
                return product;
            }
        }
        logger.warn(`could not find product with catalog number: ${catalogNumber}`);
        return undefined;
    }

    getProductQuantity(catalogNumber: number): number {
        const product = this.getProductByCatalogNumber(catalogNumber);
        return product ? this.products.get(product).length : 0;
    }

    getStoreManager(userName: string): StoreManager {
        return this.storeManagers.find((manager: StoreManager) => manager.name === userName)
    }

    getStoreOwner(userName: string): StoreOwner {
        return this.storeOwners.find((owner: StoreOwner) => owner.name === userName)
    }

    getItemsFromStock(product: IProduct, amount: number): Item[] {
        const productInStore: IProduct = this.getProductByCatalogNumber(product.catalogNumber);
        const items: Item[] = this.products.get(productInStore);
        const itemsToReturn: Item[] = items.slice(0, amount);
        const itemsRemaining: Item[] = items.slice(amount, items.length);
        this.products.set(productInStore, itemsRemaining)
        return itemsToReturn;
    }

    addReceipt(purchases: Purchase[], payment: IPayment): void {
        this.receipts.push(new Receipt(purchases, payment))
    }

    getProductFinalPrice(catalogNumber: number): number {
        return 5;
        /*
        const product: Product = this.getProductByCatalogNumber(catalogNumber)
        let finalPrice: number = product.price;
        for (const d of this._discountPolicy) {
            if (d.isValid())
                finalPrice = d.calc(finalPrice, 0);
        }
        return finalPrice
        */
    }

    setDiscountPolicy(discounts: IDiscountInPolicy[]): string {
        const newPolicy: Discount = new DiscountPolicy();
        for (const discountInPolicy of discounts) {
            const newDiscount: Discount = this.parseIDiscount(discountInPolicy.discount);

            newPolicy.add(newDiscount, discountInPolicy.operator);
        }
        this.discountPolicy = newPolicy;
        return newPolicy.id;
    }

    calculateFinalPrices(bagItems: BagItem[]): BagItem[] {
        const bagItemAfterDiscount: BagItem[] = this.discountPolicy.calc(bagItems);
        logger.info(`Done calculating for store ${this.storeName}`)

        return bagItemAfterDiscount;
    }

    getBagPrice(bagItems: BagItem[]): number {
        let finalPrice: number = 0;
        for (const bagItem of bagItems) {
            finalPrice += bagItem.finalPrice;
        }
        return finalPrice;
    }

    setPurchasePolicy(policy: IPurchasePolicyElement[]): boolean {
        const newPolicy: PurchasePolicy = new PurchasePolicyImpl();
        for (const purchasePolicy of policy) {
            const newPurchasePolicy: PurchasePolicy = this.parseIPurchasePolicy(purchasePolicy.policy);
            if (!newPurchasePolicy)
                return false;
            newPolicy.add(newPurchasePolicy, purchasePolicy.operator);
        }
        this.purchasePolicy = newPolicy;
        return true;
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

    private validateProduct(product: IProduct): ProductValidator {
        logger.debug(`validating product: ${JSON.stringify(product)}`)

        if (!product)
            return {isValid: false, error: Error.E_INVALID_PROD}

        const isNameValid: boolean = product.name && product.name !== "";
        const isIdValid: boolean = product.catalogNumber && +product.catalogNumber > 0;
        const isPriceValid: boolean = product.price && +product.price > 0;
        logger.info(`got category ${product.category}`)
        const isCategoryValid: boolean = Object.values(ProductCategory).includes(product.category);

        if (isNameValid && isIdValid && isPriceValid && isCategoryValid) {
            logger.debug(`validated successfully product: ${JSON.stringify(product)}`);
            return {
                isValid: true
            }
        } else {
            const error: string = `invalid product: ${product}. isNameValid ${isNameValid} isIdValid ${isIdValid} isPriceValid ${isPriceValid} isCategoryValid ${isCategoryValid} `;
            logger.warn(error);
            return {
                isValid: false, error
            }
        }
    }

    private getStoreOwnerByName(username: string): StoreOwner {
        for (const storeOwner of this.storeOwners) {
            if (storeOwner.name === username)
                return storeOwner;
        }
        return undefined;
    }

    private getStoreManagerByName(username: string): StoreManager {
        for (const storeManager of this.storeManagers) {
            if (storeManager.name === username)
                return storeManager;
        }
        return undefined;
    }

    private containsItem(product: IProduct, item: Item): boolean {
        return this.products.get(product).reduce((acc, currItem) => acc || currItem.id === item.id, false)
    }

    private matchingFilters(product: IProduct, filters: SearchFilters, query: SearchQuery): boolean {
        if (typeof query.productName !== "undefined" && query.productName.length > 0 && query.productName !== product.name)
            return false;

        if (typeof filters.priceRange !== "undefined" && (
            ((filters.priceRange.min as unknown) !== "" && product.price < filters.priceRange.min) ||
            ((filters.priceRange.max as unknown) !== "" && filters.priceRange.max < product.price)))
            return false;

        if (typeof filters.productCategory !== "undefined" && (filters.productCategory as unknown) !== "" && filters.productCategory !== product.category)
            return false;

        if (typeof filters.productRating !== "undefined" && (filters.productRating as unknown) !== "" && filters.productRating !== product.rating)
            return false;

        return true;
    }

    private parseIDiscount(iDiscount: IDiscount): Discount {
        let newDiscount: Discount;
        if (iDiscount.condition && iDiscount.condition.length > 0) {
            const conditions: Map<Condition, Operators> = new Map();
            for (const iCondition of iDiscount.condition) {
                logger.info(`parsing condition ${JSON.stringify(iCondition.condition)} OP ${JSON.stringify(iCondition.operator)}`)
                const nextCondition: Condition = this.parseICondition(iCondition.condition);

                if (nextCondition) {
                    logger.info(`New Condition! ${JSON.stringify(nextCondition)}`)
                    conditions.set(nextCondition, iCondition.operator);
                }
            }
            newDiscount = new CondDiscount(iDiscount.startDate, iDiscount.duration, iDiscount.percentage, iDiscount.products, conditions, iDiscount.category)
            logger.info(`New CondDiscount ${JSON.stringify(newDiscount)}`)
            return newDiscount
        }
        newDiscount = new ShownDiscount(iDiscount.startDate, iDiscount.duration, iDiscount.percentage, iDiscount.products, iDiscount.category)
        logger.info(`New ShownDiscount ${JSON.stringify(newDiscount)}`)
        return newDiscount;
    }

    private parseICondition(ifCondition: ICondition): Condition {
        if (ifCondition.minPay || +ifCondition.minPay === 0) {
            logger.info(`new min pay discount ${ifCondition.minPay} for store`)
            return new MinPayCondition(ifCondition.minPay);
        } else if (ifCondition.minAmount || +ifCondition.minAmount === 0) {
            logger.info(`new min amount discount ${ifCondition.minAmount}`)
            return new MinAmountCondition(ifCondition.catalogNumber, ifCondition.minAmount);
        }
        logger.warn(`parse condition failed ${JSON.stringify(ifCondition)}`)
        return undefined;
    }

    private parseIPurchasePolicy(iPolicy: ISimplePurchasePolicy): PurchasePolicy {
        let purchasePolicy: PurchasePolicy;
        if (iPolicy.userPolicy) {
            purchasePolicy = new UserPolicy(iPolicy.userPolicy.countries)
        } else if (iPolicy.productPolicy) {
            purchasePolicy = new ProductPolicy(iPolicy.productPolicy.catalogNumber, iPolicy.productPolicy.minAmount, iPolicy.productPolicy.maxAmount);
        } else if (iPolicy.bagPolicy) {
            purchasePolicy = new BagPolicy(iPolicy.bagPolicy.minAmount, iPolicy.bagPolicy.maxAmount);
        } else if (iPolicy.systemPolicy) {
            purchasePolicy = new SystemPolicy(iPolicy.systemPolicy.notForSellDays);
        }
        return purchasePolicy;
    }

    verifyStorePolicy(user: RegisteredUser, bagItems: BagItem[]): boolean {
        return this.purchasePolicy.isSatisfied(bagItems, user);
    }
}