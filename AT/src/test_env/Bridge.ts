import {
  Item,
  Store,
  User,
  Credentials,
  SearchData,
  RATE,
  CreditCard,
  Discount,
  PERMISSION,
  Product,
} from "./types";
import * as DummyTypes from "../../__tests__/mocks/responses";
import { ServiceFacade } from "service_layer";
import { Res, Req } from "service_layer/dist/src/service_facade/ServiceFacade";

export interface Bridge {
  setReal?(real: Bridge): void;
  setToken(sessionToken: string): void;
  init(cred: Credentials): DummyTypes.IBoolResponse;
  removeItem(item: Item): DummyTypes.IResponse;
  removeStore(store: Store): DummyTypes.IResponse;
  createStore(store: Store): DummyTypes.IStoreResponse;
  addItemsToStore(store: Store, item: Item[]): DummyTypes.IResponse;
  addProductsToStore(store: Store, products: Product[]): DummyTypes.IResponse;
  removeProductsFromStore(
    store: Store,
    Products: Product[]
  ): DummyTypes.IProductsRemovalResponse;
  viewStore(store: Store): DummyTypes.IViewStoreResponse;
  viewProduct(store: Store, product: Product): Res.ProductInfoResponse;
  removeUser(user: User): DummyTypes.IResponse;
  getUserByName(user: User): DummyTypes.IUserResponse;
  login(credentials: Credentials): DummyTypes.IResponse;
  register(credentials: Credentials): DummyTypes.IResponse;
  logout(): DummyTypes.IResponse;
  getPurchaseHistory(): DummyTypes.IPurchaseHistoryResponse;
  search(input: SearchData): DummyTypes.ISearchResponse;
  rate(toRate: Store | Product, rate: RATE): DummyTypes.IResponse;
  addToCart(store: Store, product: Product, quantity: number): DummyTypes.IResponse;
  watchCart(): Res.ViewCartRes;
  checkout(creditCard: CreditCard): DummyTypes.ICheckoutResponse;
  setDiscountToStore(store: Store, discount: Discount): DummyTypes.IResponse;
  setDiscountToItem(
    store: Store,
    item: Item,
    discount: Discount
  ): DummyTypes.IResponse;
  startSession(): DummyTypes.ISessionResponse;
  assignManager(store: Store, credentials: Credentials): DummyTypes.IResponse;
  grantPermissions(
    credentials: Credentials,
    store: Store,
    permissions: PERMISSION[]
  ): DummyTypes.IResponse;
  reset(): void;
  assignStoreOwner(store: Store, user: User): DummyTypes.IResponse;
  changeProductName(
    req: Partial<ServiceFacade.Req.ChangeProductNameRequest>
  ): ServiceFacade.Res.BoolResponse;
  changeProductPrice(
    req: Partial<ServiceFacade.Req.ChangeProductPriceRequest>
  ): ServiceFacade.Res.BoolResponse;
  watchPermissions(store: Store, credentials: Credentials): DummyTypes.IPermissionsResponse;
  removeStoreManager(req: Partial<ServiceFacade.Req.RemoveStoreManagerRequest>): ServiceFacade.Res.BoolResponse;
  removeManagerPermissions(req: ServiceFacade.Req.ChangeManagerPermissionRequest): ServiceFacade.Res.BoolResponse;
  viewStorePurchasesHistory(req : ServiceFacade.Req.ViewShopPurchasesHistoryRequest ): ServiceFacade.Res.ViewShopPurchasesHistoryResponse;
  viewUserPurchasesHistory(req : ServiceFacade.Req.ViewRUserPurchasesHistoryReq ): ServiceFacade.Res.ViewRUserPurchasesHistoryRes;
  purchase(req : ServiceFacade.Req.PurchaseRequest ): ServiceFacade.Res.PurchaseResponse;
}
