import { Item, Response, Store, User, AuthDetails, BuyItem } from "./types";

export interface Bridge {
  removeItem(item: Item): Response;
  removeStore(store: Store): Response;
  addStore(store: Store): Response;
  addItemToStore(store: Store, item: Item): Response;
  viewStore(store: Store): Response;
  viewItem(item: Item): Response;
  getLoggedInUsers(): Response;
  removeUser(user: User): Response;
  getUserByName(user: User): Response;
  login(authDetails: AuthDetails): Response;
  register(authDetails: AuthDetails): Response;
  buyItem(tansaction: BuyItem): Response;
  logout(): Response;
  getPurchaseHistory(): Response;
}
