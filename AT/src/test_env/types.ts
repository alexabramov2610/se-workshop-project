import {ProductCategory} from "se-workshop-20-interfaces/dist/src/CommonInterface";

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
  category: ProductCategory;
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
  error?: any;
}

enum PERMISSION {
  WATCH_PURCHASES_HISTORY = "WATCH_PURCHASES_HISTORY",
  WATCH_USER_QUESTIONS = "WATCH_USER_QUESTIONS",
  REPLY_USER_QUESTIONS = "REPLY_USER_QUESTIONS",
  MODIFY_BUYING_METHODS = "MODIFY_BUYING_METHODS",
  MODIFY_DISCOUNT = "MODIFY_DISCOUNT",
  MANAGE_INVENTORY = "MANAGE_INVENTORY",
  CLOSE_STORE = "CLOSE_STORE",
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
  Cart,
  CreditCard,
  Discount,
};

