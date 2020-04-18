import { Bridge } from "./Bridge";
import { Adapter } from "./Adapter";
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
  PERMISSION,
} from "./types";
import {
  DummyValues,
  IResponse,
} from "../../__tests__/mocks/responses";

let real: Partial<Bridge> = Adapter;

const Proxy: Bridge = {

  setReal(impl: Bridge) {
    real = impl;
  },

  setToken(sessionToken: string): void {
    return real && real.setToken ? real.setToken(sessionToken) : null;
  },

  startSession() {
    return real.startSession
      ? real.startSession()
      : DummyValues.SessionResponse;
  },

  removeItem(item: Item) {
    return real.removeItem ? real.removeItem(item) : DummyValues.Response;
  },

  removeStore(store: Store) {
    return real.removeStore ? real.removeStore(store) : DummyValues.Response;
  },

  createStore(store: Store) {
    return real.createStore
      ? real.createStore(store)
      : DummyValues.StoreResponse;
  },

  addItemToStore(store: Store, item: Item) {
    return real.addItemToStore
      ? real.addItemToStore(store, item)
      : DummyValues.Response;
  },

  viewItem(item: Item) {
    return real.removeItem ? real.viewItem(item) : DummyValues.ItemResponse;
  },

  viewStore(store: Store) {
    return real.viewStore ? real.viewStore(store) : DummyValues.StoreResponse;
  },

  removeUser(user: User) {
    return real.removeUser ? real.removeUser(user) : DummyValues.Response;
  },

  getUserByName(user: User) {
    return real.getUserByName
      ? real.getUserByName(user)
      : DummyValues.UserResponse;
  },

  register(credentials: Credentials) {
    return real.register ? real.register(credentials) : DummyValues.Response;
  },

  login(credentials: Credentials) {
    return real.login ? real.login(credentials) : DummyValues.Response;
  },

  logout(userName: string) {
    return real.logout ? real.logout(userName) : DummyValues.Response;
  },

  getPurchaseHistory() {
    return real.getPurchaseHistory
      ? real.getPurchaseHistory()
      : DummyValues.PurchaseHistoryResponse;
  },

  search(searchData: SearchData): Response {
    return real.search ? real.search(searchData) : DummyValues.SearchResponse;
  },

  rate(toRate: Store | Item, rate: RATE): Response {
    return real.rate ? real.rate(toRate, rate) : DummyValues.SearchResponse;
  },

  addToCart(item: Item) {
    return real.addToCart ? real.addToCart(item) : DummyValues.Response;
  },

  watchCart() {
    return real.watchCart ? real.watchCart() : DummyValues.CartResponse;
  },

  checkout(creditCard: CreditCard) {
    return real.checkout
      ? real.checkout(creditCard)
      : DummyValues.CheckoutResponse;
  },

  setDiscountToStore(store: Store, discount: Discount) {
    return real.setDiscountToStore
      ? real.setDiscountToStore(store, discount)
      : DummyValues.Response;
  },
  reset() {
    return real.reset ? real.reset() : null;
  },
  setDiscountToItem(store: Store, item: Item, discount: Discount) {
    return real.setDiscountToItem
      ? real.setDiscountToItem(store, item, discount)
      : DummyValues.Response;
  },

  init(cred: Credentials) {
    return real.init ? real.init(cred) : DummyValues.Response;
  },

  assignManager(store: Store, credentials: Credentials): IResponse {
    return undefined;
  },

  grantPermission(credentials: Credentials, permission: PERMISSION): IResponse {
    return undefined;
  },
};

export { Proxy };
