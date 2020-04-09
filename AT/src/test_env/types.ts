interface User {
  userName: string;
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
  success: boolean;
  data: any;
  error: string;
}

export { User, Item, Store, Response };
