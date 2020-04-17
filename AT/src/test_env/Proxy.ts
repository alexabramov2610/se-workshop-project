import { Bridge } from "./Bridge";
import {
  Item,
  Response,
  Store,
  User,
  Credentials,
  RATE,
  SearchData,
  Cart,
  CreditCard,
  Discount,
} from "./types";
import { DummyValues } from "../../__tests__/dummy_values/dummyValues";

let real: Bridge;

const Proxy: Bridge = {
  setReal(impl: Bridge) {
    real = impl;
  },
  setToken(token: string): void {
    return;
  },

  startSession() {
    return real && real.startSession
      ? real.startSession()
      : DummyValues.SessionResponse;
  },

  removeItem(item: Item) {
    return real ? real.removeItem(item) : DummyValues.Response;
  },

  removeStore(store: Store) {
    return real ? real.removeStore(store) : DummyValues.Response;
  },

  createStore(store: Store) {
    return real ? real.createStore(store) : DummyValues.StoreResponse;
  },

  addItemToStore(store: Store, item: Item) {
    return real ? real.addItemToStore(store, item) : DummyValues.Response;
  },

  viewItem(item: Item) {
    return real ? real.viewItem(item) : DummyValues.ItemResponse;
  },

  viewStore(store: Store) {
    return real ? real.viewStore(store) : DummyValues.StoreResponse;
  },

  getLoggedInUsers() {
    return real ? real.getLoggedInUsers() : DummyValues.UsersResponse;
  },

  removeUser(user: User) {
    return real ? real.removeUser(user) : DummyValues.Response;
  },

  getUserByName(user: User) {
    return real ? real.getUserByName(user) : DummyValues.UserResponse;
  },

  register(credentials: Credentials) {
    return real ? real.register(credentials) : DummyValues.Response;
  },

  login(credentials: Credentials) {
    return real ? real.login(credentials) : DummyValues.Response;
  },

  logout() {
    return real ? real.logout() : DummyValues.Response;
  },

  getPurchaseHistory() {
    return real
      ? real.getPurchaseHistory()
      : DummyValues.PurchaseHistoryResponse;
  },

  search(searchData: SearchData): Response {
    return real ? real.search(searchData) : DummyValues.SearchResponse;
  },

  rate(toRate: Store | Item, rate: RATE): Response {
    return real ? real.rate(toRate, rate) : DummyValues.SearchResponse;
  },

  addToCart(item: Item) {
    return real ? real.addToCart(item) : DummyValues.Response;
  },

  watchCart() {
    return real ? real.watchCart() : DummyValues.CartResponse;
  },

  checkout(creditCard: CreditCard) {
    return real ? real.checkout(creditCard) : DummyValues.CheckoutResponse;
  },

  setDiscountToStore(store: Store, discount: Discount) {
    return real
      ? real.setDiscountToStore(store, discount)
      : DummyValues.Response;
  },

  setDiscountToItem(store: Store, item: Item, discount: Discount) {
    return real
      ? real.setDiscountToItem(store, item, discount)
      : DummyValues.Response;
  },
  init(cred: Credentials) {
    return real && real.init ? real.init(cred) : DummyValues.Response;
  },
};

export { Proxy };
