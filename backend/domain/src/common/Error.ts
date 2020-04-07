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
  E_PRODUCTS_ADDITION: "Could not add products.",
  E_PRODUCTS_REMOVAL: "Could not remove products.",
  E_PRODUCT_EXISTS: "Product already exists in store.",
  E_PRODUCT_DOES_NOT_EXIST: "Product does not exist in store.",
  E_ITEMS_ADDITION:  "Could not add items.",
  E_ITEMS_REMOVAL: "Could not remove items.",
  E_NOT_LOGGED_IN: "User is not logged in.",
  E_INVALID_STORE: "Store does not exist.",
  E_NOT_AUTHORIZED: "User not authorized.",
  E_STORE_ADDITION: "Could not add store.",
  E_ASSIGN_OWNER: "Failed assigning owner.",
  E_ASSIGN_MANAGER: "Failed assigning manager."


};

export { Error, errorMsg };
