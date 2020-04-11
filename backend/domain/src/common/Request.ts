interface Request {
  body: any;
  requestor: string;
}

interface OpenStoreRequest extends Request {
  body: { storeName: string};
}

export { OpenStoreRequest,  };