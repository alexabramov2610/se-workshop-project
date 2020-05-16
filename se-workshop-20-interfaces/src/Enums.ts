export enum TradingSystemState {
    CLOSED,
    OPEN
}

export enum ManagementPermission {
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

}

export enum Operators {
    OR,
    AND,
    XOR,
}

export enum NotificationsType {
    RED,
    BLUE,
    GREEN,
    ORANGE
}

export enum WeekDays {
    SUNDAY = 1,
    MONDAY,
    TUESDAY,
    WEDNESDAY,
    THURSDAY,
    FRIDAY,
    SATURDAY
}