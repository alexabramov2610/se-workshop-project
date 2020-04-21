interface User {
  username: string;
}

interface ProductCatalogNumber {
  catalogNumber: number;
}

interface Item extends ProductCatalogNumber {
  id: number;
}

interface Product extends ProductCatalogNumber {
  name: string;
  price: number;
  category: CATEGORY;
}

interface CreditCard {
  ownerName: string;
  number: string;
  expirationMonth: string;
  expirationYear: string;
  cvv: number;
}

interface Cart {
  products: { product: Product; amount: number }[];
}

interface Discount {
  percents: number;
  timePeriod: TimePeriod;
}

interface TimePeriod {
  startTime: Date;
  endTime: Date;
}

interface Credentials {
  userName: string;
  password: string;
}

interface Store {
  name;
}

interface Inventory {
  items: Item[];
  quantities: number[];
}

interface Response {
  data: any;
  error?: string;
}

interface SearchData {
  input: string;
  filters?: Filters;
}

interface PriceRange {
  low: number;
  high: number;
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
  CLOTHING,
  Electronics,
  Hobbies,
  Home,
}

enum RATE {
  ZERO_STARS,
  ONE_STAR,
  TWO_STARS,
  THREE_STARS,
  FOUR_STARS,
  FIVE_STARS,
}

enum PERMISSION {
  WATCH_PURCHASES_HISTORY,
  WATCH_USER_QUESTIONS,
  REPLY_USER_QUESTIONS,
  MODIFY_BUYING_METHODS,
  MODIFY_DISCOUNT,
  MANAGE_INVENTORY,
  CLOSE_STORE,
}

export {
  Inventory,
  PERMISSION,
  User,
  Item,
  Store,
  Product,
  Response,
  Credentials,
  SearchData,
  Filters,
  CATEGORY,
  RATE,
  PriceRange,
  Cart,
  CreditCard,
  Discount,
};
