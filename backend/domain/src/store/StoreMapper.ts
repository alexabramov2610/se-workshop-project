import {
    ICondition,
    IDiscount,
    IItem,
    IProduct,
    ISimplePurchasePolicy
} from "se-workshop-20-interfaces/dist/src/CommonInterface";
import {Store} from "./Store";
import {Discount} from "./discounts/Discount";
import {DiscountPolicy} from "./discounts/DiscountPolicy";
import {Condition} from "./discounts/conditions/Condition";
import {Operators} from "se-workshop-20-interfaces/dist/src/Enums";
import {CondDiscount} from "./discounts/CondDiscount";
import {ShownDiscount} from "./discounts/ShownDiscount";
import {MinPayCondition} from "./discounts/conditions/MinPayCondition";
import {MinAmountCondition} from "./discounts/conditions/MinAmountCondition";
import {PurchasePolicy} from "./PurchasePolicy/PurchasePolicy";
import {PurchasePolicyImpl} from "./PurchasePolicy/PurchasePolicyImpl";
import {UserPolicy} from "./PurchasePolicy/Policies/UserPolicy";
import {ProductPolicy} from "./PurchasePolicy/Policies/ProductPolicy";
import {BagPolicy} from "./PurchasePolicy/Policies/BagPolicy";
import {SystemPolicy} from "./PurchasePolicy/Policies/SystemPolicy";
import {IsOnDiscountCondition} from "./discounts/conditions/IsOnDiscountCondition";


export function productFromDbToDomain(product): IProduct {
    return {
        catalogNumber: product.catalogNumber,
        name: product.name,
        price: product.price,
        category: product.category,
        rating: product.rating,
        db_id: product._id,
        storeName: product.storeName
    };
}

export function productsMapperFromDB(products: any): IProduct[] {
    const mappedProducts: IProduct[] = [];
    for (const product of products) {
        mappedProducts.push(productFromDbToDomain(product));
    }
    return mappedProducts;
}

export function productsAndItemsMapperFromDB(products: any): Map<IProduct, IItem[]> {
    const mappedProducts = new Map<IProduct, IItem[]>();

    products.forEach((product) => {
        const retrievedProduct: IProduct = productFromDbToDomain(product)
        const retrievedItems: IItem[] = product.items.reduce((acc, curr) => {
            const item: IItem = {db_id: curr._id, id: curr.id, catalogNumber: curr.catalogNumber};
            return acc.concat(item);
        }, []);
        mappedProducts.set(retrievedProduct, retrievedItems);
    });

    return mappedProducts;
}

export function productsMapperToDB(products: Map<IProduct, IItem[]>): any {
    let productsToDB = [];

    Array.from(products.keys()).forEach((product: IProduct) => {
        productsToDB = productsToDB.concat({
            catalogNumber: product.catalogNumber,
            name: product.name,
            price: product.price,
            category: product.category,
            rating: product.rating,
            id: product.db_id,
            items: products.get(product)
        })
    });

    return productsToDB;
}

export function storeMapperFromDB(store: any): Store {
    if (!store)
        return store;
    const {storeName, description, products, storeOwners, storeManagers, receipts, firstOwner, purchasePolicy, discountPolicy} = store;
    const realProducts: Map<IProduct, IItem[]> = productsAndItemsMapperFromDB(products);
    const realDiscountPolicy = discountFromDB(discountPolicy);
    const realPurchasePolicy = purchasePolicyFromDB(purchasePolicy);
    const realStore: Store = new Store(storeName, description, realProducts, storeOwners, storeManagers, receipts, firstOwner, realPurchasePolicy, realDiscountPolicy)
    return realStore
}

export function purchasePolicyFromDB(purchasePolicy): PurchasePolicy {
    const newPolicy: PurchasePolicy = new PurchasePolicyImpl();
    if (!purchasePolicy)
        return newPolicy
    const children = purchasePolicy.children;
    if (!children)
        return newPolicy
    for (const c of children) {
        const newPol: PurchasePolicy = parsePurchasePolicy(c);
        newPolicy.add(newPol, c.operator);
    }
    return newPolicy;
}

export function discountFromDB(discountPolicy): Discount {

    const newPolicy: Discount = new DiscountPolicy();
    if (!discountPolicy)
        return newPolicy
    const children = discountPolicy.children;
    if (!children)
        return newPolicy
    for (const c of children) {
        const newDiscount: Discount = parseDiscount(c);
        newPolicy.add(newDiscount, c.operator);
    }
    return newPolicy;
}

function parsePurchasePolicy(iPolicy): PurchasePolicy {
    let purchasePolicy: PurchasePolicy;
    if (iPolicy.countries && iPolicy.countries.length > 0) {
        purchasePolicy = new UserPolicy(iPolicy.countries)
    } else if (iPolicy.catalogNumber) {
        purchasePolicy = new ProductPolicy(iPolicy.catalogNumber, iPolicy.minAmount, iPolicy.maxAmount);
    } else if (iPolicy.minAmount && iPolicy.maxAmount) {
        purchasePolicy = new BagPolicy(iPolicy.minAmount, iPolicy.maxAmount);
    } else if (iPolicy.notForSellDays) {
        purchasePolicy = new SystemPolicy(iPolicy.notForSellDays);
    }
    return purchasePolicy;
}

function parseDiscount(iDiscount): Discount {
    let newDiscount: Discount;
    if (iDiscount.conditions && iDiscount.conditions.length > 0) {
        const conditions: Map<Condition, Operators> = new Map();
        for (const iCondition of iDiscount.conditions) {
            const nextCondition: Condition = parseCondition(iCondition);
            if (nextCondition) {
                conditions.set(nextCondition, iCondition.operator);
            }
        }
        newDiscount = new CondDiscount(iDiscount.startDate, iDiscount.duration, iDiscount.percentage, iDiscount.productsInDiscount, conditions, iDiscount.category)
        return newDiscount
    }
    newDiscount = new ShownDiscount(iDiscount.startDate, iDiscount.duration, iDiscount.percentage, iDiscount.productsInDiscount, iDiscount.category)
    return newDiscount;
}

function parseCondition(ifCondition): Condition {
    if (ifCondition.minPay || +ifCondition.minPay === 0) {
        return new MinPayCondition(ifCondition.minPay);
    } else if (ifCondition.minAmount || +ifCondition.minAmount === 0) {
        return new MinAmountCondition(ifCondition.catalogNumber, ifCondition.minAmount);
    } else if (ifCondition.catalogNumber && +ifCondition.catalogNumber)
        return new IsOnDiscountCondition(ifCondition.catalogNumber)
    return undefined;
}