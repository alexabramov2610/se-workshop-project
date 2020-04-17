interface User {
  username: string;
}

interface ProductCatalogNumber {
  catalogNumber: number;
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
  items: { product: Product; amount: number }[];
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
  id: string;
  name: string;
  description: string;
  inventory?: inventory;
}

interface inventory {
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

export {
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
