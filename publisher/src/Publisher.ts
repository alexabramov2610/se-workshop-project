import {StoreOwnerNotificationsSubscriber} from "./subscribers/StoreOwnerNotificationsSubscriber";
import { Event } from "se-workshop-20-interfaces"

export class Publisher {

    private storeOwnerNotificationsSubscribers: Map<String, StoreOwnerNotificationsSubscriber[]>;
    private _sendMessageFunction: (username: string, message: string) => boolean;

    constructor() {
        this.storeOwnerNotificationsSubscribers = new Map();
    }

    setSendMessageFunction(func: (username: string, message: string) => boolean) {
        this._sendMessageFunction = func;
    }

    subscribeStoreOwnerNotifications(storeOwnerName: string, storeName: string): void {
        if (!this.storeOwnerNotificationsSubscribers.has(storeName)) {
            this.storeOwnerNotificationsSubscribers.set(storeName, []);
        }
        const subscriber: StoreOwnerNotificationsSubscriber = new StoreOwnerNotificationsSubscriber(storeOwnerName, storeName);
        subscriber.setSendMessageFunction(this._sendMessageFunction);
        this.storeOwnerNotificationsSubscribers.get(storeName).push(subscriber);
    }

    unsubscribeStoreOwnerNotifications(storeOwnerName: string, storeName: string) {
        if (!this.storeOwnerNotificationsSubscribers.has(storeName)) {
            return;
        }

        let subscribers: StoreOwnerNotificationsSubscriber[] = this.storeOwnerNotificationsSubscribers.get(storeName);
        subscribers = subscribers.filter(subscriber => subscriber.storeOwnerName !== storeOwnerName);

        this.storeOwnerNotificationsSubscribers.set(storeOwnerName, subscribers);
    }

    notifyNewPurchase(event: Event.NewPurchaseEvent): string[] {
        let notificationNotSent: string[] = [];
        for (const subscriber of this.storeOwnerNotificationsSubscribers.get(event.storeName)) {
            if (!subscriber.updateNewPurchase(event)) {
                notificationNotSent.push(subscriber.storeOwnerName);
            }
        }

        return notificationNotSent;
    }


}