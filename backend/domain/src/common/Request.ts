interface Request {
  body: any;
  token: string;
}

interface OpenStoreRequest extends Request {
  body: { storeName: string};
}

interface SetAdminRequest extends Request {
  body: { newAdminUUID: string};
}


export { OpenStoreRequest, SetAdminRequest };