import {BagItem} from "se-workshop-20-interfaces/dist/src/CommonInterface";

export function cartMapperToDBMapperFromDB(cart: any): Map<string, BagItem[]> {
    const mappedCart = new Map<string, BagItem[]>();
    return mappedCart;
}

export function cartMapperToDB(cart: Map<string, BagItem[]>): any {
    const DBcart = new Map();
    for (const [s, b] of cart) {
        DBcart.set(s, b.map((bag) => {
            return {amount: bag.amount, finalPrice: bag.finalPrice, product: bag.product.db_id}
        }))
    }
    return DBcart;
}

