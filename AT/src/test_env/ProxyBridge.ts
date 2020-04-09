import { ServiceBridge } from "./exports";
import { Item, Response } from "./types";
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

  removeItem(id: string): Response {
    return this.real ? this.real.removeItem(id) : DummyResponse;
  }

  removeStore(id: string) {
    return this.real ? this.real.removeStore(id) : DummyResponse;
  }

  addStore(id: string, name: string, description: string): Response {
    return this.real
      ? this.real.addStore(id, name, description)
      : DummyStoreReposne;
  }

  addItemToStore(storeID: string, item: Item) {
    return this.real ? this.real.addItemToStore(storeID, item) : DummyResponse;
  }

  viewItem(itemID: string) {
    return this.real ? this.real.viewItem(itemID) : DummyItemReposne;
  }

  viewStore(storeID: string) {
    return this.real ? this.real.viewStore(storeID) : DummyStoreReposne;
  }

  getLoggedInUsers() {
    return this.real ? this.real.getLoggedInUsers() : DummyUsersReposne;
  }

  removeUser(username: string) {
    return this.real ? this.real.removeUser(username) : DummyResponse;
  }

  getUserByName(username: string) {
    return this.real ? this.real.getUserByName(username) : DummyUserReposne;
  }

  register(userName: string, password: string) {
    return this.real ? this.real.register(userName, password) : DummyResponse;
  }

  login(userName: string, password: string) {
    return this.real ? this.real.login(userName, password) : DummyResponse;
  }
}

export { ProxyBridge };
