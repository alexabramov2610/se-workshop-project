interface User {
    username: string;
}

interface Credentials {
    userName: string;
    password: string;
}

interface Item {
    id: string;
    name: string;
    price: number;
    category: CATEGORY;
    description: string;
}

interface BuyItem {
    item: Item;
    store: Store;
}

interface Store {
    id: string;
    name: string;
    description: string;
}

interface Response {
    data: any;
    error?: string;
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
    category?: CATEGORY,
    priceRange?: PriceRange
    storeRate?: RATE
    itemRate?: RATE
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
    THREES_STARS,
    FOUR_STARS,
    FIVE_STARS
}

export {User, Item, Store, Response, Credentials, BuyItem, SearchData, Filters, CATEGORY, RATE, PriceRange};
