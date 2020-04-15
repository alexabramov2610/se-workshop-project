import {Item, Response, Store, User, Credentials, BuyItem, SearchData, RATE, CreditCard, Discount} from "./types";

export interface Bridge {
    removeItem(item: Item): Response;
    removeStore(store: Store): Response;
    createStore(store: Store): Response;
    addItemToStore(store: Store, item: Item): Response;
    viewStore(store: Store): Response;
    viewItem(item: Item): Response;
    getLoggedInUsers(): Response;
    removeUser(user: User): Response;
    getUserByName(user: User): Response;
    login(credentials: Credentials): Response;
    register(credentials: Credentials): Response;
    buyItem(transaction: BuyItem): Response;
    logout(): Response;
    getPurchaseHistory(): Response;
    search(input: SearchData): Response;
    rate(toRate: Store | Item, rate: RATE): Response;
    addToCart(item: Item): Response;
    watchCart(): Response;
    checkout(creditCard: CreditCard): Response;
    setDiscountToStore(store: Store, discount: Discount): Response;
    setDiscountToItem(store: Store, item: Item, discount: Discount): Response;
}
