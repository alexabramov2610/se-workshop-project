import {Bridge} from './Bridge';
import {Item, Response, Store, User, Credentials, BuyItem, RATE, SearchData, Cart, CreditCard, Discount} from "./types";
import {
    DummyResponse,
    DummyItemResponse,
    DummyStoreResponse,
    DummyUsersResponse,
    DummyUserResponse,
    DummyCheckoutResponse,
    DummyPurchaseHistoryResponse,
    DummySearchResponse, DummyCartResponse
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

    createStore(store: Store) {
        return this.real ? this.real.createStore(store) : DummyStoreResponse;
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
        return this.real ? this.real.buyItem(transaction) : DummyCheckoutResponse;
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

    addToCart(item: Item) {
        return this.real ? this.real.addToCart(item) : DummyResponse;
    }

    watchCart() {
        return this.real ? this.real.watchCart() : DummyCartResponse;
    }

    checkout(creditCard: CreditCard) {
        return this.real ? this.real.checkout(creditCard) : DummyCheckoutResponse;
    }

    setDiscountToStore(store: Store, discount: Discount) {
        return this.real ? this.real.setDiscountToStore(store, discount) : DummyResponse;
    }

    setDiscountToItem(store: Store, item: Item, discount: Discount) {
        return this.real ? this.real.setDiscountToItem(store, item, discount) : DummyResponse;
    }
}

export {Proxy};
