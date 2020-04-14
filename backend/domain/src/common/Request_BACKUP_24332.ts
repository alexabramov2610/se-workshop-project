interface Request {
  body: any;
  token: string;
}

interface OpenStoreRequest extends Request {
  body: { storeName: string};
}

interface UserRequest extends Request{
  body:{username:string,password:string,uuid:string}
}

interface SetAdminRequest extends Request {
  body: { newAdminUUID: string};
}


export { OpenStoreRequest, SetAdminRequest ,UserRequest};
