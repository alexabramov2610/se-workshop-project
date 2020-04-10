import { ServiceBridge } from "./exports";
import { Item, Response, Store, User, AuthDetails } from "./types";
import {
  DummyResponse,
  DummyItemReposne,
  DummyStoreReposne,
  DummyUsersReposne,
  DummyUserReposne,
} from "./dummy_values/dummyValues";

class ProxyBridge implements ServiceBridge {
  private real: ServiceBridge;

  setReal(adapter: ServiceBridge) {
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
}

export { ProxyBridge };
