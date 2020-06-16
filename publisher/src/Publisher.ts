import {StoreOwnerNotificationsSubscriber} from "./subscribers/StoreOwnerNotificationsSubscriber";
import {Event} from "se-workshop-20-interfaces"
import {EventCode} from "se-workshop-20-interfaces/dist/src/Enums";
import {Subscriber} from "./subscribers/Subscriber";
import {AuctionNotificationsSubscriber} from "./subscribers/AuctionNotificationsSubscriber";
import {RegisteredUserEventsSubscriber} from "./subscribers/RegisteredUserEventsSubscriber";
import {AuctionEvent, LotteryEvent, StatisticsUpdateEvent} from "se-workshop-20-interfaces/dist/src/Event";
import {IPublisher} from "se-workshop-20-interfaces/dist/src/CommonInterface"
import {removeClient, setOnCloseEvent, terminate} from "websocket";
import {StatisticsEventsSubscriber} from "./subscribers/StatisticsEventsSubscriber";

export class Publisher implements IPublisher {

    private notificationId: number;
    private _subscriptions: Map<EventCode, Map<string, any>>;
    // private readonly _socket;

    /**
     STORE_OWNER_EVENTS                 | map<store name, subscriber[]>     |   STORE_OWNER_EVENTS          //in use
     NEW_PURCHASE                       |              "                    |   STORE_OWNER_EVENTS          //in use
     STORE_CLOSED                       |              "                    |   STORE_OWNER_EVENTS
     STORE_OPENED                       |              "                    |   STORE_OWNER_EVENTS
     APPROVE_NEW_STORE_OWNER_REQUIRED   |              "                    |   STORE_OWNER_EVENTS ---excluding the assigner // in use
     ASSIGNED_AS_STORE_OWNER            | map<username, subscriber>         |   USER_EVENTS                 //in use
     REMOVED_AS_STORE_OWNER             |              "                    |   USER_EVENTS                 //in use
     ----------------------------------------------------------------------------
     AUCTION_EVENTS                     | map<auction id, subscriber[]>     |   AUCTION_EVENTS
     HIGHER_AUCTION_OFFER               |              "                    |   AUCTION_EVENTS
     ----------------------------------------------------------------------------
     LOTTERY_EVENTS                     | map<lottery id, subscriber[]>     |   LOTTERY_EVENTS
     AUCTION_WINNER                     |              "                    |   LOTTERY_EVENTS
     LOTTERY_DESTINATION_PRICE_REACHED  |              "                    |   LOTTERY_EVENTS
     */

    constructor(logoutFunction: (username: string) => void) {
        this._subscriptions = new Map();
        this.notificationId = 0;
        setOnCloseEvent(logoutFunction)
    }

    /** subscribe **/
    subscribe(username: string, eventCode: EventCode, key: string, storeName: string): void {
        const eventType: number = this.getEventFromEventCode(eventCode.valueOf());
        if (eventType === -1)
            return;

        if (!this._subscriptions.has(eventType))
            this._subscriptions.set(eventType, new Map());

        if (eventType === EventCode.STORE_OWNER_EVENTS)
            this.subscribeStoreOwnerEvents(username, storeName);

        else if (eventType === EventCode.USER_EVENTS)
            this.subscribeRegisteredUserEvents(username);

        else if (eventType === EventCode.AUCTION_EVENTS)
            this.subscribeAuctionEvents(username, key, storeName);

        else if (eventType === EventCode.LOTTERY_EVENTS)
            this.subscribeLotteryEvents(username, key, storeName);

        else if (eventType === EventCode.WATCH_STATISTICS)
            this.subscribeStatisticsEvents(username);
    }

    private subscribeStoreOwnerEvents(username: string, storeName: string): void {
        const eventType: EventCode = EventCode.STORE_OWNER_EVENTS;

        if (!this._subscriptions.get(eventType).has(storeName))
            this._subscriptions.get(eventType).set(storeName, []);

        const subscriber: StoreOwnerNotificationsSubscriber = new StoreOwnerNotificationsSubscriber(username, storeName);
        this._subscriptions.get(eventType).get(storeName).push(subscriber);
    }

    private subscribeRegisteredUserEvents(username: string): void {
        const eventType: EventCode = EventCode.USER_EVENTS;
        const subscriber: RegisteredUserEventsSubscriber = new RegisteredUserEventsSubscriber(username);
        this._subscriptions.get(eventType).set(username, subscriber);
    }

    private subscribeAuctionEvents(username: string, auctionId: string, storeName: string): void {
        const eventType: EventCode = EventCode.AUCTION_EVENTS;

        if (!this._subscriptions.get(eventType).has(auctionId))
            this._subscriptions.get(eventType).set(auctionId, []);

        const subscriber: AuctionNotificationsSubscriber = new AuctionNotificationsSubscriber(username, auctionId, storeName);
        // subscriber.setSocket(this._socket);
        this._subscriptions.get(eventType).get(auctionId).push(subscriber);
    }

