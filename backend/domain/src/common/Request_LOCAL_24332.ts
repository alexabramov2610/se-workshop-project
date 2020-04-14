interface Request {
  body: any;
  requestor: string;
}

interface OpenStoreRequest extends Request {
  body: { storeName: string};
}

interface UserRequest extends Request{
  body:{username:string,password:string,uuid:string}
}


export { OpenStoreRequest,Request,UserRequest  };