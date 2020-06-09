import {BagItem} from "se-workshop-20-interfaces/dist/src/CommonInterface";
export interface User {
    cart: Map<string, BagItem[]>;          // storename -> items
}