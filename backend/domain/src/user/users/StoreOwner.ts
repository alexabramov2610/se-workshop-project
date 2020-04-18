import {RegisteredUser, StoreManager} from "../internal_api"

export class StoreOwner extends StoreManager {
    private _assignedStoreManagers: RegisteredUser[];
    private _assignedStoreOwners: RegisteredUser[];

    constructor(name: string) {
        super(name);
        this._assignedStoreOwners = [];
        this._assignedStoreManagers = [];
    }

    assignStoreOwner(storeOwner: StoreOwner) : void {
        this._assignedStoreOwners = this._assignedStoreOwners.concat(storeOwner);
    }

    removeStoreOwner(storeOwner: StoreOwner) : void {
        this._assignedStoreOwners = this._assignedStoreOwners.filter(currOwner => currOwner.name !== storeOwner.name)
    }

    assignStoreManager(storeManager: StoreManager) : void {
        this._assignedStoreManagers = this._assignedStoreManagers.concat(storeManager);
    }

    removeStoreManager(storeManager: StoreManager) : void {
        this._assignedStoreManagers = this._assignedStoreManagers.filter(currManager => currManager.name !== storeManager.name)
    }


}