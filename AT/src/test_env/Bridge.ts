import {Item, Response, Store, User, Credentials, BuyItem, SearchData, RATE} from "./types";

export interface Bridge {
    removeItem(item: Item): Response;
    removeStore(store: Store): Response;
    addStore(store: Store): Response;
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
}
