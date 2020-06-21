import * as Types from "../..";
import * as Env from "../..";
import { ServiceFacade } from "service_layer";
import * as DummyTypes from "./mocks/responses";
import { Product, Store, Item, User, Credentials, PERMISSION } from "../..";
import { Req, Res } from "se-workshop-20-interfaces";
import { ISearchResponse } from "./mocks/responses";
import mongoose from "mongoose";
import {Request, SaveToCartRequest} from "se-workshop-20-interfaces/dist/src/Request";
import {IPublisher} from "se-workshop-20-interfaces/dist/src/CommonInterface";
import {
    BoolResponse,
    GetOwnersAssignedByResponse,
    WatchVisitorsInfoResponse
} from "se-workshop-20-interfaces/dist/src/Response";
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

   async reset() {
    await ServiceFacade.reset();
   },

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

//   interface SaveToCartRequest extends Request {
// //   body: {
// //     storeName: string;
// //     catalogNumber: number;
// //     amount: number;
// //   };
// // }


  async addToCart(
      store: Store,
      product: Product,
      quantity: number
  ): Promise<DummyTypes.IResponse> {
return  await this.saveProductToCart(wrapWithToken({storeName: store.name, catalogNumber:product.catalogNumber, amount:quantity}))

  },
  async removeProductsFromStore(store: Store, products: Product[]) {
    const catalogNumbers = products.map((p) => {
      return { catalogNumber: p.catalogNumber };
    });
    const removeReq = { storeName: store.name, products: catalogNumbers };
    const { data, error } = await ServiceFacade.removeProducts(
      wrapWithToken(removeReq)
    );
    return error ? { data, error: error.message } : { data, error: undefined };
  },

  async viewStore(store: Store) {
    const { data, error } = await ServiceFacade.viewStoreInfo(
      wrapWithToken({ storeName: store.name })
    );
    return error
      ? { data: undefined, error: error.message }
      : { data: data.info, error: undefined };
  },

 async assignStoreOwner(store: Store, user: User): Promise<DummyTypes.IResponse> {
    const { data, error } = await ServiceFacade.assignStoreOwner(
      wrapWithToken({ storeName: store.name, usernameToAssign: user.username })
    );
    const x = data || error;
    return error
      ? { data: undefined, error: error.message }
      : { data: data, error: undefined };
  },

  async assignManager(store: Store, credentials: Credentials): Promise<DummyTypes.IResponse> {
    const req = {
      storeName: store.name,
      usernameToAssign: credentials.userName,
    };
    const { data, error } = await ServiceFacade.assignStoreManager(
      wrapWithToken(req)
    );
    return error
      ? { data: undefined, error: error.message }
      : { data: data, error: undefined };
  },

 async grantPermissions(
    credentials: Credentials,
    store: Store,
    permissions: PERMISSION[]
  ): Promise<DummyTypes.IResponse> {
    const req = {
      managerToChange: credentials.userName,
      storeName: store.name,
      permissions: permissions,
    };
    const { data, error } = await ServiceFacade.addManagerPermissions(
      wrapWithToken(req)
    );
    return error
      ? { data: undefined, error: error.message }
      : { data: data, error: undefined };
  },

  async changeProductName(
    req: Partial<Req.ChangeProductNameRequest>
  ): Promise<Res.BoolResponse> {
    return await ServiceFacade.changeProductName(wrapWithToken(req.body));
  },

  async changeProductPrice(
    req: Partial<Req.ChangeProductPriceRequest>
  ): Promise<Res.BoolResponse> {
    return  await ServiceFacade.changeProductPrice(wrapWithToken(req.body));
  },

 // async saveProductToCart(req : SaveToCartRequest) {
 //    const { data, error } = await ServiceFacade.saveProductToCart(wrapWithToken(req));
 //    return error
 //      ? { data: undefined, error: error.message }
 //      : { data: data, error: undefined };
 //  },

  async removeStoreManager(
    req: Partial<Req.RemoveStoreManagerRequest>
  ): Promise<Res.BoolResponse> {
      const yx = 2;
      const x = await ServiceFacade.removeStoreManager(wrapWithToken(req.body));
      const y= req;
      return x;
  },
  async removeStoreOwner(
        req: Partial<Req.RemoveStoreOwnerRequest>
    ): Promise<Res.BoolResponse> {
        return await ServiceFacade.removeStoreOwner(wrapWithToken(req.body));
    },

  // removeManagerPermissions(
  //   req: Req.ChangeManagerPermissionRequest
  // ): Res.BoolResponse {
  //   return ServiceFacade.removeManagerPermissions(wrapWithToken(req.body));
  // },

 async viewStorePurchasesHistory(
    req: Req.ViewShopPurchasesHistoryRequest
  ): Promise<Res.ViewShopPurchasesHistoryResponse> {
    return await ServiceFacade.viewStorePurchasesHistory(wrapWithToken(req.body));
  },

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
  async  removeProductFromCart(req: Req.RemoveFromCartRequest):Promise<Res.BoolResponse>{
    return ServiceFacade.removeProductFromCart(wrapWithToken(req.body));

  },


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

 async viewManagerPermissions(
    req: Req.ViewManagerPermissionRequest
  ): Promise<Res.ViewManagerPermissionResponse> {
    return await ServiceFacade.viewManagerPermissions(wrapWithToken(req.body));
  },

  // addDiscount(req: Req.AddDiscountRequest) {
  //   const { data, error } = ServiceFacade.addDiscount(
  //     wrapWithToken(req.body)
  //   );
  //   return error
  //     ? { data: undefined, error: error }
  //     : { data: data, error: undefined };
  // },

  async pay(req: Req.PayRequest) {
    const { data, error } = await ServiceFacade.pay(wrapWithToken(req.body));
    return error
      ? { data: undefined, error: error }
      : { data: data, error: undefined };
  },

  async deliver(req: Req.DeliveryRequest) {
    const { data, error } = await ServiceFacade.deliver(wrapWithToken(req.body));
    return error
      ? { data: undefined, error: error }
      : { data: data, error: undefined };
  },

