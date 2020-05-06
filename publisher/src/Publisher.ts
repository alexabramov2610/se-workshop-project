import {StoreOwnerNotificationsSubscriber} from "./subscribers/StoreOwnerNotificationsSubscriber";
import { Event } from "se-workshop-20-interfaces"
import {EventCode} from "se-workshop-20-interfaces/dist/src/Enums";
import {Subscriber} from "./subscribers/subscriber";
import {LotteryNotificationsSubscriber} from "./subscribers/LotteryNotificationsSubscriber";
import {AuctionNotificationsSubscriber} from "./subscribers/AuctionNotificationsSubscriber";

export class Publisher {

    private _sendMessageFunction: (username: string, message: string) => boolean;
    private _subscriptions: Map<EventCode, Map<string, Subscriber[]>>;

    /**
     NEW_PURCHASE                       | map<store name, subscriber[]>
     STORE_CLOSED                       |              "
     STORE_OPENED                       |              "
     ASSIGNED_AS_STORE_OWNER            |              "
     REMOVED_AS_STORE_OWNER             |              "
     HIGHER_AUCTION_OFFER               | map<auction id, subscriber[]>
     AUCTION_WINNER                     |              "
     LOTTERY_DESTINATION_PRICE_REACHED  | map<lottery id, subscriber[]>
     */

    constructor() {
        this._subscriptions = new Map();
    }

    setSendMessageFunction(func: (username: string, message: string) => boolean) {
        this._sendMessageFunction = func;
    }

    subscribe(username: string, subscriptionEvent: EventCode, storeName?: string, auctionId?: string, lotteryId?: string): void {
        if (!this._subscriptions.has(subscriptionEvent))
            this._subscriptions.set(subscriptionEvent, new Map())
        if (storeName) {
            if (!this._subscriptions.get(subscriptionEvent).has(storeName))
                this._subscriptions.get(subscriptionEvent).set(storeName, []);

            const subscriber: StoreOwnerNotificationsSubscriber = new StoreOwnerNotificationsSubscriber(username, storeName);
            this._subscriptions.get(subscriptionEvent).get(storeName).push(subscriber);
        } else if (auctionId) {
            if (!this._subscriptions.get(subscriptionEvent).has(auctionId))
                this._subscriptions.get(subscriptionEvent).set(auctionId, []);

            const subscriber: AuctionNotificationsSubscriber = new AuctionNotificationsSubscriber(username, storeName, auctionId);
            this._subscriptions.get(subscriptionEvent).get(auctionId).push(subscriber);
        } else if (lotteryId) {
            if (!this._subscriptions.get(subscriptionEvent).has(lotteryId))
                this._subscriptions.get(subscriptionEvent).set(lotteryId, []);

            const subscriber: LotteryNotificationsSubscriber = new LotteryNotificationsSubscriber(username, storeName, lotteryId);
            this._subscriptions.get(subscriptionEvent).get(lotteryId).push(subscriber);
        }
    }


    unsubscribeStoreOwnerNotifications(username: string, subscriptionEvent: EventCode, storeName?: string, auctionId?: string, lotteryId?: string) {
        if (!this._subscriptions.has(subscriptionEvent)) {
            return;
        }
        const key: string = storeName ? storeName : auctionId ? auctionId : lotteryId ? lotteryId : undefined;
        if (!key || !this._subscriptions.get(subscriptionEvent).has(key))
            return;

        let subscribers: Subscriber[] = this._subscriptions.get(subscriptionEvent).get(key);
        subscribers = subscribers.filter(subscriber => subscriber.username() !== username);
        this._subscriptions.get(subscriptionEvent).set(key, subscribers);
    }

    notify(event: Event.Event): string[] {
        let notificationNotSent: string[] = [];
        const key: string = this.getKeyFromEvent(event);
        if (!this._subscriptions.has(event.code) || !this._subscriptions.get(event.code).has(key))
            return notificationNotSent;
        for (const subscriber of this._subscriptions.get(event.code).get(key)) {
            if (!subscriber.update(event)) {
                notificationNotSent.push(subscriber.username());
            }
        }

        return notificationNotSent;
    }

    getKeyFromEvent(event: Event.Event): string {
        if (event.code === EventCode.NEW_PURCHASE || event.code === EventCode.STORE_CLOSED || event.code === EventCode.STORE_OPENED ||
            event.code === EventCode.ASSIGNED_AS_STORE_OWNER || event.code === EventCode.REMOVED_AS_STORE_OWNER)
            return (<Event.StoreOwnerEvent>event).storeName;

        else if (event.code === EventCode.HIGHER_AUCTION_OFFER || event.code === EventCode.AUCTION_WINNER)
            return (<Event.AuctionEvent>event).auctionId;

        else if (event.code === EventCode.LOTTERY_DESTINATION_PRICE_REACHED)
            return (<Event.LotteryEvent>event).lotteryId;

        return "";
    }
}