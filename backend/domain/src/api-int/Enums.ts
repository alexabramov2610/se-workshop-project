export enum UserRole {
    GUEST,  
    BUYER,
    SELLER,
    MANAGER,
    OWNER,
    ADMIN
}

export enum ExternalSystems  {
   DELIVERY,
   PAYMENT,
   SECURITY
}

export enum ManagementPermission {
    WATCH_PURCHASES_HISTORY,
    WATCH_USER_QUESTIONS,
    REPLY_USER_QUESTIONS,
    MODIFY_BUYING_METHODS,
    MODIFY_DISCOUNT,
    MANAGE_INVENTORY,
    CLOSE_STORE,
}
