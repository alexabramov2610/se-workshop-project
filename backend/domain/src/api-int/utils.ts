import {Guest} from "../user/users/Guest";
import {Admin, RegisteredUser} from "../user/internal_api";
import {Event} from "se-workshop-20-interfaces/dist/src/Event";
import {BagItem, IReceipt} from "se-workshop-20-interfaces/dist/src/CommonInterface";

export function formatString(str: string, placeholders: string[]) {
    // if (arguments.length === 0) {
    //     throw "No arguments";
    // }
    // const string = arguments[0];
    const lst = str.split("{}");
    // if (lst.length !== arguments.length) {
    //     throw "Placeholder format mismatched";
    // }
    let string2 = "";
    let off = 0;
    for (let i = 0; i < lst.length; i++) {
        if (off < placeholders.length) {
            string2 += lst[i] + placeholders[off++]
        } else {
            string2 += lst[i]
        }
    }
    return string2;
}


export function mapToJson(map) {
    return Array.from(map).reduce((acc, [key, val]) => Object.assign(acc, {[key]: val}), {});
}

export function createUser(): Guest {
    return { cart: new Map() }
}

export function createRegisteredUser(name: string, password: string, pendingEvents?: Event[], receipts?: IReceipt[], cart?: Map<string, BagItem[]>): RegisteredUser {
    return {name, password, pendingEvents: pendingEvents ? pendingEvents : [], receipts: receipts ? receipts : [], cart: cart ? cart : cart}
}

export function createAdmin(name: string, password: string, receipts: IReceipt[], cart?: Map<string, BagItem[]>, pendingEvents?: Event[]): Admin {
    return {name, password, pendingEvents: pendingEvents ? pendingEvents : [], receipts : receipts ? receipts : [], cart : cart ? cart : new Map()}
}

export function createGuest(): Guest {
    return { cart: new Map() }
}