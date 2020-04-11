interface Error {
  message: string;
  options?: any;
}

interface ErrorMessages {
  [key: string]:string;
}


const errorMsg:ErrorMessages = {
  E_NF: "Not found",
  E_CON: "Connection failed",
  E_AL: "Already at this state",
  E_PROD_ADD: "Could not add products.",
  E_PROD_REM: "Could not remove products.",
  E_PROD_EXISTS: "Product already exists in store.",
  E_PROD_DOES_NOT_EXIST: "Product does not exist in store.",
  E_ITEMS_ADD:  "Could not add items.",
  E_ITEMS_REM: "Could not remove items.",
  E_NOT_LOGGED_IN: "RegisteredUser is not logged in.",
  E_INVALID_STORE: "Store does not exist.",
  E_NOT_AUTHORIZED: "RegisteredUser is not authorized.",
  E_STORE_ADDITION: "Could not add store.",
  E_ASSIGN: "Failed assigning"


};

export { Error, ErrorMessages,errorMsg };