import {BagItem} from "se-workshop-20-interfaces/dist/src/CommonInterface";
import {ProductModel} from 'dal'

export async function cartMapperFromDB(cart: any): Promise<Map<string, BagItem[]>> {
    const mappedCart = new Map<string, BagItem[]>();
    for (const [store, bag] of cart) {
        // const productsID = bag.map((b)=> b.product);
        const bagItem: BagItem[] = [];
        for (const b of bag) {
            const iProduct = await ProductModel.findById(b.product);
            bagItem.push({product: iProduct, finalPrice: b.finalPrice, amount: b.amount})
        }
        mappedCart.set(store, bagItem);
    }
    return mappedCart;
}

export function cartMapperToDB(cart): any {
    const DBcart = new Map();
    for (const [s, b] of cart) {
        DBcart.set(s, b.map((bag) => {
            return {amount: bag.amount, finalPrice: bag.finalPrice, product: bag.product.db_id? bag.product.db_id : bag.product._id}
        }))
    }
    return DBcart;
}

