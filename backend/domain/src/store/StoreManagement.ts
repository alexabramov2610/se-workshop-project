import { Store } from './internal_api'
import * as Responses from '../common/Response'
import * as Error from '../common/Error'
import { User } from "../user/internal_api";

export class StoreManagement {

    private _stores: Store[];

    constructor() {
        this._stores = [];
    }

    addStore(store: Store) : Responses.StoreAdditionResponse {
        if (store.storeName && store.storeName !== '' && store.storeId > 0) {
            this._stores.push(store);
            return {data: {result: true}}
        }
        else {
            return {data: {result: false}, error: {message: Error["E_STORE_ADDITION"]}}
            console.log("ERROR");
        }
    }

    verifyStore(store: Store) : boolean {
        for (let currStore of this._stores) {
            if (currStore.UUID === store.UUID) {
                return true;
            }
        }
        return false;
    }

    verifyStoreOwner(store: Store, user: User) : boolean {
        return store.verifyStoreOwner(user);
    }

    verifyStoreManager(store: Store, user: User) : boolean {
        return store.verifyStoreManager(user);
    }

}