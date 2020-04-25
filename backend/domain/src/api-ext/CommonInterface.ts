import {ProductCategory, Rating} from "./Enums";

export {ProductCategory}

export interface IItem extends ProductCatalogNumber {
    id: number
}

export interface ProductCatalogNumber {
    catalogNumber: number
}

export interface IProduct extends ProductCatalogNumber {
    name: string,
    price: number,
    category: ProductCategory
}

export interface Cart {
    products: CartProduct[]
}

export interface CartProduct {
    storeName: string,
    bagItems: BagItem[]
}

export interface Purchase {
    storeName: string,
    userName: string,
    item: IItem,
    price: number;
}

export interface BagItem {
    product: IProduct,
    amount: number;
    finalPrice?: number
}

export interface CreditCard {
    holderName: string,
    number: number,
    expMonth: number,
    expYear: number,
    ccv: number,
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

export interface IReceipt {
  date: Date;
  purchases: Purchase[];
}

export interface StoreInfo {
    storeName: string,
    storeRating: Rating,
    storeOwnersNames: string[],
    storeManagersNames: string[],
    productsNames: string[]
}

export interface ProductInStore {
    product: IProduct,
    storeName: string
}