import {EventCode, NotificationsType} from "./Enums";
import {VisitorsStatistics} from "./CommonInterface";

interface Notification {
    message: string,
    type: NotificationsType
}

interface Event {
    notification: Notification,
    code: EventCode,
    username: string
}

interface AuctionEvent extends Event {
    auctionId: string,
}

interface HighOfferAuctionEvent extends AuctionEvent {
    newOffer: number
}

interface AuctionWinnerEvent extends AuctionEvent {
    winner: string
}

interface LotteryEvent extends Event {
    lotteryId: string
}

interface StoreOwnerEvent extends Event {
    storeName: string
}

interface ApproveOwnerEvent extends StoreOwnerEvent {
    assigner: string
}

interface NewPurchaseEvent extends StoreOwnerEvent {
    // code: EventCode.NEW_PURCHASE
}

interface StatisticsUpdateEvent extends Event {
    statistics :VisitorsStatistics
}

export {
    StatisticsUpdateEvent,
    HighOfferAuctionEvent,
    AuctionWinnerEvent,
    Notification,
    Event,
    AuctionEvent,
    LotteryEvent,
    StoreOwnerEvent,
    NewPurchaseEvent,
    ApproveOwnerEvent
};