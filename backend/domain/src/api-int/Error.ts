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
    E_USER_NOT_VALID: "User name not valid",
    E_BU: "The username is already taken.",
    E_BAD_OPERATION: "This operation is not allowed in this user state.",
    E_NA: "This user is not an Admin.",
    E_BP: "Bad Password",
    E_NAL: "User is not at that state.",
    E_NOT_OWNER: "User is not owner of that store.",
    E_NOT_MANAGER: "User is not manager of that store.",
    E_PROD_ADD: "Could not add products.",
    E_PROD_REM: "Could not remove products.",
    E_PROD_EXISTS: "Product already exists in store.",
    E_PROD_DOES_NOT_EXIST: "Product does not exist in store.",
    E_USER_DOES_NOT_EXIST: "User does not exist.",
    E_ITEMS_ADD:  "Could not add items.",
    E_ITEMS_REM: "Could not remove items.",
    E_BAD_TOKEN: "Bad token.",
    E_NOT_LOGGED_IN: "User is not logged in.",
    E_INVALID_STORE: "Store does not exist.",
    E_NOT_AUTHORIZED: "User is not authorized.",
    E_STORE_EXISTS: "There is already store with his name.",
    E_BAD_STORE_NAME: "This store name is illegal.",
    E_STORE_ADDITION: "Could not add store.",
    E_ASSIGN: "Failed assigning",
    E_INVALID_PROD: "Invalid product.",
    E_PERMISSION: "This manager doesn't have this permission.",
    E_INVALID_PERM: "Invalid permissions.",
    E_NOT_ASSIGNER: "Not assigner of user ",
    E_STOCK: "This product not in stock.",
    E_NOT_IN_CART:"This cart dont contain this product",
    E_ITEM_NOT_EXISTS:"Item does not exist in this store bag",
    E_BAG_NOT_EXISTS:"This store bag is not exist",
    E_BAG_BAD_AMOUNT:"This bag don't have the requested amount",
    E_PAY_FAILURE: "Payment failure.",
    E_MANGER_NOT_EXISTS:"This user not manager in this store.",
    E_EMPTY_CART:"The cart is empty",
    E_MODIFY_DISCOUNT:"Modify discount failed",
    E_USER_EXISTS:"User name is already taken",
    E_INVALID_PARAM: "Invalid parameters",
    SET_POLICY_FAILED: "Set policy failed!",
    VERIFY_POLICY_FAILED: "Verifying policy failed",
    E_ASSIGN_SELF: "You cannot assign yourself",
    E_MAX_AMOUNT_REACHED: "You have reached the maximum amount of this product",
    E_DB: "Database error",
    E_AGREEMENT: "Failed to approve new store owner",
    E_MODIFY_PRODUCT: "Failed to modify product"


};

export { Error, ErrorMessages, errorMsg };