import {IItem, IProduct} from "se-workshop-20-interfaces/dist/src/CommonInterface";
import {Store} from "./Store";


export function productFromDbToDomain(product): IProduct {
    return {
        catalogNumber: product.catalogNumber,
        name: product.name,
        price: product.price,
        category: product.category,
        rating: product.rating,
        db_id: product._id,
        storeName: product.storeName
    };
}

export function productsMapperFromDB(products: any): IProduct[] {
    const mappedProducts: IProduct[] = [];
    for (const product of products) {
        mappedProducts.push(productFromDbToDomain(product));
    }
    return mappedProducts;
}

export function productsAndItemsMapperFromDB(products: any): Map<IProduct, IItem[]> {
    const mappedProducts = new Map<IProduct, IItem[]>();

    products.forEach( (product) => {
        const retrievedProduct: IProduct = productFromDbToDomain(product)
        const retrievedItems: IItem[] = product.items.reduce((acc, curr) => {
            const item: IItem = {db_id: curr._id, id: curr.id, catalogNumber: curr.catalogNumber};
            return acc.concat(item);
        }, []);
        mappedProducts.set(retrievedProduct, retrievedItems);
    });

    return mappedProducts;
}

export function productsMapperToDB(products: Map<IProduct, IItem[]>): any {
    let productsToDB = [];

    Array.from(products.keys()).forEach((product: IProduct) => {
        productsToDB = productsToDB.concat({
            catalogNumber: product.catalogNumber,
            name: product.name,
            price: product.price,
            category: product.category,
            rating: product.rating,
            id: product.db_id,
            items: products.get(product)
        })
    });

    return productsToDB;
}

export function storeMapperFromDB(store: any): Store {
    if (!store)
        return store;
    const {storeName, description, products, storeOwners, storeManagers, receipts, firstOwner, purchasePolicy, discountPolicy} = store;
    const realProducts: Map<IProduct, IItem[]> = productsAndItemsMapperFromDB(products);
    const realStore: Store = new Store(storeName, description, realProducts, storeOwners, storeManagers, receipts, firstOwner, purchasePolicy, discountPolicy)
    return realStore
}