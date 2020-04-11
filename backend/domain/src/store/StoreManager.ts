import { Store } from './internal_api'
import * as Responses from '../common/Response'
import * as Error from '../common/Error'
import { RegisteredUser } from "../user/internal_api";
import { Logger as logger } from "../common/Logger";

export class StoreManager {

    private _stores: Store[];

    constructor() {
        this._stores = [];
    }

    addStore(store: Store) : Responses.BoolResponse {
        logger.info(`trying to add store: ${JSON.stringify(store)} to system`)
        if (this.verifyStore(store)) {
            this._stores.push(store);
            logger.info(`successfully added store: ${JSON.stringify(store)} to system`)
            return {data: {result: true}}
        }
        else {
            logger.warn(`failed adding store ${JSON.stringify(store)} to system`)
            return {data: {result: false}, error: {message: Error["E_STORE_ADDITION"]}}
        }
    }

    verifyStoreExists(store: Store) : boolean {
        if (this.verifyStore(store)) {
            for (let currStore of this._stores) {
                if (currStore.UUID === store.UUID) {
                    logger.info(`verified store ${JSON.stringify(store)}`)
                    return true;
                }
            }
        }
        logger.error(`could not verify store ${JSON.stringify(store)}`)
        return false;
    }

    verifyStore(store: Store) {
        return store.storeName && store.storeName !== '' && store.UUID && store.UUID !== '';
    }

    verifyStoreOwner(store: Store, user: RegisteredUser) : boolean {
        return store.verifyIsStoreOwner(user);
    }

    verifyStoreManager(store: Store, user: RegisteredUser) : boolean {
        return store.verifyStoreManager(user);
    }

}