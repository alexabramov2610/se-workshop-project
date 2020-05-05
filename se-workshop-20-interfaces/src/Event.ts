interface Event {
    message: string
}

interface NewPurchaseEvent extends Event {
    storeName: string
}

export {
    Event,
    NewPurchaseEvent
};