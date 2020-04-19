import {
  Item,
  Store,
  User,
  Credentials,
  SearchData,
  RATE,
  CreditCard,
  Discount,
  PERMISSION, Product,
} from "./types";
import * as DummyTypes from "../../__tests__/mocks/responses";

export interface Bridge {
  setReal?(real: Bridge): void;
  setToken(sessionToken: string): void;
  init(cred: Credentials): DummyTypes.IBoolResponse;
  removeItem(item: Item): DummyTypes.IResponse;
  removeStore(store: Store): DummyTypes.IResponse;
  createStore(store: Store): DummyTypes.IStoreResponse;
  addItemsToStore(store: Store, item: Item[]): DummyTypes.IResponse;
  addProductsToStore(store: Store, products: Product[]): DummyTypes.IResponse;
  removeProductsFromStore(store: Store, Products: Product[]): DummyTypes.IProductsRemovalResponse;
  viewStore(store: Store): DummyTypes.IStoreResponse;
  viewItem(item: Item): DummyTypes.IItemResponse;
  removeUser(user: User): DummyTypes.IResponse;
  getUserByName(user: User): DummyTypes.IUserResponse;
  login(credentials: Credentials): DummyTypes.IResponse;
  register(credentials: Credentials): DummyTypes.IResponse;
  logout(): DummyTypes.IResponse;
  getPurchaseHistory(): DummyTypes.IPurchaseHistoryResponse;
  search(input: SearchData): DummyTypes.ISearchResponse;
  rate(toRate: Store | Product, rate: RATE): DummyTypes.IResponse;
  addToCart(product: Product): DummyTypes.IResponse;
  watchCart(): DummyTypes.ICartResponse;
  checkout(creditCard: CreditCard): DummyTypes.ICheckoutResponse;
  setDiscountToStore(store: Store, discount: Discount): DummyTypes.IResponse;
  setDiscountToItem(
    store: Store,
    item: Item,
    discount: Discount
  ): DummyTypes.IResponse;
  startSession(): DummyTypes.ISessionResponse;
  assignManager(store: Store, credentials: Credentials): DummyTypes.IResponse;
  grantPermission(
    credentials: Credentials,
    permission: PERMISSION
  ): DummyTypes.IResponse;
  reset(): void;
}
