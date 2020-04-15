interface User {
    username: string
}

interface CreditCard {
    ownerName: string,
    number: string,
    expirationMonth: string,
    expirationYear: string,
    cvv: number
}

interface Cart {
    items: Item[],
    quantities: number[]
}

interface Discount {
    percents: number,
    timePeriod: TimePeriod
}

interface TimePeriod {
    startTime: Date,
    endTime: Date
}

interface Credentials {
    userName: string,
    password: string
}

interface Item {
    id: string,
    name: string,
    price: number,
    category: CATEGORY,
    description: string
}

interface BuyItem {
    item: Item,
    store: Store
}

interface Store {
    id: string,
    name: string,
    description: string,
    inventory?: inventory
}

interface inventory {
    items: Item[],
    quantities: number[],
}

interface Response {
    data: any,
    error?: string
}

interface SearchData {
    input: string,
    filters?: Filters,
}

interface PriceRange {
    low: number,
    high: number,
}

interface Filters {
    category?: CATEGORY;
    priceRange?: PriceRange;
    storeRate?: RATE;
    itemRate?: RATE;
}

enum CATEGORY {
    ELECTRONICS,
    HOME_AND_OFFICE,
    CLOTHING
}

enum RATE {
    ZERO_STARS,
    ONE_STAR,
    TWO_STARS,
    THREE_STARS,
    FOUR_STARS,
    FIVE_STARS
}

export {
    User,
    Item,
    Store,
    Response,
    Credentials,
    BuyItem,
    SearchData,
    Filters,
    CATEGORY,
    RATE,
    PriceRange,
    Cart,
    CreditCard,
    Discount
};
