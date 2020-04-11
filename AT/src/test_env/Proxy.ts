import { Bridge } from "../";
import { Item, Response, Store, User, AuthDetails, BuyItem } from "./types";
import {
  DummyResponse,
  DummyItemReposne,
  DummyStoreReposne,
  DummyUsersReposne,
  DummyUserReposne,
  DummyBuyReposne,
  DummyPurchaseHistoryResponse,
} from "../../__tests__/dummy_values/dummyValues";

class Proxy implements Bridge {
  private real: Bridge;

  setReal(adapter: Bridge) {
    this.real = adapter;
  }

  removeItem(item: Item): Response {
    return this.real ? this.real.removeItem(item) : DummyResponse;
  }

  removeStore(store: Store) {
    return this.real ? this.real.removeStore(store) : DummyResponse;
  }

  addStore(store: Store) {
    return this.real ? this.real.addStore(store) : DummyStoreReposne;
  }

  addItemToStore(store: Store, item: Item) {
    return this.real ? this.real.addItemToStore(store, item) : DummyResponse;
  }

  viewItem(item: Item) {
    return this.real ? this.real.viewItem(item) : DummyItemReposne;
  }

  viewStore(store: Store) {
    return this.real ? this.real.viewStore(store) : DummyStoreReposne;
  }

  getLoggedInUsers() {
    return this.real ? this.real.getLoggedInUsers() : DummyUsersReposne;
  }

  removeUser(user: User) {
    return this.real ? this.real.removeUser(user) : DummyResponse;
  }

  getUserByName(user: User) {
    return this.real ? this.real.getUserByName(user) : DummyUserReposne;
  }

  register(authDetails: AuthDetails) {
    return this.real ? this.real.register(authDetails) : DummyResponse;
  }

  login(authDetails: AuthDetails) {
    return this.real ? this.real.login(authDetails) : DummyResponse;
  }

  logout() {
    return this.real ? this.real.logout() : DummyResponse;
  }

  buyItem(transaction: BuyItem) {
    return this.real ? this.real.buyItem(transaction) : DummyBuyReposne;
  }
  getPurchaseHistory() {
    return this.real
      ? this.real.getPurchaseHistory()
      : DummyPurchaseHistoryResponse;
  }
}

export { Proxy };
