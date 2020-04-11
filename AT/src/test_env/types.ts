interface User {
  username: string;
}

interface AuthDetails {
  identifier: string;
  password: string;
}

interface Item {
  id: string;
  name: string;
  price: number;
  description: string;
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

export { User, Item, Store, Response, AuthDetails };
