interface Notification {
    message: string;
    options?: any;
}

interface Notifications {
    [key: string]:string;
}


const notificationMsg: Notifications = {
    M_NEW_PURCHASE: "New purchase made in store {} by {}",
    M_ASSIGNED_AS_OWNER: "You have been assigned as store owner of store: {}",
    M_REMOVED_AS_OWNER: "You have been removed from being store owner of store: {}",
};

export { notificationMsg };