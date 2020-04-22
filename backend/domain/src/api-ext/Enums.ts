
export enum TradingSystemState{
    CLOSED,
    OPEN
}

export enum ManagementPermission {
    WATCH_PURCHASES_HISTORY = 1,
    WATCH_USER_QUESTIONS = 2,
    REPLY_USER_QUESTIONS = 3,
    MODIFY_BUYING_METHODS = 4,
    MODIFY_DISCOUNT = 5,
    MANAGE_INVENTORY = 6,
    CLOSE_STORE = 7,
}

export enum ProductCategory {
    General = 1,
    Electronics = 2,
    Hobbies = 3,
    Home = 4
}

export enum Rating {
    VERY_LOW = 1,
    LOW = 2,
    MEDIUM = 3,
    HIGH = 4,
    VERY_HIGH = 5
}