    private subscribeLotteryEvents(username: string, lotteryId: string, storeName: string): void {
        const eventType: EventCode = EventCode.LOTTERY_EVENTS;

        if (!this._subscriptions.get(eventType).has(lotteryId))
            this._subscriptions.get(eventType).set(lotteryId, []);

        const subscriber: AuctionNotificationsSubscriber = new AuctionNotificationsSubscriber(username, lotteryId, storeName);
        // subscriber.setSocket(this._socket);
        this._subscriptions.get(eventType).get(lotteryId).push(subscriber);
    }

    private subscribeStatisticsEvents(username: string): void {
        const eventType: EventCode = EventCode.WATCH_STATISTICS;
        const subscriber: StatisticsEventsSubscriber = new StatisticsEventsSubscriber(username);
        this._subscriptions.get(eventType).set(username, subscriber);
    }


    /** unsubscribe **/
    unsubscribe(username: string, subscriptionEvent: EventCode, key: string): void {
        const eventType: number = this.getEventFromEventCode(subscriptionEvent);
        if (eventType === -1)
            return;
        // subscribers = subscribers.filter(subscriber => subscriber.username() !== username);

        if (!this._subscriptions.has(eventType))
            return;

        if (eventType === EventCode.STORE_OWNER_EVENTS)
            this.unsubscribeStoreOwnerEvents(username, key);

        else if (eventType === EventCode.USER_EVENTS)
            this.unsubscribeRegisteredUserEvents(username);

        else if (eventType === EventCode.AUCTION_EVENTS)
            this.unsubscribeAuctionEvents(username, key);

        else if (eventType === EventCode.LOTTERY_EVENTS)
            this.unsubscribeLotteryEvents(username, key);

        else if (eventType === EventCode.WATCH_STATISTICS)
            this.unsubscribeStatisticsEvents(username);
    }

    private unsubscribeStoreOwnerEvents(username: string, storeName: string): void {
        const eventType: EventCode = EventCode.STORE_OWNER_EVENTS;

        if (!this._subscriptions.get(eventType).has(storeName))
            return;

        let subscribers: Subscriber[] = this._subscriptions.get(eventType).get(storeName);
        subscribers = subscribers.filter(subscriber => subscriber.username() !== username);
        this._subscriptions.get(eventType).set(storeName, subscribers);
    }

    private unsubscribeRegisteredUserEvents(username: string): void {
        const eventType: EventCode = EventCode.USER_EVENTS;

        if (!this._subscriptions.get(eventType).has(username))
            return;

        this._subscriptions.get(eventType).delete(username);
    }

    private unsubscribeAuctionEvents(username: string, auctionId: string): void {
        const eventType: EventCode = EventCode.AUCTION_EVENTS;
        if (!this._subscriptions.get(eventType).has(auctionId))
            return;

        let subscribers: Subscriber[] = this._subscriptions.get(eventType).get(auctionId);
        subscribers = subscribers.filter(subscriber => subscriber.username() !== username);
        this._subscriptions.get(eventType).set(auctionId, subscribers);
    }

    private unsubscribeLotteryEvents(username: string, lotteryId: string): void {
        const eventType: EventCode = EventCode.LOTTERY_EVENTS;
        if (!this._subscriptions.get(eventType).has(lotteryId))
            return;

        let subscribers: Subscriber[] = this._subscriptions.get(eventType).get(lotteryId);
        subscribers = subscribers.filter(subscriber => subscriber.username() !== username);
        this._subscriptions.get(eventType).set(lotteryId, subscribers);
    }

    private unsubscribeStatisticsEvents(username: string): void {
        const eventType: EventCode = EventCode.WATCH_STATISTICS;

        if (!this._subscriptions.get(eventType).has(username))
            return;

        this._subscriptions.get(eventType).delete(username);
    }

    /** notify **/
    notify(event: Event.Event): string[] {
        let notificationNotSent: string[] = [];
        const eventType: EventCode = this.getEventFromEventCode(event.code);
        if (eventType === -1)
            return;

        if (eventType === EventCode.STORE_OWNER_EVENTS)
            return this.handleStoreOwnerEvent(<Event.StoreOwnerEvent> event);

        if (eventType === EventCode.APPROVE_NEW_STORE_OWNER_REQUIRED)
            return this.handleAssignStoreOwnerEvent(<Event.ApproveOwnerEvent> event);

        else if (eventType === EventCode.USER_EVENTS)
            return this.handleRegisteredUserEvent(event);

        else if (eventType === EventCode.AUCTION_EVENTS)
            return this.handleAuctionEvent(<AuctionEvent> event);

        else if (eventType === EventCode.LOTTERY_EVENTS)
            return this.handleLotteryEvent(<LotteryEvent> event);

        else if (eventType === EventCode.WATCH_STATISTICS)
            this.handleStatisticsEvent(<StatisticsUpdateEvent> event);

        return notificationNotSent;
    }

