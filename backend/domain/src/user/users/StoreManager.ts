import { RegisteredUser } from "../internal_api"
import { UserRole } from "../../api-int/internal_api"
import { ManagementPermission } from "../../api-int/internal_api";

export class StoreManager extends RegisteredUser {

    private _permissions: ManagementPermission[];

    constructor(name: string, password: string, uuid?: string) {
        super(name, password, uuid);
        this.setRole(UserRole.MANAGER);
        this._permissions = [];
    }

    addPermission(permission: ManagementPermission) {
        if (this._permissions.indexOf(permission) >= 0)
            return;
        this._permissions.push(permission);
    }

    removePermission(permission: ManagementPermission) {
        this._permissions = this._permissions.filter(perm => permission.valueOf() != perm.valueOf());
    }

    getPermissions(): ManagementPermission[] {
        return this._permissions;
    }
}