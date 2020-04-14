import {Bridge} from './Bridge';
import {Item, Response, Store, User, Credentials, BuyItem, RATE, SearchData, Cart} from "./types";
import {
    DummyResponse,
    DummyItemResponse,
    DummyStoreResponse,
    DummyUsersResponse,
    DummyUserResponse,
    DummyBuyResponse,
    DummyPurchaseHistoryResponse,
    DummySearchResponse
} from "../../__tests__/dummy_values/dummyValues";

class Proxy implements Bridge {
    private real: Bridge;

    setReal(adapter: Bridge) {
        this.real = adapter;
    }

    removeItem(item: Item): Response {
        return this.real ? this.real.removeItem(item) : DummyResponse;
    }

    removeStore(store: Store) {
        return this.real ? this.real.removeStore(store) : DummyResponse;
    }

    addStore(store: Store) {
        return this.real ? this.real.addStore(store) : DummyStoreResponse;
    }

    addItemToStore(store: Store, item: Item) {
        return this.real ? this.real.addItemToStore(store, item) : DummyResponse;
    }

    viewItem(item: Item) {
        return this.real ? this.real.viewItem(item) : DummyItemResponse;
    }

    viewStore(store: Store) {
        return this.real ? this.real.viewStore(store) : DummyStoreResponse;
    }

    getLoggedInUsers() {
        return this.real ? this.real.getLoggedInUsers() : DummyUsersResponse;
    }

    removeUser(user: User) {
        return this.real ? this.real.removeUser(user) : DummyResponse;
    }

    getUserByName(user: User) {
        return this.real ? this.real.getUserByName(user) : DummyUserResponse;
    }

    register(credentials: Credentials) {
        return this.real ? this.real.register(credentials) : DummyResponse;
    }

    login(credentials: Credentials) {
        return this.real ? this.real.login(credentials) : DummyResponse;
    }

    logout() {
        return this.real ? this.real.logout() : DummyResponse;
    }

    buyItem(transaction: BuyItem) {
        return this.real ? this.real.buyItem(transaction) : DummyBuyResponse;
    }

    getPurchaseHistory() {
        return this.real
            ? this.real.getPurchaseHistory()
            : DummyPurchaseHistoryResponse;
    }

    search(searchData: SearchData): Response {
        return this.real ? this.real.search(searchData) : DummySearchResponse;
    }

    rate(toRate: Store | Item, rate: RATE): Response {
        return this.real ? this.real.rate(toRate, rate) : DummySearchResponse;
    }

    addToCart(cart: Cart, item: Item) {
        return this.real ? this.real.addToCart(cart, item) : DummyResponse;
    }
}

export {Proxy};
