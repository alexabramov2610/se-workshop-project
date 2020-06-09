// import { Bridge } from "./Bridge";
// import { Adapter } from "./Adapter";
// import {
//   Item,
//   Response,
//   Store,
//   User,
//   Credentials,
//   Discount,
//   PERMISSION,
//   Product,
// } from "./types";
// import {
//   DummyValues,
//   IProductsRemovalResponse,
//   IResponse,
// } from "./mocks/responses";
// import { Res, Req } from "se-workshop-20-interfaces";
// import { Operators } from "se-workshop-20-interfaces/dist/src/Enums";
//
// let real: Partial<Bridge> = Adapter;
//
// const Proxy: Bridge = {
//   setReal(impl: Bridge) {
//     real = impl;
//   },
//
//   setToken(sessionToken: string): void {
//     return real && real.setToken ? real.setToken(sessionToken) : null;
//   },
//
//   init(cred: Credentials) {
//     return real.init ? real.init(cred) :new Promise((resolve,reject) => resolve( DummyValues.Response));
//   },
//   startSession() {
//     return real.startSession
//       && real.startSession()
//       // :new Promise((resolve,reject) => resolve(DummyValues.SessionResponse));
//   },
//   register(credentials: Credentials) {
//     return real.register ? real.register(credentials) : new Promise((resolve,reject) => resolve(DummyValues.Response));
//   },
//
//   login(credentials: Credentials, asAdmin: boolean = false) {
//     return real.login ? real.login(credentials, asAdmin) :new Promise((resolve,reject) => resolve( DummyValues.Response));
//   },
//
//   logout() {
//     return real.logout ? real.logout() : new Promise((resolve,reject) => resolve(DummyValues.Response));
//   },
//
// //   removeItem(item: Item) {
// //     return real.removeItem ? real.removeItem(item) : DummyValues.Response;
// //   },
//
// //   removeStore(store: Store) {
// //     return real.removeStore ? real.removeStore(store) : DummyValues.Response;
// //   },
//
// //   createStore(store: Store) {
// //     return real.createStore
// //       ? real.createStore(store)
// //       : DummyValues.StoreResponse;
// //   },
//
// //   addItemsToStore(store: Store, items: Item[]) {
// //     return real.addItemsToStore
// //       ? real.addItemsToStore(store, items)
// //       : DummyValues.Response;
// //   },
//
// //   viewProduct(store: Store, product: Product) {
// //     return real.viewProduct
// //       ? real.viewProduct(store, product)
// //       : DummyValues.ViewProductResponse;
// //   },
//
// //   viewStore(store: Store) {
// //     return real.viewStore
// //       ? real.viewStore(store)
// //       : DummyValues.ViewStoreResponse;
// //   },
//
// //   removeUser(user: User) {
// //     return real.removeUser ? real.removeUser(user) : DummyValues.Response;
// //   },
//
// //   getUserByName(user: User) {
// //     return real.getUserByName
// //       ? real.getUserByName(user)
// //       : DummyValues.UserResponse;
// //   },
//
//
// //   getPurchaseHistory() {
// //     return real.getPurchaseHistory
// //       ? real.getPurchaseHistory()
// //       : DummyValues.PurchaseHistoryResponse;
// //   },
//
// //   search(searchData: Req.SearchRequest): Response {
// //     return real.search ? real.search(searchData) : DummyValues.SearchResponse;
// //   },
//
// //   // rate(toRate: Store | Product, rate: RATE): Response {
// //   //   return real.rate ? real.rate(toRate, rate) : DummyValues.SearchResponse;
// //   // },
//
// //   addToCart(store: Store, product: Product, quantity: number) {
// //     return real.addToCart
// //       ? real.addToCart(store, product, quantity)
// //       : DummyValues.Response;
// //   },
//
// //   watchCart() {
// //     return real.watchCart ? real.watchCart() : DummyValues.CartResponse;
// //   },
//
// //   removeProductFromCart(req: Req.RemoveFromCartRequest){
// //     return real.removeProductFromCart? real.removeProductFromCart(req): DummyValues.Response;
//
// //   },
//
// //   // addDiscount(req: Req.AddDiscountRequest): Res.AddDiscountResponse {
// //   //   return real.addDiscount
// //   //     ? real.addDiscount(req)
// //   //     : {
// //   //         data: {
// //   //           result: true,
// //   //           discountID: "5646-435U3%^13513-5165",
// //   //         },
// //   //       };
// //   // },
//
// //   setDiscountToStore(store: Store, discount: Discount) {
// //     return real.setDiscountToStore
// //       ? real.setDiscountToStore(store, discount)
// //       : DummyValues.Response;
// //   },
//
// //   reset() {
// //     return real.reset ? real.reset() : null;
// //   },
//
// //   setDiscountToItem(store: Store, item: Item, discount: Discount) {
// //     return real.setDiscountToItem
// //       ? real.setDiscountToItem(store, item, discount)
// //       : DummyValues.Response;
// //   },
//
//
// //   assignManager(store: Store, credentials: Credentials): IResponse {
// //     return real.assignManager
// //       ? real.assignManager(store, credentials)
// //       : DummyValues.Response;
// //   },
//
// //   grantPermissions(
// //     credentials: Credentials,
// //     store: Store,
// //     permission: PERMISSION[]
// //   ): IResponse {
// //     return real.grantPermissions
// //       ? real.grantPermissions(credentials, store, permission)
// //       : DummyValues.Response;
// //   },
//
// //   addProductsToStore(store: Store, products: Product[]): IResponse {
// //     return real.addProductsToStore
// //       ? real.addProductsToStore(store, products)
// //       : DummyValues.Response;
// //   },
//
// //   removeProductsFromStore(
// //     store: Store,
// //     products: Product[]
// //   ): IProductsRemovalResponse {
// //     return real.removeProductsFromStore
// //       ? real.removeProductsFromStore(store, products)
// //       : DummyValues.ProductsRemovalResponse;
// //   },
//
// //   assignStoreOwner(store: Store, user: User): IResponse {
// //     return real.assignStoreOwner
// //       ? real.assignStoreOwner(store, user)
// //       : { data: {} };
// //   },
//
// //   changeProductName(
// //     req: Partial<Req.ChangeProductNameRequest>
// //   ): Res.BoolResponse {
// //     return real.changeProductName
// //       ? real.changeProductName(req)
// //       : { data: { result: true } };
// //   },
// //   changeProductPrice(
// //     req: Partial<Req.ChangeProductPriceRequest>
// //   ): Res.BoolResponse {
// //     return real.changeProductName
// //       ? real.changeProductPrice(req)
// //       : { data: { result: true } };
// //   },
//
// //   watchPermissions(store: Store, credentials: Credentials) {
// //     return real.watchPermissions(store, credentials)
// //       ? real.watchPermissions(store, credentials)
// //       : DummyValues.PermissionsResponse;
// //   },
// //   removeStoreManager(
// //     req: Partial<Req.RemoveStoreManagerRequest>
// //   ): Res.BoolResponse {
// //     return real.removeStoreManager
// //       ? real.removeStoreManager(req)
// //       : { data: { result: false } };
// //   },
// //   removeManagerPermissions(
// //     req: Req.ChangeManagerPermissionRequest
// //   ): Res.BoolResponse {
// //     return real.removeManagerPermissions
// //       ? real.removeManagerPermissions(req)
// //       : { data: { result: true } };
// //   },
// //   viewUserPurchasesHistory(
// //     req: Req.ViewRUserPurchasesHistoryReq
// //   ): Res.ViewRUserPurchasesHistoryRes {
// //     return real.viewUserPurchasesHistory
// //       ? real.viewUserPurchasesHistory(req)
// //       : { data: { result: false, receipts: [] } };
// //   },
// //   viewStorePurchasesHistory(
// //     req: Req.ViewShopPurchasesHistoryRequest
// //   ): Res.ViewShopPurchasesHistoryResponse {
// //     return real.viewUserPurchasesHistory
// //       ? real.viewStorePurchasesHistory(req)
// //       : { data: { result: false, receipts: [] } };
// //   },
// //   purchase(req: Req.PurchaseRequest): Res.PurchaseResponse {
// //     return real.purchase ? real.purchase(req) : { data: { result: false } };
// //   },
// //   saveProductToCart(req: Req.SaveToCartRequest): Res.BoolResponse {
// //     return real.saveProductToCart && real.saveProductToCart(req);
// //   },
// //   viewManagerPermissions(
// //     req: Req.ViewManagerPermissionRequest
// //   ): Res.ViewManagerPermissionResponse {
// //     return real.viewManagerPermissions && real.viewManagerPermissions(req);
// //   },
// //   pay(req: Req.PayRequest): Res.PaymentResponse {
// //     return real.pay
// //       ? real.pay(req)
// //       : {
// //           data: {
// //             result: true,
// //             payment: { lastCC4: "5555", totalCharged: 80 },
// //           },
// //         };
// //   },
//
// //   deliver(req: Req.DeliveryRequest): Res.DeliveryResponse {
// //     return real.deliver ? real.deliver(req) : { data: { result: true } };
// //   },
// // //discounts
//
// // setDiscountsPolicy(req: Req.SetDiscountsPolicyRequest): Res.BoolResponse{
// //   return real.setDiscountsPolicy ? real.setDiscountsPolicy(req) : { data: { result: true } }
// // },
//
// // addDiscount  (req: Req.AddDiscountRequest): Res.BoolResponse{
// //   return real.addDiscount ? real.addDiscount(req) : { data: { result: true } }
// // },
// // removeProductDiscount(req: Req.RemoveDiscountRequest): Res.BoolResponse {
// //   return real.removeProductDiscount ? real.removeProductDiscount(req) : { data: { result: true } }
//
// // },
// // setPurchasePolicy(req: Req.SetPurchasePolicyRequest): Res.BoolResponse{
// //   return real.setPurchasePolicy ? real.setPurchasePolicy(req) : { data: { result: true } }
//
// // },
// // viewPurchasePolicy(req: Req.SetPurchasePolicyRequest): Res.ViewStorePurchasePolicyResponse{
// //   return real.viewPurchasePolicy ? real.viewPurchasePolicy(req) : {data:{policy:{policy:[
// //     {operator:Operators.OR,policy:{productPolicy:{catalogNumber: 1,minAmount: 2, maxAmount: 4}}}
// //         ]}}}
// // }
//
//
//
//
//
//
// };
//
// export { Proxy };
