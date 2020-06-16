export enum TradingSystemState {
    CLOSED,
    OPEN
}

export enum ManagementPermission {
    VIEW_MANAGER_PERMISSION = "VIEW_MANAGER_PERMISSION",
    WATCH_PURCHASES_HISTORY = "WATCH_PURCHASES_HISTORY",
    WATCH_USER_QUESTIONS = "WATCH_USER_QUESTIONS",
    REPLY_USER_QUESTIONS = "REPLY_USER_QUESTIONS",
    MODIFY_BUYING_METHODS = "MODIFY_BUYING_METHODS",
    MODIFY_DISCOUNT = "MODIFY_DISCOUNT",
    MANAGE_INVENTORY = "MANAGE_INVENTORY",
    CLOSE_STORE = "CLOSE_STORE",
}

export enum ProductCategory {
    GENERAL = "GENERAL",
    ELECTRONICS = "ELECTRONICS",
    HOBBIES = "HOBBIES",
    HOME = "HOME",
    CLOTHING = "CLOTHING",
}

export enum Rating {
    VERY_LOW = 1,
    LOW = 2,
    MEDIUM = 3,
    HIGH = 4,
    VERY_HIGH = 5
}

export enum DiscountsTypes {
    SHOWN_DISCOUNT,
    COND_DISCOUNT,
    HIDDEN_DISCOUNT
}

export enum BuyingTypes {
    IMMEDIATE_PURCHASE,
    Auction,
    Lottery
}

export enum EventCode {
    STORE_OWNER_EVENTS,
    AUCTION_EVENTS,
    LOTTERY_EVENTS,
    USER_EVENTS,

    NEW_PURCHASE,
    STORE_CLOSED,
    STORE_OPENED,
    ASSIGNED_AS_STORE_OWNER,
    REMOVED_AS_STORE_OWNER,

    HIGHER_AUCTION_OFFER,
    AUCTION_WINNER,

    LOTTERY_DESTINATION_PRICE_REACHED,

    APPROVE_NEW_STORE_OWNER_REQUIRED,

    WATCH_STATISTICS
}

export enum Operators {
    OR = "OR",
    AND = "AND",
    XOR = "XOR"
}

export enum NotificationsType {
    RED = 0,
    BLUE = 1,
    GREEN = 2,
    ORANGE = 3,

    STATISTICS = 100
}

export enum WeekDays {
    SUNDAY = "Sunday",
    MONDAY = "Monday",
    TUESDAY = "Tuesday",
    WEDNESDAY = "Wednesday",
    THURSDAY = "Thursday",
    FRIDAY = "Friday",
    SATURDAY = "Saturday"
}