    private handleAssignStoreOwnerEvent(event: Event.ApproveOwnerEvent): string[] {
        const eventType: EventCode = EventCode.STORE_OWNER_EVENTS;
        if (!this._subscriptions.has(eventType) || !this._subscriptions.get(eventType).has(event.storeName))
            return [event.username];
        const subscribers: Subscriber[] = this._subscriptions.get(eventType).get(event.storeName).filter((s: Subscriber) => s.username() !== event.assigner)
        return this.updateSubscribers(subscribers, event);

    }

    private handleStoreOwnerEvent(event: Event.StoreOwnerEvent): string[] {
        const eventType: EventCode = EventCode.STORE_OWNER_EVENTS;
        if (!this._subscriptions.has(eventType) || !this._subscriptions.get(eventType).has(event.storeName))
            return [event.username];
        return this.updateSubscribers(this._subscriptions.get(eventType).get(event.storeName), event);
    }

    private handleRegisteredUserEvent(event: Event.Event): string[] {
        const eventType: EventCode = EventCode.USER_EVENTS;
        if(!this._subscriptions.has(eventType) || !this._subscriptions.get(eventType).has(event.username)) {
            // console.log("event wasn't sent")
            return [event.username];
        }
        return this.updateSubscribers([this._subscriptions.get(eventType).get(event.username)], event);
    }

    private handleAuctionEvent(event: Event.AuctionEvent): string[] {
        const eventType: EventCode = EventCode.AUCTION_EVENTS;
        if (!this._subscriptions.has(eventType) || !this._subscriptions.get(eventType).has(event.auctionId))
            return [event.username];
        return this.updateSubscribers(this._subscriptions.get(eventType).get(event.auctionId), event);
    }

    private handleLotteryEvent(event: Event.LotteryEvent): string[] {
        const eventType: EventCode = EventCode.LOTTERY_EVENTS;
        if (!this._subscriptions.has(eventType) || !this._subscriptions.get(eventType).has(event.lotteryId))
            return [event.username];
        return this.updateSubscribers(this._subscriptions.get(eventType).get(event.lotteryId), event);
    }

    private handleStatisticsEvent(event: StatisticsUpdateEvent): string[] {
        const eventType: EventCode = EventCode.WATCH_STATISTICS;
        if(!this._subscriptions.has(eventType) || !this._subscriptions.get(eventType).has(event.username)) {
            // console.log("event wasn't sent")
            return [event.username];
        }
        return this.updateSubscribers([this._subscriptions.get(eventType).get(event.username)], event);
    }

    private updateSubscribers(subscribers: Subscriber[], event: Event.Event): string[] {
        let notificationNotSent: string[] = [];
        const notificationId = this.notificationId++;
        for (const subscriber of subscribers) {
            if (!subscriber.update(event, notificationId))
                notificationNotSent.push(subscriber.username());
        }
        return notificationNotSent;
    }

    private getEventFromEventCode(eventCode: EventCode): number {
        if (eventCode === EventCode.STORE_OWNER_EVENTS ||
            eventCode === EventCode.NEW_PURCHASE ||
            eventCode === EventCode.STORE_CLOSED ||
            eventCode === EventCode.STORE_OPENED)
            return EventCode.STORE_OWNER_EVENTS;

        else if (eventCode === EventCode.APPROVE_NEW_STORE_OWNER_REQUIRED)
            return EventCode.APPROVE_NEW_STORE_OWNER_REQUIRED;

        else if (eventCode === EventCode.ASSIGNED_AS_STORE_OWNER ||
             eventCode === EventCode.USER_EVENTS ||
             eventCode === EventCode.REMOVED_AS_STORE_OWNER)
            return EventCode.USER_EVENTS;

        else if (eventCode === EventCode.AUCTION_EVENTS ||
            eventCode === EventCode.HIGHER_AUCTION_OFFER)
            return EventCode.AUCTION_EVENTS;

        else if (eventCode === EventCode.LOTTERY_EVENTS ||
            eventCode === EventCode.AUCTION_WINNER ||
            eventCode === EventCode.LOTTERY_DESTINATION_PRICE_REACHED)
            return EventCode.LOTTERY_EVENTS;

        else if (eventCode === EventCode.WATCH_STATISTICS)
            return EventCode.WATCH_STATISTICS;

        return -1;
    }

    terminateSocket(): void {
        terminate()
    }

    removeClient(username) {
        removeClient(username);
    }
}
