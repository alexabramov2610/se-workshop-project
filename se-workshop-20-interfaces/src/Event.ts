import {EventCode, NotificationsType} from "./Enums";

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

export {
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