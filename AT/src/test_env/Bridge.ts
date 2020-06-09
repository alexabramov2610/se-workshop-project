import {
  Item,
  Store,
  User,
  Credentials,
  Discount,
  PERMISSION,
  Product,
} from "./types";
import * as DummyTypes from "./mocks/responses";
import { Req, Res } from "se-workshop-20-interfaces";

export interface Bridge {
  setReal?(real: Bridge): void;
  setToken(sessionToken: string): void;
  startSession(): Promise<DummyTypes.ISessionResponse>;
  login(credentials: Credentials, asAdmin?: boolean): Promise<DummyTypes.IResponse>;
  register(credentials: Credentials): Promise<DummyTypes.IResponse>;
  logout(): Promise<DummyTypes.IResponse>;
  init(cred: Credentials): Promise<DummyTypes.IBoolResponse>;
  // removeItem(item: Item): DummyTypes.IResponse;
  // removeStore(store: Store): DummyTypes.IResponse;
  createStore(store: Store): Promise<DummyTypes.IStoreResponse>;
  addItemsToStore(store: Store, item: Item[]): Promise<DummyTypes.IResponse>;
  addProductsToStore(store: Store, products: Product[]): Promise<DummyTypes.IResponse>;
  // removeProductsFromStore(
  //   store: Store,
  //   Products: Product[]
  // ): DummyTypes.IProductsRemovalResponse;
   viewStore(store: Store): Promise<DummyTypes.IViewStoreResponse>;
   viewProduct(store: Store, product: Product): Promise<Res.ProductInfoResponse>;
  // removeUser(user: User): DummyTypes.IResponse;
  // getUserByName(user: User): DummyTypes.IUserResponse;
  // getPurchaseHistory(): DummyTypes.IPurchaseHistoryResponse;
   search(input: Req.SearchRequest): Promise<DummyTypes.ISearchResponse>;
  // // rate(toRate: Store | Product, rate: RATE): DummyTypes.IResponse;
  addToCart(store: Store,product: Product,quantity: number): Promise<DummyTypes.IResponse>;
  watchCart(): Promise<Res.ViewCartRes>;
  
  // setDiscountToStore(store: Store, discount: Discount): DummyTypes.IResponse;
  // setDiscountToItem(
  //   store: Store,
  //   item: Item,
  //   discount: Discount
  // ): DummyTypes.IResponse;
  
  // assignManager(store: Store, credentials: Credentials): DummyTypes.IResponse;
  // grantPermissions(
  //   credentials: Credentials,
  //   store: Store,
  //   permissions: PERMISSION[]
  // ): DummyTypes.IResponse;
  // reset(): void;
  // assignStoreOwner(store: Store, user: User): DummyTypes.IResponse;
  // changeProductName(
  //   req: Partial<Req.ChangeProductNameRequest>
  // ): Res.BoolResponse;
  // changeProductPrice(
  //   req: Partial<Req.ChangeProductPriceRequest>
  // ): Res.BoolResponse;
  // watchPermissions(
  //   store: Store,
  //   credentials: Credentials
  // ): DummyTypes.IPermissionsResponse;
  // removeStoreManager(
  //   req: Partial<Req.RemoveStoreManagerRequest>
  // ): Res.BoolResponse;
  // removeManagerPermissions(
  //   req: Partial<Req.ChangeManagerPermissionRequest>
  // ): Res.BoolResponse;
  // viewStorePurchasesHistory(
  //   req: Partial<Req.ViewShopPurchasesHistoryRequest>
  // ): Res.ViewShopPurchasesHistoryResponse;
  viewUserPurchasesHistory(
    req: Partial<Req.ViewRUserPurchasesHistoryReq>
  ): Promise<Res.ViewRUserPurchasesHistoryRes>;
  purchase(req: Partial<Req.PurchaseRequest>): Promise<Res.PurchaseResponse>;
  saveProductToCart(req: Partial<Req.SaveToCartRequest>): Promise<Res.BoolResponse>;
  // removeProductFromCart(req: Req.RemoveFromCartRequest):Res.BoolResponse;
  // viewManagerPermissions(
  //   req: Partial<Req.ViewManagerPermissionRequest>
  // ): Res.ViewManagerPermissionResponse;
  // addDiscount(req: Req.AddDiscountRequest);
  pay(req: Req.PayRequest): Promise<Res.PaymentResponse>;
  // deliver(req: Req.DeliveryRequest): Res.DeliveryResponse;
  // setDiscountsPolicy(req: Req.SetDiscountsPolicyRequest): Res.BoolResponse;
  //  addDiscount  (req: Req.AddDiscountRequest): Res.BoolResponse;
  // removeProductDiscount(req: Req.RemoveDiscountRequest): Res.BoolResponse 
  // setPurchasePolicy(req: Req.SetPurchasePolicyRequest): Res.BoolResponse
  // viewPurchasePolicy(req: Req.ViewStorePurchasePolicyRequest): Res.ViewStorePurchasePolicyResponse

}
