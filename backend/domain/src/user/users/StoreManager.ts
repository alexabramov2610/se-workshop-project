import {RegisteredUser} from "../internal_api"
import {ManagementPermission} from "../../api-ext/Enums";

export class StoreManager extends RegisteredUser {

    private _permissions: ManagementPermission[];

    constructor(name: string) {
        super(name);
        this._permissions = [ManagementPermission.WATCH_PURCHASES_HISTORY, ManagementPermission.WATCH_USER_QUESTIONS, ManagementPermission.REPLY_USER_QUESTIONS];
    }

    addPermission(permission: ManagementPermission) {
        if (this._permissions.indexOf(permission) >= 0)
            return;
        this._permissions.push(permission);
    }

    removePermission(permission: ManagementPermission) {
        this._permissions = this._permissions.filter(perm => permission.valueOf() !== perm.valueOf());
    }

    getPermissions(): ManagementPermission[] {
        return this._permissions;
    }

    isAllowed(permission: ManagementPermission) : boolean {
        return this._permissions.find((p) => p === permission) >= 0
    }

}