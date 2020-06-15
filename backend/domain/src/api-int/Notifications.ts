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
    M_NEED_APPROVE: "You have been requested to approve new store owner: {} of store {}",
    M_STATS_UPDATE: "Statistics update received"
};

export { notificationMsg };