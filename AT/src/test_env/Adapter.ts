import * as Types from "../..";
import * as Env from "../..";
import { ServiceFacade } from "service_layer";
import * as DummyTypes from "./mocks/responses";
import { Product, Store, Item, User, Credentials, PERMISSION } from "../..";
import { Req, Res } from "se-workshop-20-interfaces";
import { ISearchResponse } from "./mocks/responses";
import mongoose from "mongoose";
import {SaveToCartRequest} from "se-workshop-20-interfaces/dist/src/Request";
let token;
const wrapWithToken = (req: any) => {
  return { body: { ...req }, token };
};




export const Adapter: any = {
  setToken(sessionToken: string): void {
    token = sessionToken;
  },

  async startSession(): Promise<DummyTypes.ISessionResponse> {
    const token: string = await ServiceFacade.startNewSession();
    const sss = token;
    return { data: { token: token } };
  },

  async init(credentials: Types.Credentials): Promise<DummyTypes.IResponse> {
    const initReq = {
      firstAdminName: credentials.userName,
      firstAdminPassword: credentials.password,
    };
    const { data, error } = await ServiceFacade.systemInit(wrapWithToken(initReq));
    return error
      ? { data: undefined, error: error.message }
      : { data: data, error: undefined };
  },

  // reset() {
  //   ServiceFacade.reset();
  // },

  async register(credentials: Types.Credentials): Promise<DummyTypes.IResponse> {
    const reqCred = {
      username: credentials.userName,
      password: credentials.password,
    };
    const response = await ServiceFacade.registerUser(wrapWithToken(reqCred));
    return response.error
      ? { data: undefined, error: response.error.message }
      : { data: response.data };
  },

  async login(
    credentials: Types.Credentials,
    asAdmin: boolean = false
  ): Promise<DummyTypes.IResponse> {
    const reqCred = {
      username: credentials.userName,
      password: credentials.password,
      asAdmin
    };
    const { data, error } = await ServiceFacade.loginUser(wrapWithToken(reqCred));
    return error
      ? { data: undefined, error: error.message }
      : { data: data, error: undefined };
  },

  async logout(): Promise<DummyTypes.IResponse> {
    const { data, error } = await ServiceFacade.logoutUser(wrapWithToken({}));
    return error
      ? { data: undefined, error: error.message }
      : { data: data, error: undefined };
  },

  async createStore(store: Types.Store): Promise<DummyTypes.IStoreResponse> {
    const req = wrapWithToken({ storeName: store.name,description:'blabla' });
    const { error, data } = await ServiceFacade.createStore(req);
    if (error || !data.result) return { data: undefined, error: error.message };
    else if (data.result) return { data: { name: store.name } };
  },

  async  addItemsToStore(store: Store, items: Item[]): Promise<DummyTypes.IResponse> {
    const req = { storeName: store.name, items };
    const { data, error } = await ServiceFacade.addItems(wrapWithToken(req));
    return error
      ? { data: undefined, error: error.message }
      : { data: data, error: undefined };
  },

  async addProductsToStore(store: Store, products: Product[]): Promise<DummyTypes.IResponse> {
    const req = { storeName: store.name, products: products };
    const { data, error } = await ServiceFacade.addNewProducts(wrapWithToken(req));
    return error
      ? { data: undefined, error: error.message }
      : { data: data, error: undefined };
  },

  // removeProductsFromStore(store: Store, products: Product[]) {
  //   const catalogNumbers = products.map((p) => {
  //     return { catalogNumber: p.catalogNumber };
  //   });
  //   const removeReq = { storeName: store.name, products: catalogNumbers };
  //   const { data, error } = ServiceFacade.removeProducts(
  //     wrapWithToken(removeReq)
  //   );
  //   return error ? { data, error: error.message } : { data, error: undefined };
  // },

  async viewStore(store: Store) {
    const { data, error } = await ServiceFacade.viewStoreInfo(
      wrapWithToken({ storeName: store.name })
    );
    return error
      ? { data: undefined, error: error.message }
      : { data: data.info, error: undefined };
  },

  // assignStoreOwner(store: Store, user: User): DummyTypes.IResponse {
  //   const { data, error } = ServiceFacade.assignStoreOwner(
  //     wrapWithToken({ storeName: store.name, usernameToAssign: user.username })
  //   );
  //   return error
  //     ? { data: undefined, error: error.message }
  //     : { data: data, error: undefined };
  // },

  // assignManager(store: Store, credentials: Credentials): DummyTypes.IResponse {
  //   const req = {
  //     storeName: store.name,
  //     usernameToAssign: credentials.userName,
  //   };
  //   const { data, error } = ServiceFacade.assignStoreManager(
  //     wrapWithToken(req)
  //   );
  //   return error
  //     ? { data: undefined, error: error.message }
  //     : { data: data, error: undefined };
  // },

  // grantPermissions(
  //   credentials: Credentials,
  //   store: Store,
  //   permissions: PERMISSION[]
  // ): DummyTypes.IResponse {
  //   const req = {
  //     managerToChange: credentials.userName,
  //     storeName: store.name,
  //     permissions: permissions,
  //   };
  //   const { data, error } = ServiceFacade.addManagerPermissions(
  //     wrapWithToken(req)
  //   );
  //   return error
  //     ? { data: undefined, error: error.message }
  //     : { data: data, error: undefined };
  // },

  // changeProductName(
  //   req: Partial<Req.ChangeProductNameRequest>
  // ): Res.BoolResponse {
  //   return ServiceFacade.changeProductName(wrapWithToken(req.body));
  // },

  // changeProductPrice(
  //   req: Partial<Req.ChangeProductPriceRequest>
  // ): Res.BoolResponse {
  //   return ServiceFacade.changeProductPrice(wrapWithToken(req.body));
  // },

 // async saveProductToCart(req : SaveToCartRequest) {
 //    const { data, error } = await ServiceFacade.saveProductToCart(wrapWithToken(req));
 //    return error
 //      ? { data: undefined, error: error.message }
 //      : { data: data, error: undefined };
 //  },

  // removeStoreManager(
  //   req: Partial<Req.RemoveStoreManagerRequest>
  // ): Res.BoolResponse {
  //   return ServiceFacade.removeStoreManager(wrapWithToken(req.body));
  // },

  // removeManagerPermissions(
  //   req: Req.ChangeManagerPermissionRequest
  // ): Res.BoolResponse {
  //   return ServiceFacade.removeManagerPermissions(wrapWithToken(req.body));
  // },

  // viewStorePurchasesHistory(
  //   req: Req.ViewShopPurchasesHistoryRequest
  // ): Res.ViewShopPurchasesHistoryResponse {
  //   return ServiceFacade.viewStorePurchasesHistory(wrapWithToken(req.body));
  // },

  async viewUserPurchasesHistory(
    req: Req.ViewRUserPurchasesHistoryReq
  ): Promise<Res.ViewRUserPurchasesHistoryRes> {
    return await ServiceFacade.viewRegisteredUserPurchasesHistory(
      wrapWithToken(req.body)
    );
  },

  async viewProduct(store: Store, product: Product): Promise<Res.ProductInfoResponse> {
    const { data, error } = await ServiceFacade.viewProductInfo(
      wrapWithToken({
        storeName: store.name,
        catalogNumber: product.catalogNumber,
      })
    );
    return error
      ? { data: undefined, error: error }
      : { data: data, error: undefined };
  },

  async purchase(req: Req.PurchaseRequest): Promise<Res.PurchaseResponse> {
    return await ServiceFacade.purchase(wrapWithToken(req.body));
  },
  // removeProductFromCart(req: Req.RemoveFromCartRequest):Res.BoolResponse{
  //   return ServiceFacade.removeProductFromCart(wrapWithToken(req.body));

  // },


  async watchCart(): Promise<Res.ViewCartRes> {
    const { data, error } = await ServiceFacade.viewCart(wrapWithToken({}));
    return error
      ? { data: undefined, error: error }
      : { data: data, error: undefined };
  },



  async saveProductToCart(req: Req.SaveToCartRequest): Promise<Res.BoolResponse> {
    return await  ServiceFacade.saveProductToCart(wrapWithToken(req.body));
  },

  async search(searchData: Req.SearchRequest): Promise<ISearchResponse> {
    const { data, error } = await ServiceFacade.search(
      wrapWithToken(searchData.body)
    );
    return error
      ? { data: undefined, error: error.message }
      : { data: data, error: undefined };
  },

  // viewManagerPermissions(
  //   req: Req.ViewManagerPermissionRequest
  // ): Res.ViewManagerPermissionResponse {
  //   return ServiceFacade.viewManagerPermissions(wrapWithToken(req.body));
  // },

  // addDiscount(req: Req.AddDiscountRequest) {
  //   const { data, error } = ServiceFacade.addDiscount(
  //     wrapWithToken(req.body)
  //   );
  //   return error
  //     ? { data: undefined, error: error }
  //     : { data: data, error: undefined };
  // },

  // pay(req: Req.PayRequest) {
  //   const { data, error } = ServiceFacade.pay(wrapWithToken(req.body));
  //   return error
  //     ? { data: undefined, error: error }
  //     : { data: data, error: undefined };
  // },

  // deliver(req: Req.DeliveryRequest) {
  //   const { data, error } = ServiceFacade.deliver(wrapWithToken(req.body));
  //   return error
  //     ? { data: undefined, error: error }
  //     : { data: data, error: undefined };
  // },

  // setDiscountsPolicy(req: Req.SetDiscountsPolicyRequest){
  //   const { data, error } = ServiceFacade.setDiscountsPolicy(wrapWithToken(req.body));
  //   return error
  //     ? { data: undefined, error: error }
  //     : { data: data, error: undefined }; 
  // },

  // removeProductDiscount(req: Req.RemoveDiscountRequest){
  //   const { data, error } = ServiceFacade.removeProductDiscount(wrapWithToken(req.body));
  //   return error
  //     ? { data: undefined, error: error }
  //     : { data: data, error: undefined }; 
  // },

  // setPurchasePolicy(req: Req.SetPurchasePolicyRequest){
  //   const { data, error } = ServiceFacade.setPurchasePolicy(wrapWithToken(req.body));
  //   return error
  //     ? { data: undefined, error: error }
  //     : { data: data, error: undefined }; 
  // },

  // viewPurchasePolicy(req: Req.ViewStorePurchasePolicyRequest){
  //   const { data, error } = ServiceFacade.viewPurchasePolicy(wrapWithToken(req.body));
  //   return error
  //     ? { data: undefined, error: error }
  //     : { data: data, error: undefined }; 
  // }


};
