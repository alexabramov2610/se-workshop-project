interface User {
  username: string;
}

interface AuthDetails {
  userName: string;
  password: string;
}
interface Item {
  id: string;
  name: string;
  price: number;
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

export { User, Item, Store, Response, AuthDetails, BuyItem };
