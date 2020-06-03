import { IItem, IProduct } from "se-workshop-20-interfaces/dist/src/CommonInterface";

export function productsMapperFromDB(products: any) :Map<IProduct, IItem[]>{
    const mappedProducts = new Map<IProduct, IItem[]>();

    products.forEach(product => {
        const retrievedProduct: IProduct = { catalogNumber: product.catalogNumber, name: product.name, price: product.price, category: product.category, rating: product.rating };
        const retrievedItems: IItem[] = product.items.reduce((acc, curr) => {
            const item: IItem = { id: curr.id, catalogNumber: curr.catalogNumber };
            return acc.concat(item);
        } ,[]);
        mappedProducts.set(retrievedProduct, retrievedItems);
    });

    return mappedProducts;
}

export function productsMapperToDB(products: Map<IProduct, IItem[]>) :any{
    const productsToDB = [];
/*
    products.forEach((items: IItem,product: IProduct) => {
        productsToDB = productsToDB.concat({
            catalogNumber: product.catalogNumber,
            name: product.name,
            price: product.price,
            category: product.category,
            rating: product.rating,
            items
        })
    });
*/
    return productsToDB;
}