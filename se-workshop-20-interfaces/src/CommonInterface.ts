

import {EventCode, ManagementPermission, Operators, ProductCategory, Rating, WeekDays} from "./Enums";
import {Event} from "./Event";

export {ProductCategory};

export interface VisitorsStatistics {
    guests: number;
    registeredUsers: number;
    managers: number;
    owners: number;
    admins: number;
}

export interface DailyStatistics {
    date: Date,
    statistics: VisitorsStatistics
}

export interface IPublisher {
    subscribe(username: string, eventCode: EventCode, key: string, storeName: string): void;

    unsubscribe(username: string, subscriptionEvent: EventCode, key: string): void;

    notify(event: Event): string[];

    terminateSocket(): void;

    removeClient(username: string);
}

export interface IItem extends ProductCatalogNumber {
    id: number;
    db_id?: string;
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
    rating?: Rating;
    db_id?: string;
    storeName?: string;
}

export interface Cart {
    products: CartProduct[]
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
    id: string;
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
    products: number[];
    category?: ProductCategory;
    percentage: number;
    condition?: IConditionOfDiscount[];
    coupon?: string
}

export interface IDiscountInPolicy {
    discount: IDiscount,
    operator: Operators
}

export interface IDiscountPolicy {
    discounts: IDiscountInPolicy[]
}

export interface IConditionOfDiscount {
    condition: ICondition,
    operator: Operators
}

/*
choose one of
minAmount - product discount
minPay -    store discount
 */
export interface ICondition {
    catalogNumber?: number;
    minAmount?: number;
    minPay?: number;
}


// *******************START PURCHASE POLICY************************** //

export interface IProductPurchasePolicy {
    catalogNumber: number;
    minAmount: number;
    maxAmount: number;
}

export interface IBagPurchasePolicy {
    minAmount: number;
    maxAmount: number;
}

export interface ISystemPurchasePolicy {
    notForSellDays: WeekDays[]
}

export interface IUserPurchasePolicy {
    countries: string[]
}

export interface ISimplePurchasePolicy {
    productPolicy?: IProductPurchasePolicy;
    bagPolicy?: IBagPurchasePolicy;
    systemPolicy?: ISystemPurchasePolicy;
    userPolicy?: IUserPurchasePolicy;
}

export interface IPurchasePolicyElement {
    operator: Operators
    policy: ISimplePurchasePolicy
}

export interface IPurchasePolicy {
    policy: IPurchasePolicyElement[]
}

// *******************END PURCHASE POLICY************************** //

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
}

export interface IReceipt {
    date: Date;
    purchases: Purchase[];
    payment?: IPayment;
}

export interface IPayment {
    lastCC4: string;
    totalCharged: number;
    transactionID: number;
}

export interface StoreInfo {
    storeName: string;
    description: string;
    storeRating: Rating;
    storeOwnersNames: string[];
    storeManagersNames: string[];
    productsNames: string[];
}

export interface ProductInStore {
    product: IProduct;
    storeName: string;
    storeRating?: Rating
}

export interface ManagerNamePermission {
    managerName: string,
    permissions: ManagementPermission[]
}

export interface AssignAgreement {
    assignedByOwner: string;
    newOwner: string
    requiredApprove: [string],
    approvedBy: [string],
    storeName: string
}