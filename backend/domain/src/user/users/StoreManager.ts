import {ManagementPermission} from "se-workshop-20-interfaces/dist/src/Enums";

export interface StoreManager {
    name: string;
    managerPermissions: ManagementPermission[];

    // constructor(name: string) {
    //     super(name);
    //     this._permissions = [ManagementPermission.WATCH_PURCHASES_HISTORY, ManagementPermission.WATCH_USER_QUESTIONS, ManagementPermission.REPLY_USER_QUESTIONS];
    // }
    //
    // addPermission(permission: ManagementPermission) {
    //     if (this._permissions.indexOf(permission) >= 0)
    //         return;
    //     this._permissions.push(permission);
    // }
    //
    // removePermission(permission: ManagementPermission) {
    //     this._permissions = this._permissions.filter(perm => permission.valueOf() !== perm.valueOf());
    // }
    //
    // getPermissions(): ManagementPermission[] {
    //     return this._permissions;
    // }
    //
    // isAllowed(permission: ManagementPermission) : boolean {
    //     return this._permissions.indexOf(permission) >= 0;
    // }

}