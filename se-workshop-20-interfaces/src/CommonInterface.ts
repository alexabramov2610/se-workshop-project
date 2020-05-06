import {DiscountOperators, ProductCategory, Rating} from "./Enums";

export {ProductCategory};

export interface IItem extends ProductCatalogNumber {
    id: number;
}

export interface ProductCatalogNumber {
    catalogNumber: number;
}

export interface Error {
    message: string;
    options?: any;
}

export interface IContactUsMessage {
    question: string,
    date: Date,
    response: string,
    responderName: string,
    responseDate: string,
}

export interface IProduct extends ProductCatalogNumber {
    name: string;
    price: number;
    category: ProductCategory;
}

export interface Cart {
    products: CartProduct[];
}

export interface CartProduct {
    storeName: string;
    bagItems: BagItem[];
}

export interface Purchase {
    storeName: string;
    userName: string;
    item: IItem;
    price: number;
}

export interface BagItem {
    product: IProduct;
    amount: number;
    finalPrice?: number;
}

export interface CreditCard {
    holderName: string;
    number: string;
    expMonth: string;
    expYear: string;
    cvv: string;
}

export interface ProductWithQuantity extends ProductCatalogNumber {
    quantity: number;
}
/*
 duration - in days
 simple discount (Shown/Cond) - provide products, percentage, condition?

 */
export interface IDiscount {
    startDate: Date;
    duration: number;
    products?: number[];
    percentage?: number;
    condition?: ICondition;
    coupon?: string;
    complex?: IComplexDiscount;
    ifCondClause?: IifClause;
}
/*
choose one of
minAmount - product discount
minPay -    store discount
 */
export interface ICondition {
    minAmount?: number;
    minPay?: number;
}
/*
choose one of operator,
children - for AND\XOR\OR
if+then -  for IFTHEN
 */
export interface IComplexDiscount extends IDiscount {
    operator: DiscountOperators;
    children?: IDiscount[];
    ifClause?: IDiscount;
    thenClause?: IDiscount;
}

export interface IifClause {
    productInBag?: number;
    productInDiscount?: number;
}

export interface PriceRange {
    min: number;
    max: number;
}

export interface SearchFilters {
    priceRange?: PriceRange;
    productRating?: Rating;
    storeRating?: Rating;
    productCategory?: ProductCategory;
}

export interface SearchQuery {
    productName?: string;
    storeName?: string;
    // tags: Tag[]
}

export interface IReceipt {
    date: Date;
    purchases: Purchase[];
    payment?: IPayment;
}

export interface IPayment {
    lastCC4: string;
    totalCharged: number;
}

export interface StoreInfo {
    storeName: string;
    storeRating: Rating;
    storeOwnersNames: string[];
    storeManagersNames: string[];
    productsNames: string[];
}

export interface ProductInStore {
    product: IProduct;
    storeName: string;
}
