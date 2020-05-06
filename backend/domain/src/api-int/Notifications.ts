interface Notification {
    message: string;
    options?: any;
}

interface Notifications {
    [key: string]:string;
}


const notification: Notifications = {
    M_NEW_PURCHASE: "New purchase made in store {} by {}"
};

export { Notification, Notifications, notification };