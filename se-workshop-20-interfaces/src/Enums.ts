
export enum TradingSystemState{
    CLOSED,
    OPEN
}

export enum ManagementPermission {
    WATCH_PURCHASES_HISTORY,
    WATCH_USER_QUESTIONS,
    REPLY_USER_QUESTIONS,
    MODIFY_BUYING_METHODS,
    MODIFY_DISCOUNT,
    MANAGE_INVENTORY,
    CLOSE_STORE,
}

export enum ProductCategory {
    GENERAL,
    ELECTRONICS,
    HOBBIES,
    HOME,
    CLOTHING,
}

export enum Rating {
    VERY_LOW ,
    LOW ,
    MEDIUM,
    HIGH ,
    VERY_HIGH
}


export enum BuyingTypes {
    IMMEDIATE_PURCHASE,
    Auction,
    Lottery
}

export enum DiscountOperators {
    OR,
    AND,
    XOR,
    IFTHEN
}