import {StoreManager} from "../internal_api"

export interface StoreOwner {
    assignedStoreManagers: StoreManager[];
    assignedStoreOwners: StoreOwner[];
    name: string;
}