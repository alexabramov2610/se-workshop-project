import { Store } from './internal_api'
import { logger, BoolResponse , errorMsg , UserRole} from '../common/internal_api'
import {RegisteredUser, StoreOwner} from "../user/internal_api";

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
            logger.debug(`successfully added store: ${JSON.stringify(newStore)} to system`)
            return {data: {result: true}}
        }
        else {
            logger.warn(`failed adding store ${storeName} to system`)
            return {data: {result: false}, error: {message: errorMsg["E_STORE_ADDITION"]}}
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
        logger.warn(`could not verify store ${JSON.stringify(store.UUID)}`)
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

    verifyStoreOperation(store: Store, user: RegisteredUser) : BoolResponse {
        if (!this.verifyStoreExists(store)) {
            const error = errorMsg['E_INVALID_STORE'];
            logger.warn(error);
            return { data: { result: false } , error: { message: error}};
        }
        else if (!(this.verifyStoreOwner(store, user) || this.verifyStoreManager(store, user))) {
            const error = errorMsg['E_NOT_AUTHORIZED'];
            logger.warn(error);
            return { data: { result: false } , error: { message: error}};
        }
        return { data: { result: true } }
    }

    assignStoreOwner(store: Store, userToAssign: RegisteredUser, userWhoAssigns: RegisteredUser) : BoolResponse {
        logger.debug(`user: ${JSON.stringify(userWhoAssigns.UUID)} requested to assign user:
                ${JSON.stringify(userToAssign.UUID)} as a manager in store: ${JSON.stringify(store.UUID)} `)

        const operationValid: BoolResponse = this.verifyStoreOperation(store, userWhoAssigns);
        if (operationValid.error) {
            logger.warn(`user: ${JSON.stringify(userWhoAssigns.UUID)} failed to assign user:
                ${JSON.stringify(userToAssign.UUID)} as a manager in store: ${JSON.stringify(store.UUID)}. error: ${operationValid.error.message}`);
            return operationValid;
        }

        if (store.verifyIsStoreOwner(userToAssign)) {   // already store owner
            const error = errorMsg['E_AL'];
            logger.warn(`user: ${JSON.stringify(userWhoAssigns.UUID)} failed to assign user:
                ${JSON.stringify(userToAssign.UUID)} as a manager in store: ${JSON.stringify(store.UUID)}. error: ${error}`);
            return {data : {result: false}, error : {message : error}};
        }

        logger.debug(`successfully assigned user: ${JSON.stringify(userToAssign.UUID)} as a manager in store: ${JSON.stringify(store.UUID)}, assigned by user ${userWhoAssigns.UUID}`)
        return store.addStoreOwner(new StoreOwner(userToAssign.name, userWhoAssigns.password));    //TODO: fix new StoreOwner

    }

}