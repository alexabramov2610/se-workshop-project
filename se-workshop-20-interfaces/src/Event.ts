import {EventCode} from "./Enums";

interface Event {
    message: string,
    username: string,
    code: EventCode
}

interface AuctionEvent extends Event {
    auctionId: string
}

interface LotteryEvent extends Event {
    lotteryId: string
}

interface StoreOwnerEvent extends Event {
    storeName: string
}

interface NewPurchaseEvent extends StoreOwnerEvent {
    // code: EventCode.NEW_PURCHASE
}

export {
    Event,
    AuctionEvent,
    LotteryEvent,
    StoreOwnerEvent,
    NewPurchaseEvent
};