async  setDiscountsPolicy(req: Req.SetDiscountsPolicyRequest){
    const { data, error } =await ServiceFacade.setDiscountsPolicy(wrapWithToken(req.body));
    return error
      ? { data: undefined, error: error }
      : { data: data, error: undefined };
  },

  // removeProductDiscount(req: Req.RemoveDiscountRequest){
  //   const { data, error } = ServiceFacade.removeProductDiscount(wrapWithToken(req.body));
  //   return error
  //     ? { data: undefined, error: error }
  //     : { data: data, error: undefined }; 
  // },

    async  setPurchasePolicy(req: Req.SetPurchasePolicyRequest){
    const { data, error } = await ServiceFacade.setPurchasePolicy(wrapWithToken(req.body));
    return error
      ? { data: undefined, error: error }
      : { data: data, error: undefined };
  },

  async viewPurchasePolicy(req: Req.ViewStorePurchasePolicyRequest){
    const { data, error } = await ServiceFacade.viewPurchasePolicy(wrapWithToken(req.body));
    return error
      ? { data: undefined, error: error }
      : { data: data, error: undefined };
  },
    async setPublisher(publisher: IPublisher): Promise<void>{
      const x= publisher;
      await ServiceFacade.setPublisher(publisher);
    },

    async getVisitorsInfo(req: Partial<Req.WatchVisitorsInfoRequest>): Promise<WatchVisitorsInfoResponse>{
        return await ServiceFacade.watchVisitorsInfo(wrapWithToken(req.body));
    },
    async approveStoreOwner(req: Partial<Req.ApproveNewOwnerRequest>): Promise<BoolResponse>{
        return await ServiceFacade.approveStoreOwner(wrapWithToken(req.body));
    },
    async getOwnersAssignedBy(req: Partial<Req.GetOwnersAssignedByRequest>): Promise<GetOwnersAssignedByResponse>{
        return await ServiceFacade.getOwnersAssignedBy(wrapWithToken(req.body));
    },
    async initFromFile(req: Partial<Req.InitFromFileRequest>): Promise<Res.BoolResponse>{
        const reqWithToken = wrapWithToken(req.body)
        const x = reqWithToken
        return await ServiceFacade.initFromFile(reqWithToken);
    },

    async mockDeliverySys(): Promise<BoolResponse>{
      const req = {body: {system: "test"}}
        const reqWithToken = wrapWithToken(req.body)
        const x = reqWithToken
        const res = await ServiceFacade.setDeliverySystem(reqWithToken);
      return res;
    },
    async mockPaymentSys(): Promise<BoolResponse>{
        const req = {body: {system: "test"}}
        const reqWithToken = wrapWithToken(req.body)
        const x = reqWithToken
        return await ServiceFacade.setPaymentSystem(reqWithToken);
    }
};
