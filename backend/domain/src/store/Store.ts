import {Res} from 'se-workshop-20-interfaces'
import {errorMsg as Error} from "../api-int/Error"
import {loggerW} from "../api-int/internal_api";
import {RegisteredUser, StoreManager, StoreOwner} from "../user/internal_api";
import {
    BagItem, ICondition,
    IDiscount, IDiscountInPolicy, IItem,
    IProduct, IPurchasePolicyElement, IReceipt, ISimplePurchasePolicy,
    ProductCatalogNumber,
    ProductCategory,
    ProductInStore,
    ProductWithQuantity,
    SearchFilters,
    SearchQuery
} from "se-workshop-20-interfaces/dist/src/CommonInterface";
import {Operators, Rating} from "se-workshop-20-interfaces/dist/src/Enums";
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
import {
    ProductModel,
    DiscountPolicyModel,
    DiscountModel,
    ConditionModel,
    PurchasePolicyModel,
    PurchasePolicyElementModel
} from "dal"
import {IsOnDiscountCondition} from "./discounts/conditions/IsOnDiscountCondition";

const logger = loggerW(__filename)

interface ProductValidator {
    isValid: boolean,
    error?: string
}

export class Store {
    storeName: string;
    description: string;
    products: Map<IProduct, IItem[]>;
    storeOwners: StoreOwner[];
    storeManagers: StoreManager[];
    receipts: IReceipt[];
    firstOwner: StoreOwner;
    purchasePolicy: PurchasePolicy;
    discountPolicy: Discount;
    rating: Rating;

    constructor(storeName: string, description: string, products: Map<IProduct, IItem[]>, storeOwner: StoreOwner[],
                storeManagers: StoreManager[], receipts: IReceipt[], firstOwner: StoreOwner, purchasePolicy: PurchasePolicy, discountPolicy: Discount) {
        this.storeName = storeName;
        this.description = description;
        this.products = products;
        this.storeOwners = storeOwner
        this.storeManagers = storeManagers;
        this.receipts = receipts;
        this.firstOwner = firstOwner;
        this.purchasePolicy = purchasePolicy;
        this.discountPolicy = discountPolicy;
        this.rating = Rating.MEDIUM;
    }


    addItems(items: IItem[]): Res.ItemsAdditionResponse {
        logger.debug(`adding ${items.length} items to store id: `)
        const addedItems: IItem[] = [];
        const notAddedItems: IItem[] = [];

        for (const item of items) {
            const catalogNumber: number = +item.catalogNumber;
            const product: IProduct = this.getProductByCatalogNumber(catalogNumber);
            // @ts-ignore
            if (catalogNumber && /^\d+$/.test(item.id) && item.id && product && !this.containsItem(product, item)) {
                this.products.set(product, this.products.get(product).concat([item]));
                addedItems.push(item);
            } else {
                notAddedItems.push(item);
            }
        }

        if (addedItems.length === 0) { // failed adding
            logger.warn(`failed adding all requested ${items.length} items to store `)
            return {
                data: {result: false, itemsNotAdded: items, itemsAdded: addedItems},
                error: {message: Error.E_ITEMS_ADD}
            }
        } else {
            logger.debug(`added ${items.length - notAddedItems.length} of ${items.length} request items to store`)
            return {
                data: {result: true, itemsNotAdded: notAddedItems, itemsAdded: addedItems}
            }
        }
    }

