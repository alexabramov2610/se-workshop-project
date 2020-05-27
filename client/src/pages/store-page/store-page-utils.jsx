export const permissions = {
    VIEW_MANAGER_PERMISSION: "VIEW_MANAGER_PERMISSION",
    WATCH_PURCHASES_HISTORY: "WATCH_PURCHASES_HISTORY",
    WATCH_USER_QUESTIONS: "WATCH_USER_QUESTIONS",
    REPLY_USER_QUESTIONS: "REPLY_USER_QUESTIONS",
    MODIFY_BUYING_METHODS: "MODIFY_BUYING_METHODS",
    MODIFY_DISCOUNT: "MODIFY_DISCOUNT",
    MANAGE_INVENTORY: "MANAGE_INVENTORY",
    CLOSE_STORE: "CLOSE_STORE"
}

export const isOwner = (props) => {
    return props.permissions.length === Object.keys(permissions).length;
}

export const isManager = (props) => {
    return props.permissions.length !== 0;
}

export const hasPermission = (permission, permissions) => {
    return permissions.includes(permission);
}

export const initialManagersPermissions = [
    permissions.MANAGE_INVENTORY,
    permissions.MODIFY_BUYING_METHODS
];
