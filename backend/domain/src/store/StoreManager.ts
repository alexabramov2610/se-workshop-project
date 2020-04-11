import { Store } from './internal_api'
import * as Res from '../common/Response'
import {RegisteredUser, StoreOwner} from "../user/internal_api";
import { Logger as logger } from "../common/Logger";
import {Item, Product} from "../trading_system/internal_api";
import { errorMsg as Error } from "../common/Error";

export class StoreManager {

    private _stores: Store[];

    constructor() {
        this._stores = [];
    }

    addStore(store: Store) : Res.BoolResponse {
        logger.info(`trying to add store: ${JSON.stringify(store.UUID)} to system`)
        if (this.verifyStore(store)) {
            this._stores.push(store);
            logger.info(`successfully added store: ${JSON.stringify(store.UUID)} to system`)
            return {data: {result: true}}
        }
        else {
            logger.warn(`failed adding store ${JSON.stringify(store.UUID)} to system`)
            return {data: {result: false}, error: {message: Error["E_STORE_ADDITION"]}}
        }
    }

    verifyStoreExists(store: Store) : boolean {
        if (this.verifyStore(store)) {
            for (let currStore of this._stores) {
                if (currStore.UUID === store.UUID) {
                    logger.info(`verified store ${JSON.stringify(store.UUID)}`)
                    return true;
                }
            }
        }
        logger.error(`could not verify store ${JSON.stringify(store.UUID)}`)
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

    verifyStoreOperation(store: Store, user: RegisteredUser) : Res.BoolResponse {
        if (!this.verifyStoreExists(store)) {
            const error = Error['E_INVALID_STORE'];
            logger.error(error);
            return { data: { result: false } , error: { message: error}};
        }
        else if (!(this.verifyStoreOwner(store, user) || this.verifyStoreManager(store, user))) {
            const error = Error['E_NOT_AUTHORIZED'];
            logger.error(error);
            return { data: { result: false } , error: { message: error}};
        }
        return { data: { result: true } }
    }

    assignStoreOwner(store: Store, userToAssign: RegisteredUser, userWhoAssigns: RegisteredUser) : Res.BoolResponse {
        logger.info(`user: ${JSON.stringify(userWhoAssigns.UUID)} requested to assign user:
                ${JSON.stringify(userToAssign.UUID)} as a manager in store: ${JSON.stringify(store.UUID)} `)

        const operationValid: Res.BoolResponse = this.verifyStoreOperation(store, userWhoAssigns);
        if (operationValid.error) {
            logger.error(`user: ${JSON.stringify(userWhoAssigns.UUID)} failed to assign user:
                ${JSON.stringify(userToAssign.UUID)} as a manager in store: ${JSON.stringify(store.UUID)}. error: ${operationValid.error.message}`);
            return operationValid;
        }

        if (store.verifyIsStoreOwner(userToAssign)) {   // already store owner
            const error = Error['E_AL'];
            logger.error(`user: ${JSON.stringify(userWhoAssigns.UUID)} failed to assign user:
                ${JSON.stringify(userToAssign.UUID)} as a manager in store: ${JSON.stringify(store.UUID)}. error: ${error}`);
            return {data : {result: false}, error : {message : error}};
        }

        logger.info(`successfully assigned user: ${JSON.stringify(userToAssign.UUID)} as a manager in store: ${JSON.stringify(store.UUID)}, assigned by user ${userWhoAssigns.UUID}`)
        return store.addStoreOwner(new StoreOwner(userToAssign.name, userWhoAssigns.password));    //TODO: fix new StoreOwner

    }

}