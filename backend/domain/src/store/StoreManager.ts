import { Store } from './internal_api'
import {logger, BoolResponse , Error, UserRole} from '../common/internal_api'
import { RegisteredUser } from "../user/internal_api";

export class StoreManager {

    private _stores: Store[];

    constructor() {
        this._stores = [];
    }

    addStore(storeName: string, owner: RegisteredUser) : BoolResponse {
        if(storeName !== ''){
            const newStore = new Store(storeName);
            newStore.setFirstOwner(owner);
            owner.setRole(UserRole.OWNER);
            this._stores.push(newStore);
            logger.info(`successfully added store: ${JSON.stringify(newStore)} to system`)
            return {data: {result: true}}
        }
        else {
            logger.warn(`failed adding store ${storeName} to system`)
            return {data: {result: false}, error: {message: Error["E_STORE_ADDITION"]}}
        }
    }

    verifyStoreExists(store: Store) : boolean {
        if (this.verifyStore(store)) {
            for (let currStore of this._stores) {
                if (currStore.UUID === store.UUID) {
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