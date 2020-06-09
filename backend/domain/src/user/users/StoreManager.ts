import {ManagementPermission} from "se-workshop-20-interfaces/dist/src/Enums";

export interface StoreManager {
    name: string;
    managerPermissions: ManagementPermission[];
}