    addNewProducts(products: IProduct[]): Res.ProductAdditionResponse {
        logger.debug(`adding ${products.length} products to store`)
        const invalidProducts: IProduct[] = [];
        const validProducts: IProduct[] = [];

        for (const product of products) {
            if (this.getProductByCatalogNumber(product.catalogNumber)) {
                logger.warn(`product: ${product.catalogNumber} already exists in store`)
                invalidProducts.push(product);
            } else if (!this.validateProduct(product).isValid) {
                logger.warn(`invalid product: ${product}`)
                invalidProducts.push(product);
            } else {
                product.storeName = this.storeName;
                product.rating = 3;
                this.products.set(product, []);
                validProducts.push(product);
            }
        }

        if (invalidProducts.length === products.length) { // failed adding
            logger.warn(`failed adding all requested ${products.length} products to store`)
            return {
                data: {result: false, productsNotAdded: invalidProducts, productsAdded: validProducts},
                error: {message: Error.E_PROD_ADD}
            }
        } else {
            logger.debug(`added ${products.length - invalidProducts.length} of ${products.length} request products to store `)
            return {
                data: {result: true, productsNotAdded: invalidProducts, productsAdded: validProducts}
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

    removeItems(items: IItem[]): Res.ItemsRemovalResponse {
        logger.debug(`removing ${items.length} items from store`)
        const notRemovedItems: IItem[] = [];
        const itemsRemoved: IItem[] = [];

        for (const item of items) {
            const catalogNumber = item.catalogNumber;

            const productInStore: IProduct = this.getProductByCatalogNumber(catalogNumber);
            if (productInStore) {
                const productItems: IItem[] = this.products.get(productInStore);
                const itemToRemove: IItem = this.getItemById(productItems, item.id);
                if (itemToRemove) {
                    this.products.set(productInStore, productItems.filter(curr => curr !== itemToRemove));
                    itemsRemoved.push(itemToRemove)
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
                data: {result: true, itemsNotRemoved: notRemovedItems, itemsRemoved}
            }
        }
    }

    async removeProductsWithQuantity(products: ProductWithQuantity[], isReturnItems: boolean): Promise<Res.ProductRemovalResponse> {
        logger.debug(`removing ${products.length} products with quantities from store`)
        const notRemovedProducts: ProductCatalogNumber[] = [];
        const itemsToReturn: IItem[] = [];
        for (const product of products) {
            const productInStore: IProduct = this.getProductByCatalogNumber(product.catalogNumber);
            if (productInStore) {
                const items: IItem[] = this.products.get(productInStore);

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

    removeProductsByCatalogNumber(products: ProductCatalogNumber[]): Res.ProductRemovalResponse {
        logger.debug(`removing ${products.length} items from store`)
        const productsNotRemoved: IProduct[] = [];
        const productsRemoved: IProduct[] = [];

        for (const catalogNumber of products) {
            const product: IProduct = this.getProductByCatalogNumber(catalogNumber.catalogNumber);
            if (product) {
                productsRemoved.push(product)
                this.products.delete(product);
            } else {
                productsNotRemoved.push(product);
            }
        }

        if (productsNotRemoved.length === products.length) {
            logger.warn(`failed removing all requested ${products.length} products from store`)
            return {
                data: {result: false, productsNotRemoved, productsRemoved: []},
                error: {message: Error.E_PROD_REM}
            };
        } else {
            logger.debug(`removed ${products.length - productsNotRemoved.length} of ${products.length} request products from store`)
            return {
                data: {result: true, productsNotRemoved, productsRemoved}
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

    getProductByCatalogNumber(catalogNumber: number): IProduct {
        logger.debug(`searching product with catalog number: ${catalogNumber}`);
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

    async getItemsFromStock(product: IProduct, amount: number): Promise<IItem[]> {
        const productInStore: IProduct = this.getProductByCatalogNumber(product.catalogNumber);
        const items: IItem[] = this.products.get(productInStore);
        const itemsToReturn: IItem[] = items.slice(0, amount);
        const itemsRemaining: IItem[] = items.slice(amount, items.length);
        try {
            const res = await ProductModel.updateOne({_id: productInStore.db_id}, {items: itemsRemaining})
            logger.info(`updated products db ${res}`)
        } catch (e) {
            logger.error(`getItemsFromStock: DB ERROR ${e}`)
        }
        this.products.set(productInStore, itemsRemaining)
        return itemsToReturn;
    }

    addReceipt(receipt: IReceipt): void {
        this.receipts.push(receipt);
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

    async setDiscountPolicy(discounts: IDiscountInPolicy[]): Promise<boolean> {
        const newPolicy: Discount = new DiscountPolicy();
        try {
            await DiscountModel.deleteMany({storeName: this.storeName})
        } catch (e) {
            return false;
        }
        const newDocs = [];
        for (const discountInPolicy of discounts) {
            const newDiscount: Discount = this.parseIDiscount(discountInPolicy.discount);
            newPolicy.add(newDiscount, discountInPolicy.operator);
            const conditions = newDiscount.getConditions();
            let conditionDocs = [];
            if (conditions) {
                const newCondDocs = [];
                for (const [c, o] of conditions) {
                    newCondDocs.push({
                        operator: o,
                        minPay: c.getMinPay(),
                        minAmount: c.getMinAmount(),
                        catalogNumber: c.getCatalogNumber()
                    })
                }
                try {
                    conditionDocs = await ConditionModel.create(newCondDocs)
                } catch (e) {
                    logger.error(`setDiscountPolicy conditions ERROR DB ${e} `)
                }

            }
            newDocs.push({
                operator: discountInPolicy.operator,
                startDate: newDiscount.startDate,
                duration: newDiscount.duration,
                percentage: newDiscount.percentage,
                productsInDiscount: newDiscount.productsInDiscount,
                category: newDiscount.category,
                conditions: conditionDocs,
                storeName: this.storeName
            })
        }

        try {
            const discountsDocs = await DiscountModel.create(newDocs);
            const discountPolicy = await DiscountPolicyModel.findOneAndUpdate({storeName: this.storeName}, {children: discountsDocs});
        } catch (e) {
            logger.error(`setDiscountPolicy discounts ERROR DB ${e} `)

        }
        this.discountPolicy = newPolicy;
        return true;
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

    async setPurchasePolicy(policy: IPurchasePolicyElement[]): Promise<boolean> {
        const newPolicy: PurchasePolicy = new PurchasePolicyImpl();
        try {
            await PurchasePolicyElementModel.deleteMany({storeName: this.storeName})
        } catch (e) {
            return false;
        }
        const newDocs = [];
        for (const purchasePolicy of policy) {
            const newPurchasePolicy: PurchasePolicy = this.parseIPurchasePolicy(purchasePolicy.policy);
            if (!newPurchasePolicy)
                return false;
            newPolicy.add(newPurchasePolicy, purchasePolicy.operator);
            logger.debug(`${newPurchasePolicy.getNotForSellDays()} ${newPurchasePolicy.getCatalogNumber()} ${newPurchasePolicy.getMinAmount()} ${newPurchasePolicy.getMaxAmount()}`)
            newDocs.push({
                operator: purchasePolicy.operator,
                notForSellDays: newPurchasePolicy.getNotForSellDays(),
                catalogNumber: newPurchasePolicy.getCatalogNumber(),
                minAmount: newPurchasePolicy.getMinAmount(),
                maxAmount: newPurchasePolicy.getMaxAmount(),
                countries: newPurchasePolicy.getCountries(),
                storeName: this.storeName
            })
        }
        try {
            const policiesDocs = await PurchasePolicyElementModel.create(newDocs);
            const purchasePolicy = await PurchasePolicyModel.findOneAndUpdate({storeName: this.storeName}, {children: policiesDocs});
        } catch (e) {
            logger.error(`setPurchasePolicy ERROR DB ${e} `)
            return false;
        }
        this.purchasePolicy = newPolicy;
        return true;
    }

    private getItemById(items: IItem[], id: number): IItem {
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
            const error: string = `invalid product isNameValid ${isNameValid} isIdValid ${isIdValid} isPriceValid ${isPriceValid} isCategoryValid ${isCategoryValid} `;
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

    private containsItem(product: IProduct, item: IItem): boolean {
        const items: IItem[] = this.products.get(product)
        return items.reduce((acc, currItem) => acc || +currItem.id === +item.id, false)
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
        } else if (ifCondition.catalogNumber && +ifCondition.catalogNumber) {
            return new IsOnDiscountCondition(ifCondition.catalogNumber)
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