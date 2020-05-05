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

// duration - in days
export interface IDiscount {
    startDate: Date;
    duration: number;
    products: number[];
    percentage?: number;
    condition?: ICondition;
    coupon?: string;
    complex?: IComplexDiscount;
}

export interface ICondition {
    minAmount?: number;
    minPay?: number;
}

export interface IComplexDiscount extends IDiscount {
    operator: DiscountOperators;
    children?: IifClause[] | IDiscount[];
    ifClause?: IDiscount | IifClause;
    thenClause?: IDiscount;
}

export interface IifClause extends IDiscount {
    productInBag?: number;
    productInDiscount?: number;
}

/*
//example of request to add "if bought X or (Y AND Z) then 60% on K"
const startDate: Date = new Date()
const duration: number = 3;
const complex: IComplexDiscount = {
    startDate,
    duration,
    products: [1, 2, 3, 4],
    operator: DiscountOperators.IFTHEN,
    ifClause: {
        startDate,
        duration,
        complex: {
            startDate,
            duration,
            operator: DiscountOperators.OR,
            children: [{startDate, duration, products: [1], productInBag: 1}, {
                startDate,
                duration,
                products: [1, 2],
                complex: {
                    startDate,
                    duration,
                    products: [1, 2],
                    operator: DiscountOperators.AND,
                    children: [{startDate, duration, products: [2], productInBag: 2}, {
                        startDate,
                        duration,
                        products: [3],
                        productInBag: 3
                    }]
                }
            }],
            products: [1, 2, 3]
        },
        products: [1, 2, 3]
    },
    thenClause: {startDate, duration, products: [4], percentage: 60},
}
*/

/*
//example of request to add "discount on Milk(1) or Borekas(2) but not both"
const startDate: Date = new Date()
const duration: number = 3;
const complex: IComplexDiscount = {
    startDate,
    duration,
    products: [1,2],
    operator: DiscountOperators.XOR,
    children: [{startDate, duration, percentage: 50, products: [1]}, {
        startDate,
        duration,
        percentage: 30,
        products: [2]
    }],
}
*/

//example of request to add "buy 2 bisli and get 3 free"
const startDate: Date = new Date()
const duration: number = 3;
const complex: IDiscount = {
    startDate,
    duration,
    products: [1],
    percentage: 100,

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
