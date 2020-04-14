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

interface RegisterRequest extends Request{
  body:{username:string,password:string}
}

interface LoginRequest extends Request{
  body:{username:string,password:string}
}

interface LogoutRequest extends Request{
  body:{username:string}
}


interface SetAdminRequest extends Request {
  body: { newAdminUUID: string};
}


export { OpenStoreRequest,RegisterRequest, LoginRequest,SetAdminRequest,LogoutRequest ,UserRequest};
