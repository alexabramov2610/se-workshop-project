import {ProductCategory, Rating} from "./Enums";
import exp from "constants";

export {ProductCategory}

export interface Item extends ProductCatalogNumber {
    id: number
}

export interface ProductCatalogNumber {
    catalogNumber: number
}

export interface Product extends ProductCatalogNumber {
    name: string,
    price: number,
    category: ProductCategory
}

export interface Purchase {
    item: Item,
    price: number;
}

export interface BagItem {
    product: Product,
    amount: number;
}

export interface CreditCard {
    holderName: string,
    number: string,
    expMonth: string,
    expYear: string,
    ccv: string,
}


export interface ProductWithQuantity extends ProductCatalogNumber {
    quantity: number
}

export interface PriceRange {
    min: number,
    max: number
}

export interface SearchFilters {
    priceRange?: PriceRange,
    productRating?: Rating,
    storeRating?: Rating,
    productCategory?: ProductCategory
}

export interface SearchQuery {
    productName?: string,
    storeName?: string,
    // tags: Tag[]
}

export interface StoreInfo {
    storeName: string,
    storeRating: Rating,
    storeOwnersNames: string[],
    storeManagersNames: string[],
    productsNames: string[]
}

export interface ProductInStore {
    product: Product,
    storeName: string
}