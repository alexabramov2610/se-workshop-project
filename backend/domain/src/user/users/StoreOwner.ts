import {RegisteredUser, StoreManager} from "../internal_api"

export class StoreOwner extends StoreManager {
    private _storeManagerAssigners: RegisteredUser[];
    private _storeOwnerAssigners: RegisteredUser[];

    constructor(name: string) {
        super(name);
        this._storeManagerAssigners = [];
        this._storeOwnerAssigners = [];
    }
}