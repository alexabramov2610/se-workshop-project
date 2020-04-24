import * as Types from "../..";
import * as Env from "../..";
import { ServiceFacade } from "service_layer";
import * as DummyTypes from "../../__tests__/mocks/responses";
import { Product, Store, Item, User, Credentials, PERMISSION } from "../..";
import { changeProductName, Req } from "service_layer/dist/src/service_facade/ServiceFacade";

let token;
const wrapWithToken = (req: any) => {
  return { body: { ...req }, token };
};

export const Adapter: Partial<Env.Bridge> = {
  setToken(sessionToken: string): void {
    token = sessionToken;
  },

  startSession() {
    const token: string = ServiceFacade.startNewSession();
    return { data: { token: token } };
  },

  init(credentials: Types.Credentials): DummyTypes.IResponse {
    const initReq = {
      firstAdminName: credentials.userName,
      firstAdminPassword: credentials.password,
    };
    const { data, error } = ServiceFacade.systemInit(wrapWithToken(initReq));
    return error
      ? { data: undefined, error: error.message }
      : { data: data, error: undefined };
  },

  reset() {
    ServiceFacade.reset();
  },

  register(credentials: Types.Credentials): DummyTypes.IResponse {
    const reqCred = {
      username: credentials.userName,
      password: credentials.password,
    };
    const response = ServiceFacade.registerUser(wrapWithToken(reqCred));
    return response.error
      ? { data: undefined, error: response.error.message }
      : { data: response.data };
  },

  login(credentials: Types.Credentials): DummyTypes.IResponse {
    const reqCred = {
      username: credentials.userName,
      password: credentials.password,
    };
    const { data, error } = ServiceFacade.loginUser(wrapWithToken(reqCred));
    return error
      ? { data: undefined, error: error.message }
      : { data: data, error: undefined };
  },

  logout(): DummyTypes.IResponse {
    const { data, error } = ServiceFacade.logoutUser(wrapWithToken({}));
    return error
      ? { data: undefined, error: error.message }
      : { data: data, error: undefined };
  },

  createStore(store: Types.Store): DummyTypes.IStoreResponse {
    const req = wrapWithToken({ storeName: store.name });
    const { error, data } = ServiceFacade.createStore(req);
    if (error || !data.result) return { data: undefined, error: error.message };
    else if (data.result) return { data: { name: store.name } };
  },

  addItemsToStore(store: Store, items: Item[]): DummyTypes.IResponse {
    const req = { storeName: store.name, items };
    const { data, error } = ServiceFacade.addItems(wrapWithToken(req));
    return error
      ? { data: undefined, error: error.message }
      : { data: data, error: undefined };
  },

  addProductsToStore(store: Store, products: Product[]): DummyTypes.IResponse {
    const req = { storeName: store.name, products: products };
    const { data, error } = ServiceFacade.addNewProducts(wrapWithToken(req));
    return error
      ? { data: undefined, error: error.message }
      : { data: data, error: undefined };
  },

  removeProductsFromStore(store: Store, products: Product[]) {
    const catalogNumbers = products.map((p) => {
      return { catalogNumber: p.catalogNumber };
    });
    const removeReq = { storeName: store.name, products: catalogNumbers };
    const { data, error } = ServiceFacade.removeProducts(
      wrapWithToken(removeReq)
    );
    return error ? { data, error: error.message } : { data, error: undefined };
  },

  viewStore(store: Store) {
    const { data, error } = ServiceFacade.viewStoreInfo(
      wrapWithToken({ storeName: store.name })
    );
    return error
      ? { data: undefined, error: error.message }
      : { data: data.info, error: undefined };
  },

  assignStoreOwner(store: Store, user: User): DummyTypes.IResponse {
    const { data, error } = ServiceFacade.assignStoreOwner(
      wrapWithToken({ storeName: store.name, usernameToAssign: user.username })
    );
    return error
      ? { data: undefined, error: error.message }
      : { data: data, error: undefined };
  },

  // viewProduct(store: Store, product: Product) {
  //   const {data, error} = ServiceFacade.viewProductInfo(wrapWithToken({storeName: store.name, catalogNumber: product.catalogNumber}));
  //   return error
  //       ? {data: undefined, error: error}
  //       : {data: data.info, error: undefined};
  // },

  assignManager(store: Store, credentials: Credentials): DummyTypes.IResponse {
    const req = {
      storeName: store.name,
      usernameToAssign: credentials.userName,
    };
    const { data, error } = ServiceFacade.assignStoreManager(
      wrapWithToken(req)
    );
    return error
      ? { data: undefined, error: error.message }
      : { data: data, error: undefined };
  },

  grantPermissions(
    credentials: Credentials,
    store: Store,
    permissions: PERMISSION[]
  ): DummyTypes.IResponse {
    const req = {
      managerToChange: credentials.userName,
      storeName: store.name,
      permissions: permissions,
    };
    const { data, error } = ServiceFacade.addManagerPermissions(
      wrapWithToken(req)
    );
    return error
      ? { data: undefined, error: error.message }
      : { data: data, error: undefined };
  },

  changeProductName(
    req: Partial<ServiceFacade.Req.ChangeProductNameRequest>
  ): ServiceFacade.Res.BoolResponse {
    return ServiceFacade.changeProductName(wrapWithToken(req.body));
  },

  changeProductPrice(
    req: Partial<ServiceFacade.Req.ChangeProductPriceRequest>
  ): ServiceFacade.Res.BoolResponse {
    return ServiceFacade.changeProductPrice(wrapWithToken(req.body));
  },

  addToCart(store: Store, product: Product, quantity: number) {
    const req = {
      storeName: store.name,
      catalogNumber: product.catalogNumber,
      amount: quantity,
    };
    const { data, error } = ServiceFacade.saveProductToCart(wrapWithToken(req));
    return error
      ? { data: undefined, error: error.message }
      : { data: data, error: undefined };
  },
  removeStoreManager(
    req: Partial<ServiceFacade.Req.RemoveStoreManagerRequest>
  ): ServiceFacade.Res.BoolResponse {
    return ServiceFacade.removeStoreManager(wrapWithToken(req.body));
  },
  removeManagerPermissions(
    req: ServiceFacade.Req.ChangeManagerPermissionRequest
  ): ServiceFacade.Res.BoolResponse {
    return ServiceFacade.removeManagerPermissions(wrapWithToken(req.body));
  },
  viewStorePurchasesHistory(req : ServiceFacade.Req.ViewShopPurchasesHistoryRequest ): ServiceFacade.Res.ViewShopPurchasesHistoryResponse {
    return ServiceFacade.viewStorePurchasesHistory(wrapWithToken(req.body));
  },
  viewUserPurchasesHistory(req : ServiceFacade.Req.ViewRUserPurchasesHistoryReq ): ServiceFacade.Res.ViewRUserPurchasesHistoryRes {
    return ServiceFacade.viewRegisteredUserPurchasesHistory(wrapWithToken(req.body));
  },
  purchase(req : ServiceFacade.Req.PurchaseRequest ): ServiceFacade.Res.PurchaseResponse {
    return ServiceFacade.purchase(wrapWithToken(req.body));
  },
  
};
